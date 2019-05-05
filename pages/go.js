const bro = require('../src/crawler/browser');
const { pagesDefinition } = require('./pagesDefinition');
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {

    for(let pages = 0; pages < pagesDefinition.length; pages++) {
        const browser = await bro.browser();
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            if (interceptedRequest.url().endsWith('.png')
                || interceptedRequest.url().endsWith('.jpg')
                || interceptedRequest.url().includes('ads')
                || interceptedRequest.url().includes('facebook')
                || interceptedRequest.url().includes('twitter')
                || interceptedRequest.url().includes('doubleclick'))
                interceptedRequest.abort();
            else
                interceptedRequest.continue();
        });

        try {
            console.log(`!!! STARTING CRAWLING PAGE ${pagesDefinition[pages].pageName}`);
            await page.goto(pagesDefinition[pages].pageDomain + pagesDefinition[pages].newsLink);
            await page.waitForSelector(pagesDefinition[pages].mainSelector);
            const news = await page.evaluate((newsSelector) => {
                let newsResults = [];
                let newsOnPage = document.querySelectorAll(newsSelector);

                newsOnPage.forEach(async (singleNews) => {
                    const link = await singleNews.getAttribute('href');
                    newsResults.push(link);
                });

                return newsResults;
            }, pagesDefinition[pages].newsSelector);

            for (let i = 1; i < news.length - 1; i++) {
                await page.goto(pagesDefinition[pages].pageDomain + news[i]);
                let title = await textHelper.singleSelectorReadText(page, pagesDefinition[pages].newsTitle);
                let text = await textHelper.multipleSelectorsReadText(page, pagesDefinition[pages].newsContent);
                let link = pagesDefinition[pages].pageDomain + news[i];
                if (text && title) {
                    await databaseHelper.insertNewsToDatabase(title, text, link, pagesDefinition[pages].pageName);
                }
            }
        } catch (e) {
         console.log(e);
        }
        finally {
            console.log(`!!! FINISHED CRAWLING PAGE ${pagesDefinition[pages].pageName}`);
            browser.close();
        }
    }
    await databaseHelper.endPool();
})();
