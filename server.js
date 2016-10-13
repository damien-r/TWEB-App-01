var express = require('express');
var app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
console.log(GITHUB_TOKEN);

if (GITHUB_TOKEN === undefined) {
    console.log("GITHUB_TOKEN is undefined");
    process.exit(1);
}

app.get('/api/github',function(req, res){
    return res.json({ token: GITHUB_TOKEN });
});

app.set('port', (process.env.PORT || 4000));

app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
    console.log('The app is now running on port', app.get('port'));
});
