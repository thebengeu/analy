// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs'
// eslint-disable-next-line unicorn/prefer-node-protocol
import { tmpdir } from 'os'
// eslint-disable-next-line unicorn/prefer-node-protocol
import process from 'process'

import { createClient } from '@supabase/supabase-js'
import cors from 'cors'
import { browserName, detectOS } from 'detect-browser'
import { downloadDbs, open } from 'geolite2-redist'
import { CountryResponse, Reader } from 'maxmind'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getClientIp } from 'request-ip'

const lookupPromise = downloadDbs(`${tmpdir()}/maxmind`).then(async () =>
  open(
    'GeoLite2-Country',
    (path) => new Reader<CountryResponse>(fs.readFileSync(path))
  )
)

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing process.env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing process.env.SUPABASE_SERVICE_KEY')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

interface Request extends NextApiRequest {
  body: {
    pathAndQuery: string
    referrer: string
  }
}

export default nc<Request, NextApiResponse>()
  .use(cors())
  .post(async (request, response) => {
    const userAgent = request.headers['user-agent']
    let browser
    let os
    if (userAgent) {
      browser = browserName(userAgent)
      os = detectOS(userAgent)
    }

    const clientIp = getClientIp(request)
    let country
    if (clientIp) {
      const lookup = await lookupPromise
      country = lookup.get(clientIp)?.country?.names.en
    }

    await supabase.from('pageviews').insert(
      {
        browser,
        country,
        ip: clientIp,
        os,
        referrer: request.body.referrer,
        url: request.body.pathAndQuery,
        user_agent: userAgent,
      },
      { returning: 'minimal' }
    )

    response.status(200).send('')
  })
