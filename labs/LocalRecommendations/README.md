
# Labs: <a id="title">Local Recommendations</a>

## What can I do in {town}? <a id="intro"></a>

Local Recommendations is a skill that gives you suggestions on where to visit and dine in your local city or town.
You can install the skill, and then update the Javascript code to make the skill an expert on what to do in your favorite location.

### Installation
Install this skill to learn more about a particular city: Gloucester, Massachusetts.
The instructor will walk you through the high level steps:
1. Copy and paste the ```speechAssets/InteractionModel.json``` contents into a new skill in Skill Builder Beta.
1. Copy the ```src/index.js``` code into a new AWS Lambda function that is based on the **Fact** blueprint.

Practice speaking to the skill a few times to learn all the features of the skill.
When you ask for a meal such as "breakfast", the skill will scan the list of restaurants serving breakfast and choose one at random.  When you say "go outside" you should hear the current weather conditions.


### Test
1. Be sure you have installed Node.JS on your laptop.
1. With the alexa-cookbook previously downloaded to a folder your laptop, open a command prompt and navigate to the cookbook folder (labs/LocalRecommendations/src).  Type in ```npm install```
1. Next, navigate back up to the (labs/LocalRecommendations) folder.  Type in ```node testflow```
You should see a sequence of skill events be tested and the corresponding output.
This will look best with a black-background command prompt.  Read more about [TestFlow](../../testing/TestFlow).

## Labs

### Lab 1: Customize this skill for your city or town
Think of your hometown, current city, or favorite city.  Jot down a list of your favorite restaurants and attractions.

Open your Lambda function and click on the Code tab.  Review the first section of the code that is customized for Gloucester.
There are static data blocks called ```languageStrings```, and a ```data {}``` object containing details and lists.
Carefully modify these green strings within the quotes to define the city, state, zip, restaurants, and attractions custom to your particular town.
Be sure to maintain quotes around all strings.  Single or double quotes around strings are both valid (```"``` or ```'```). Ensure all objects ```{key:value}``` and lists ```[item1, item2]``` are properly nested and terminated, as in the starting code sample.

Click **Save** to save the changes to your Lambda function.
[Test](https://github.com/alexa/alexa-cookbook/tree/master/testing) your function.
If it works well, please [publish your skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/publishing-an-alexa-skill)  for the world to enjoy.


### Lab 2: Add a new Intent with Slot
Review the Intent called AttractionIntent.  It has a slot called "distance" which is defined as type ```AMAZON.NUMBER```

The sample utterance looks like this:

```AttractionIntent recommend an attraction within {distance} miles```

Within the Lambda code, we access the value of this slot via the following code:

```
        var distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }
```
We have code that validates the distance and substitutes a default distance in case the user says something that matches the Intent but they fail to say the slot value.


Add a new Intent and Slot of your own!  Just think of a new question a user might ask.  Give the question an Intent name.
Within the question, identify a slot that behaves like a variable, wildcard, or parameter.
You can plan to use slot types such as ```AMAZON.US_STATE```, ```AMAZON.US_FIRST_NAME```, ```AMAZON.MusicGroup```, etc.
See the [full list](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference).

You can also create your own slot type within the Interaction Model page.
For example, you could create a slot type called LIST_OF_BIRDS with values "cardinal", "blue jay", "robin", etc.
Once this list has been created, you could define a new slot called "bird" that is type LIST_OF_BIRDS.

**Within your Lambda code, copy the format of the ```AttractionIntent``` function definition to create a new handler with the same name as your new Intent.**

**Customize the logic in your handler to retrieve the slot value, and add logic to say a response back to the user.**


### Lab 3: Extend the skill logic with smart recommendations
When the user says "go outside", the ```GoOutIntent``` intent is called and the code in the GoOutIntent handler block is executed.
This makes an API call over the Internet to the Yahoo Weather service, which returns the weather and current time in your city.

You can enhance the ```GoOutIntent``` handler code (around line 185) to make a relevant activity suggestion to the user.
For example, add logic to decide, based on current time and weather conditions, whether to:

 * Go out to a local beach or park
 * Recommend a movie theatre or mall
 * Attend a scheduled public event happening soon
 * Staying home to watch a movie on Amazon Prime
 * etc..


### Lab 4: Extend the skill with other web service calls
The ```getWeather()``` function makes a call to the Yahoo Weather API.

The details of this web service call are maintained in the myAPI object:

```
var myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};
```

<a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29"/> </a>

 Note:
 * This weather API allows 2000 calls per day for non-commercial use.
 * The ```${data.city}``` and ```${data.state}``` values are dyamically inserted into the myAPI.path string.  This entire string begins and ends with tick marks ` and not normal quotes such as " or '.  Strings with tick marks can use variable substitution shown here.

**Exercise:**
Find another web service call that would add value to your skill.  It might be an API that provides restaurant hours, a taxi service fare estimator, or an API that is published by a local business or university.

Implement a call to this API as a function in your skill.  Add the function to the logic in an Intent handler so that the API can help prepare a dynamic response for the user.

For a tutorial on calling APIs from Lambda, see the README guides at [external-calls/httpsGet](../../external-calls/httpsGet) and [external-calls/httpsPost](../../external-calls/httpsPost).



### Practice and Demo
Practice all the features of your skill.  You can use [EchoSim.IO](https://echosim.io), the Amazon shopping app on your phone, or an Echo device.

Be ready to demo the skill to your fellow event attendees, friends, and family.  Ask them to try the skill and observe how they say their requests.

<hr />

Back to the [github.com/alexa/alexa-cookbook](https://github.com/alexa/alexa-cookbook) home page.

