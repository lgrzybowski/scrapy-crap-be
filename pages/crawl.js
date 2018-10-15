const fs = require('fs');
const exec = require('child_process').exec;

(async () => {
    crawling();
    //setInterval(crawling, 3600000);
})();

function crawling(){
    console.log('crawling function');
    let pages = fs.readdirSync('./pages', 'utf8');
    const sites = pages.filter((element) => {
        if(element !== 'crawl.js') {
            return element;
        }
    });

    sites.forEach((site)=>{
        exec(`node ./pages/${site}`, (err, stdout) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
        });
    })
}

