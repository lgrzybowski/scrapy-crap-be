const puppeteer =  require('puppeteer');

const browser = async() => {
    return await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox',
            '--disable-dev-shm-usage',
            '--lang=pl-PL,pl',
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"],
        defaultViewport: {
            width: 1680,
            height: 1050,
        },
    });
};

module.exports = {
    browser
};