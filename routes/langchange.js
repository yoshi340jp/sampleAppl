var router = require('./common');

//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//言語変更用
router.post('/langchange', auth.authorize(), function(req, res, next){
	console.log("Language change");
    req.session.locale = req.body.language;
	req.session.indivisual.age = req.body.age;		  
	req.session.indivisual.country = req.body.country;		  
	req.session.indivisual.language = req.body.language; 
    res.redirect('back');
});

// Prepare for using module as router
module.exports = router;