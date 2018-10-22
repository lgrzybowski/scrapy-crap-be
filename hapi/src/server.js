const fs = require('fs');

'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/{siteName}',
    handler: (request, h) => {
        let result = JSON.parse(fs.readFileSync(`./results/${request.params.siteName}.json`, {encoding: 'utf-8'}));
        return result;
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