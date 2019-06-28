/**
 * Helper module to build and return response.
 */

exports.buildResponseForRecognizedIntent = buildResponseForRecognizedIntent;
exports.buildResponseForUnrecognizedIntent = buildResponseForUnrecognizedIntent;

function buildResponseForRecognizedIntent(handlerInput, response) {

    const retResponse = handlerInput.responseBuilder
        .addDirective(response.directive)
        .speak(response.speechText)
        .getResponse();
    console.log("Return response ", retResponse);
    return retResponse;
}

function buildResponseForUnrecognizedIntent(handlerInput) {
    const intent = handlerInput.requestEnvelope.request.intent.name;
    const outputSpeech = "Cannot handle " + intent;
    return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
}
