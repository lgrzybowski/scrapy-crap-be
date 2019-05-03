require('dotenv').config();
const fs = require('fs');
const exec = require('child_process').exec;
const async = require('async');

(async () => {
    completeCrawling();
    setInterval(completeCrawling, 1200000);
})();

function completeCrawling() {
    const sites = readFiles();
    const funcs = sites.map(function(file) {
        return exec.bind(null, `node ./pages/${file}`)
    });
    async.series(funcs, getResults);
}

function getResults(err, data) {
    if (err) {
        return console.log(err)
    }
    data.forEach((element) => {
        console.log(element[0])
    })
}

function readFiles() {
    console.log('reading files');
    let pages = fs.readdirSync('./pages', 'utf8');
    const sites = pages.filter((element) => {
        if(element !== 'crawl.js') {
            return element;
        }
    });
    console.log('we should have all files now');
    return sites;
}

