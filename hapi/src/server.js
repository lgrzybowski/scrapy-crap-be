const fs = require('fs');

'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/{siteName}',
    handler: (request, h) => {
        const filePath = `./results/${request.params.siteName}.json`;

        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));
        }
        return null;
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