# Build An Alexa HistoryBuff Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-off._TTH_.png)](instructions/1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-off._TTH_.png)](instructions/2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-off._TTH_.png)](instructions/3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-off._TTH_.png)](instructions/4-testing.md)

## What You Will Learn
*  [AWS Lambda](http://aws.amazon.com/lambda)
*  [Alexa Skills Kit (ASK)](https://developer.amazon.com/alexa-skills-kit)
*  Progressive Response API

## What You Will Need
*  [Amazon Developer Portal Account](http://developer.amazon.com)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code in [src](lambda/custom) folder.


## What Your Skill Will Do
 The historyBuff is a sample skill that gives historical information that happened on a user provided day from wikipedia.
 The purpose of building this skill is to teach you how to use:
 - Alexa service: send directive request to progressive response API with authorization.
 - Web service: communicate with an external web service to get events for specified days in history(Wikipedia API)
 - Pagination: after obtaining a list of events, read a small subset of events and wait for user prompt to read the next subset of events by maintaining session state.
 - Session management: save session state in session attributes so that to handle multi-turn dialog model.
 - SSML: using SSML tags to control how Alexa render the *text-to-speech*.
 
 In the historyBuff skill, the user will provide a day by saying something like this:
   - "Alexa, ask History Buff what happened on August thirtieth."
  
 and Alexa will respond with responses like this:
- "For August thirtieth, in 2016, [...] . Wanna go deeper in history?"

If the user answers yes, the Alexa will respond with next subnext of events. If the user answers no, then the session is ended.

Now let's get start by a step to step instruction.

<a href="instructions/1-voice-user-interface.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_get_started._TTH_.png" /></a>


