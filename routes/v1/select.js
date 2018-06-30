var router = require('./common');

router.get('/select',function(req, res){
	var dba = require(process.cwd() + '/common/dba');
	dba.connect();

	var result = dba.selectPK('');
	console.log("COME HERE SELECT PK");
	console.log(result + "");

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("Hello world");
	res.end();

	dba.disconnect();
});

// Prepare for using module as router
module.exports = router;