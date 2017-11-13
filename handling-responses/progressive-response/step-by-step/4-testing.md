# Build An Alexa HistoryBuff Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-locked._TTH_.png)](3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-on._TTH_.png)](4-testing.md)

## Testing Your Alexa Skill

So far, we have [created a Voice User Interface](1-voice-user-interface.md) and [a Lambda function](2-lambda-function.md), and [connected the two together](3-connect-vui-to-code.md).  Your skill is now ready to test.

1.  **Go back to the [Amazon Developer Portal](https://developer.amazon.com/edw/home.html#/skills/list) and select your skill from the list.** You may still have a browser tab open if you started at the beginning of this tutorial.

2.  **Open the "Test" tab on the left side.**

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/4-2-test-tab._TTH_.png" />

3.  **Understand the voice simulator.** While it's not specific to your skill, the Voice Simulator is a valuable testing tool for every skill. Type a word into the box, and click the "Listen" button to hear how Alexa will
pronounce it. To make changes to her pronunciation, use Speech Synthesis Markup Language [(SSML)](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference) to modify how Alexa will interpret text to speech. Try these examples:

```html
<say-as interpret-as="number">12345</say-as>
```

```html
<say-as interpret-as="ordinal">12345</say-as>
```

```html
<say-as interpret-as="digits">12345</say-as>
```

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/4-3-voice-simulator._TTH_.png" />

Return to the Voice Simulator as needed to ensure that Alexa says words and phrases as you would expect.

4.  **Test your skill with the Service Simulator.** To validate that your skill is working as expected, use the Service Simulator.  In the **Enter Utterance** text box, type "October 13"， it will show the voice response and echo show render response as well.

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/test_33._CB1508279020_.png" /> 
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/test_2._CB1507932569_.png" />

### Service Simulator Tips
* After you click the "Ask [Your Skill Name]" button, you should see the **Lambda Request** and **Lambda Response** boxes get populated with JSON data like in the screenshot above.
* Click the **Listen** button in the bottom right corner to hear Alexa read the response.

* If you receive a response that reads: *"The remote endpoint could not be called, or the response it returned was invalid,"* this is an indication that something is broken.  AWS Lambda offers an additional testing tool to help you troubleshoot your skill.

5.  **Configure a test event in AWS Lambda.** Now that you are familiar with the **request** and **response** boxes in the Service Simulator, it's important for you to know that you can use your **requests** to directly test your Lambda function every time you update it.  To do this:
1.  Create & copy a new response with the Service Simulator, or grab the sample text from the box below:

```JAVASCRIPT
{
  "session": {
  "new": true,
  "sessionId": "SessionId.01d19fec-f7b0-4d49-8d96-bd5fb88e0352",
  "application": {
  "applicationId": "amzn1.ask.skill.3fffd2ea-2cd8-4a34-8809-f8a5c217ff18"
  },
  "attributes": {},
  "user": {
  "userId": "amzn1.ask.account.AEY2FIWPF72JQZZQ64MPTBSHKXTATPXU6U36XKY3377TCITR7CPEKF3UDBXDZFHWGZORUB3BKPINQZ2TPIIBJBVLWPC7MLOKSLHKO64KVGJXD3TACIUNULDZGSHRTS42Z42JTLQYA3IVJECKLDIW5CTY642LUTJOCHM6RLXOHBCVJX6CG6KFQF7XWZZPCPFZDQL6WKNZOBO66VY"
  }
  },
  "request": {
  "type": "LaunchRequest",
  "requestId": "EdwRequestId.3ea25cc6-c490-4582-9c12-06ed119b4579",
  "locale": "en-US",
  "timestamp": "2017-10-13T20:16:04Z"
  },
  "context": {
  "AudioPlayer": {
  "playerActivity": "IDLE"
  },
  "System": {
  "application": {
  "applicationId": "amzn1.ask.skill.3fffd2ea-2cd8-4a34-8809-f8a5c217ff18"
  },
  "user": {
  "userId": "amzn1.ask.account.AEY2FIWPF72JQZZQ64MPTBSHKXTATPXU6U36XKY3377TCITR7CPEKF3UDBXDZFHWGZORUB3BKPINQZ2TPIIBJBVLWPC7MLOKSLHKO64KVGJXD3TACIUNULDZGSHRTS42Z42JTLQYA3IVJECKLDIW5CTY642LUTJOCHM6RLXOHBCVJX6CG6KFQF7XWZZPCPFZDQL6WKNZOBO66VY"
  },
  "device": {
  "supportedInterfaces": {}
  }
  }
  },
  "version": "1.0"
}
```

2.  **Open your Lambda function in AWS, open the **Select a test event** menu, and select "Configure test event."**

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/configure_test_events._CB1507926089_.png" />

3.  **Choose "Create new test event"** and then in the **Event template**, choose **Alexa Start Session**. You can choose any item in the Event template, as they are just templated event requests, but using "Alexa Start Session" is an easy one to remember.  This will also be the sample request that fires every time you update and "Save and Test" your Lambda code.

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/event_template._CB1507926400_.png" />

4.  Give a name of the test event, for example, "launch" here. **Delete the contents of the box, and paste your request into the box.**

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/new_events._CB1507926791_.png" />

5.  **Click the "Create" button.** This will save your test event, and run it against your Lambda function. This gives you visibility into four things:

*  **Your response, listed in the "Execution Result."**

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/output_1._CB1507927333_.png" />

*  **A Summary of the statistics for your request.** This includes things like duration, resources, and memory used.

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/output_2._CB1507927332_.png" />

*  **Log output.**  By effectively using console.log() statements in your Lambda code, you can track what is happening inside your function, and help to figure out what is happening when something goes wrong.  You will find the log to be incredibly valuable as you move into more advanced skills.

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/historybuff/output_3._CB1507927332_.png"/>

*  **A link to your [CloudWatch](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs:) logs for this function.**  This will show you **all** of the responses and log statements from every user interaction.  This is very useful, especially when you are testing your skill from a device with your voice.  (It is the "[Click here](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs:)" link in the Log Output description.)

6.  **Other testing methods to consider:**

*  [Echosim.io](https://echosim.io) - a browser-based Alexa skill testing tool that makes it easy to test your skills without carrying a physical device everywhere you go.
*  [Unit Testing with Alexa](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/unit-testing.md) - a modern approach to unit testing your Alexa skills with [Postman](http://getpostman.com) and [Amazon API Gateway](http://aws.amazon.com/apigateway).



