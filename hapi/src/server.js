'use strict'
require('dotenv').config()
const Hapi = require('hapi')

const databaseHelper = require('../../src/helpers/database')

const server = Hapi.server({
  port: process.env.PORT || 8080,
  host: '0.0.0.0'
})

server.route({
  method: 'GET',
  path: '/{siteName}',
  handler: (request, h) => {
    return databaseHelper.getNewsFromToday(request.params.siteName)
  }
})

server.route({
  method: 'GET',
  path: '/',
  handler: (h) => {
    return databaseHelper.getAllSites()
  }
})

const init = async () => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
