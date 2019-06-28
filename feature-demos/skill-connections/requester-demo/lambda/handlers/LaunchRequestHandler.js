/**
 * Handler to handle LaunchRequest.
 */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      console.log("LaunchRequest received.");
      const speechText = 'Welcome to Skill Connections Requester Skill.';
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};

module.exports = LaunchRequestHandler;
