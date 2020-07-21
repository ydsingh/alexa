// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

const Alexa = require('ask-sdk-core');

const messages = {
    WELCOME: 'Welcome to the Sample Alexa Person Profile API Skill! You can ask for your name, given name or your phone number. What do you want to ask?',
    WHAT_DO_YOU_WANT: 'What do you want to ask?',
    PROFILE_NOT_RECOGNIZED: 'Your profile is not recognized. If you haven\'t yet, please create and train a voice profile through the Alexa app and try again.',
    NOTIFY_MISSING_PERMISSIONS: 'Please enable Person Profile permissions in the Amazon Alexa app.',
    NAME_MISSING: 'It looks like we don\'t have your name. You can set your name through the Alexa App.',
    GIVEN_NAME_MISSING: 'It looks like we don\'t have your given name. You can set your given name through the Alexa App.',
    NUMBER_MISSING: 'It looks like we don\'t have your phone number. You can set your phone number through the Alexa App.',
    NAME_AVAILABLE: 'Your full name is: ',
    GIVEN_NAME_AVAILABLE: 'Your given name is: ',
    NUMBER_AVAILABLE: 'Your phone number is: ',
    ERROR: 'Uh Oh. Looks like something went wrong.',
    API_FAILURE: 'There was an error with the Alexa Person Profile API. Please try again.',
    GOODBYE: 'Bye! Thanks for using the Sample Alexa Person Profile API Skill!',
    UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
    HELP: 'You can use this skill by asking something like: whats my name?',
    STOP: 'Bye! Thanks for using the Sample Alexa Person Profile API Skill!',
};

const PERMISSIONS = ['alexa::profile:mobile_number:read', 'alexa::profile:name:read', 'alexa::profile:given_name:read'];

const LaunchRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.speak(messages.WELCOME)
            .reprompt(messages.WHAT_DO_YOU_WANT)
            .getResponse();
    },
};

const ProfileFullNameIntent = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'ProfileFullNameIntent'
        );
    },
    async handle(handlerInput) {
        const person = handlerInput.requestEnvelope.context.System.person;
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

        if (person) {
            const personId = person.personId;
            console.log("Received personId: ", personId);
        } else {
            return handlerInput.responseBuilder
                .speak(messages.PROFILE_NOT_RECOGNIZED)
                .reprompt(messages.PROFILE_NOT_RECOGNIZED)
                .getResponse();
        }

        try {
            const client = handlerInput.serviceClientFactory.getUpsServiceClient();
            const name = await client.getPersonsProfileName();

            console.log('Name successfully retrieved, now responding to user.');

            let response;
            if (name == null) {
                response = handlerInput.responseBuilder.speak(messages.NAME_MISSING)
                    .getResponse();
            } else {
                const speechText = `${messages.NAME_AVAILABLE} ${name}`;
                response = handlerInput.responseBuilder.speak(speechText)
                    .getResponse();
            }
            return response;
        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const ProfileGivenNameIntent = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'ProfileGivenNameIntent'
        );
    },
    async handle(handlerInput) {
        const person = handlerInput.requestEnvelope.context.System.person;
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

        if (person) {
            const personId = person.personId;
            console.log("Received personId: ", personId);
        } else {
            return handlerInput.responseBuilder
                .speak(messages.PROFILE_NOT_RECOGNIZED)
                .reprompt(messages.PROFILE_NOT_RECOGNIZED)
                .getResponse();
        }

        try {
            const client = handlerInput.serviceClientFactory.getUpsServiceClient();
            const givenName = await client.getPersonsProfileGivenName();

            console.log('Given name successfully retrieved, now responding to user.');

            let response;
            if (givenName == null) {
                response = handlerInput.responseBuilder.speak(messages.GIVEN_NAME_MISSING)
                    .getResponse();
            } else {
                const speechText = `${messages.GIVEN_NAME_AVAILABLE} ${givenName}`;
                response = handlerInput.responseBuilder.speak(speechText)
                    .getResponse();
            }
            return response;
        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const ProfileNumberIntent = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'ProfileNumberIntent'
        );
    },
    async handle(handlerInput) {
        const person = handlerInput.requestEnvelope.context.System.person;
        const consentToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

        if (person) {
            const personId = person.personId;
            console.log("Received personId: ", personId);
        } else {
            return handlerInput.responseBuilder
                .speak(messages.PROFILE_NOT_RECOGNIZED)
                .reprompt(messages.PROFILE_NOT_RECOGNIZED)
                .getResponse();
        }

        try {
            const client = handlerInput.serviceClientFactory.getUpsServiceClient();
            const number = await client.getPersonsProfileMobileNumber();

            console.log('Number successfully retrieved, now responding to user.');

            let response;
            if (number == null) {
                response = handlerInput.responseBuilder.speak(messages.NUMBER_MISSING)
                    .getResponse();
            } else {
                const speechText = `${messages.NUMBER_AVAILABLE} <say-as interpret-as="telephone">${number.countryCode} ${number.phoneNumber}</say-as>`;
                response = handlerInput.responseBuilder.speak(speechText)
                    .getResponse();
            }
            return response;
        } catch (error) {
            if (error.name !== 'ServiceError') {
                const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse();
                return response;
            }
            throw error;
        }
    }
};

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const UnhandledIntent = {
    canHandle() {
        return true;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.UNHANDLED)
            .reprompt(messages.UNHANDLED)
            .getResponse();
    },
};

const HelpIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.HELP)
            .reprompt(messages.HELP)
            .getResponse();
    },
};

const CancelIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.GOODBYE)
            .getResponse();
    },
};

const StopIntent = {
    canHandle(handlerInput) {
        const {
            request
        } = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(messages.STOP)
            .getResponse();
    },
};

const ProfileError = {
    canHandle(handlerInput, error) {
        return error.name === 'ServiceError';
    },
    handle(handlerInput, error) {
        if (error.statusCode === 403) {
            return handlerInput.responseBuilder
                .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(messages.API_FAILURE)
            .reprompt(messages.API_FAILURE)
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequest,
        ProfileGivenNameIntent,
        ProfileFullNameIntent,
        ProfileNumberIntent,
        SessionEndedRequest,
        HelpIntent,
        CancelIntent,
        StopIntent,
        UnhandledIntent,

    )
    .addErrorHandlers(ProfileError)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('cookbook/customer-profile/v1')
    .lambda(); // The identifier of the recognized speaker.