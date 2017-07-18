
# Labs: <a id="title">Breakfast Sandwich</a>

## How can I build a Recipe Skill for Alexa? <a id="intro"></a>

Breakfast Sandwich is a skill that will guide the user through the process to prepare and cook a meal.
The skill can give the user a list of recipe ingredients, and then guide them through all the recipe steps.
You can install the skill, and then update the text within the Lambda Javascript code to define your own Recipe and Ingredients.

### Installing the skill

The instructor will walk you through the high level steps (check the full [Fact Skill Tutorial](https://github.com/alexa/skill-sample-nodejs-fact) for reference):

* Create a new AWS Lambda function:
  1. Choose the **Fact** blueprint template.
  1. Setup "Alexa Skills Kit" as the function trigger.
  1. Name the function ```BreakfastSandwich```
  1. Replace the existing code by pasting in the code from [src/index.js](src/index.js).
  1. Choose your default role ```lambda_basic_execution```
  1. Click "Create Function"

* Create a new skill
  1. Call the skill "Breakfast Sandwich" with invocation name ```breakfast sandwich```
  1. Launch "Skill Builder Beta"
  1. Click the Code Editor tab (just below the turqoise Dashboard tab on the top left)
  1. Copy and paste the ```speechAssets/InteractionModel.json``` contents into the Skill Builder Beta.
  1. Click Save, then Build
  1. Advance to the Configuration page, choose AWS Lambda ARN, and paste in the ARN from the function you created.


### Test

Practice speaking to the skill a few times to learn all the features of the skill.
When you ask for "ingredients", you will both hear a list of ingredients, and see the list on your Alexa app or Echo Show screen, if you have one.
When you ask to "begin cooking", the skill will guide you through each step in the process.  You can say Pause or Stop and then return to the skill and resume where you left off.


1. Be sure you have installed Node.JS on your laptop.
1. With the alexa-cookbook previously downloaded to a folder your laptop, open a command prompt and navigate to the cookbook folder (labs/Recipe/src).  Type in ```npm install```
1. Next, navigate back up to the (labs/BreakfastSandwich) folder.  Type in ```node testflow```
You should see a sequence of skill events be tested and the corresponding output.
This will look best with a black-background command prompt.

## Labs
### Lab 1: Customize this skill for your own Recipe

Open your Lambda function and click on the Code tab.  Review the first section of the code that is customized for the Breakfast Sandwich meal.
There are static data blocks called ```languageStrings```, and a ```data {}``` object containing details and lists.
Carefully modify these green strings within the quotes to define the title, ingredients, and recipe steps.
Be sure to maintain quotes around all strings.  Single or double quotes around strings are both valid (```"``` or ```'```). Ensure all objects ```{key:value}``` and lists ```[item1, item2]``` are properly nested and terminated, as in the starting code sample.

Click **Save** to save the changes to your Lambda function.
[Test](https://github.com/alexa/alexa-cookbook/tree/master/testing) your function.
If it works well, please [publish your skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/publishing-an-alexa-skill)  for the world to enjoy.

### Lab 2: Allow the user to Pause and Resume
We can configure a DynamoDB database table to remember which step the user was on when they pause the skill.
Then, the skill can resume with the next step when the user returns to the skill.

#### Configure Permissions for DynamoDB
Steps:
1. Open a browser to the [AWS Console](https://aws.amazon.com/console)
1. Find the **IAM** service, click Roles, and click on the name of your standard Lambda role, such as ```lambda_basic_execution```.
1. Click the blue button to "Attach Policy"
1. There are over 200 possible policies.  Search for "dyn" and then locate the policy named ```DynamoDBFullAccess``` and click the checkbox.
1. Click "Attach Policy"

#### Enable the table within your Lambda code
Steps:
1. Review your Lambda function code within the AWS Lambda console.
1. Locate the line ```// alexa.dynamoDBTableName = 'RecipeSkillTable'; ``` which is at around line 40.
1. Uncomment out this line by removing the first two ```//``` characters.
1. Scroll up and click the blue "Save" button.
1. Test your skill.  Open the skill, say "begin cooking", and then say "stop".  You may encounter errors the first couple of times the skill runs.  This is okay.  The skill code is setting up a new table in DynamoDB which may take 60 seconds to complete.


Test your skill again.  Now, when you say "Stop" or "Pause" during the recipe steps, you can re-launch the skill and be prompted to continue where you left off.



### Practice and Demo
Practice all the features of your skill.  You can use [EchoSim.IO](https://echosim.io), the Amazon shopping app on your phone, or an Echo device.

Be ready to demo the skill to your fellow event attendees, friends, and family.  Ask them to try the skill and observe how they say their requests.

<hr />

Back to the [github.com/alexa/alexa-cookbook](https://github.com/alexa/alexa-cookbook) home page.

