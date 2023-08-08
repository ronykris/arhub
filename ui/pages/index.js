import Head from 'next/head'
import Image from 'next/image'
import FileList from '../components/FileList'
import FileDetails from '../components/FileDetails'
import { useEffect, useState } from 'react'

/*const filesData = [
  { name: 'File 1', details: 'Details for File 1' },
  { name: 'File 2', details: 'Details for File 2' },
  // Add more files...
];*/

const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [filesData, setFilesData] = useState([])

  const handleItemClick = (file) => {
    setSelectedFile(file);
  };

  useEffect(async () => {
    const res = await fetch('/api/query', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      }
    })
    const images = await res.json()
    setFilesData(images)
    console.log(images)
  }, [])
  

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

        <div className="flex flex-col md:flex-row p-4 md:p-8">
          <FileList files={filesData} onItemClick={handleItemClick} />
          <FileDetails selectedFile={selectedFile} />
        </div>
      </main>
    </div>
  )
}

export default Home
