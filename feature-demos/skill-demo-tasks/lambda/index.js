// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./localisation');

const SKILL_ID = 'REPLACE_WITH_YOUR_SKILL_ID_HERE';
const ZODIAC_SIGNS = [
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn'
];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(handlerInput.t('WELCOME_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const HoroscopeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HoroscopeIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('SOURCE_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SignHoroscopeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SignHoroscopeIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const slot = Alexa.getSlot(requestEnvelope, 'sign');
        // we assume this is ER_SUCCESS_MATCH as we have a sign validator in the model
        let sign = slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;;
        let horoscope = {};
        // here we take the horoscope from a localisation file but ideally you'd take dynamically from a database or service
        horoscope.description = handlerInput.t('HOROSCOPE_' + sign);
        horoscope.sign = handlerInput.t(sign);

        return handlerInput.responseBuilder
            .withSimpleCard(horoscope.sign, horoscope.description)
            .withShouldEndSession(true)
            .speak(horoscope.description)
            .getResponse();
    }
};

// This task handler must be added below to the skill builder *before* LaunchRequestHandler
const SignHoroscopeTaskHandler = {
    canHandle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        return Alexa.getRequestType(requestEnvelope) === 'LaunchRequest'
            && requestEnvelope.request.task
            && requestEnvelope.request.task.name === SKILL_ID + '.SignHoroscope';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder} = handlerInput;
        let {task} = requestEnvelope.request;
        console.log(JSON.stringify(task));
        if(!(task.input && task.input['sign'])) {
            return responseBuilder
                .addDirective({
                    type: 'Tasks.CompleteTask',
                    status: {
                        code: 400,
                        message: 'Missing zodiac sign parameter'
                    }
                })
                .withShouldEndSession(true)
                .getResponse();
        }
        let sign = task.input['sign'];
        // we have to validate the sign here as we don't have model validations in tasks
        if(!ZODIAC_SIGNS.some(item => item === sign)) {
            return responseBuilder
                .addDirective({
                    type: 'Tasks.CompleteTask',
                    status: {
                        code: 404,
                        message: 'Invalid zodiac sign parameter'
                    }
                })
                .withShouldEndSession(true)
                .getResponse();
        }
        let horoscope = {};
        // here we take a fake horoscope from a localisation file but ideally you'd fetch it dinamically from a database or service
        horoscope.description = handlerInput.t('HOROSCOPE_' + sign);
        horoscope.sign = handlerInput.t(sign);

        return responseBuilder
                .speak(horoscope.description)
                .withSimpleCard(horoscope.sign, horoscope.description)
                .addDirective({
                    type: 'Tasks.CompleteTask',
                    status: {
                        code: 200,
                        message: 'OK'
                    },
                    result: {
                        payload: horoscope.description
                    }
                })
                .withShouldEndSession(true)
                .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('FALLBACK_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('GOODBYE_MSG'))
            .withShouldEndSession(true)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intent: intentName});
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = handlerInput.t('ERROR_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
// Additionally it will handle picking a random value if instead of a string it receives an array
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value))
                return value[Math.floor(Math.random() * value.length)];
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        SignHoroscopeTaskHandler, // make sure tasks handler are added before the standard LaunchRequest handler
        LaunchRequestHandler,
        HoroscopeIntentHandler,
        SignHoroscopeIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addRequestInterceptors(
        LoggingRequestInterceptor,
        LocalisationRequestInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
