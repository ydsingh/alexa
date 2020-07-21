# Person Profile Demo

## What You Will Need
*  [Amazon Developer Account](http://developer.amazon.com/alexa)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code on [GitHub](https://github.com/alexa/alexa-cookbook/tree/master/feature-demos/skill-demo-person-profile/)

## Setting Up the Demo
This folder contains the interaction model and skill code.  It is structured to make it easy to deploy if you have the ASK CLI already setup.  If you would like to use the Developer Portal, you can follow the steps outlined in the [Hello World](https://github.com/alexa/skill-sample-nodejs-hello-world) example, by substituting the [Model](./models/en-US.json) and the [skill code](./lambda/custom/index.js) when called for.

## Running the Demo
To start the demo say "alexa open person profile demo". If your test account has a voice profile set up and has opted into personalization, Alexa will prompt you to grant permissions or request your name or phone number. If personalization is not turned on, Alexa will say 'Hi Stranger.'" 

This demo is packaged for the ASK CLI version 1. If you are running ASK CLI version 2 or higher, please run `ask util upgrade-project` in the project root to migrate it to the newer format.