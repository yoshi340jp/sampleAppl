var router = require('./common');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, flag) {
	//該当データが存在する場合は、そのデータを取得する。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);

    async.parallel([
    	function(callback){
    		var queryString = 'INSERT INTO INDIVISUAL_ACTION (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,BEHAVIOR_1,BEHAVIOR_2,BEHAVIOR_3,ACTION_ID,ACTION_NAME,POSITION_NUM,CRE_DATE,CRE_USER)VALUES(?,?,?,?,?,?,?,?,?,?,now(),?)';
    		var param = [req.session.staff.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.staff.indivisualId,req.session.indivisual.behavior_1,req.session.indivisual.behavior_2,req.session.indivisual.behavior_3,req.session.indivisual.actionId,req.session.indivisual.actionName,req.session.indivisual.positionNum,req.session.staff.name];

    		dba.insert(queryString, param, function(err,result){
	    		if(err){
	    			console.error(err);
	        		req.flash('error',util.getErrorMessage('DBQueryError'));
	    			callback(err,null);
	    		}else{
	    			callback(null,result);
	    		}
	    	});
    	},
	],
	function(err, result){
    	if(err){
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
    		dba.commit();
            res.redirect('back');
		}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/lookup4', auth.authorize(), function(req,res){
	req.session.indivisual.actionId = req.body.action;
	req.session.indivisual.actionName = req.body.actionName;
	req.session.indivisual.positionNum = req.body.positionNum;
	req.session.indivisual.behavior_1 = req.body.behavior_1;
	req.session.indivisual.behavior_2 = req.body.behavior_2;
	req.session.indivisual.behavior_3 = req.body.behavior_3;
	
	execute(req,res,true);
});

//GET Request
router.get('/lookup4', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;