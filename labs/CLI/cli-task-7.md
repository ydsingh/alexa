# CLI Lab
## Task 7

**Lets set up the code for our customer's purchase path.** Our customers need a way to buy this product. Let's create a new intent for them that will present them with the pricing options and the ability to accept or decline the purchase of their in skill product.

  1. Start by editing the front-end (VUI) again. Open the interaction model in your preferred Code Editor (`models/en-US.json`). 
  
  2. Copy and paste the following block of JSON below in between `line 37` and `line 38`. Feel free to add additional utterances:

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
 
   
3. Save your interaction model and open your lambda function (located in `lambda/custom/index.js`). Copy and paste the following brick of code in a new line after `line 50` (in between the `HowAreYouIntentHandler` and the `HelpIntentHandler`):

```
const BuyIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
},
async handle(handlerInput) {

  //retrieve skill locale
  const locale = handlerInput.requestEnvelope.request.locale; 
  
  //initialize the monetizationService
  const monetizationService = handlerInput.serviceClientFactory.getMonetizationServiceClient(); 
  
  //await expression pauses the rest of the execution until in-skill products are retrieved
  //retrieve all locale specific in-skill products
  const result = await monetizationService.getInSkillProducts(locale); 
  
  //set the product object
  const product = result.inSkillProducts[0]; 
  
  //send in-skill product payload as a directive to the Alexa service to handle the transaction
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
**NOTE:** We've commented this code so you can understand exactly what's going on. 

**The intent above will allow the Alexa service to handle pricing, and the purchase path flow.** Still, a customer has a few options: they may accept the purchase, they may decline the purchase, or they may run into an error with the transaction. We'll add a new handler to manage different prompts our skill can return to our customer based on their decision.
 
4. Right below the `BuyIntentHandler` and before the `HelpIntentHandler` (around `line 86` through `line 89`), create a new handler called the `BuyResponseHandler`. You can copy and paste the following brick of code:

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
    
    //if and else statements driven by the customer's purchaseResult will alter the prompts to the customer
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

5. Before we can test this out, we have to register these two new intents to our request handlers.

6. Let's scroll down to `line 190`. Add `BuyIntentHandler,` and `BuyResponseHandler,` to the comma separated list in the order that they appear in your code. Your code should look something like this:


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

7. Now Deploy your changes with `ask deploy`

8. Test the changes you've made to your skill on your device, from the developer portal or on echosim.io. You can try to say something like "Alexa, start hello jeff" and then follow up with "buy it now". Experiment with declining the option to purchase, and then try the experience again with accepting the purchase.
