var router = require('./common');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req,res,updateFlag) {
	//DBに接続。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);

    async.parallel([
    	function(callback){
    		if(updateFlag){
	    		var queryString = 'UPDATE INDIVISUAL_INFO SET BEHAVIOR_1 = ?,BEHAVIOR_2=?, BEHAVIOR_3=?,UPD_DATE = NOW(), UPD_USER = ?  WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?'; 
	    		var param = [req.session.indivisual.behavior[0],req.session.indivisual.behavior[1],req.session.indivisual.behavior[2],req.session.staff.name,
	    			req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];
	    
	    		dba.update(queryString, param, function(err,result){
	    			if(err){
	    				console.error(err);
	    	    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    				callback(err,null);
	    			}else{
	    				callback(null,result);
	    			}
	    		});
    		}else{
				callback(null,0);    			
    		}
    	}
	],
	function(err,results){
    	if(err){
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
    		dba.commit();
    		res.render(req.params.hotelId + '/checkin/checkin_4', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId
		    });
    	}
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkin4', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.behavior) {
		var arrayBehavior  = String(req.body.behavior).split(',');
		if(arrayBehavior.length > 3){
			req.flash('error',util.getErrorMessage('SelectCountError',[util.getViewName('checkin3','behavior'),3]));
			errflag = true;
		}else{
			req.session.indivisual.behavior = arrayBehavior;
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatorySelectError',[util.getViewName('checkin3','behavior')]));
		errflag = true;
	}
	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/checkin4', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;