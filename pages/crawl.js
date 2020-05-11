require('dotenv').config()

const rss = require('../rss/rss')
const pagesDefinition = require('./pagesDefinition');

(async () => {
  completeCrawling()
  setInterval(completeCrawling, 1200000)
})()

function completeCrawling () {
  Promise.all([pagesDefinition, rss])
}
