import { createClient } from '@supabase/supabase-js'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { DayPickerRangeController } from 'react-dates'

import 'chartjs-adapter-date-fns'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing process.env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const chartOptions = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
      },
    },
  },
}

export default function Dashboard() {
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState<moment.Moment | null>(
    moment().startOf('day')
  )
  const [endDate, setEndDate] = useState<moment.Moment | null>(
    moment().endOf('day')
  )
  const [focusedInput, setFocusedInput] = useState<
    'startDate' | 'endDate' | null
  >('startDate')
  const [pageviews, setPageviews] = useState<
    Array<{
      id: number
      inserted_at: string
      ip: string
      referrer: string
      url: string
      user_agent: string
    }>
  >([])
  const [pageviewsUrlCount, setPageviewsUrlCount] = useState<
    Array<{ url: string; pageviews: number }>
  >([])
  const [pageviewsBrowserCount, setPageviewsBrowserCount] = useState<
    Array<{ browser: string; pageviews: number }>
  >([])
  const [pageviewsOsCount, setPageviewsOsCount] = useState<
    Array<{ os: string; pageviews: number }>
  >([])

  const chartData = {
    datasets: [
      {
        label: 'Pageviews',
        data,
      },
    ],
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/pageviews', {
        method: 'POST',
        body: JSON.stringify({
          startTime: startDate?.startOf('day').toISOString(),
          endTime: endDate?.endOf('day').toISOString(),
        }),
      })
      setData(await response.json())
    }

    fetchData()
  }, [startDate, endDate])

  useEffect(() => {
    const subscription = supabase
      .from('pageviews')
      .on('INSERT', (payload) => {
        setPageviews((previousPageviews) => [...previousPageviews, payload.new])
      })
      .subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchPageviewsUrlCount = async () => {
      const { data } = await supabase.rpc('pageviews_url_count', {
        start_time: startDate?.startOf('day').toISOString(),
        end_time: endDate?.endOf('day').toISOString(),
      })
      if (data) {
        setPageviewsUrlCount(data)
      }
    }

    fetchPageviewsUrlCount()
  }, [startDate, endDate])

  useEffect(() => {
    const fetchPageviewsBrowserCount = async () => {
      const { data } = await supabase.rpc('pageviews_browser_count', {
        start_time: startDate?.startOf('day').toISOString(),
        end_time: endDate?.endOf('day').toISOString(),
      })
      if (data) {
        setPageviewsBrowserCount(data)
      }
    }

    fetchPageviewsBrowserCount()
  }, [startDate, endDate])

  useEffect(() => {
    const fetchPageviewsOsCount = async () => {
      const { data } = await supabase.rpc('pageviews_os_count', {
        start_time: startDate?.startOf('day').toISOString(),
        end_time: endDate?.endOf('day').toISOString(),
      })
      if (data) {
        setPageviewsOsCount(data)
      }
    }

    fetchPageviewsOsCount()
  }, [startDate, endDate])

  return (
    <div className="container mx-auto">
      <Head>
        <title>Dashboard</title>
        <script async src="/collector.js" />
      </Head>
      <ul className="flex">
        <li className="mr-6">
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className="mr-6">
          <Link href="/dashboard">
            <a className="font-bold">Dashboard</a>
          </Link>
        </li>
      </ul>
      <h1 className="text-3xl my-4">Dashboard</h1>
      <DayPickerRangeController
        startDate={startDate}
        endDate={endDate}
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate)
          setEndDate(endDate)
        }}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => {
          setFocusedInput(focusedInput ? focusedInput : 'startDate')
        }}
        initialVisibleMonth={moment}
        numberOfMonths={2}
        minimumNights={0}
      />
      <div className="mt-4">
        {startDate?.format('ll')} to {endDate?.format('ll')}
      </div>
      <Bar data={chartData} options={chartOptions} />
      <div className="grid grid-cols-3 gap-4 my-4">
        <table className="border table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">URL</th>
              <th className="border px-4 py-2">Pageviews</th>
            </tr>
          </thead>
          <tbody>
            {pageviewsUrlCount.map((urlCount, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{urlCount.url}</td>
                <td className="border px-4 py-2">{urlCount.pageviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="border table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Browser</th>
              <th className="border px-4 py-2">Pageviews</th>
            </tr>
          </thead>
          <tbody>
            {pageviewsBrowserCount.map((browserCount, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{browserCount.browser}</td>
                <td className="border px-4 py-2">{browserCount.pageviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="border table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">OS</th>
              <th className="border px-4 py-2">Pageviews</th>
            </tr>
          </thead>
          <tbody>
            {pageviewsOsCount.map((osCount, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{osCount.os}</td>
                <td className="border px-4 py-2">{osCount.pageviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-2xl my-4">Realtime Pageviews</h2>
      <div className="my-4">
        Open pages in other tabs to see realtime pageviews.
      </div>
      {pageviews.length > 0 && (
        <table className="border table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">URL</th>
              <th className="border px-4 py-2">Referrer</th>
              <th className="border px-4 py-2">IP</th>
              <th className="border px-4 py-2">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {pageviews.map((pageview) => (
              <tr key={pageview.id}>
                <td className="border px-4 py-2">
                  {new Date(pageview.inserted_at).toUTCString()}
                </td>
                <td className="border px-4 py-2">{pageview.url}</td>
                <td className="border px-4 py-2">{pageview.referrer}</td>
                <td className="border px-4 py-2">{pageview.ip}</td>
                <td className="border px-4 py-2">{pageview.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
