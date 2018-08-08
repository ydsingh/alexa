# CLI Lab
## Task 7

  **Lets set up the code for our customer's purchase path.**
  
**First our custommers need a way to buy this product. Let's create a new intent for them that will present them with the pricing options and the ability to accept or decline the purchase of their in skill product.**

  2. We'll start by editing the front-end (VUI) again. Open the interaction model in your preferred Code Editor (`models/en-US.json`). 
  
  3. Copy and paste the following block of JSON below in between `line 37` and `line 38`. Feel free to add additional utterances:

  ```        
  {
          "name": "BuyIntent",
          "slots": [

          ],
          "samples": [
            "buy now",
            "buy it now",
            "I want to buy",
            "let's buy"
          ]
        },
    ```  
 
   
2. Save your interaction model and open your lambda function (lambda/custom/index.js) and copy/paste the following brick of code in a new line after `line 50` (in between the `HowAreYouIntentHandler` and the `HelpIntentHandler`):

  ```
const BuyIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
},
async handle(handlerInput) {
  const locale = handlerInput.requestEnvelope.request.locale;
  const monetizationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();

  const result = await monetizationService.getInSkillProducts(locale);
  const product = result.inSkillProducts[0];

      return handlerInput.responseBuilder
          .addDirective({
              'type': 'Connections.SendRequest',
              'name': 'Buy',
              'payload': {
                          'InSkillProduct': {
                              'productId': product.productId
                          }
              },
              'token': 'correlationToken'
          })
          .getResponse();

    }
    };
    ```     
    
  **A customer may accept the purchase, they may decline the purchase, or there could be an error with the transaction. We'll add a new handler to manage different prompts our skill can return to our customer based on their decision.**
 
4. Right below the `BuyIntentHandler` and before the `HelpIntentHandler`, around `line77` through `line 79`. We'll create a new handler called the `BuyResponseHandler`. You can copy and paste the following brick of code:

  ```
const BuyResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Buy';
  },
  async handle(handlerInput) {
    console.log('IN BUYRESPONSEHANDLER');
    let speechText;
    let repromptText = "Try saying Hello!";

    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    const result = await monetizationService.getInSkillProducts(locale)
    const product = result.inSkillProducts[0];
      
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
          
          speechText = 'We hope you enjoy it! ' + repromptText;

        }
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED') {
          speechText = 'No problem. Thanks for your interest in ' + product.name + ' ' + repromptText;

        }
      } else {
          // Something failed.
          console.log(`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`);
          speechText = 'There was an error handling your purchase request. Please try again or contact us for help.';
      }


      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();

  },
};
```
6. Before we can test this out, we have to register these two new intents to our request handlers.
7. Let's scroll down to `line 180`. Add `BuyIntentHandler,` and `BuyResponseHandler,` to the comma separated list in the order that they appear in your code. It should look something like this:


    ```
    .addRequestHandlers(
    	LaunchRequestHandler,
    	HelloWorldIntentHandler,
    	HowAreYouIntentHandler,
    	BuyIntentHandler,
    	BuyResponseHandler,
    	HelpIntentHandler,
    	CancelAndStopIntentHandler,
    	SessionEndedRequestHandler
    )
    ``` 
8. Now Deploy your changes. Since you've changed both the interaction model and the lambda function simply enter `ask deploy` into your command prompt to push both the interaction model and lambda function changes up. This command will also push up any changes you've made to the metadata for your in-skill product.

Test the changes you've made to your skill on your device, from the developer portal or on echosim.io. You can try to say something like "Alexa, start hello jeff" and then follow up with "buy it now"...go ahead and experiment with declining the option to purchase, and then try again with accepting the purchase.