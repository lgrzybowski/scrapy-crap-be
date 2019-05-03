const bro = require('../src/crawler/browser');
const pageURL = 'https://www.eurogamer.pl';
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const pageName = 'eurogamerpl';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${pageName}`);
        await page.goto(`${pageURL}/archive/news`, {timeout: 120000});
        await page.waitForSelector('.main');
        await page.waitFor(2000);
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.compact-archive-item a.cover');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });
            return newsResults;
        });

        await page.waitFor(10000);

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(`${pageURL}${news[i]}`, {timeout: 120000});
            let title = await textHelper.singleSelectorReadText(page, 'h1.title');
            let text = await textHelper.multipleSelectorsReadText(page, 'main section p');
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
