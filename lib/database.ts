// eslint-disable-next-line unicorn/prefer-node-protocol
import process from 'process'

import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_CONNECTION_STRING,
})
