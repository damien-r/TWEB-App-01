var express = require('express');
var app = express();
var rp = require('request-promise');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

/*
 *******************************************************
 * Retrieve environment variable from server
 *******************************************************
 */
// Get Github Token to authenticate to Github API
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (GITHUB_TOKEN === undefined) {
    console.log("GITHUB_TOKEN is undefined");
    process.exit(1);
}

// Get Github user agent to authenticate to Github API
var GITHUB_USER_AGENT = process.env.GITHUB_USER_AGENT;
if (GITHUB_USER_AGENT === undefined) {
    console.log("GITHUB_USER_AGENT is undefined");
    process.exit(1);
}

// Get uri to connect to mongo DB add-on
var MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI === undefined) {
    console.log("DB_URI is undefined");
    process.exit(1);
}

/**
 *******************************************************
 * Server configurations
 *******************************************************
 */
app.set('port', (process.env.PORT || 4000));

app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function() {
    console.log('The app is now running on port', app.get('port'));
});

/**
 *******************************************************
 * server REST API
 *******************************************************
 */
// Get history of the last requested repo made by a specific ip user
app.get('/api/history/:ipUser', function (req, res, next) {

    var context = {};
    context.ip_user = req.params.ipUser;
    context.db_url = MONGODB_URI;

    getHistory(context)
        .then(function (result){
            // success
            res.json(result.history);
        }).catch(function (error){
            console.log("An error occured when trying to get history");
            next(error);
        }
    );

});

// Get github statistics from DB for a given id (this id corresponds
// to ObjectId in mongoDB)
app.get('/api/githubStats/:_id', function (req, res, next) {
    var context = {};
    context._id = req.params._id;
    context.db_url = MONGODB_URI;

    getGithubStats(context)
        .then(function (result){
            console.log("We are done");
            var dataToSend = {};
            dataToSend._id = result._id;
            dataToSend.date = result.date;
            dataToSend.repo = result.repo;
            dataToSend.stats = result.stats;
            res.json(dataToSend);
        }).catch(function (error){
        console.log("An error occured when trying to get data from mongoDB");
        next(error);
    });
});

// Get github statistics from github API for a given username and repo
app.get('/api/githubStats/:username/:repo', function (req, res, next) {

    console.log(req.params.username + '/' + req.params.repo);

    var context = {};
    context.ip_user = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    context.date = new Date();
    context.repo = req.params.username + "/" + req.params.repo;
    context.db_url = MONGODB_URI;

    // Used for Github API
    context.options = {
        uri: 'https://api.github.com/repos/'+context.repo+'/stats/code_frequency',
        qs: {
            access_token: GITHUB_TOKEN
        },
        headers: {
            'User-Agent': GITHUB_USER_AGENT
        },
        json: true
    };

    fetchAndSaveGithubStats(context)
        .then(function (result) {
            console.log("We are done:");
            console.log(result.stats);
            // Send Github stats
            var dataToSend = {};
            dataToSend._id = result._id;
            dataToSend.date = result.date;
            dataToSend.repo = result.repo;
            dataToSend.stats = result.stats;
            res.json(dataToSend);
        }).catch(function (error) {
        console.log("An error occured during the process.");
        next(error);
    });
});

/**
 *******************************************************
 * Functions
 *******************************************************
 */

function getHistory(context) {
    return openDBConnection(context)
        .then(fetchHistory)
        .then(closeDBConnection);
}

function fetchHistory(context) {
    console.log("Fetching history from DB...");
    var collection = context.db.collection("githubstats");
    return collection
        .find({ ip_user: context.ip_user },{ date: 1, repo: 1 })
        .sort({ date: -1 })
        .limit(7)
        .toArray()
        .then(function (documents){
            // Need to reverse to be consistent with data presentation
            context.history = documents.reverse();
            return context;
        });
}

function getGithubStats(context) {
    return openDBConnection(context)
        .then(getStatFromDB)
        .then(closeDBConnection);
}

function getStatFromDB(context) {
    console.log("Getting stats from DB...");
    var collection = context.db.collection("githubstats");
    return collection.findOne({_id: new ObjectID(context._id)})
        .then(function (document){
            console.log(document);
            context._id = document._id;
            context.date = document.date;
            context.repo = document.repo;
            context.stats = document.stats;
            return context;
        })
}

function fetchAndSaveGithubStats(context) {
    return openDBConnection(context)
        .then(fetchGithubStats)
        .then(saveGithubStats)
        .then(closeDBConnection);
}

function openDBConnection(context) {
    console.log("Open DB connection...");
    return MongoClient.connect(context.db_url)
        .then(function (db) {
            console.log("DB connection opened.");
            context.db = db;
            return context;
        });
}

function fetchGithubStats(context) {
    console.log("Fetching github stats...");
    return rp(context.options)
        .then(function (stats){
            console.log("Github stats fetched.");
            context.stats = stats;
            return context;
        });
}

function saveGithubStats(context) {
    console.log("Saving github stats...");
    var collection = context.db.collection("githubstats");
    return collection.insertOne(
            {
                ip_user: context.ip_user,
                date: new Date(),
                repo: context.repo,
                stats: context.stats
            })
        .then(function(results){
            console.log("Github stats saved.");
            context._id = results.insertedId;
            return context;
        });
}

function closeDBConnection(context) {
    console.log("Closing DB connection...");
    return context.db.close()
        .then(function() {
            console.log("DB connection closed.");
            return context;
        });
}
