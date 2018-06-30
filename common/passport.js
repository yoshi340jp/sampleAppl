module.exports = function(){
  var passport = require('passport');

  // sessionにユーザー(のキー)情報を格納する処理
  passport.serializeUser(function(user, done) {
    console.log("serialize");
    done(null, user);
  });

  // sessionからユーザー情報を復元する処理
  passport.deserializeUser(function(obj, done) {
    console.log("deserialize");
    done(null, obj);
  });

  // 利用するstrategyを設定
  passport.use(require('./cognito'));
};