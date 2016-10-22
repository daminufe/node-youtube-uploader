'use strict';

const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path');

router.get('/', index);

let versions = getDirectories(path.resolve(__dirname));

versions.forEach(function (version) {
    router.use(`/${version}`, require(`./${version}/routes`));
});

module.exports = router;

function index (req, res) {
    res.send({
        versions: versions
    });
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
