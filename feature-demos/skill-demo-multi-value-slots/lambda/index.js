const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello, what smoothie would you like me to make?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const getFirstResolvedEntityValue = (element) => {
    const [firstResolution = {}] = element.resolutions.resolutionsPerAuthority || [];
    return firstResolution && firstResolution.status.code === 'ER_SUCCESS_MATCH'
        ? firstResolution.values[0].value.name
        : null;
};

const getReadableSlotValue = (handlerInput, slotName) => {
    const rootSlotValue = Alexa.getSlotValueV2(handlerInput.requestEnvelope, slotName);
    const PAUSE = '<break time="0.25s"/>';
    const slotValueStr = !rootSlotValue
        ? 'None'
        : Alexa.getSimpleSlotValues(rootSlotValue)
              .map(
                  (slotValue) =>
                      getFirstResolvedEntityValue(slotValue) || `${slotValue.value}`
              )
              .join(' ');
    return `${slotName} ${PAUSE} ${slotValueStr}`;
};

const MakeSmoothieIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'COOKBOOK_MakeSmoothieIntent'
        );
    },
    handle(handlerInput) {
        const fruitResponse = getReadableSlotValue(handlerInput, 'Fruits');
        const greensResponse = getReadableSlotValue(handlerInput, 'Greens');
        const extrasResponse = getReadableSlotValue(handlerInput, 'Extras');
        const speakOutput = `Alright, one smoothie with ${fruitResponse}, ${greensResponse}, and ${extrasResponse} coming right up.`;
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
        );
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            ['AMAZON.CancelIntent', 'AMAZON.StopIntent'].includes(
                Alexa.getIntentName(handlerInput.requestEnvelope)
            )
        );
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    },
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        MakeSmoothieIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
