const rssParser = require('rss-parser')
const parser = new rssParser()
const databaseHelper = require('./../src/helpers/database')
const request = require('request-promise-native')
const cherio = require('cheerio')

const RSS = [
  {
    name: 'spidersweb',
    url: 'https://www.spidersweb.pl/feed',
    newsTitle: 'article#single_1 .white',
    newsContentMainSelector: 'article#single_1',
    newsContent: '.article-main',
    remove: []
  },
  {
    name: 'antyweb',
    url: 'http://antyweb.pl/feed',
    newsTitle: 'article .entry_title',
    newsContentMainSelector: 'article',
    newsContent: '.article',
    remove: ['.block-more', '.ac-footer']
  },
  {
    name: 'ppe',
    url: 'https://www.ppe.pl/rss.html',
    newsTitle: '.di',
    newsContentMainSelector: '.txt',
    newsContent: '.maintxt.news-body',
    remove: ['.txt .maintxt.news-body ul']
  },
  {
    name: 'eurogamerpl',
    url: 'https://www.eurogamer.pl/?format=rss',
    newsTitle: 'h1.title',
    newsContentMainSelector: 'main section',
    newsContent: 'p',
    remove: []
  }
  // {
  //   name: 'grampl',
  //   url: 'https://www.gram.pl/rss/content.xml',
  //   newsTitle: 'article h1',
  //   newsContentMainSelector: '#content-root',
  //   newsContent: 'p',
  //   remove: []
  // }
];

(async () => {
  RSS.forEach(async (rss) => {
    const feed = await parser.parseURL(rss.url)

    feed.items.forEach(async (rssResponse) => {
      try {
        const articleLink = await request({
          method: 'GET',
          uri: rssResponse.link
        })

        const $ = cherio.load(articleLink)

        rss.remove.forEach((removeSelector) => {
          $(removeSelector).remove()
        })

        await databaseHelper.insertNewsToDatabase($(rss.newsTitle).text().trim(),
          $(rss.newsContentMainSelector).eq(0).find(rss.newsContent).text().trim(), rssResponse.link, rss.name)
      } catch (error) {
        console.log(error)
      }
    })
  })
})()
