# Creating a Message When the User Confuses You

Because of the nature of voice interactions, there will be times where a user says something that your skill just didn't anticipate.  In those cases, it is helpful to acknowledge what the user said, and indicate that you didn't know how to handle their request.

In some cases, Alexa might have just misunderstood the user.  By repeating what Alexa heard, the user can try to correct their request to get it right the second time.  In other cases, your skill just doesn't know how to handle their request.  This still lets them know that you're aware, and gives them an opportunity to try something else.

From your intent, you can call `getRandomConfusionMessage(value)`, and it will return a message indicating the miss to your user.  The "value" is the slot text that you received.  (To easily grab a slot value, check out the ingredient "[Retrieving A Slot Value](https://github.com/alexa/alexa-cookbook/blob/dev-tips/ingredients/getting-a-slot-value.md).")

    var speechText = getRandomConfusionMessage(value);

To call this, add this helper function to your code.  You can modify the speech text in the method to make the language more appropriate for your skill, if necessary.

    function getRandomConfusionMessage(value)
    {
        var spokenWords = "I heard you say " + value + " ";
        var messages = ["I don't seem to know how to answer that one yet, but I'll work on it.",
                    "Hmmm.  I can't seem to figure that one out.",
                    "There's a chance I misunderstood you, but I don't know how to answer your question.",
                    "I'm sorry. I don't know how to help you with that.",
                    "I don't have an answer for you today, but I'll add it to my list of things I should learn soon!"];
        var random = getRandom(0, messages.length-1);
        return spokenWords + "<break time='500ms'/>" + messages[random];
    }

    function getRandom(min, max)
    {
        return Math.floor(Math.random() * (max-min+1)+min);
    }
