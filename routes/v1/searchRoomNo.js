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
    		var queryString = 'SELECT CHECK_IN_DATE FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND ROOM_NUM = ? AND INDIVISUAL_ID = ? ORDER BY CHECK_IN_DATE DESC LIMIT 0, 5';
    		var param = [req.session.staff.siteCode,req.session.indivisual.roomNo,req.session.staff.indivisualId];

    		dba.selectLists(queryString, param, function(err,result){
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
            res.send(JSON.parse(result));
		}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/searchRoomNo', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('lookup1','roomNo')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('lookup1','roomNo')]));
		errflag = true;		  	  
	}

	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/searchRoomNo', auth.authorize(), function(req,res){
		res.redirect('back');
});

// Prepare for using module as router
module.exports = router;