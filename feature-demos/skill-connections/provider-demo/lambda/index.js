const Alexa = require('ask-sdk-core');

/**
 * Handler for AMAZON.PrintWebPage skill connections requests.
 */
const PrintWebPageTaskHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
            && request.task.name == "AMAZON.PrintWebPage";
    },
    handle(handlerInput) {
        console.log("handling AMAZON.PrintWebPage task");
        let speechText = "OK, your print is confirmed";

        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                "type": "Tasks.CompleteTask",
                "status": {
                    "code": "200",
                    "message": "return as desired",
                }
            })
            .withShouldEndSession(true)
            .getResponse();
    },
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'&& request.task === undefined;
    },
    handle(handlerInput) {
        console.log("LaunchRequest received");

        return handlerInput.responseBuilder
            .speak('Welcome to Skill Connections Provider Skill')
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

/**
 * Handler to catch exceptions from RequestHandler
 * and respond back to Alexa
 */
const ErrorHandler = {
    canHandle(handlerInput, error) {
        // handle all type of exceptions
        return true;
    },
    handle(handlerInput, error) {
        console.log("==== ERROR ======");
        console.log(`Error handled: ${error}`);

        return handlerInput.responseBuilder
            .speak('Sorry, error occurred')
            .getResponse();
    },
};

exports.handler = Alexa.SkillBuilders
  .custom()
  .addRequestHandlers(
    PrintWebPageTaskHandler,
    LaunchRequestHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
