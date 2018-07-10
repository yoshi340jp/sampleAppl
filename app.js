'use strict';
// TEST CODE_1
// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    //var cpuCount = require('os').cpus().length;
	var cpuCount = 1;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
    	console.log(cpuCount);
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    var AWS = require('aws-sdk');
    var express = require('express');
    var session = require('express-session');
    var flash = require('express-flash');
    var bodyParser = require('body-parser');
    var passport = require('passport');
    var i18n = require("i18n");
    require('dotenv').config();
    
    var app = express();

    // templateエンジンの設定(ejs)
    app.set('view engine', 'ejs');
    app.set('views', process.cwd() + '/views');
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.static('static'));

    // passportモジュールをLoad（認証用）
    require('./common/passport')(app);
    app.use(session({
        secret: 'secret secret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    //認証用モジュールのロード
	var auth = require(process.cwd() + '/common/auth');

    // i18nの利用設定（Multi Language対応）
    i18n.configure({
      // 利用するlocalesを設定。これが辞書ファイルとひも付きます
      locales: ['ja', 'en'],
      defaultLocale: 'ja',
      // 辞書ファイルのありかを指定
      directory: __dirname + "/locales",
      // オブジェクトを利用したい場合はtrue
      objectNotation: true
    });
    app.use(i18n.init);

    // 言語切り替え用
    app.use(function (req, res, next) {
      if (req.body.language) {
        i18n.setLocale(req, req.body.language);
        req.session.locale = req.body.language;
        console.log("session" +  i18n.getLocale(req));
      }else if(!req.session.locale){
    	req.session.locale = i18n.getLocale(req);
        console.log("session2" +  i18n.getLocale(req));
      }else{
    	i18n.setLocale(req, req.session.locale);
    	console.log("session3" +  i18n.getLocale(req) + ":" + req.session.locale);    	  
      }
      next();
    });

    // routingの設定
    var router_root = require('./routes/');
    var router_checkin = require('./routes/checkin/');    
    var router_checkout = require('./routes/checkout/');    
    var router_api = require('./routes/v1/');

    app.use('/:hotelId/', router_root);
    app.use('/:hotelId/checkin/', router_checkin);
    app.use('/:hotelId/checkout/', router_checkout);
    app.use('/api/:hotelId/', router_api);

    //認証用Request処理
    app.post('/:hotelId/loginauth',function(req, res, next) {
        passport.authenticate('cognito', {
            successRedirect: '/' + req.params.hotelId + '/menu',
            failureRedirect: '/' + req.params.hotelId + '/login',
            failureFlash: true
        })(req, res, next);
    });

    //言語変更用
    app.post('/:hotelId/langchange', auth.authorize(), function(req, res, next){
    	console.log("Language change");
        req.session.locale = req.body.language;
    	req.session.indivisual.age = req.body.age;		  
    	req.session.indivisual.country = req.body.country;		  
    	req.session.indivisual.language = req.body.language; 
        console.log(req.body.language);
        console.log("session4" +  i18n.getLocale(req));
        res.redirect('back');
    });
    
    //Dummy
    app.get('/option/signup', function(req, res){
        res.render('signup', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
