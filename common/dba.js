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
	
	exports.selectPK = function(queryString,callback){
		console.log(queryString);
		client.query(queryString, function(err, result) {
			if(err) {
				console.error('error running query', err);
				callback(err,null);
			}else{
				callback(null,JSON.stringify(result[0]));
			}
		});
	};
	
	exports.selectLists = function(queryString,callback){
		client.query(queryString, function(err, result) {
			if(err) {
				callback(err,null);
			}else{
	//			console.log(result);
				callback(null,JSON.stringify(result));
	//			this.returnResult = JSON.stringify(result);
	//			console.log("ret2:"+ this.returnResult);
			}
		});
	};
//module.exports = client;