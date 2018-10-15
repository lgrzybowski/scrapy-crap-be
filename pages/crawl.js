const async = require('async')
const rss = require('../rss/rss');

(async () => {
  completeCrawling()
  setInterval(completeCrawling, 1200000)
})()

function completeCrawling () {
  async.series(rss)
}
