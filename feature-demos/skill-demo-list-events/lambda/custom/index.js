const Alexa = require('ask-sdk');

const welcomeOutput = 'Welcome to ...';
const welcomeReprompt = 'What can I help you with?';
const helpOutput = 'You can demonstrate ... by ...  Try saying ...';
const helpReprompt = 'Try saying ...';

// Status of list, either active or completed
const STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// handlers

const SkillEnabledEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaSkillEvent.SkillEnabled';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    console.log(`skill was enabled for user: ${userId}`);
  },
}

const SkillDisabledEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaSkillEvent.SkillDisabled';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    console.log(`skill was disabled for user: ${userId}`);
  },
}

const SkillPermissionAcceptedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaSkillEvent.SkillPermissionAccepted';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    const acceptedPermissions = JSON.stringify(handlerInput.requestEnvelope.request.body.acceptedPermissions);
    console.log(`skill permissions were accepted for user ${userId}. New permissions: ${acceptedPermissions}`);
  },
}

const SkillPermissionChangedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaSkillEvent.SkillPermissionChanged';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    const acceptedPermissions = JSON.stringify(handlerInput.requestEnvelope.request.body.acceptedPermissions);
    console.log(`skill permissions were changed for user ${userId}. New permissions: ${acceptedPermissions}`);
  },
}

const SkillAccountLinkedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaSkillEvent.SkillAccountLinked';
  },
  handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.context.System.user.userId;
    console.log(`skill account was linked for user ${userId}`);
  },
}

const ItemsCreatedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ItemsCreated';
  },
  async handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    const listItemIds = handlerInput.requestEnvelope.request.body.listItemIds;
    const status = STATUS.ACTIVE;

    const list = await getListInfo(listId, status, accessToken);
    const listItem = await traverseListItems(listId, listItemIds, accessToken);
    const itemName = listItem.value;
    console.log(`${itemName} was added to list ${list.name}`);
  },
}

const ItemsDeletedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ItemsDeleted';
  },
  async handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    const listItemIds = handlerInput.requestEnvelope.request.body.listItemIds;
    const status = STATUS.ACTIVE;

    const list = await getListInfo(listId, status, accessToken);
    console.log(`${listItemIds} was deleted from list ${list.name}`);
  },
}

const ItemsUpdatedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ItemsUpdated';
  },
  async handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    const listItemIds = handlerInput.requestEnvelope.request.body.listItemIds;
    const status = STATUS.ACTIVE;

    const list = await getListInfo(listId, status, accessToken);
    const listItem = traverseListItems(listId, listItemIds, accessToken);
    const itemName = listItem.value;
    console.log(`${itemName} was updated on list ${list.name}`);
  },
}

const ListCreatedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ListCreated';
  },
  async handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    const status = STATUS.ACTIVE;

    const list = getListInfo(listId, status, accessToken);
    console.log(`list ${list.name} was created`);
  },
}

const ListUpdatedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ListUpdated';
  },
  async handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint;
    const status = STATUS.ACTIVE;

    const list = await getListInfo(listId, status, accessToken);
    console.log(`list ${list.name} was updated`);
  },
}

const ListDeletedEventHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'AlexaHouseholdListEvent.ListDeleted';
  },
  handle(handlerInput) {
    const listId = handlerInput.requestEnvelope.request.body.listId;
    const status = STATUS.ACTIVE;

    console.log(`list ${listId} was deleted`);
  },
}

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
 * Fetches list item information for each listItem in listItemIds. Executes the
 * callback function with the response back from api.amazonalexa.com
 * for each item in the list.
 *
 * @param {String} listId list id to check
 * @param {String[]} listItemIds list item ids in the request
 * @param {String} consentToken consent token from Alexa request
 * @param {(String) => void} callback func for each list item
 */
function traverseListItems(listId, listItemIds, accessToken) {
  const listClient = new Alexa.services.ListManagementService();
  listItemIds.forEach((itemId) => {
    const listRequest = listClient.getListItem(listId, itemId, accessToken);

    listRequest.then((response) => {
      return response;
    }).catch((err) => {
      console.error(err);
    });
  });
};

/**
 * Fetches list information for given list id. Executes the
 * callback function with the response back from api.amazonalexa.com.
 *
 * @param {String} listId list id to check
 * @param {String} status specify either “active” or “completed” items.
 * @param {String} consentToken consent token from Alexa request
 * @param {(String) => void} callback func for the list
 */
function getListInfo(listId, status, accessToken) {
  const listClient = new Alexa.services.ListManagementService();
  const listInfo = listClient.getList(listId, status, accessToken);

  listInfo.then((response) => {
    return response;
  }).catch((err) => {
    console.error(err);
  });
}

// exports

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    AmazonCancelStopHandler,
    AmazonHelpHandler,
    LaunchRequestHandler,
    SkillEnabledEventHandler,
    SkillDisabledEventHandler,
    SkillPermissionAcceptedEventHandler,
    SkillPermissionChangedEventHandler,
    SkillAccountLinkedEventHandler,
    ItemsCreatedEventHandler,
    ItemsDeletedEventHandler,
    ItemsUpdatedEventHandler,
    ListCreatedEventHandler,
    ListUpdatedEventHandler,
    ListDeletedEventHandler,
    SessionEndedHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
