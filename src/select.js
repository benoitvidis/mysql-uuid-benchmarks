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
  const db = process.argv[2]
  const item = process.argv[3]

  const client = clients[db]

  const uuids = require(`../out/${db}.${item}.samples.json`)

  const f = fs.createWriteStream(path.join(__dirname, `../out/${db}.${item}.select.csv`))
  f.write(`;${db}.${item}\n`)

  for (const u of uuids) {
    let uuid
    switch (item) {
      case 'id':
        uuid = Number.parseInt(u)
        break
      case 'uuid':
        uuid = u
        break
      default:
        uuid = Buffer.from(u, 'hex')
    }

    const ms = await bench(() => client.query(`
        SELECT *
        FROM  ${item}
        WHERE uuid = :uuid
      `, {
      replacements: { uuid },
      type: client.QueryTypes.SELECT
    }));

    f.write(`${u};${ms}\n`)
  }

  f.close()

})()
