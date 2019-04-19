# Dynamic Entities Demo

## What You Will Need
*  [Amazon Developer Account](http://developer.amazon.com/alexa)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code on [GitHub](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-demo-dynamic-entities/).

## Setting Up the Demo
This folder contains the interaction model and skill code.  It is structured to make it easy to deploy if you have the ASK CLI already setup.  If you would like to use the Developer Portal, you can follow the steps outlined in the [Hello World](https://github.com/alexa/skill-sample-nodejs-hello-world) example, substituting the [Model](./models/en-US.json) and the [skill code](./lambda/custom/index.js) when called for.

## Running the Demo
To start the demo say "alexa open trivia game". It will start a quiz game immediately where you answer questions which answers are dynamic entities retrieved from a quiz API. You can say "start" to start over or stop to see the game stats.

?

> Note: We use the Open Trivia Database to fetch Q/As (https://opentdb.com)

> Note: To make things easier we elimate questions that have mixed alphanumeric answers (only letters are allowed in the answers)

> Note: Some answers can be non standard words (like the name of a Pokemon character) so in those cases the answer might be not recognized properly

\###