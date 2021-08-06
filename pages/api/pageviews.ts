import type { NextApiRequest, NextApiResponse } from 'next'

import { pool } from '../../lib/database'

export default async function pageviews(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { startTime, endTime } = JSON.parse(request.body)
  const result = await pool.query(
    `
    SELECT
      DATE_TRUNC('hour', inserted_at) as x,
      COUNT(*) as y
    FROM
      pageviews
    WHERE
      inserted_at >= $1
      AND inserted_at <= $2
    GROUP BY
      1
    ORDER BY
      1
  `,
    [startTime, endTime]
  )
  response.send(result.rows)
}
