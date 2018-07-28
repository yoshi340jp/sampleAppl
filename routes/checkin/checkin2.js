var router = require('./checkin3');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, insertFlag) {
	//DBに接続。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);
	
	async.parallel([
    	function(callback){
    		var queryString;
    		var language;
    		if(req.session.locale === 'en'){
    			language = 'ENNAME';
    		}else if(req.session.locale === 'ja'){
    			language = 'JPNAME';
    		}
    		queryString = 'SELECT SHORTNAME, ' + language + ' AS NAME FROM COUNTRY ORDER BY NAME';
	    	dba.selectLists(queryString, null,function(err,result){
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
    		var queryString;
    		var language;
    		if(req.session.locale === 'en'){
    			language = 'ENNAME';
    		}else if(req.session.locale === 'ja'){
    			language = 'JPNAME';
    		}
    		queryString = 'SELECT A.COUNTRY AS SHORTNAME, B.' + language + ' AS NAME, count(*) AS COUNT FROM INDIVISUAL_INFO A INNER JOIN COUNTRY B WHERE COUNTRY IS NOT NULL AND A.COUNTRY = B.SHORTNAME GROUP BY COUNTRY ORDER BY COUNT DESC LIMIT 0, 5';
    		dba.selectLists(queryString, null,function(err,result){
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
    		if(insertFlag){
	    		var queryString = 'INSERT INTO INDIVISUAL_INFO (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,GENDER,CRE_DATE,CRE_USER)VALUES(';
	    		queryString +=	'?,?,?,?,?,now(),?)';
	    		var param = [req.session.staff.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.staff.indivisualId,req.session.indivisual.gender,req.session.staff.name];
	    
	    		dba.insert(queryString, param, function(err,result){
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
			res.render(req.params.hotelId + '/checkin/checkin_2', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
		        top5countries: JSON.parse(results[1]),
		        countryList: JSON.parse(results[0]),
		        age: req.session.indivisual.age,
		        country: req.session.indivisual.country,
		        language: req.session.indivisual.language,
		        error_msg: req.flash('error')
		    });
    	}
		dba.disconnect();
    });    

}

//POST Request
router.post('/checkin2', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	req.session.indivisual.checkinDate = util.getNowYMD();
	if(req.body.gender) {
		 req.session.indivisual.gender = req.body.gender;
	}else{
		req.flash('error',util.getErrorMessage('MandatorySelectError',[util.getViewName('checkin1','gender')]));
		errflag = true;
	}
	
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('checkin1','roomNo')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('checkin1','roomNo')]));
		errflag = true;		  	  
	}
	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/checkin2', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;