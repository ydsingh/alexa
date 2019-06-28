/**
 * Handler to handle IntentRequest.
 */
var IntentsHandler = require('../utils/IntentsHandler').default;
var ResponseBuilder = require('../utils/ResponseBuilder');

const IntentRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === "IntentRequest";
    },
    handle(handlerInput) {
        const intent = handlerInput.requestEnvelope.request.intent.name;
        console.log(`Handle intent: ${intent}`);
        if (intent in IntentsHandler) {
            var response = IntentsHandler[intent].response;
            return ResponseBuilder.buildResponseForRecognizedIntent(handlerInput, response);
        }
        return ResponseBuilder.buildResponseForUnrecognizedIntent(handlerInput);
    }
};

module.exports = IntentRequestHandler;
