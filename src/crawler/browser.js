const puppeteer = require('puppeteer');

const browser = async() => {
    return await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--lang=pl-PL,pl'],
        defaultViewport: {
            width: 1680,
            height: 1050,
        },
    });
};

module.exports = {
    browser
};