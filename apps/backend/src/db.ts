import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import fs from 'fs'

type Database = {
  trades: string[]
}

if (!fs.existsSync(`data`)) fs.mkdirSync(`data`)
if (!fs.existsSync(`data/db.json`)) fs.writeFileSync(`data/db.json`, `{}`)

const adapter = new FileSync<Database>('data/db.json')
const db = low(adapter)

db.defaults({ trades: [] }).write()

export { db }
