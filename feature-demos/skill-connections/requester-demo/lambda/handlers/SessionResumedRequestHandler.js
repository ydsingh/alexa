/**
 * Handler to handle SessionResumedRequest.
 */
const SessionResumedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionResumedRequest';
    },
    handle(handlerInput) {
        console.log("Requester skill received SessionResumedRequest");

        // Session attributes and ID are same as previous IntentRequest
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const status = handlerInput.requestEnvelope.request.cause.status;
        const code = status.code;
        const message = status.message;
        const speechText = `status code is ${code}, message is ${message}`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

module.exports = SessionResumedRequestHandler;
