import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to my Next.js application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>

        <div className="mt-6">
          <Link href="/login" legacyBehavior>
            <a className="text-blue-600 hover:underline">Go to Login Page</a>
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
