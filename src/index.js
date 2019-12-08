const config = require('./config')
const fs = require('fs')
const path = require('path')
const clients = require('./db')

/**
 * returns the time in ms an anonymous async method resolves
 *
 * @param {Function} fn
 * @returns {Number}
 */
async function bench (fn) {
  const start = process.hrtime.bigint()
  await fn()
  const end = process.hrtime.bigint()
  return Number(end - start) / 1000000
}

(async () => {
  const max = 250000
  const step = 5000
  const sample = 10000

  const db = process.argv[2];
  const client = clients[db];

  for (const item of [
    'id',
    'uuid',
    'binuuid',
    'obinuuid'
  ]) {
    const start = process.hrtime.bigint()

    let query
    if (item === 'id') {
      query = 'INSERT INTO id VALUES()'
    }
    else {
      switch(db) {
        case 'mysql5':
        case 'percona5':
        case 'mariadb':
          query = `INSERT INTO ${item} SELECT ${item}()`
          break;
        case 'mysql8':
        case 'percona8':
          switch(item) {
            case 'uuid':
              query = 'INSERT INTO uuid SELECT UUID()'
              break
            case 'binuuid':
              query = 'INSERT INTO binuuid SELECT UUID_TO_BIN(UUID())'
              break
            case 'obinuuid':
              query = 'INSERT INTO obinuuid SELECT UUID_TO_BIN(UUID(), 1)'
              break
          }
      }
    }

    console.log(db, query)

    let sum = 0

    const f = fs.createWriteStream(path.join(__dirname, `../out/${db}.${item}.csv`));

    for (let i = 0; i < max; i++) {
      if (i && i % step === 0) {
        console.log(db, `${i}`.padStart(12, ' '), query, sum / step)
        f.write(`${i};${sum / step}\n`)
        sum = 0
      }
      sum += await bench(() => client.query(query))
    }

    console.log(` ${Number(process.hrtime.bigint() - starg) / 1000000}ms`);
    f.close()

    // get sample uuids
    {
      const uuids = await client.query(`
      `, {
        replacements: {

        },
        type: client.QueryTypes.SELECT
      })
        .map(({ uuid }) => typeof uuid === 'string' ? uuid : uuid.toString('hex'))

      fs.writeFileSync(
        path.join(__dirname, `../out/${db}.${item}.samples.json`),
        JSON.stringify(uuids)
      )
    }
  }
})()