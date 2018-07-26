var router = require('./langchange');

var passport = require('passport');

//認証用Request処理
router.post('/loginauth',function(req, res, next) {
	//セッション初期化
	req.session.locale = null;
	req.session.indivisual = null;
	req.session.staff = null;
    passport.authenticate('cognito', {
        successRedirect: '/' + req.params.hotelId + '/menu',
        failureRedirect: '/' + req.params.hotelId + '/login',
        failureFlash: true
    })(req, res, next);
});

// Prepare for using module as router
module.exports = router;