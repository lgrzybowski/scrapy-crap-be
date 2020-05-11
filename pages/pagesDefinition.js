require('dotenv').config()
const request = require('request-promise-native');
const cherio = require('cheerio');
const databaseHelper = require('./../src/helpers/database')


const pagesDefinition =
    [{
      name: 'mmorpgorgpl',
      pageDomain: 'https://mmorpg.org.pl',
      newsLink: '.content .article-list__item--title a',
      newsTitle: '.article__title h2',
      newsContentMainSelector: '.article__text p',
      newsContent:'',
      remove:[]
    }];

    (async () => {
      pagesDefinition.forEach(async (page) => {
        let newsLinks = [];
        const mainPage = await request({
          method: 'GET',
          uri: page.pageDomain,
        })

        const $ = cherio.load(mainPage);
        const links = $(page.newsLink)
      
        links.each((link, value) => {
            newsLinks.push($(value).attr('href'));
          })
          readNewsContent(page.pageDomain, newsLinks)
          newsLinks = [];
        })
    })(); 

    const readNewsContent = function (domain,links) {
      links.forEach(async (link) => {
          const newsPage = await request({
            method:'GET',
            uri: domain + link,
          })
          const $ = cherio.load(newsPage);

          await databaseHelper.insertNewsToDatabase($('.article__title h2').text().trim(),
          $('.article__text').text().trim(), domain + link, 'mmorpgorgpl')         
      })
    };