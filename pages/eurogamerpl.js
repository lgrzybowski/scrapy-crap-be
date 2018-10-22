const bro = require('../src/crawler/browser');
const pageURL = 'https://www.eurogamer.pl';
const save = require('./../src/helpers/save');
const text = require('./../src/helpers/text');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();

    const name = 'eurogamer';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${name}`);
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

        let results = {
            news: [],
        };

        await page.waitFor(10000);

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(`${pageURL}${news[i]}`, {timeout: 120000});
            let title = await text.singleSelectorReadText(page, 'h1.title');
            let articleText = await text.multipleSelectorsReadText(page, 'main section p');
            if (text !== undefined && title !== undefined) {
                results.news.push({
                    id: i.toString(),
                    title: title,
                    text: articleText,
                    link: pageURL + news[i]
                });
            }
        }
        await save.saveNews(name, results);
    } catch (e) {
        console.log(e);
    }
    finally {
        console.log(`!!! FINISHED CRAWLING PAGE ${name}`);
        browser.close();
    }
})();
