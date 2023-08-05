import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='p-1'>
      <Head>
        <title>ArHub!</title>
        <meta name="description" content="ArHub!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col h-screen justify-center align-middle p-4'>
        <h1 className='text-6xl  text-blue-500 text-center p-10  '>
          Welcome to <a href="https://nextjs.org">ArHub!</a>
        </h1>

        <p className='p-2 text-2xl text-center'>
          The authentic decentralized container registry and hub.          
        </p>
      </main>
    </div>
  )
}
