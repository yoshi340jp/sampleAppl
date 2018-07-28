/**
 * http://usejsdoc.org/
 */
	
	var mysql = require('mysql');
	
	var client;
		
	exports.connect = function(){
		client = mysql.createConnection({
	    	host: process.env.RDS_HOSTNAME,
	    	port: process.env.RDS_PORT,
	    	database: process.env.RDS_DB_NAME,
	    	user: process.env.RDS_USERNAME,
	    	password: process.env.RDS_PASSWORD
	    });
	
		client.connect(function(err) {
			if(err) {
				return console.error('could not connect to MySQL', err);
			}
			console.log("DB Connected!!");
		});
	};

	exports.beginTransaction = function(){
		client.beginTransaction(function(err){
			if(err) {
				return console.error('could not start transaction', err);
			}
			console.log("Start Transaction");			
		});
	};

	exports.commit = function(){
        client.commit(function(err, result) {
            console.log("Commit Transaction");
         });
	};
	
	exports.rollback = function(){
		client.rollback(function(err, result) {
			if(err) {
				console.error("ROLLBACK Failed");
			}
			console.log("ROLLBACK successful!");
		});		
	};
	
	exports.disconnect = function(){
		client.end();
		console.log("Disconnect");
	};
	
	exports.selectPK = function(queryString,param,callback){
		var sql = mysql.format(queryString, param);
		client.query(queryString, param,function(err, result) {
			if(err) {
				console.error(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,JSON.stringify(result[0]));
			}
		});
	};
	
	exports.selectLists = function(queryString,param,callback){
		var sql = mysql.format(queryString, param);
		client.query(queryString, param,function(err, result) {
			if(err) {
				console.error(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,JSON.stringify(result));
			}
		});
	};
	
	exports.insert = function(queryString, param, callback){
		var sql = mysql.format(queryString, param);
		client.query(queryString, param, function(err, result){
			if(err) {
				console.error(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,result.affectedRows);
			}
		});
	};

	exports.update = function(queryString, param,callback){
		var sql = mysql.format(queryString, param);
		client.query(queryString, param, function(err, result){
			if(err) {
				console.error(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,result.changedRows);
			}
		});
	};

	exports.delete = function(queryString, param, callback){
		client.query(queryString, param,function(err, result){
			if(err) {
				console.error(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,result.affectedRows);
			}
		});
	};
