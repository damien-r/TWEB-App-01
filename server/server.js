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
    console.log("GITHUB_TOKEN is required !");
    process.exit(1);
}

// Get Github user agent to authenticate to Github API
var GITHUB_USER_AGENT = process.env.GITHUB_USER_AGENT;
if (GITHUB_USER_AGENT === undefined) {
    console.log("GITHUB_USER_AGENT is required !");
    process.exit(1);
}

// Get uri to connect to mongo DB add-on
var MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI === undefined) {
    console.log("DB_URI is required !");
    process.exit(1);
}

const GITHUB_API = "https://api.github.com"

/**
 *******************************************************
 * Server configurations
 *******************************************************
 */
app.set('port', (process.env.PORT || 4000));

app.use(express.static(__dirname + '/../app/'));

app.listen(app.get('port'), function() {
    console.log('The app is now running on port', app.get('port'));
});

/**
 *******************************************************
 * server REST API
 *******************************************************
 */
// test séparation composants
// app.use('/api', require('./routes'));

// Get history of the last requests made by a specific ip user
app.get('/api/history', function (req, res, next) {

    var context = {};
    // Get ip from user
    context.ip_user = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    context.db_uri = MONGODB_URI;

    console.log("ip user: " + context.ip_user);
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
app.get('/api/githubstats/:_id', function (req, res, next) {
    var context = {};
    context._id = req.params._id;
    context.db_uri = MONGODB_URI;

    getGithubStats(context)
        .then(function (result){
            console.log("We are done");
            var dataToSend = {};
            dataToSend._id = result._id;
            dataToSend.date = result.date;
            dataToSend.repo = result.repo;
            dataToSend.stats = result.data;
            res.json(dataToSend);
        }).catch(function (error){
        console.log("An error occured when trying to get data from mongoDB");
        next(error);
    });
});

// Get github statistics from github API for a given username and repo
app.get('/api/githubstats/:username/:repo', function (req, res, next) {

    console.log(req.params.username + '/' + req.params.repo);

    var context = {};
    context.ip_user = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    context.date = new Date();
    context.repo = req.params.username + "/" + req.params.repo;
    context.db_uri = MONGODB_URI;

    // Used for Github API
    context.options = {
        uri: GITHUB_API + '/repos/'+context.repo+'/stats/code_frequency',
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
            console.log(result.data);
            // Send Github stats
            var dataToSend = {};
            dataToSend._id = result._id;
            dataToSend.date = result.date;
            dataToSend.repo = result.repo;
            dataToSend.stats = result.data;
            res.json(dataToSend);
        }).catch(function (error) {
            console.log("An error occured during the process.");
            next(error);
        });
});

app.get('/api/repos/:username', function (req, res, next) {

    var context = {};
    // Used for Github API
    context.options = {
        uri: GITHUB_API + '/users/' + req.params.username + '/repos',
        qs: {
            access_token: GITHUB_TOKEN
        },
        headers: {
            'User-Agent': GITHUB_USER_AGENT
        },
        json: true
    };

    fetchGithubData(context)
        .then(function (result) {
            res.json(result.trends);
        })
        .catch(function (error) {
            next(error);
        });
});

app.get('/api/trends', function(req, res, next) {
    console.log("\n## Get trends");

    var context = {
        db_uri: MONGODB_URI
    };

    getTrends(context)
        .then(function(context) {
            res.json(context.trends);
        })
        .catch(function(error) {
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
            context.data = document.data;
            return context;
        })
}

function fetchAndSaveGithubStats(context) {
    return openDBConnection(context)
        .then(fetchGithubData)
        .then(saveGithubStats)
        .then(closeDBConnection);
}

function openDBConnection(context) {
    console.log("Open DB connection...");
    return MongoClient.connect(context.db_uri)
        .then(function (db) {
            console.log("DB connection opened.");
            context.db = db;
            return context;
        });
}

function fetchGithubData(context) {
    console.log("Fetching github data...");
    return rp(context.options)
        .then(function (data){
            console.log("Github data fetched.");
            // TODO : de temps a autre la reponse "bug"
            // 'data' est juste un élément de type Object qui ne contient rien...
            // Est-ce l'API github qui fonctionne mal ? ou le plugin 'request-promise' ?
            console.log("------------------------------------after rp: " + data);
            context.data = data;
            return context;
        });
}

function saveGithubStats(context) {
    console.log("Saving github data...");
    var collection = context.db.collection("githubstats");
    return collection.insertOne(
            {
                ip_user: context.ip_user,
                date: new Date(),
                repo: context.repo,
                data: context.data
            })
        .then(function(results){
            console.log("Github data saved.");
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

function getTrends(context) {
    return openDBConnection(context)
        .then(fetchTrends)
        .then(closeDBConnection);
}

function fetchTrends(context) {
    console.log("Fetching trends from DB...");

    var collection = context.db.collection("githubstats");
    return collection
        .aggregate([{ "$group": { _id: "$repo", count: { $sum: 1 } } }])
        .sort({ count: -1 })
        .limit(7)
        .toArray()
        .then(function(documents) {
            context.trends = documents;
            return context;
        })
        .catch(function(error) {
            console.log(error);
        });
}
