const Alexa = require('ask-smapi-sdk');
const Token = require('./tokens.js');
const util = require('util');

// specify the refreshTokenConfig with clientId, clientSecrect and refreshToken generated in the previous step
const refreshTokenConfig = {
  "clientId": Token.client_Id,
  "clientSecret": Token.client_Secret, 
  "refreshToken": Token.refresh_token,
  "accessToken": Token.access_token
}

const smapiClient = new Alexa.StandardSmapiClientBuilder()
    .withRefreshTokenConfig(refreshTokenConfig)
    .client();


// To only retrieve response body
/* smapiClient.listSkillsForVendorV1(Token.ids.vendorId)
    .then((response) => {
        console.log(util.inspect(response, {"showHidden":false, "depth":4, "colors": true, "compact": false}));
    })
    .catch((err) => {
        console.log(err.message);
        console.log(util.inspect(err, {"showHidden":false, "depth":4, "colors": true, "compact": false}));;
    });
   */ 

  smapiClient.getSkillMetricsV1('amzn1.ask.skill.daf97eea-19e6-4016-842b-c0a1adee6834','2020-02-01T00:00:00Z','2020-02-07T23:59:59Z','P1D','uniqueCustomers','live','custom')
    .then((response) => {
      console.log(util.inspect(response, {"showHidden":false, "depth":4, "colors": true, "compact": false}));
  })
  .catch((err) => {
      console.log(err.message);
      console.log(util.inspect(err, {"showHidden":false, "depth":4, "colors": true, "compact": false}));;
  });