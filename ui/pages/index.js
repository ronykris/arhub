import Head from 'next/head'
import Image from 'next/image'
import FileList from '../components/FileList'
import FileDetails from '../components/FileDetails'
import { useEffect, useState } from 'react'


const Home = () => {

  const [selectedFile, setSelectedFile] = useState({});
  const [filesData, setFilesData] = useState([])

  const handleItemClick = (index) => {    
    console.log(filesData[index])
    setSelectedFile(filesData[index]);
  };

  useEffect(() => {
    (async() => {
      const res = await fetch('/api/query', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setFilesData(data)      
    })()
  }, [])
  

  return (
    <div className='p-1'>
      <Head>
        <title>ArHub!</title>
        <meta name="description" content="ArHub!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col h-screen justify-center align-middle p-4 max-w-[90%] mx-auto'>
        <h1 className='text-6xl  text-blue-500 text-center p-10 mb-3 font-medium  '>
          Welcome to <a href="https://nextjs.org">ArHub!</a>
        </h1>

        <p className='p-2 text-2xl text-center mb-3 font-normal'>
          The authentic decentralized docker container registry and hub.          
        </p>

        <div className="flex flex-col md:flex-row justify-center p-4 md:p-8">
          <FileList files={ filesData } onItemClick={ handleItemClick } />
          <FileDetails selectedFile={selectedFile} />
        </div>
      </main>
    </div>
  )
}

export default Home
