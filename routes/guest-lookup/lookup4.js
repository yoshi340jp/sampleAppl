var router = require('./common');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, flag) {
	//該当データが存在する場合は、そのデータを取得する。
	dba.connect();

    async.parallel([
    	function(callback){
    		var queryString = "INSERT INTO INDIVISUAL_ACTION (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,BEHAVIOR,ACTION_ID,CRE_DATE,CRE_USER)VALUES(?,?,?,?,?,?,now(),?)";
    		var param = [req.session.indivisual.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.indivisual.indivisualId,req.session.indivisual.selectKey,req.session.indivisual.actionId,req.session.indivisual.operator];

    		dba.insert(queryString, param, function(err,result){
	    		if(err){
	    			callback(err,null);
	    		}else{
	    			callback(null,result);
	    		}
	    	});
    	},
	],
	function(err, result){
    	if(err){
    		console.log(err);
    		req.flash('error',err.sqlMessage);
            res.redirect('back');
    	}else{
            res.redirect('back');
		}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/lookup4', auth.authorize(), function(req,res){
	console.log("action:" + req.body.action);
	req.session.indivisual.actionId = req.body.action;
	execute(req,res,true);
	});

//GET Request
router.get('/lookup4', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;