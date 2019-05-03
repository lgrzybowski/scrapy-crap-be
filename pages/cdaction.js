const bro = require('../src/crawler/browser');
const pageURL = 'https://www.cdaction.pl';
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const pageName = 'cdaction';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${pageName}`);
        await page.goto(`${pageURL}/newsy-1.html`);
        await page.waitForSelector('#newsy');
        const news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('#newsy .news h3 a');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        for (let i = 1; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i]);
            let title = await textHelper.singleSelectorReadText(page, '#news_content h1');
            let text = await textHelper.singleSelectorReadText(page, '.tresc');
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
