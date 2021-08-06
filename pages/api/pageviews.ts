import type { NextApiRequest, NextApiResponse } from 'next'

import { pool } from '../../lib/database'

export default async function pageviews(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const result = await pool.query(`
    SELECT
      DATE_TRUNC('hour', inserted_at) as x,
      COUNT(*) as y
    FROM
      pageviews
    GROUP BY
      1
    ORDER BY
      1
  `)
  response.send(result.rows)
}
