/**
 * Handler for error handling.
 */
const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      return handlerInput.responseBuilder
        .speak('Sorry, error occurred.')
        .getResponse();
    },
};

module.exports = ErrorHandler;
