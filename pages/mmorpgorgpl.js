const bro = require('../src/crawler/browser');
const pageURL = 'https://mmorpg.org.pl';
const textHelper = require('./../src/helpers/text');
const databaseHelper = require('./../src/helpers/database');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().endsWith('.png')
            || interceptedRequest.url().endsWith('.jpg')
            || interceptedRequest.url().includes('ads')
            || interceptedRequest.url().includes('doubleclick'))
            interceptedRequest.abort();
        else
            interceptedRequest.continue();
    });

    const pageName = 'mmorpgorgpl';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${pageName}`);
        await page.goto(pageURL, {timeout: 120000});
        await page.waitForSelector('.content__left');
        const news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.article-list__item--title a');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i], {timeout: 120000});
            let title = await textHelper.singleSelectorReadText(page, '.article__title');
            let text = await textHelper.multipleSelectorsReadText(page, '.article__text p');
            let link = pageURL + news[i];
            if (title) {
                await databaseHelper.insertNewsToDatabase(title, text, link, pageName);
            }
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
