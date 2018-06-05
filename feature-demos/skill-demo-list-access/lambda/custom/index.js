const Alexa = require('ask-sdk');
const https = require('https');

const listIsEmpty = '#list_is_empty#';

const welcomeOutput = 'Welcome. You can say, top todo';
const welcomeReprompt = 'You can say, top todo';
const helpOutput = 'You can say top todo or cancel top todo.';
const helpReprompt = 'Say top todo or cancel top todo.';

// handlers

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(welcomeOutput)
      .reprompt(welcomeReprompt)
      .getResponse();
  },
};

const TopToDoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'TopToDoIntent';
  },
  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let speechOutput;
    console.log('Starting top todo handler');
    const itemName = await getTopToDoItem(handlerInput);
    if (!itemName) {
      speechOutput = 'Alexa List permissions are missing. You can grant permissions within the Alexa app.';
      const permissions = ['read::alexa:household:list'];
      return responseBuilder
        .speak(speechOutput)
        .withAskForPermissionsConsentCard(permissions)
        .getResponse();
    } else if (itemName === listIsEmpty) {
      speechOutput = 'Your todo list is empty.';
    } else {
      speechOutput = `Your top todo is ${itemName}`;
    }
    return responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const CompleteTopToDoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'ClearTopToDoIntent';
  },
  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let speechOutput;
    console.info('Starting complete top todo handler');
    const status = await completeTopToDoAction(handlerInput);
    if (!status) {
      speechOutput = 'Alexa List permissions are missing. You can grant permissions within the Alexa app.';
      const permissions = ['write::alexa:household:list'];
      return responseBuilder
        .speak(speechOutput)
        .withAskForPermissionsConsentCard(permissions)
        .getResponse();
    } else if (status === listIsEmpty) {
      speechOutput = 'I could not delete your top todo. Your todo list is empty.';
    } else if (status === 200) {
      speechOutput = 'I successfully deleted your top todo.';
    } else {
      speechOutput = `I could not delete the todo. The developers are debugging response code ${status}`;
    }
    return responseBuilder
      .speak(helpOutput)
      .getResponse();
  },
};

const AmazonHelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    return responseBuilder
      .speak(helpOutput)
      .reprompt(helpReprompt)
      .getResponse();
  },
};

const AmazonCancelStopHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const speechOutput = 'Okay, talk to you later! ';

    return responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const request = handlerInput.requestEnvelope.request;

    console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
    console.log(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I had trouble doing what you asked.  Please ask for it again.')
      .reprompt('Sorry, I had trouble doing what you asked.  Please ask for it again.')
      .getResponse();
  },
};

// helpers

/**
 * List API to retrieve the List of Lists : Lists Metadata.
 */
function getListsMetadata(session) {
  if (!session.user.permissions) {
    console.log('permissions are not defined');
    return;
  }
  const consentToken = session.user.permissions.consentToken;
  console.log('Starting the get list metadata call.');
  // todo convert to serviceclient
  const options = {
    host: api_url,
    port: api_port,
    path: '/v2/householdlists/',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + consentToken,
      'Content-Type': 'application/json'
    }
  }

  var req = https.request(options, (res) => {
    console.log('STATUS: ', res.statusCode);
    console.log('HEADERS: ', JSON.stringify(res.headers));

    if (res.statusCode === 403) {
      console.log("permissions are not granted");
      callback(null);
      return;
    }

    var body = [];
    res.on('data', function (chunk) {
      body.push(chunk);
    }).on('end', function () {
      body = Buffer.concat(body).toString();
      callback(body);
    });

    res.on('error', (e) => {
      console.log(`Problem with request: ${e.message}`);
    });
  }).end();
}

