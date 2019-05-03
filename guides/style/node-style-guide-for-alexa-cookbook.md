# Alexa Cookbook and Sample Skills Style Guide for Node.js

This Style Guide provides the guidance for how Node.js code used in the Alexa Cookbook and Sample Skills should be formatted and laid out. Please use these guidelines (unless you know better ones -- if you do, open an issue/PR).

## Contents

1. Code Layout
1. General
1. Handlers & Interceptors
1. Functions
1. Internationalization (I18N)

## Code Layout
Ensure that the code in index.js follows this order:
1. License header (if applicable)
1. Constants (not including language strings if multiple languages in the same file)
1. Handlers
1. Functions (if not in separate file)
1. Lambda Setup (export)
1. Language strings (if including multiple languages in the same file)

### Section Labels
1.	Add a header comment for each of these code sections 
-	`/* CONSTANTS */`
-	`/* HANDLERS */`
-	`/* FUNCTIONS */`
-	`/* LAMBDA SETUP */`
- `/* LANGUAGE STRINGS */`

## General
1. Code needs to be internationalized (use language strings, etc.) but does not need to be translated. Minimum support of en-US required.
1. Lint the code according to this [ESLint configuration file](./eslintrc.json). Using ESLint is not required, presuming the result matches. (Config files for other tools accepted as PR's.)
> If you are new to ESLint, get started with [ESLint installation and usage information](https://eslint.org/docs/user-guide/getting-started). 
1. The `.speak` method should always take `speakOutput` as its parameter.
1. The `.reprompt` method should always take `repromptOutput` or `speakOutput` as its parameter.
1. Comments usage:
    1. Indicate where required/optional action is required.
    1. Mark required actions in comments with `**TODO**`.
    1. Describe key or unusual code.
1. To make code more readable, indent and line break statements with multiple conditionals. Line break before the operator. For example,
    **Do**
    ```javascript
    return request.type === "IntentRequest"
           && (request.intent.name === "QuizIntent"
               || request.intent.name === "AMAZON.StartOverIntent");
    ```
    **Don't**
    This breaks after the operator. Use line break before operator.
    ```javascript
    return request.type === "IntentRequest" &&
              (request.intent.name === "QuizIntent" || request.intent.name === "AMAZON.StartOverIntent");
    ```
    **Don't**
    This line is too long. Use a line break.
    ```javascript
    return request.type === "IntentRequest" && (request.intent.name === "QuizIntent" || request.intent.name === "AMAZON.StartOverIntent");
    ```
    **Don't**
    This line is not indented properly.
    ```javascript
    return request.type === "IntentRequest"
    && (request.intent.name === "QuizIntent" || request.intent.name === "AMAZON.StartOverIntent");
    ```
### Constants, Variables & Attributes
1.	Constants and session attributes should be named in "camelCase".
2.	Use only `const` or let to declare variables. 
1.	`const` should be used for things that would not be altered
2.	`let` should be used for things that would likely altered programmatically
3.	Rename boolean variables to begin with "is", "has", "can" or comparable prefix to indicate boolean.  E.g. "isCorrect", instead of just "correct".

### Standard Constants
The following constants should be included:
```javascript
const debug = getEnvVar('DEBUG', false); // controls if debug messaging should be outputted to CloudWatch logs
const speakError = getEnvVar('SPEAK_ERROR', false); // controls if error message details should be spoken in the response to aid in debugging. requires debug to be enabled in order to work
const errorMessage='I had trouble processing that request. Please try again and if the issue persists, please contact the skill developer. What can I help you with?';
```

## Handlers & Interceptors
1.	Rename all handlers to NOT include the word "Intent", but the word "Handler" instead. So, name them like - 
    1.	LaunchRequestHandler 
    1.	SomeRandomHandler
    1.	RepeatHandler
    1.	HelpHandler
    1.	ExitHandler
    1.  FallbackHandler
    1.	SessionEndedRequestHandler
    1.	ErrorHandler
1. Include the Handlers in this order when constructing the SkillBuilder:
    1. LaunchRequestHandler
    1. <skill specific intent handlers>
    1.	RepeatHandler (if applicable)
    1.	HelpHandler
    1.	ExitHandler
    1.  FallbackHandler
    1.	SessionEndedRequestHandler
1. Include the suffix **Interceptor** on both request and response interceptors.

### Boilerplate Code
The code in these sections should be used for their respective handlers. If the functionality of the code requires changes, use this as a baseline.
#### SessionEndedRequestHandler
```javascript
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler - canHandle");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequestHandler';
  },
  handle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler - handle");
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};
```
#### FallbackHandler
```javascript
// coming soon
```
#### ErrorHandler
```javascript
const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler - canHandle");
    return true;
  },
  handle(handlerInput, error) {
    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error.stack)}`); 
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak(errorMessage )
      .reprompt(errorMessage)
      .getResponse();
  },
};
```
#### LogRequestInterceptor
```javascript
// coming soon
```
#### LogResponseInterceptor
```javascript
// coming soon
```
## Functions
1. All (non-handler) functions should be named in "camelCase"
2. All functions names should begin with an action verb, so like - getFinalScore, formatCasing, supportsDisplay etc.
3. If a utility function is available in the SDK, the use of it is preferred over using a locally maintain function with comparable functionality.

## Testing
1. No specific test methodology is currently required, but do test your code.  Use unit testing (no voice interaction) in addition to voice testing (full stack).
1. Run ESLint on the code to check for errors, including indentation.
1. Where applicable, include certification testing instructions.

## I18N (Internationalization)
I18N will leverage i18next.
In the require section add:
```javascript
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
```
Import the desired translations by adding this section (always include all locales, just comment out the ones not included).
```javascript
const languageStrings = {
  'en' : require('languages\en.js'),
  'en-US': require('languages\en-US.js'),
//  'en-GB': require('languages\en-GB.js'),
  'de': require('languages\de.js'),
};
```
Process the translations using this code:
```javascript
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  },
};
```
Enable the Interceptor by adding this to the skillBuilder definition:
```javascript
.addRequestInterceptors(LocalizationInterceptor)
```
Under lambda/custom/languages, add <lang>.js and <lang>-<country>.js as needed.  Those files will be structured as:
```javascript
// en-US.js 
module.exports = {
	translation: {
		'HELLO': 'how are you in the USA?',
		/// ...
	}
}
```
For strings to be translated, first setup with:
```javascript
const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
```
then you can use:
```javascript
speakOutput = requestAttributes.t('RECIPE_NOT_FOUND_MESSAGE');
```
If you want to use the sprintf functionality, use this:
```javascript
sessionAttributes.repromptSpeech = requestAttributes.t('HELP_REPROMPT', item);
```
where
```javascript
HELP_REPROMPT: 'You can say things like, what\'s the recipe for a %s, or you can say exit...Now, what can I help you with?'
```
