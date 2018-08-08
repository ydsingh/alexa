# CLI Lab
## Task 6

  **Lets experiment with monetizing our skill. Let's give our customers the ability to one-time purchase a special greeting.**

1. Let's add a product. Open a terminal window or command prompt and navigate to our skill directory. Type in the following command:  
  
  ```
ask add isp
```
  
2.  You'll be presented with a choice of products, either *entitlements* or *subscriptions*. For the purpose of this lab, choose the **entitlement** option and press Enter.

3. You'll get a second option to choose a basic template for your in-skill product. Select the `Entitlement_Template` and press Enter.

4. The terminal prompt will ask you for a name, go ahead and type in `premium-greeting`

5.  A new in-skill product will be created as a JSON file in a folder called `/isps/entiltement/`. Open it in a code or text editor of your choice to examine its contents.

6. Fill out the fields marked **TODO** or you can simply copy and paste a completed version by [clicking here](https://github.com/alexa/alexa-cookbook/edit/master/labs/CLI/assets/premium-greetings.json).  

7. Return to your terminal window and type in `ask deploy -t isp` to deploy your product.

8. Go to `line 26` add `async` to the handle callback. It should look something like this:   

```
     async handle(handlerInput) {
       const speechText = 'Hello World!';
```

**TIP:** If you're curious about what the `async` expression does, you can read more about it [by clicking here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

9. Let's also add a reprompt at this point to keep alexa listening for another utterance from our customer. After `line 27` we can add `let repromptText = 'Try saying hello. ';` and after `line 30` we can add `.reprompt(repromptText)` to the responseBuilder return block.

10. If you completed this part successfully, your `HelloWorldIntentHandler` should look something like this:

	```
	const HelloWorldIntentHandler = {
	  canHandle(handlerInput) {
	    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
	      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
	  },
	  async handle(handlerInput) {
	    const speechText = 'Hello World!';
	
	    return handlerInput.responseBuilder
	      .speak(speechText)
	      .reprompt(repromptText)
	      .withSimpleCard('Hello World', speechText)
	      .getResponse();
	  },
	};
	```

	**Let's put our premium greeting behind a pay wall. If a customer is entitled to our "premium greeting" product, we'll send them the premium speech output -- otherwise they will get a standard greeting with an upsell message to**
	
11. Go ahead and copy and paste the following brick of code at `line 29`:

	```
    const locale = handlerInput.requestEnvelope.request.locale;
    const monetizationService = await handlerInput.serviceClientFactory.getMonetizationServiceClient();
  
    const result = await monetizationService.getInSkillProducts(locale);
    const product = result.inSkillProducts[0]
    console.log(product);

    if (product.entitled === 'ENTITLED') {
      speechText = "Many years of happy days befall thee, my <emphasis level='strong'>gracious</emphasis> sovereign. <audio src='https://s3.amazonaws.com/ask-soundlibrary/magic/amzn_sfx_fairy_melodic_chimes_01.mp3'/>"
    } else {
      upsell = product.summary + ' Say buy it now to make it happen!';
      speechText = 'Hello World. ' + upsell;
      repromptText = repromptText + upsell;
    }
	```
	
12. The final step is to go down to `line 122` and add the following line to the exports handler:
`  .withApiClient(new Alexa.DefaultApiClient())`


**Congratulations!** You've created a product and the associated experience. The logic will check to see if your customer is entitled to to your product and if they are, the greeting will change! Test the changes you've made to your skill on your device, from the developer portal or on echosim.io. You can try to say something like "Alexa, ask hello jeff to say hello". Since your simulator hasn't paid for the skill yet, you should still get the standard greeting.
