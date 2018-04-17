# Enabling Skill ID Verification in AWS Lambda


**Summary**

It is highly recommended that you limit invocation permissions to just Alexa and enable skill ID verification to protect your function from malicious callers.

**Instructions**

1. To secure a Lambda function, so that it can only be invoked by your skill, follow these steps.
2. Open up the [developer portal](https://developer.amazon.com/edw/home.html#/skills) and select your skill from the list. You may have this open from another browsertab, if you started from the beginning of one of our sample skill tutorials.
3. Click the Skill Information Link.
4. Copy the **Application ID** provided in the main window. This is also known as a skill ID, and is unique to your skill.
5. Return to your Lambda function in the AWS Console. If you're following a sample skill tutorial, you may already have this browser tab open. Otherwise, open the Lambda console by clicking here: [AWS Console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions) and selecting the appropriate function. 
6. Scroll down to **Configure triggers**, paste the Skill ID in the Skill ID edit box.
7. Click the **Add** button. 
8. Then click the **Save** button in the top right. You should see a green success message at the top of your screen. Now, click the box that has the Lambda icon followed by the name of your function and scroll down to the field called "Function code".

**Further Reading**

For more information visit the [Configuring Alexa Skills Kit Triggers](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#configuring-the-alexa-skills-kit-trigger) section of our Official Alexa Skills Kit Documentation.




