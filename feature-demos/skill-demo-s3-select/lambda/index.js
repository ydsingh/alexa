const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const s3Bucket = 'MY_BUCKET_NAME'; // enter your bucket here only if this is not an Alexa Hosted Skill
const s3Key = 'facts.json'; // full path to your facts file (sample file available in root of project)

const GetNewFactHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && request.intent.name === 'GetNewFactIntent');
    },
    async handle(handlerInput) {
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const factCount = await getFactCount(locale);
        const randomFact = await getFact(locale, Math.floor(Math.random() * factCount));
        let speakOutput;
        if(randomFact)
            speakOutput = handlerInput.t('GET_FACT_MESSAGE') + randomFact;
        else
            speakOutput = handlerInput.t('ERROR_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(requestAttributes.t('HELP_REPROMPT'))
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('HELP_MESSAGE'))
            .reprompt(handlerInput.t('HELP_REPROMPT'))
            .getResponse();
    },
};

const FallbackHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('FALLBACK_MESSAGE'))
            .reprompt(handlerInput.t('FALLBACK_REPROMPT'))
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('STOP_MESSAGE'))
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'SessionEndedRequest';
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
        console.log(`Error handled: ${error.message}`);
        console.log(`Error stack: ${error.stack}`);
        return handlerInput.responseBuilder
            .speak(handlerInput.t('ERROR_MESSAGE'))
            .reprompt(handlerInput.t('ERROR_MESSAGE'))
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: require('./i18n'),
            returnObjects: true
        });
        localizationClient.localize = function localize() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value))
                return value[Math.floor(Math.random() * value.length)];
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localizationClient.localize(...args);
        }
    }
};

const getParams = (query) => {
    return {
        Bucket: process.env.S3_PERSISTENCE_BUCKET ? process.env.S3_PERSISTENCE_BUCKET : s3Bucket,
        Key: s3Key,
        ExpressionType: 'SQL',
        Expression: query,
        InputSerialization: {
            JSON: { Type: 'DOCUMENT' },
            CompressionType: 'NONE'
        },
        OutputSerialization: {
            JSON: {}
        }
    };
}

const getFactCount = async (locale) => {
    try {
        const baseLocale = locale.split('-')[0];
        const query = `SELECT COUNT(*) FROM S3Object[*].${baseLocale}.facts[*]`;
        const params = getParams(query);
        return await getS3SelectData(params);
    } catch (e) {
        console.log('select error: ' + e);
        return 0;
    }
};

const getFact = async (locale, index) => {
    try {
        const baseLocale = locale.split('-')[0];
        const query = `SELECT * FROM S3Object[*].${baseLocale}.facts[${index}]`;
        const params = getParams(query);
        return await getS3SelectData(params);
    } catch (e) {
        console.log('select error: ' + e);
        return null;
    }
};

const getS3SelectData = async (params) => {
    return new Promise((resolve, reject) => {
        s3.selectObjectContent(params, (err, data) => {
            let returnVal = 0;
            if (err) reject(err);
            if (!data) reject('Empty data object');

            data.Payload.on('data', (event) => {
                if (event.Records) {
                    returnVal = event.Records.Payload.toString();
                    console.log('event records: ' + returnVal);
                    //resolve(returnVal);
                } else if (event.Stats) {
                    console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
                } else if (event.End) {
                    console.log('SelectObjectContent completed');
                }
            }).on('error', (err) => {
                console.log('select API error: ' + err)
            }).on('end', () => {
                console.log(`returning value of 1st property: ${returnVal}`);
                const obj = JSON.parse(returnVal);
                resolve(obj[Object.keys(obj)[0]]);
            });
        });
    });
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        GetNewFactHandler,
        HelpHandler,
        ExitHandler,
        FallbackHandler,
        SessionEndedRequestHandler,
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/skill-demo-s3-select/v1')
    .lambda();
