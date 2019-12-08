const config = {
  clients: [
    { host: 'mysql5', dialect: 'mysql' },
    { host: 'mysql8', dialect: 'mysql' },
    { host: 'percona5', dialect: 'mysql' },
    { host: 'percona8', dialect: 'mysql' },
    { host: 'mariadb', dialect: 'mariadb' }
  ]
}

module.exports = config