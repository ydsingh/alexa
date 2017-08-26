## Update Shadow <a id="title"></a>

1. [Setup Thing](./step-1.md#title) || 2. [Create The Skill](./step-2.md#title) || 3. [Create The Lambda Function](./step-3.md#title) || 4. [Connect Skill To Lambda & Add IOT Permissions](./step-4.md#title) || 5. [Webapp-Thing](./step-5.md#title)

This skill includes an Intent called ```CityIntent``` with a slot called ```city```, that is of type ```AMAZON.EUROPE_CITY```.

The user will say: ```go to London``` and the skill will update the IOT Device Shadow with the name of the city.

#### Instructions for deploying this sample skill

## 2. Create the Skill <a id="title"></a>
<hr />


1. Login to [developer.amazon.com](https://developer.amazon.com) and click Alexa, then Alexa Skills Kit.
1. Create a new Skill called **city browser** with invocation name ```city browser```.
1. Paste in the [IntentSchema.json](./update-shadow/speechAssets/IntentSchema.json) :

```
{
  "intents": [
    {
      "intent": "MyIntent",  "slots":[]
    },
    {
      "intent": "CityIntent",
      "slots":[
        {
          "name":"city",
          "type":"AMAZON.EUROPE_CITY"
      }
      ]
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}

```

1. Paste in the [SampleUtterances.txt](./update-shadow/speechAssets/SampleUtterances.txt) :

```
MyIntent hello
CityIntent go to {city}
CityIntent i am from {city}
```

Pause here and leave this browser tab open.

#### Continue to the next step

 * [Part 3 - Create the Lambda function](./step-3.md#title)


Back to the [Home Page](./README.md#title)
