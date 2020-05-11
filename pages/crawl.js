require('dotenv').config()

const async = require('async')
const rss = require('../rss/rss');
const pagesDefinition = require('./pagesDefinition');

(async () => {
  completeCrawling()
  setInterval(completeCrawling, 1200000)
})()

function completeCrawling () {
  async.series(rss)
}
