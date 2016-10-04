var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 4000));

app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
    console.log('The app is now running on port', app.get('port'));
});
