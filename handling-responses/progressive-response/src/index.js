/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at 
 **/
'use strict';

const Alexa = require("alexa-sdk");
const Messages = require('./Messages');
const WikiRequestClient = require('./WikiRequestClient');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined; // jshint ignore:line

const PAGINATION_SIZE = 3;
const SESSION_INDEX = 'index';
const SESSION_TEXT = 'text';
const MONTH_NAMES = 'January,February,March,April,May,June,July,August,September,October,November,December';

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.response
            .speak(Messages.WELCOME)
            .listen(Messages.HELP);
        this.emit(':responseReady');
    },

    'GetFirstEventIntent': function () {
        const dateSlotValue = this.event.request.intent.slots && this.event.request.intent.slots.day.value;
        const calendar = dateSlotValue && (isNaN(Date.parse(dateSlotValue)) ? new Date() : new Date(dateSlotValue));
        const month = MONTH_NAMES.split(',')[calendar.getMonth()];  
        const date = calendar.getDate().toString();
        callDirectiveService(this.event);
        const wikiRequestClient = new WikiRequestClient();
        wikiRequestClient.getEventsFromWiki(month, date)
        .then((events) => {
            if(events.length === 0) {
                this.response
                    .speak(Messages.CONNECTERROR);
                this.emit(':responseReady');
                return;
            } 
            const cardTitle = 'Events on ' + month + ' ' + date;
            const startIndex = 0;
            let speechOutput = '<p>For ' + month + ' ' + date + '</p> ' + selectCurrentEvents(events, startIndex).speechOutputContent;
            let cardOutput = 'For ' + month + ' ' + date + ', ' + selectCurrentEvents(events, startIndex).cardOutputContent;
            if(startIndex + PAGINATION_SIZE >= events.length) {
                this.response
                    .speak(speechOutput)
                    .listen(Messages.NOMORE)
                    .cardRenderer(Messages.CARDTITLE, cardOutput);
                this.emit(':responseReady');
                return;
            }
            this.attributes[SESSION_INDEX] = PAGINATION_SIZE;
            this.attributes[SESSION_TEXT] = events;
            speechOutput += Messages.GODEEPER;
            cardOutput += Messages.GODEEPER;
            this.response.speak(speechOutput)
                        .listen(Messages.MOREREPROMPTTEXT)
                        .cardRenderer(cardTitle, cardOutput);
            this.emit(':responseReady');    
        }); 
    },

    'GetNextEventIntent': function () {
        const events = this.attributes[SESSION_TEXT];
        const startIndex = this.attributes[SESSION_INDEX];
        if(events.length === 0) {
            this.emit('AMAZON.HelpIntent');
            return;
        }
        if(startIndex >= events.length) {
            this.response
                .speak(Messages.NOMORE)
                .listen('');
            this.emit(':responseReady');
            return;
        } 
        let speechOutput = selectCurrentEvents(events, startIndex).speechOutputContent;
        let cardOutput = selectCurrentEvents(events, startIndex).cardOutputContent;
        if(startIndex + PAGINATION_SIZE >= events.length) {
            this.response
                .speak(speechOutput)
                .listen(Messages.NOMORE)
                .cardRenderer(Messages.CARDTITLE, cardOutput);
            this.emit(':responseReady');
            return;
        }
        this.attributes[SESSION_INDEX] = startIndex + PAGINATION_SIZE;
        speechOutput += Messages.GODEEPER;
        cardOutput += Messages.GODEEPER;
        this.response
            .speak(speechOutput)
            .listen(Messages.MOREREPROMPTTEXT)
            .cardRenderer(Messages.CARDTITLE, cardOutput);
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function () {
        this.response
            .speak(Messages.HELP)
            .listen(Messages.HELPREPROMPTTEXT);
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.response
            .speak(Messages.GOODBYE);
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        this.response
            .speak(Messages.GOODBYE);
        this.emit(':responseReady');
    },

    'Unhandled': function() {
        this.response
            .speak(Messages.UNHANDLED)
            .listen(Messages.HELP);
        this.emit(':responseReady');
    }
};

function callDirectiveService(event) {
    // Call Alexa Directive Service.
    const ds = new Alexa.services.DirectiveService();
    const requestId = event.request.requestId;
    const endpoint = event.context.System.apiEndpoint;
	const token = event.context.System.apiAccessToken;
	const directive = new Alexa.directives.VoicePlayerSpeakDirective(requestId, Messages.DIRECTIVESERVICEMESSAGE);
    ds.enqueue(directive, endpoint, token)
    .catch((err) => {
        console.log(Messages.DIRECTIVEERRORMESSAGE + err);
    });
}

function selectCurrentEvents(events, startIndex) {
    let speechOutputContent = '';
    let cardOutputContent = '';
    for (let i = startIndex; i < Math.min(events.length, startIndex + PAGINATION_SIZE); i++) {
        speechOutputContent += '<p>' + events[i] + '</p>';
        cardOutputContent += events[i] + '\n';
    }
    return {
            'speechOutputContent': speechOutputContent,
            'cardOutputContent': cardOutputContent
    };
}
