var CognitoStrategy = require('passport-cognito');
console.log('Hello2');
module.exports = new CognitoStrategy({
    userPoolId: 'us-west-2_GnuWf0Dnq',
    clientId: '5q40303u3543cs3nkeip39u5i1',
    region: 'us-west-2'
  },
  function(accessToken, idToken, refreshToken, user, cb) {
    process.nextTick(function() {
//        user.expiration = session.getIdToken().getExpiration();
        cb(null, user);
    });
  }
);
