var express = require('express');
// Routing
var router = express.Router();

router.get('/',function(req, res){
    var pg = require('pg');

    exports.handler = function(){
        var dbConfig = {
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DB_NAME,
            host: process.env.RDS_HOSTNAME,
            port: process.env.RDS_PORT
        };
        
        var client = new pg.client(dbConfig);
        client.connect();
        client.queryString('SELECT NOW()',(err,res) =>{
            res.json({
                message:res
            });
        });        
    };
});

// Prepare for using module as router
module.exports = router;