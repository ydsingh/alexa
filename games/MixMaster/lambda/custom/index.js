'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'mixMaster';
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const introSong = 'https://s3.amazonaws.com/asksounds/happyintro.mp3';
const easySong = 'https://s3.amazonaws.com/asksounds/waitingtime1.mp3';
const mediumSong = 'https://s3.amazonaws.com/asksounds/waitingtime3.mp3';
const hardSong = 'https://s3.amazonaws.com/asksounds/waitingtime2.mp3';
const correctSong = 'https://s3.amazonaws.com/asksounds/correct1.mp3';

//question, hint, answer
//easy medium hard
    //duration of prompt
    //question nature
//painting the picture for the kids
//that was fun, here comes your next one!
//quit, help, reset, dynamo to save index of questions
    //ending prompt scenario global attribute: easy medium hard, json object answer question synonyms audio file, Amy 

var handlers = {
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['currentStage'] = 'easy';
            this.attributes['currentLevel'] = 0;
        }
        this.emit("LaunchRequest");
    },
    'LaunchRequest': function() {
        //ask a new question
        this.response.speak("<audio src='" + introSong + "' /> Welcome to Mix Master! ");
        this.emit(':responseReady');
    },
    'QuestionIntent': function() {
        //get a question
        if(!this.attributes['currentStage'] || !this.attributes['currentLevel']) {
            this.attributes['currentStage'] = 'easy';
            this.attributes['currentLevel'] = 0;
        }

        let data = mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']];
        var audio = '';

        if (this.attributes['currentStage'] == 'easy') {
            audio = easySong;
        } else if (this.attributes['currentStage'] == 'medium') {
            audio = mediumSong;
        } else {
            audio = hardSong;
        }
        //ask the question
        this.response.speak("Think about what " + data.mix[0] + " and " + data.mix[1] + " could make. <audio src='" + audio + "' /> What do they make?").listen("What do they make?");
        this.emit(':responseReady');
    },
    'AnswerIntent': function () {
        //get the Answer
        let slotValues = getSlotValues(this.event.request.intent.slots);
        let givenAnswer = slotValues.answer.resolved;

        let correctAnswer = mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].answer;
        let speechOutput = "";

        if(correctAnswer.toUpperCase()==givenAnswer.toUpperCase()) {
            speechOutput = "<audio src='" + correctSong + "' />" + getSpeechCon(true)+ " you got it! " + givenAnswer + " was right. ";
            
            //update stage and level
            if (this.attributes['currentLevel'] < mixMasterElements[this.attributes['currentStage']].length) {
                this.attributes['currentLevel'] = parseInt(this.attributes['currentLevel']) + 1;
            } else {
                if (this.attributes['currentStage'] == 'easy') {
                    speechOutput += getSpeechCon(true) + " you leveled up!";
                    this.attributes['currentStage'] = 'medium';
                    this.attributes['currentLevel'] = 0;
                } else if (this.attributes['currentStage'] == 'medium') {
                    speechOutput += getSpeechCon(true) + " you leveled up!";
                    this.attributes['currentStage'] = 'hard';
                    this.attributes['currentLevel'] = 0;
                } else {
                    speechOutput += getSpeechCon(true) + " you completed all of the mixes! What level would you like to start at next?";
                    this.response.listen(speechOutput);
                    this.emit(':responseReady');
                }
            }
            speechOutput = " To play in this scene, say play. To move on, say next question.";
            this.emit(':responseReady');
        } else {
            //incorrect + hint
            speechOutput =
                getSpeechCon(false) 
                    + " you are almost right! Here is a hint. "
                    + mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].hint
                    + ". Now let's try that one again. ";
            this.emit('QuestionIntent');
        }
    },
    'PlaySceneIntent': function() {
        let scene = mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].scene;
        let audio = mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].audio;
        let speechOutput = scene + "<audio src='" + audio + "' />" + getSpeechCon(true) + " that was fun! Here comes your next mix master question. ";
        this.emit('QuestionIntent');
    },
    'HintIntent': function() {
        speechOutput = "Here is a hint. " + mixMasterElements[this.attributes['currentStage']][this.attributes['currentLevel']].hint + ". Here it comes again, ";
        this.response.speak(speechOutput);
        this.emit('QuestionIntent');
    },
    'NewGameIntent':function(){
      this.emit('LaunchRequest');
    },

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: let's play a game");
        this.response.listen("You can try: let's play a game");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.emit('AMAZON.HelpIntent');
    }
};


