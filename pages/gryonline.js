const bro = require('../src/crawler/browser');
const pageURL = 'https://www.gry-online.pl';
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const pageName = 'gryonline';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${pageName}`);
        await page.goto(`${pageURL}/newsroom.asp`);
        await page.waitForSelector('.lista-news');
        const news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.lista-news .box a:not(.pic-c)');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i]);

            let title = await textHelper.singleSelectorReadText(page, '.word-txt h1');
            let text = await textHelper.multipleSelectorsReadText(page, '.word-txt p');
            let link = pageURL + news[i];
            await databaseHelper.insertNewsToDatabase(title, text, link, pageName);
        }

    } catch (e) {
        console.log(e);
    }
    finally {
        console.log(`!!! FINISHED CRAWLING PAGE ${pageName}`);
        await databaseHelper.endPool();
        browser.close();
    }
})();
