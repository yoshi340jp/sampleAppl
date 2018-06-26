// Include the cluster module
var cluster = require('cluster');

// 認可処理。指定されたロールを持っているかどうか判定します。
var authorize = function () {
    return function (req, res, next) {
        if (req.user !== null) {
            console.log("userNAME:" + req.user.username);
            return next();
        }
        console.log("userNG2:" + req.user);
        res.redirect("/login");
    };
};

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

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
    var bodyParser = require('body-parser');
    var passport = require('passport');

    AWS.config.region = process.env.REGION;

    var sns = new AWS.SNS();
    var ddb = new AWS.DynamoDB();

    var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();

    // passportモジュールをLoad
    require('./config/passport')(app);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(express.static('static'));

    console.log("path:" + __dirname + "/views");

    // session用のmiddlewaresを有効化
    app.use(session({
        secret: 'secret secret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    var router = require('./routes/v1/');
    app.use('/api/v1/', router);
    
    app.post('/auth/cognito',
        passport.authenticate('cognito', {
            successRedirect: '/mypage2',
            failureRedirect: '/login2'
    }));

    app.get('/login', function(req, res){
        res.render('login', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/login2', function(req, res){
        res.render('login2', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/mypage', authorize(), function(req, res){
        res.render('mypage', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/mypage2', authorize(), function(req, res){
        res.render('mypage2', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/signup2', function(req, res){
        res.render('signup2', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/', function(req, res) {
        res.render('index', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/login/index', function(req, res) {
        res.render('index', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.post('/signup', function(req, res) {
        var item = {
            'userId': {'S': req.body.email},
            'name': {'S': req.body.name},
            'preview': {'S': req.body.previewAccess},
            'theme': {'S': req.body.theme}
        };

        ddb.putItem({
            'TableName': ddbTable,
            'Item': item,
            'Expected': { email: { Exists: false } }        
        }, function(err, data) {
            if (err) {
                var returnStatus = 500;

                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }

                res.status(returnStatus).end();
                console.log('DDB Error: ' + err);
            } else {
                sns.publish({
                    'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email 
                                        + "\r\nPreviewAccess: " + req.body.previewAccess 
                                        + "\r\nTheme: " + req.body.theme,
                    'Subject': 'New user sign up!!!',
                    'TopicArn': snsTopic
                }, function(err, data) {
                    if (err) {
                        res.status(500).end();
                        console.log('SNS Error: ' + err);
                    } else {
                        res.status(201).end();
                    }
                });            
            }
        });
    });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
