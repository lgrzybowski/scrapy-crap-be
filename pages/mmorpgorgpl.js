const bro = require('../src/crawler/browser');
const pageURL = 'https://mmorpg.org.pl/';
const save = require('./../src/helpers/save');
const text = require('./../src/helpers/text');

(async () => {
    const browser = await bro.browser();
    const page = await browser.newPage();
    const name = 'mmorpgorgpl';

    try {
        console.log(`!!! STARTING CRAWLING PAGE ${name}`);
        await page.setRequestInterception(true);
        page.on('request', intercepted => {
            if (intercepted.url().toLowerCase().includes('youtube') || intercepted.url().toLowerCase().includes('ads')) {
                intercepted.abort();
            } else {
                intercepted.continue();
            }
        });
        await page.goto(pageURL, {timeout: 90000});
        await page.waitForSelector('.content__left');
        let news = await page.evaluate(() => {
            let newsResults = [];
            let newsOnPage = document.querySelectorAll('.article-list__item--title a');

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
            await page.goto(pageURL + news[i], {timeout: 90000});
            let title = await text.singleSelectorReadText(page, '.article__title');
            let newTitle = title.replace(/Opu.+/g, ' ');
            let newTitleWithoutNumbers = newTitle.replace(/\d{1,2}\s\d{1,4}/g, ' ');
            let articleText = await text.multipleSelectorsReadText(page, '.article__text p');
            if (text !== undefined && newTitle !== undefined) {
                results.news.push({
                    id: i.toString(),
                    title: newTitleWithoutNumbers,
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
