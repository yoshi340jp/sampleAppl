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
				return console.error('could not connect to postgres', err);
			}
			console.log("Connected!!");
		});
	};
			
	exports.disconnect = function(){
		client.end();
		console.log("Disconnect");
	};
	
	exports.selectPK = function(queryString,param,callback){
		var sql = mysql.format(queryString, param);
		console.log(sql);
		client.query(queryString, param,function(err, result) {
			if(err) {
				console.error('error running query', err);
				callback(err,null);
			}else{
				callback(null,JSON.stringify(result[0]));
			}
		});
	};
	
	exports.selectLists = function(queryString,param,callback){
		var sql = mysql.format(queryString, param);
		console.log(sql);
		client.query(queryString, param,function(err, result) {
			if(err) {
				callback(err,null);
			}else{
				callback(null,JSON.stringify(result));
			}
		});
	};
	
	exports.insert = function(queryString, param, callback){
		var sql = mysql.format(queryString, param);
		console.log(sql);
		client.query(queryString, param, function(err, result){
			if(err) {
				console.log(err);
				callback(err,null);
			}else{
				console.log(result);
				callback(null,result.affectedRows);
			}
		});
	};

	exports.update = function(queryString, param,callback){
		var sql = mysql.format(queryString, param);
		console.log(sql);
		client.query(queryString, param, function(err, result){
			if(err) {
				console.log(err);
				callback(err,null);
			}else{
				console.log('changed ' + result.changedRows + ' rows');
				callback(null,result.changedRows);
			}
		});
	};

	exports.delete = function(queryString, param, callback){
		client.query(queryString, param,function(err, result){
			if(err) {
				console.log(err);
				callback(err,null);
			}else{
				console.log('deleted ' + result.affectedRows + ' rows');
				callback(null,result.affectedRows);
			}
		});
	};

//module.exports = client;