// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
// Library to connect to the external quiz API
const axios = require('axios');
// Library to decode special characters in strings returned by the external quiz API (like e.g. &amp; -> &)
const he = require('he');
// Library to convert numbers into words (like e.g. 100 -> one hundred)
const numberWords = require('number-words');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return StartIntentHandler.handle(handlerInput);
    }
}

const StartIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StartIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        let speechText, repromptText = '';
        if(requestEnvelope.session['new'])
            speechText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01'/> Welcome to the Trivia Game. I will ask questions and give you a set of answers to choose from. Only one of them is correct. Here's the first one. ";
        else
            speechText = "Ok let's get started. Here's the first one. ";

        const trivia = await getTrivia();

        if(trivia) {
            console.log(JSON.stringify(trivia));
            speechText += he.decode(trivia.question) + ' ';
            // decode all answers in case they have encoded special characters and add to speech output
            const decodedAnswers = joinAndDecodeAnswers(trivia.correct_answer, trivia.incorrect_answers);
            decodedAnswers.map((answer) => {speechText += answer + ', '; repromptText += answer + ', '});
            // save correct answer in session attributes to compare later
            sessionAttributes['correctAnswer'] = he.decode(trivia.correct_answer);
            // add answers as dynamic entities
            addDynamicEntities(handlerInput.responseBuilder, decodedAnswers);
        } else {
            speechText = "I had a problem fetching a new question for you. Please say start to try again. ";
            repromptText = "Please say start to try again. ";
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
}

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        let answer, speechText, repromptText = '';
        console.log(JSON.stringify(intent.slots));
        const correctAnswer = sessionAttributes['correctAnswer'];

        if(!sessionAttributes['rightAnswers'])
            sessionAttributes['rightAnswers'] = 0;
        if(!sessionAttributes['wrongAnswers'])
            sessionAttributes['wrongAnswers'] = 0;

        const slotValues = getStaticAndDynamicSlotValuesFromSlot(intent.slots.answer);

        if (slotValues.static.statusCode === 'ER_SUCCESS_MATCH') {
            sessionAttributes['wrongAnswers']++;
            speechText = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_01'/> Too bad! The right answer is ${correctAnswer}. `;
        }
        if (slotValues.dynamic.statusCode === 'ER_SUCCESS_MATCH') {
            answer = slotValues.value;
            // check if value is a number and covert to words if so
            if(!isNaN(answer))
                answer = numberWords.decode(answer);
            if(answer.toLowerCase() === correctAnswer.toLowerCase()) {
                sessionAttributes['rightAnswers']++;
                speechText = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>That's right! `;
            } else {
                sessionAttributes['wrongAnswers']++;
                speechText = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_01'/> Sorry, it's not ${answer}! The right answer is ${correctAnswer}. `;
            }
        }

        speechText += `Let's try another one. `;

        const trivia = await getTrivia();

        if(trivia) {
            console.log(JSON.stringify(trivia));
            speechText += he.decode(trivia.question) + ' ';
            // decode all answers in case they have encoded special characters and add to speech output
            const decodedAnswers = joinAndDecodeAnswers(trivia.correct_answer, trivia.incorrect_answers);
            decodedAnswers.map((answer) => {speechText += answer + ', '; repromptText += answer + ', '});
            // save correct answer in session attributes to compare later
            sessionAttributes['correctAnswer'] = he.decode(trivia.correct_answer);
            // add answers as dynamic entities
            addDynamicEntities(handlerInput.responseBuilder, decodedAnswers);
        } else {
            speechText = "I had a problem fetching a new question for you. Please say start to try again. ";
            repromptText = "Please say start to try again. ";
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
}

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = "I don't know about that. Please try again. ";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = "You can say start to play the game or stop to exit and get your game stats. What would you like to do?";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        const rightAnswers = parseInt(sessionAttributes['rightAnswers']);
        const wrongAnswers = parseInt(sessionAttributes['wrongAnswers']);
        const totalAnswers = rightAnswers + wrongAnswers;
        let speechText = `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01'/>`;
        if(totalAnswers > 0) {
            speechText += `You got ${rightAnswers} answers right, out of a total of ${totalAnswers}. `;
            speechText += `That's a ${Math.floor(rightAnswers*100/totalAnswers)} percent effectiveness! `;
        }
        speechText += "See you later!";

        // It's a good practice to clear all dynamic entities at the end of a session
        const clearEntitiesDirective = {
          type: 'Dialog.UpdateDynamicEntities',
          updateBehavior: 'CLEAR'
        };

        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective(clearEntitiesDirective)
            .getResponse();
    }
}

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
}

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = "There was an error. Please try again. ";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}

// Auxiliary function
function getTrivia() {
        const url = 'https://opentdb.com/api.php?amount=20&type=multiple';

        var config = {
            timeout: 7000, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }

        return getJsonResponse(url, config).then((result) => {
            if(result.response_code === 0) {
                const {results} = result;
                const valid = results.filter(item =>
                    !/[^a-z]/i.test(item.correct_answer) &&
                    !/[^a-z]/i.test(item.incorrect_answers[0]) &&
                    !/[^a-z]/i.test(item.incorrect_answers[1]) &&
                    !/[^a-z]/i.test(item.incorrect_answers[2])
                );
                if(valid.length > 0) {
                    return valid[0];
                }
            }
            return null;
        }).catch((error) => {
            return null;
        });
}

function joinAndDecodeAnswers(correctAnswer, incorrectAnswers) {
    // insert correct answer in random position of the incorrect answers array
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    incorrectAnswers.splice(randomIndex, 0, correctAnswer);
    // decode all answers in case they have encoded special characters and add to speech output
    return incorrectAnswers.map((answer) => he.decode(answer).toLowerCase());
}

function addDynamicEntities(responseBuilder, answers) {
    let updateEntitiesDirective = {
      type: 'Dialog.UpdateDynamicEntities',
      updateBehavior: 'REPLACE',
      types: [
        {
          name: 'AnswerType',
          values: [] // we fill this array with the answers below
        }
      ]
    };
    answers.map((answer) => updateEntitiesDirective.types[0].values.push(
        {
            id: answer.replace(/\s/gi, "_"),
            name: {
                value: answer
            }
        }
    ));
    console.log(JSON.stringify(updateEntitiesDirective));
    responseBuilder.addDirective(updateEntitiesDirective);
}

const getStaticAndDynamicSlotValues = function(slots) {
    const slotValues = {}
    for (let slot in slots) {
        slotValues[slot] = getStaticAndDynamicSlotValuesFromSlot(slots[slot]);
    }
    return slotValues;
}

const getStaticAndDynamicSlotValuesFromSlot = function(slot) {

    const result = {
        name: slot.name,
        value: slot.value
    };

    if (((slot.resolutions || {}).resolutionsPerAuthority || [])[0] || {}) {
        slot.resolutions.resolutionsPerAuthority.forEach((authority) => {
            const slotValue = {
                authority: authority.authority,
                statusCode: authority.status.code,
                synonym: slot.value || undefined,
                resolvedValues: slot.value
            };
            if (authority.values && authority.values.length > 0) {
                slotValue.resolvedValues = [];

                authority.values.forEach((value) => {
                    slotValue.resolvedValues.push(value);
                });

            }

            if (authority.authority.includes('amzn1.er-authority.echo-sdk.dynamic')) {
                result.dynamic = slotValue;
            } else {
                result.static = slotValue;
            }
        });
    }
    return result;
};


// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StartIntentHandler,
        AnswerIntentHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
