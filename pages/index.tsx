import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Home</title>
        <script async src="/collector.js" />
      </Head>
      <ul className="flex">
        <li className="mr-6">
          <Link href="/">
            <a className="font-bold">Home</a>
          </Link>
        </li>
        <li className="mr-6">
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>
      </ul>
      <h1 className="text-3xl my-4">Home</h1>
    </div>
  )
}
