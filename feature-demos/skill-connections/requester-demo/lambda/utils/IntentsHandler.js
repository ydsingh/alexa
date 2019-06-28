/**
 * Lists all of the intents the requester skill can handle.
 */

const IntentsResponse = require('./IntentsResponse');

const IntentsHandler = {
    SendPrintWebPage: {
        response: IntentsResponse.SendPrintWebPage,
    },
};
exports.default = IntentsHandler;