//=========================================================================================================================================
// HELPER FUNCTIONS
//=========================================================================================================================================

function getSpeechCon(type) {
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min+1)+min);
}
//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what synonym the person said - .synonym
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
    let slotValues = {};

    console.log(JSON.stringify(filledSlots));

    Object.keys(filledSlots).forEach(function(item) {
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name=filledSlots[item].name;
        //console.log("name: "+name);
        if(filledSlots[item]&&
           filledSlots[item].resolutions &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        "isValidated": filledSlots[item].value == filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name
                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "synonym":filledSlots[item].value,
                        "resolved":filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
                }
            } else {
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved":filledSlots[item].value,
                    "isValidated": false
                };
            }
        },this);
        //console.log("slot values: "+JSON.stringify(slotValues));
        return slotValues;
}

//=========================================================================================================================================
// DATA
//=========================================================================================================================================
const mixMasterElements = {
    "easy": [
        {
            "answer":"mud",
            "mix":["dirt", "water"],
            "hint":"it is sticky and brown",
            "synonyms":[],
            "scene":"Now you are in a stinky smelly swamp! Be careful where you step!",
            "audio":"https://s3.amazonaws.com/asksounds/swamp.mp3"
        },
        {
            "answer":"rain",
            "mix":["clouds", "water"],
            "synonyms":["showers", "thunder", "rain shower", "storm"],
            "hint":"don't forget your umbrella",
            "scene":"You are in a scary thunder storm! Take cover!",
            "audio":"https://s3.amazonaws.com/asksounds/thunder.mp3"
        },
        {
            "answer":"campfire",
            "mix":["fire", "wood"],
            "synonyms":["bonfire", "camping"],
            "hint":"we can roast marshmellows",
            "scene":"You are at a spooky campsite, I hope there aren't monsters in the forrest!",
            "audio":"https://s3.amazonaws.com/asksounds/campfire.mp3"
        },
        {
            "answer":"space",
            "mix":["stars", "moon"],
            "synonyms":["outerspace", "galaxy"],
            "hint":"do you think aliens exist?",
            "scene":"Now you are deep in space, let's go exploring!",
            "audio":"https://s3.amazonaws.com/asksounds/space.mp3"
        },
        {
            "answer":"library",
            "mix":["words", "paper"],
            "synonyms":["books", "literature", "bookstore"],
            "hint":"<amazon:effect name='whispered'>Shush! Use your quiet voice!</amazon:effect>",
            "scene":"<amazon:effect name='whispered'>We are in the library, don't make too much noise!</amazon:effect>",
            "audio":"https://s3.amazonaws.com/asksounds/library.mp3"
        },
        {
            "answer":"snow",
            "mix":["rain", "cold"],
            "synonyms":["frosty", "sleet", "hail", "frost", "winter"],
            "hint":"it is white and fluffy",
            "scene":"Oh boy it is cold! We are in the middle of Antartica!",
            "audio":"https://s3.amazonaws.com/asksounds/wind.mp3"
        }
    ],
    "medium": [
        {
            "answer":"glass",
            "mix":["sand", "fire"],
            "synonyms":["mirror"],
            "hint":"what are windows made out of",
            "scene":"Everything is glass, step carefully!",
            "audio":"askjhd"
        }
    ],
    "hard": []
};