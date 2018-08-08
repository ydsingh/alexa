 # CLI Lab
## Task 2
  **Once you have the CLI setup let's scaffold our first project**

1. Open up a command prompt. Navigate to a directory that you would like to work in.

2. Enter the command below. 

  ```
ask new
  ```

3. You'll be asked to provide a skill name. This can be anything you would like it to be, though the best practice is to name it something descriptive and sensible. For our case, lets just call it `hello-world`

4. You should receive a confirmation message "New Project for Alexa Skill Created".

5. Navigate into the directory you just created. Notice that the CLI has already created the base files for our Alexa Skill with the project name of "hello-world".

6. Next, enter the following command:

  ```
ask deploy
  ```

7. This command will deploy the lambda function and the interaction model for your Alexa Skill.

8. Log into your [AWS Console](https://aws.amazon.com/lambda/) to see the lambda function deployed to the cloud.

9. You can also log into the [skill developer portal](https://developer.amazon.com/alexa/console/ask) to see the interaction model with all of your skill metadata has been deployed.

10. Feel free to test your skill on any echo device registered to your account by saying "Alexa, start greeter". If you don't have a device handy, you can test from the testing pane in the [developer portal](https://developer.amazon.com/alexa/console/ask) or on [echosim.io](https://www.echosim.io).
