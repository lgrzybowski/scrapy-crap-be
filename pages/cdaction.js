const bro = require('../src/crawler/browser');
const pageURL = 'https://www.cdaction.pl';
const save = require('./../src/helpers/save');
const text = require('./../src/helpers/text');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const name = 'cdaction';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${name}`);
        await page.goto(`${pageURL}/newsy-1.html`);
        await page.waitForSelector('#newsy');
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('#newsy .news h3 a');

            newsOnPage.forEach(async (singleNews) => {
                const link = await singleNews.getAttribute('href');
                newsResults.push(link);
            });

            return newsResults;
        });

        let results = {
            news: [],
        };

        for (let i = 1; i < news.length - 1; i++) {
            await page.goto(pageURL + news[i]);
            results.news.push(
                {
                    id: i.toString(),
                    title: await text.singleSelectorReadText(page, '.lead'),
                    text: await text.singleSelectorReadText(page, '.tresc'),
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
