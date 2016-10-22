var router = require('express').Router();
// var four0four = require('./utils/404')();
var data = require('./data');

router.get('/history/:ipUser', getHistory);
router.get('/githubstats/:_id', getStatsFromDB);
router.get('/githubstats/:username/:repo', getStatsFromGithub);
// router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getHistory(req, res, next) {
    var history = data.history(req.params.ipUser);
}

function getStatsFromGithub(req, res, next) {
    data.githubstats(req.params.username, req.params.repo);
}

function getStatsFromDB(req, res, next) {
    data.DBstats(req.params._id);
}

function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}
