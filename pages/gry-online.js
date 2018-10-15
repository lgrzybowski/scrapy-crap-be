const bro = require('../src/crawler/browser');
const pageURL = 'https://www.gry-online.pl';
const save = require('./../src/helpers/save');
const text = require('./../src/helpers/text');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const name = 'gry-online';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${name}`);
        await page.goto(`${pageURL}/newsroom.asp`);
        await page.waitForSelector('.lista-news');
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.lista-news .box a:not(.pic-c)');

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
            await page.goto(pageURL + news[i]);
            results.news.push({
                id: i.toString(),
                title: await text.singleSelectorReadText(page, '.word-txt h1'),
                text: await text.multipleSelectorsReadText(page, '.word-txt p'),
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
