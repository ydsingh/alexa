'use strict';

const Alexa = require('ask-sdk-core');
const config = require('config');
const directive = require('directive');
const error = require('error-handler');
const payload = require('payload');
const utilities = require('utilities');

// Do you want to buy something?
const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(config.launchRequestWelcomeResponse + config.launchRequestQuestionResponse)
			.reprompt(config.launchRequestQuestionResponse)
			.getResponse();
	}
};

// No, I do not want to buy something
const NoIntentHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(config.noIntentResponse)
			.withSimpleCard(config.noIntentMessage, config.storeURL)
			.getResponse();
	}
};

// Yes, I do want to buy something
const YesIntentHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
	},
	handle(handlerInput) {
		// interacting with Amazon Pay will end the session. Use this token to identify returning customers across sessions
		const correlationToken = utilities.generateRandomString(12);

		// Call the Amazon Pay Setup operation to get a BillingAgreeemtn tjat you can charge for this customer
		const setupPayload = payload.getSetupBuilder(handlerInput.requestEnvelope.request.locale);
		const setupDirective = directive.buildSetupDirective(setupPayload, correlationToken);

		return handlerInput.responseBuilder
			.addDirective(setupDirective)
			.getResponse();
	}
};

/** You requested the Setup directive and are now receiving the Connections.Response
 * 
 * This sample aims to be siple and not comprehesive. Make sure to e.g. improve any error handling before going live.
 */

const ConnectionsSetupResponseHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "Connections.Response"
			&& handlerInput.requestEnvelope.request.name === "Setup";
	},
	handle(handlerInput) {
		console.log('handling setup response');
		const connectionResponsePayload = handlerInput.requestEnvelope.request.payload;
		const connectionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;

		// If there are integration or runtime errors, do not charge the payment method
		if (connectionResponseStatusCode != 200) {
			return error.handleErrors(handlerInput);
		} else {

			// interacting with Amazon Pay will end the session. Use this token to identify returning customers across sessions
			const correlationToken = utilities.generateRandomString(12);

			// Get the billingAgreementId and billingAgreementStatus from the Setup Connections.Response
			const billingAgreementId = connectionResponsePayload.billingAgreementDetails.billingAgreementId;
			const billingAgreementStatus = connectionResponsePayload.billingAgreementDetails.billingAgreementStatus;

			// If billingAgreementStatus is valid, Charge the payment method    
			if (billingAgreementStatus === 'OPEN') {

				// Set the Charge payload in Skill Connections and send the request directive
				const chargePayload = payload.getChargeBuilder(billingAgreementId);
				const chargeDirective = directive.buildChargeDirective(chargePayload, correlationToken);

				return handlerInput.responseBuilder
					.addDirective(chargeDirective)
					.withShouldEndSession(true)
					.getResponse();

				// If billingAgreementStatus is not valid, do not Charge the payment method	
			} else {
				return error.handleBillingAgreementState(billingAgreementStatus, handlerInput);
			}
		}
	}
};

// You requested the Charge directive and are now receiving the Connections.Response
const ConnectionsChargeResponseHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "Connections.Response"
			&& handlerInput.requestEnvelope.request.name === "Charge";
	},
	handle(handlerInput) {
		const connectionResponsePayload = handlerInput.requestEnvelope.request.payload;
		const connectionResponseStatusCode = handlerInput.requestEnvelope.request.status.code;

		// If there are integration or runtime errors, handle them
		if (connectionResponseStatusCode != 200) {
			return error.handleErrors(handlerInput);
		} else {
			const authorizationStatusState = connectionResponsePayload.authorizationDetails.state;

			// Authorization is declined, tell the user their order was not placed
			if (authorizationStatusState === 'Declined') {
				const authorizationStatusReasonCode = connectionResponsePayload.authorizationDetails.reasonCode;

				return error.handleAuthorizationDeclines(authorizationStatusReasonCode, handlerInput);

				// Authorization is approved, tell the user their order was placed    
			} else {
				return handlerInput.responseBuilder
					.speak(config.orderConfirmationResponse)
					.withShouldEndSession(true)
					.getResponse();
			}

		}
	}
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
			|| Alexa.getRequestType(handlerInput.requestEnvelope) === 'Connections.Response';
	},
	handle(handlerInput) {
		const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
		const speakOutput = config.reflectorMessage.replace('%intentName%', intentName);

		return handlerInput.responseBuilder
			.speak(speakOutput)
			//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse();
	}
};

exports.handler = Alexa.SkillBuilders
	.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		NoIntentHandler,
		YesIntentHandler,
		ConnectionsSetupResponseHandler,
		ConnectionsChargeResponseHandler,
		IntentReflectorHandler)
	.withCustomUserAgent('cookbook/feature-demos/skill-demo-amazon-pay/v2.0')
	.lambda();