# CLI Lab
## Task 3
  **Let's customize this basic skill and get some practice using the CLI to deploy our changes. We'll first begin by making changes to and deploying our lambda code.**

13. Open the file `lambda/custom/index.js` in your preferred Code Editor, alternatively feel free to use a standard text editor like notepad.

14. Scroll down to `line 11` and change the `speechText` string to say whatever you would like Alexa to say when a user opens this skill. Save the file.

15. Since we made a change to our Lambda function, let's update it. Go back to your command prompt, make sure you are in the root folder of your directory and type the following command:

  ```
  ask deploy -t lambda
  ```
  You should see a confirmation message in your terminal "Lambda deployment finished."

  Congratulations! Test the changes by launching the skill on your device, from the testing pane in the [developer portal](https://developer.amazon.com/alexa/console/ask) or on [echosim.io](https://www.echosim.io).
