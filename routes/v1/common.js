var express = require('express');
// Routing
var router = express.Router({mergeParams:true});

router.get('/',function(req, res){
    var mysql = require('mysql');
    
    var connection = mysql.createConnection({
    	host: process.env.RDS_HOSTNAME,
    	port: process.env.RDS_PORT,
    	database: process.env.RDS_DB_NAME,
    	user: process.env.RDS_USERNAME,
    	password: process.env.RDS_PASSWORD
    });
    

	connection.query('SELECT NOW() AS "theTime"', function(err, result) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		if(err) {
			return console.error('error running query', err);
		}
		console.log('--- results ---');
		console.log(result);
		console.log('time is ...');
		console.log(result[0].theTime);
		res.write(result[0].theTime + "");
		res.write("hotel_id: " + req.params.hotelId);
		res.end();
	});

	connection.end(function() {
		console.log('connection end');
	});
});
    
// Prepare for using module as router
module.exports = router;