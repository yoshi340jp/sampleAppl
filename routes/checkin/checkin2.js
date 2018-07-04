var router = require('./checkin3');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function getNowYMD(){
	  var dt = new Date();
	  var y = dt.getFullYear();
	  var m = ("00" + (dt.getMonth()+1)).slice(-2);
	  var d = ("00" + dt.getDate()).slice(-2);
	  var result = y +  m + d;
	  return result;
	}

function execute(req, res, insertFlag) {
	dba.connect();

    async.parallel([
    	function(callback){
    		var queryString = 'SELECT SHORTNAME, ENNAME FROM COUNTRY';
	    	dba.selectLists(queryString, null,function(err,result){
	    		if(err){
	    			callback(err,null);
	    		}else{
		    		console.log("res" + result);
					callback(null,result);
	    		}
			});
    	},
    	function(callback){
    		if(insertFlag){
	    		var queryString = "INSERT INTO INDIVISUAL_INFO (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,GENDER,CRE_DATE,CRE_USER)VALUES(";
	    		queryString +=	"?,?,?,?,?,now(),?)";
	    		var param = [req.session.indivisual.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.indivisual.indivisualId,req.session.indivisual.gender,req.session.indivisual.operator];
	    
	    		dba.insert(queryString, param, function(err,result){
	    			if(err){
	    				console.log(err);
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
    		console.log(err);
    		req.flash('error',err.sqlMessage);
            res.redirect('back');
    	}else{
	    	console.log("render"+ results);
			res.render(req.params.hotelId + '/checkin/checkin_2', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
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
	var errflag = false;
	req.session.indivisual.checkinDate = getNowYMD();
	if(req.body.gender) {
		 req.session.indivisual.gender = req.body.gender;
		 console.log(req.body.gender);
	}else{
		req.flash('error','性別を選択してください');
		errflag = true;
	}
	
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error','ルームNoは数字で入力してください。¥n');
			errflag = true;		  
		}
	}else{
		req.flash('error','ルームNoを入力してください。¥n');
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