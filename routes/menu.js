var router = require('./loginauth');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

var AWS = require('aws-sdk');

//async モジュールのインポート
var async = require('async');

function execute(req, res){
	//セッションReset
	req.session.locale = null;
	req.session.indivisual = {name:req.user.username};

    async.parallel([
    	function(callback){
    		//Login Userの情報をsessionに格納
			if(typeof req.session.staff === 'undefined' || req.session.staff === null){		
				AWS.config.region = process.env.COGNITO_REGIONID;
				var poolData = {
				  UserPoolId : process.env.COGNITO_USER_POOLID,
				  ClientId : process.env.COGNITO_CLIENTID
				};
		
				var params = {
				  AccessToken: req.user.token /* required */
				};
		
				var provider = new AWS.CognitoIdentityServiceProvider();
				provider.getUser(params, function(err, data) {
				  if (err){ 
					  console.log(err, err.stack);
					  callback(err,null);
				  }// an error occurred
				  else{
					  req.session.staff = {name:req.user.username};
					  var userAttributes = data.UserAttributes;
					  for (var i in userAttributes) {
			            if(userAttributes[i].Name === 'custom:siteCode'){
			            	req.session.staff.siteCode = userAttributes[i].Value;
			            }
			            if(userAttributes[i].Name === 'custom:indivisualID'){
			            	req.session.staff.indivisualId = userAttributes[i].Value;	            	
			            }
			            if(userAttributes[i].Name === 'custom:language'){
			            	req.session.staff.language = userAttributes[i].Value;
			            }
			            if(userAttributes[i].Name === 'email'){
			            	req.session.staff.email = userAttributes[i].Value;
			            }
			            if(userAttributes[i].Name === 'custom:managementLevel'){
			            	req.session.staff.managementLevel = userAttributes[i].Value;
			            }
					  }
		  			  console.log("Staff:" + JSON.stringify(req.session.staff));
     				  callback(null,'1');
				  }
	
				});
			}else{
				callback(null,'2');
			}
		}
	],
	function(err,results){
		res.render(req.params.hotelId + '/menu', {
	        static_path: '',
	        theme: process.env.THEME || 'flatly',
	        flask_debug: process.env.FLASK_DEBUG || 'false',
	        hotel_id: req.params.hotelId
	    });
    });
}

//POST Request
router.post('/menu', auth.authorize(), function(req,res){execute(req,res);});

//GET Request
router.get('/menu', auth.authorize(), function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;