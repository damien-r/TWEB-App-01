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

const GITHUB_API = "https://api.github.com";

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

// Get history of the last requests made by a specific ip user
app.get('/api/history', function (req, res, next) {

    var context = {};
    // Get ip from user
    context.ip_user = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    context.db_url = MONGODB_URI;

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
    context.db_url = MONGODB_URI;

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

    var context = {};
    context.ip_user = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    context.date = new Date();
    context.repo = req.params.username + "/" + req.params.repo;
    context.db_url = MONGODB_URI;

    // Used for Github API
    context.options = {
        uri: GITHUB_API + '/repos/'+context.repo+'/stats/code_frequency',
        qs: {
            access_token: GITHUB_TOKEN
        },
        headers: {
            'User-Agent': GITHUB_USER_AGENT
        },
        json: true,
        resolveWithFullResponse: true
    };

    fetchAndSaveGithubStats(context)
        .then(function (result) {
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
        json: true,
        resolveWithFullResponse: true
    };

    fetchGithubData(context)
        .then(function (result) {
            res.json(result.data);
        })
        .catch(function (error) {
            next(error);
        })
});

/**
 *******************************************************
 * Functions
 *******************************************************
 */

/**
 * Chain of promises to get history from data stored in mongoDB
 */
function getHistory(context) {
    console.log("Getting history of ip " + context.ip_user);
    return openDBConnection(context)
        .then(fetchHistory)
        .then(closeDBConnection);
}

/**
 * Construct history from data stored in mongoDB
 */
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

/**
 * Chain of promises to get github statistics
 */
function getGithubStats(context) {
    return openDBConnection(context)
        .then(getStatFromDB)
        .then(closeDBConnection);
}

/**
 * Get github statistics stored in mongoDB
 */
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

/**
 * Chain of promises to fetch and save github data in mongoDB
 */
function fetchAndSaveGithubStats(context) {
    return openDBConnection(context)
        .then(fetchGithubData)
        .then(saveGithubStats)
        .then(closeDBConnection);
}

/**
 * Open mongoDB connection
 */
function openDBConnection(context) {
    console.log("Open DB connection...");
    return MongoClient.connect(context.db_url)
        .then(function (db) {
            console.log("DB connection opened.");
            context.db = db;
            return context;
        })
        .catch(function(error){
            console.log("Error when trying to open DB connection");
            console.log(error);
        });
}

/**
 * Retrieve github data using github API and the request-promise module
 */
function fetchGithubData(context) {
    console.log("Fetching github data...");
    return rp(context.options)
        .then(function (data){
            // FROM GITHUB : A WORD ABOUT CACHE
            // https://developer.github.com/v3/repos/statistics/#a-word-about-caching
            //
            // Computing repository statistics is an expensive operation,
            // so we try to return cached data whenever possible.
            // If the data hasn't been cached when you query a repository's statistics,
            // you'll receive a 202 response; a background job is also fired to
            // start compiling these statistics. Give the job a few moments
            // to complete, and then submit the request again.
            // If the job has completed, that request will receive a 200 response
            // with the statistics in the response body.
            //
            // Repository statistics are cached by the SHA of the repository's
            // default branch, which is usually master;
            // pushing to the default branch resets the statistics cache.

            // In conclusion, we have to check the status code of the answer.
            // If it's a 202, we wait a short time for github to cache the results
            // and then request again for the same data.
            // We do that until we get the the proper 200 statusCode.
            if (data.statusCode == 202) {
                console.log("data status code = " + data.statusCode);
                setTimeout(function() {
                    console.log("waiting a short time...");
                }, 50);
                return fetchGithubData(context);
            } else {
                console.log("Github data fetched.");
                context.data = data.body;
                return context;
            }
        })
        .catch(function (error){
            console.log("An error occured when trying to fetch github data");
            console.log(error);
            closeDBConnection(context);
        });
}

/**
 * Save github data in mongoDB
 */
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
        })
        .catch(function(error){
            console.log("An error occured when trying to save data.");
            console.log(error);
        });
}

/**
 * Close mongoDB connection
 */
function closeDBConnection(context) {
    console.log("Closing DB connection...");
    return context.db.close()
        .then(function() {
            console.log("DB connection closed.");
            return context;
        });
}
