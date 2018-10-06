var express = require('express');
// Routing
var router = express.Router({mergeParams:true});

//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

router.get('/', auth.authorize(), function(req, res){
    res.render('index', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});	
    
// Prepare for using module as router
module.exports = router;