const bro = require('../src/crawler/browser');
const pageURL = 'https://www.gram.pl';
const save = require('./../src/helpers/save');
const text = require('./../src/helpers/text');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const name = 'grampl';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${name}`);
        await page.goto(pageURL, { timeout: 120000 });
        await page.waitForSelector('.news-room');
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.article a');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        let results = {
            news: [],
        };

        for (let i = 0; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i], { timeout: 120000 });
            results.news.push({
                id: i.toString(),
                title: await text.singleSelectorReadText(page, 'article h1'),
                text: await text.multipleSelectorsReadText(page, '#content-root p'),
                link: pageURL + news[i]
            });
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
