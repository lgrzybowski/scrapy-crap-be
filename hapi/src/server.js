const fs = require('fs');

'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        let results = fs.readdirSync('./results', 'utf8');
        let content=[];

        results.forEach((site) => {

            let result = JSON.parse(fs.readFileSync(`./results/${site}`, {encoding: 'utf-8'}));

            const news = result.news;
            const noExtension = site.substring(0, site.indexOf('.'));

            if (result !== undefined) {
                content.push({site: noExtension, news});
            }
        });

        return content;
    }
});


const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();