# Custom Tasks Demo Skill

## What You Will Need
*  [Amazon Developer Account](http://developer.amazon.com/alexa)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code on [GitHub](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-demo-tasks/).
*  An Alexa device (e.g. Amazon Echo) or the simulator in the Developer Console

## What you Get
This is a demo showing how to implement custom tasks in Skill Connections. We use a skill that reads you your horoscope
according to your zodiac sign and also offer that service as a [Custom Task](https://developer.amazon.com/en-US/docs/alexa/custom-skills/implement-custom-tasks-in-your-skill.html), part of [Skill Connections](https://developer.amazon.com/en-US/docs/alexa/custom-skills/understand-skill-connections.html).

## Setting Up the Demo
This folder contains the interaction model and skill code.  It is structured to make it easy to deploy if you have the ASK CLI already setup (try 'ask deploy'). Note that this sample requires ASK CLI v2 or greater as previous versions of the CLI can't deploy custom tasks (nor tasks can be deployed from the Developer Console at the time of this writing).

In order to deploy you need to be whitelisted first so please do the following:
1. Edit skill-package/skill.json and remove the "tasks" item in apis.custom
2. Rename skill-package/tasks to skill-package/tasks.tmp
3. Do "ask deploy" and write down the skill ID
4. Enter the skill ID in lambda/index.js (SKILL_ID constant)
5. Fill in [this form](https://build.amazonalexadev.com/DirectConnections_landing-page.html) and provide the skill ID

Once you get whitelisted undo steps 1 and 2 above and deploy the skill again (you are adding the task back).

## Running the Demo
You can say "alexa open simple horoscope" and then say a zodiac sign to see the basic functionality but in this case you would not be using tasks. In order to use Tasks you can try the [command line](https://developer.amazon.com/en-US/docs/alexa/custom-skills/implement-custom-tasks-in-your-skill.html#to-invoke-your-task-handler) or sending a directive from another skill (the Requester skill):
```js
return handlerInput.responseBuilder
    .speak(speechText)
    .addDirective({
        'type': 'Connections.StartConnection', 
        'uri': 'connection://YOUR_SKILL_ID.SignHoroscope/1?provider=YOUR_SKILL_ID',
        'input': {
            'sign': 'virgo'
        },
        'token': 'none'
    })
```
Besides sending the directive the Requester skill processes the response coming back from the task in a SessionResumedRequest handler, e.g.:
```js
const SessionResumedRequestHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'SessionResumedRequest';
    },
    handle(handlerInput) {
        const {status, result} = handlerInput.requestEnvelope.request.cause;
        const code = status.code;
        const message = status.message;
        let speechText = `Got back! Status code is ${code}, message is ${message}`;
        if (code === '200') {
          speechText += ` and payload is. ${result.payload}`;
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};
```
> See the [Skill Connections Demos](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-connections) for a working Requester skill example

## Resources
* [Create Re-usable Alexa Skills with Custom Tasks (Beta) and Direct Skill Connections (Preview)](https://alexa.design/customtasks)
* [Implement Custom Tasks in your Skill](https://developer.amazon.com/en-US/docs/alexa/custom-skills/implement-custom-tasks-in-your-skill.html)
* [Use Skill Connections to Request Tasks](https://developer.amazon.com/en-US/docs/alexa/custom-skills/use-skill-connections-to-request-tasks.html)
* [Reach More Customers with Quick Links for Alexa (Beta) and New In-Skill Purchasing Options](https://developer.amazon.com/en-US/blogs/alexa/alexa-skills-kit/2020/07/quick-links-custom-tasks-isp)
* [Simple Horoscope, a demo skill showing custom tasks](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-demo-tasks)
* [Launch Tasks via the Timers API (demo)](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-demo-timers)
* [Skill Connections Demos](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-connections)
* [Alexa Skill Custom Tasks Repository](https://github.com/alexa-labs/alexa-custom-task-definitions)

## License

This library is licensed under the Amazon Software License.
