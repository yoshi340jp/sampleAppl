var CognitoStrategy = require('passport-cognito');

module.exports = new CognitoStrategy({
    userPoolId: process.env.COGNITO_USER_POOLID,
    clientId: process.env.COGNITO_CLIENTID,
    region: process.env.COGNITO_REGIONID
  },
  function(accessToken, idToken, refreshToken, user, err, cb) {
    process.nextTick(function() {
//        user.expiration = session.getIdToken().getExpiration();
    	user.token = accessToken;
        cb(null, user);
    });
  }
);
