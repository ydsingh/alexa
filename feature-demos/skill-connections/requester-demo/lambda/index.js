/**
 * Skill Connections Requester.
 * Main entry point for lambda.
 */
const AskSdkCore = require('ask-sdk-core');

const IntentRequestHandler = require('./handlers/IntentRequestHandler');
const LaunchRequestHandler = require('./handlers/LaunchRequestHandler');
const SessionResumedRequestHandler = require('./handlers/SessionResumedRequestHandler');
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler');
const ErrorHandler = require('./handlers/ErrorHandler');

exports.handler = AskSdkCore.SkillBuilders.custom()
	.addRequestHandlers(
        IntentRequestHandler,
        LaunchRequestHandler,
        SessionResumedRequestHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
    