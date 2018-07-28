var router = require('./checkin4');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res,updateFlag) {
	//DBに接続。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);

    async.parallel([
    	function(callback){
    		var queryString = 'SELECT ID,BEHAVIOR_VAL FROM SPECIFIC_BEHAVIOR WHERE LANG = ? ORDER BY RAND()';
    		var param = [String(req.session.locale).toUpperCase()];
	    	dba.selectLists(queryString, param,function(err,result){
	    		if(err){
	    			console.error(err);
    	    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    			callback(err,null);
	    		}else{
					callback(null,result);
	    		}
			});
    	},
    	function(callback){
    		if(updateFlag){
	    		var queryString = 'UPDATE INDIVISUAL_INFO SET AGE = ?,COUNTRY=?, LANGUAGE=?, UPD_DATE = NOW(), UPD_USER = ? WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?'; 
	    		var param = [req.session.indivisual.age,req.session.indivisual.country,req.session.indivisual.language,req.session.staff.name,
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
    		res.render(req.params.hotelId + '/checkin/checkin_3', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
		        behaviorList: JSON.parse(results[0]),
		        error_msg: req.flash('error')
		    });
    	}
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkin3', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.age) {
		if(!isNaN(req.body.age)){
			 req.session.indivisual.age = req.body.age;
		}else{
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('checkin2','age')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('checkin2','age')]));
		errflag = true;
	}
	
	req.session.indivisual.country = req.body.country;		  
	req.session.indivisual.language = req.body.language; 
	req.session.locale = req.body.language;
	
	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});	

//GET Request
router.get('/checkin3', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;