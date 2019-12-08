const config = require('./config')
const Sequelize = require('sequelize')

const clients = {}

for (const { dialect, host } of config.clients) {
  clients[host] = new Sequelize('uuid', 'root', 'root',
    {
      dialect,
      host,
      logging: false
    })
}

module.exports = clients