/**
* List API to retrieve the customer to-do list.
*/
function getToDoList(session) {
  if (!session.user.permissions) {
    console.log('permissions are not defined');
    return;
  }
  const consentToken = session.user.permissions.consentToken;
  console.log('Starting get todo list call.');

  const returnValue = getListsMetadata(session);
  if (!returnValue) {
    console.log('permissions are not defined');
    return;
  }
  var obj = JSON.parse(returnValue);
  var todo_path = "";
  for (i = 0; i < obj.lists.length; i++) {
    if (obj.lists[i].name === 'Alexa to-do list') {
      for (j = 0; j < obj.lists[i].statusMap.length; j++) {
        if (obj.lists[i].statusMap[j].status === 'active') {
          todo_path = obj.lists[i].statusMap[j].href;
          break;
        }
      }
      break;
    }
  }

  const options = {
    host: api_url,
    port: api_port,
    path: todo_path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + consentToken,
      'Content-Type': 'application/json'
    }
  }

  const req = https.request(options, (res) => {
    console.log('STATUS: ', res.statusCode);
    console.log('HEADERS: ', JSON.stringify(res.headers));

    if (res.statusCode === 403) {
      console.log("permissions are not granted");
      return;
    }

    const body = [];
    res.on('data', function (chunk) {
      body.push(chunk);
    }).on('end', function () {
      body = Buffer.concat(body).toString();
      callback(JSON.parse(body));
    });

    res.on('error', (e) => {
      console.log(`Problem with request: ${e.message}`);
    });
  }).end();
}

/**
* Helper function to retrieve the top to-do item.
*/
function getTopToDoItem(session) {
  const returnValue = getToDoList(session);
  if (!returnValue) {
    return;
  }
  else if (!returnValue.items || returnValue.items.length === 0) {
    return (listIsEmpty);
  }
  else {
    return (returnValue.items[0].value);
  };
};

/**
* List API to delete the top todo item.
*/
function completeTopToDoAction(session) {
  returnValue = getToDoList(session);
  if (!returnValue) {
    return;
  }
  else if (!returnValue.items || returnValue.items.length === 0) {
    return (listIsEmpty);

  }

  if (!session.user.permissions) {
    console.log("permissions are not defined");
    return;
  }
  const consentToken = session.user.permissions.consentToken;

  var path = "/v2/householdlists/_listId_/items/_itemId_";
  path = path.replace("_listId_", returnValue.listId);
  path = path.replace("_itemId_", returnValue.items[0].id);

  var options = {
    host: api_url,
    port: api_port,
    path: path,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + consentToken,
      'Content-Type': 'application/json'
    }
  }

  var req = https.request(options, (res) => {
    console.log('STATUS: ', res.statusCode);
    console.log('HEADERS: ', JSON.stringify(res.headers));

    if (res.statusCode === 403) {
      console.log("permissions are not granted");
      return;
    }

    var body = [];
    res.on('data', function (chunk) {
      body.push(chunk);
    }).on('end', function () {
      body = Buffer.concat(body).toString();
      callback(res.statusCode);
    });

    res.on('error', (e) => {
      console.log(`Problem with request: ${e.message}`);
    });

  }).end();
};

function getSlotValues(filledSlots) {
  const slotValues = {};

  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;
    slotValues[name] = {};

    // Extract the nested key 'code' from the ER resolutions in the request
    let erStatusCode;
    try {
      erStatusCode = ((((filledSlots[item] || {}).resolutions ||
        {}).resolutionsPerAuthority[0] || {}).status || {}).code;
    } catch (e) {
      // console.log('erStatusCode e:' + e)
    }

    switch (erStatusCode) {
      case 'ER_SUCCESS_MATCH':
        slotValues[name].synonym = filledSlots[item].value;
        slotValues[name].resolved = filledSlots[item].resolutions
          .resolutionsPerAuthority[0].values[0].value.name;
        slotValues[name].isValidated = filledSlots[item].value ===
          filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name;
        slotValues[name].statusCode = erStatusCode;
        break;

      default: // ER_SUCCESS_NO_MATCH, undefined
        slotValues[name].synonym = filledSlots[item].value;
        slotValues[name].resolved = filledSlots[item].value;
        slotValues[name].isValidated = false;
        slotValues[name].statusCode = erStatusCode === undefined ? 'undefined' : erStatusCode;
        break;
    }
  }, this);

  return slotValues;
}

// exports

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    AmazonCancelStopHandler,
    AmazonHelpHandler,
    LaunchRequestHandler,
    CompleteTopToDoHandler,
    TopToDoHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
