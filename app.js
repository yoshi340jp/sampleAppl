'use strict';

// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    //var cpuCount = require('os').cpus().length;
	var cpuCount = 1;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
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
      }else if(!req.session.locale){
    	req.session.locale = i18n.getLocale(req);
      }else{
    	i18n.setLocale(req, req.session.locale);
      }
      next();
    });

    // routingの設定
    var router_userManage = require('./routes/userManage/');
    var router_root = require('./routes/');
    var router_checkin = require('./routes/checkin/');    
    var router_checkout = require('./routes/checkout/');    
    var router_lookup = require('./routes/guest-lookup/');    
    var router_api = require('./routes/v1/');

    app.use('/option/', router_userManage);
    app.use('/:hotelId/', router_root);
    app.use('/:hotelId/checkin/', router_checkin);
    app.use('/:hotelId/checkout/', router_checkout);
    app.use('/:hotelId/guest-lookup/', router_lookup);
    app.use('/api/:hotelId/', router_api);

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
