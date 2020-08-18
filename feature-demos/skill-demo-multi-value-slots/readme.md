# Create Multi-Value Slots Demo

## Setting Up the Demo
This folder contains the interaction model and skill code.  It is structured to make it easy to deploy if you have the ASK CLI already setup. 

If you would like to use the Developer Portal, you can follow the steps outlined in the [Hello World](https://github.com/alexa/skill-sample-nodejs-hello-world) example, substituting the [Model](./models/en-US.json) and the [skill code](./lambda/index.js) when called for. 


## Running the Demo
To start the demo say "alexa smoothie demo".  It will prompt you for what ingredients you would like in your smoothie.  Say "smoothie with {fruits} {greens} and {extras}" in any combination you like, with multiple values for each slot if required. Alexa will reply back with the confirmed Smoothie order.

