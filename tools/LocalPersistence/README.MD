# Alexa local persistence adapter (for Node.js)

The local persistence adapter is a convenient and simple persistence adapter to use when you're developing and debugging on your local computer instead of developing remotely with a Lambda function via AWS Lambda or Alexa Hosted Skills.

## What & Why

### What is a Persistence Adapter?

Persistence adapters are a tool enabled by the Alexa SDK to simplify storing values between sessions. For example, in the [Cake Time tutorial](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/get-deeper/tutorials-code-samples/build-an-engaging-alexa-skill), you're taught how to use the S3 persistence adapter to save the customer's birthday between visits.

### Why/when do I need a "local" persistence adapter?

This is expressly intended for use when you are coding and debugging locally (i.e. on your own computer, using something like the [Alexa Toolkit for Visual Studio Code](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-ask-skills.html). 

While the S3 and Dynamo DB persistence adapters are relatively easy to use when you're running your skill handler code on AWS Lambda (via AWS or Alexa Hosted Skills), they rely on built-in configuration information that AWS Lambda has, but your local development environment usuallt does not. 

The local adapter is simple. It uses the built-in file system module in Node.js to save your persistent data as a text file, the same way the S3 adapter does, only it does it locally. There's no extra AWS configuration and the persistent data files are easily editable with a text editor in case you need to quickly change a persistent variable value for a test.

## Set-up Instructions

### Step 1: Dependencies

Install the [`js-sha512`](https://www.npmjs.com/package/js-sha512) package into your Node project in your local development environment. As you'll only need it in this environment, you can decide if you want to add it to your `package.json`. It's used to shorten the user ID you receive to make it less likely (though not impossible) you'll go over your file system's maximum path length.

### Step 2: Add the adapter to your project folder

Copy the `local_persist.class.js` file to your main project folder (the same one where your `index.js` is).

### Step 3: Create your persistent storage folder

If you don't specify a path in your code, the adapter will save all data files to a folder named `persistence` in your main project folder. **But you have to create the folder you'll use or the files won't be written.** 

It is advisable to add this folder to your .gitignore file so it and the files saved in it aren't added to your git repository.

### Step 4: Integrate the adapter

Persistence adapters all have to meet the same interface, so the AttributesManager functions in your skill handler code are the same whether you're using this, the S3 adapter, or any other. **BUT** you don't want to accidentally push to production using a local adapter. 

The best practice is to use an environment variable, but there are many ways to set environment variables, both temporarily and permanently in your operating system, in your AWS Lambda configuration, or using the [`dotenv`](https://www.npmjs.com/package/dotenv) package for Node.  How you set the variable and what you name it is up to you, but for this example, we'll call the variable `SKILL_STAGE` and we'll have two sample values: `prod` and `dev`, which you would set for each machine depending on if it was a production server or a development environment.

The sample below assumes you'll use the S3 persistence adapter as a default and this one if you're explicitly running in development.

At the top of the `index.js`, where you're requiring modules.

```javascript
if (process.env.SKILL_STAGE === "dev") {
  const persistence = require('./local_persist.class.js');
  var persistence_adapter = new persistence.localPersistenceAdapter({"path": "./pvals"})
} else {
  const persistence = require('ask-sdk-s3-persistence-adapter');
  var persistence_adapter = new persistence.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
}
```

The constructor for `localPersistenceAdapter()` takes an optional argument of a configuration object with a `path` value that is appended to the path for the main code folder. If one is not provided, `./persistence` will be used as the default. Relative paths like `../../persistence` have also been known to work. If you're using the Dynamo DB adapter or another persistence adapter in production, you'll want to adjust the code.

*Remember, you must create the directory, whether you specify it or allow the default.*  

Then, later in `index.js`, where you're constructing the SkillBuilder:

```javascript
Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(getPersistenceAdapter(ddbTableName))
  [...]
```

When you save (a) persistent value(s) for the first time, the local persistence adapter will hash the user ID to a more easily managed (especially for Windows) `[64-character-hash].json` file name. 

## More information and related links

[ASK SDK: Managing Attributes](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-nodejs/manage-attributes.html)

