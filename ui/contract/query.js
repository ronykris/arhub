import fs from 'fs';
import Arweave from 'arweave'
import https from 'https'
import { resolve } from 'path';
import axios from 'axios';
import tar from 'tar-fs'
import base64url from 'base64url'


const getImages = async() => {
    let results = await fetch('https://arweave.dev/graphql', {
      method: 'POST',
  
      headers: {
        "Content-Type": "application/json"
      },
  
      body: JSON.stringify({
        query: `{transactions
            (tags: { name: "type", values: ["arhubcimg"] }) {
              edges {
                node {
                  id
                }
              }
            }
          }`
      })
    })
    let characters = await results.json();
    console.log(characters.data.transactions.edges)
    var imageUrls = []
    var ids = []
    const imageCount = characters.data.transactions.edges.length
    for (let i = 0; i < imageCount; i++) {
        let uri = `https://www.arweave.net/${characters.data.transactions.edges[i].node.id}`
        let id = characters.data.transactions.edges[i].node.id
        console.log(`URI: ${uri}`)
        imageUrls.push(uri)
        ids.push(id)
    }
    console.log(imageUrls)
    return ids
    
  }

  const getFileName = async (id) => { 
    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
      });
      const txn = await arweave.transactions.get(id)
      for (let i = 0; i < txn.tags.length; i++) {
        let buf = Buffer.from(txn.tags[i].name, 'base64')
        if (buf.toString('ascii') === 'filename') {
            let buff = Buffer.from(txn.tags[i].value, 'base64')
            try {
              const dataArray = await arweave.transactions.getData(id)
            const bdata = base64url.toBuffer(dataArray)
            const tarFilePath = 'hello-world.tar'
            const writeStream = fs.createWriteStream(tarFilePath);
            writeStream.write(bdata);
            writeStream.end();
            writeStream.on('finish', () => {
              console.log('Tar file created successfully.');
            });
            /*const tarStream = tar.extract(process.cwd())
            tarStream.write({
              name: 'hello-world.tar'
            })
            tarStream.end(bdata)
            tarStream.on('finish', () => {
              console.log('downloaded')
            })*/
            } catch (e) { 
              console.error(e)
            }
            
            

            return (buff.toString('ascii'))
        }

      }  
      
        
      //console.log(txn)
  }

  const fetchImage = async (id) => {
      try { 
        let uri = `https://www.arweave.net/${id}`  
        console.log(uri)      
        const filename = await getFileName(id)
        /*const response = await axios({
            uri,
            method: 'GET',            
            responseType: 'arraybuffer'
        });

        //const filestream = fs.createWriteStream(`${filename}.tar`)
        const filestream = fs.createWriteStream('hello-world.tar')
        response.data.pipe(filestream)
        
        return new Promise((resolve, reject) => {
            filestream.on('finish', resolve)
            filestream.on('error', reject)
        })*/

        return await new Promise((resolve, reject) => {
            https.get(uri, (res) => {
                console.log(uri)                
                const status = res.statusCode ?? 0
                if (status >= 400) {
                    return reject(new Error(res.statusMessage))
                }
                //const fileWriter = fs.createWriteStream(`${filename}.tar`, { flags: 'w' })
                const fileWriter = fs.createWriteStream(`helloworld.tar`)
                fileWriter.on('finish', () => {
                    fileWriter.close()
                    console.log('Download complete...')
                    resolve({})
                })
                res.pipe(fileWriter)
            }).on('error', error => {
                reject(error)
            })
        })
        

      } catch (err) { 
          console.error('Error downloading file: ', err)
      }
  }
  

const main = async () => {
    const imageIds = await getImages()
    for (let i = 0; i < imageIds.length; i++) {
        try {
            await fetchImage(imageIds[i])     
        } catch (err) { 
            console.error('Error downloading image: ', err)
        }
           
    }
}

main()