var express = require('express');
var app = express();

// Get Github Token from environment variable
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (GITHUB_TOKEN === undefined) {
    console.log("GITHUB_TOKEN is undefined");
    process.exit(1);
}

// Define REST API to get github token from angularjs app
app.get('/api/github',function(req, res){
    return res.json({ token: GITHUB_TOKEN });
});

// Define REST API for mongoDB
// TODO

app.set('port', (process.env.PORT || 4000));

app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
    console.log('The app is now running on port', app.get('port'));
});
