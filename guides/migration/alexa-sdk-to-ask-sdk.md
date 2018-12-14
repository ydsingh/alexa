# Converting Alexa Skills to Use Node.js v2 SDK
The purpose of this guide is to convert a skill from using the V1 SDK to the V2 SDK.  The V1 Skill Adapter will allow a skill to use the V2 SDK without any changes.  This guide will help you convert your skill to use the V2 SDK directly.  This will allow you to take full advantage of the new features and capabilities of the V2 SDK.  This guide cannot cover converting all the custom code you have in your skill, however it should get you 80-90% of the way there.  You will need to fully test your skill after the conversion.

This guide assumes you are not making any changes to your interaction model.  However, after conversion, you should consider adding the FallbackIntent, and any other standard intents you might not currently have as part of your skill.  When the interaction model updates are complete, you will need to resubmit your skill for certification.  If you decide not to update the interaction model, you should consider also submitting your skill for recertification ensure the highest customer experience.
## Overview of process
1.	Setup Prerequisites
2.	Clone skill
3.	Generate test requests
4.	Generate Boilerplate Code
5.	Map states into handlers
6.	Replace v1 functions with v2 Equivalents
7.	Unit test
8.	Test the skill
