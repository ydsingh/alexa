/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const helpers = require('./helpers.js');
const interceptors = require('./interceptors.js');
const constants = require('./constants.js');
const AWS = constants.AWS;
const DYNAMODB_TABLE = constants.DYNAMODB_TABLE;


// const SkillEventHandler = {
//     canHandle(handlerInput) {
//         const request = handlerInput.requestEnvelope.request;
//         return (
//             request.type === 'AlexaSkillEvent.SkillPermissionAccepted' ||
//             request.type === 'AlexaSkillEvent.SkillPermissionChanged'
//         )
//     },
//     handle(handlerInput) {
//         const userId = handlerInput.requestEnvelope.context.System.user.userId;
//         let acceptedPermissions;
//
//         let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
//
//         let permissions = sessionAttributes['permissions'];
//
//         switch (handlerInput.requestEnvelope.request.type) {
//             case 'AlexaSkillEvent.SkillEnabled':
//                 console.log(`skill was enabled for user: ${userId}`);
//                 break;
//             case 'AlexaSkillEvent.SkillDisabled':
//                 console.log(`skill was disabled for user: ${userId}`);
//                 break;
//             case 'AlexaSkillEvent.SkillPermissionAccepted':
//
//                 acceptedPermissions = handlerInput.requestEnvelope.request.body.acceptedPermissions;
//                 for(let i=0; i<acceptedPermissions.length; i++) {
//                     if(permissions.indexOf(acceptedPermissions[i].scope) === -1) {
//                         permissions.push(acceptedPermissions[i].scope);
//                     }
//
//                     console.log(`***** ${acceptedPermissions[i].scope}`);
//                 }
//                 // console.log(`Saving permission ${JSON.stringify(acceptedPermissions)}`);
//
//                 console.log(`skill permissions were accepted for user ${userId}.`);
//                 console.log(`New permissions       : ${JSON.stringify(acceptedPermissions)}`);
//                 console.log(`Resulting permissions : ${permissions.toString()}`);
//
//                 break;
//             case 'AlexaSkillEvent.SkillPermissionChanged':
//                 acceptedPermissions = JSON.stringify(handlerInput.requestEnvelope.request.body.acceptedPermissions);
//                 console.log(`skill permissions were changed for user ${userId}. New permissions: ${acceptedPermissions}`);
//                 break;
//             case 'AlexaSkillEvent.SkillAccountLinked':
//                 console.log(`skill account was linked for user ${userId}`);
//                 break;
//             default:
//                 console.log(`unexpected request type: ${handlerInput.requestEnvelope.request.type}`);
//         }
//
//         handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
//         handlerInput.attributesManager.savePersistentAttributes();
//
//         // not spoken to user; this event is out-of-session
//         const speechText = `Alexa Skill Event ${handlerInput.requestEnvelope.request.type} was processed.  Current permissions are ${permissions.toString()}. `;
//         return handlerInput.responseBuilder
//             .speak(speechText)
//             .getResponse();
//     },
// };


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {

        const debug = true;
        const stack = error.stack.split('\n');
        console.log(stack[0]);
        console.log(stack[1]);
        console.log(stack[2]);

        let errorLoc = stack[1].substring(stack[1].lastIndexOf('/') + 1, 900);

        errorLoc = errorLoc.slice(0, -1);

        const file = errorLoc.substring(0, errorLoc.indexOf(':'));
        let line = errorLoc.substring(errorLoc.indexOf(':') + 1, 900);
        line = line.substring(0, line.indexOf(':'));

        let speechOutput = 'Sorry, an error occurred. ';
        if(debug) {
            speechOutput +=  error.message + ' in ' + file + ', line ' + line;
        }

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .withShouldEndSession(true)
            .getResponse();
    },
};


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )

  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(interceptors.RequestPersistenceInterceptor)
  .addRequestInterceptors(interceptors.RequestHistoryInterceptor)
  .addResponseInterceptors(interceptors.ResponsePersistenceInterceptor)

  .withTableName(DYNAMODB_TABLE)
  .withAutoCreateTable(true)

  .lambda();
