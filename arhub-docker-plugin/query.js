import fs from 'fs';
//import Arweave from 'arweave'
import base64url from 'base64url'
import { queryAllTransactionsGQL } from 'arweavekit/graphql'
import { getTransaction } from 'arweavekit/transaction'



/*const queryImages = async() => {
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
    
  }*/

  const fetchImage = async (id, name) => { 
    try {
      const txn = await getTransaction({
        transactionId: id, 
        environment: 'mainnet'
      });  
      
      const dataArray = txn.data
      const bindata = base64url.toBuffer(dataArray)
      const tarFilePath = name +'.tar'
      const writeStream = fs.createWriteStream(tarFilePath);
      writeStream.write(bindata);
      writeStream.end();
      writeStream.on('finish', () => {
        writeStream.close()
        console.log('Image pulled successfully.');
      });           
      writeStream.on('error', err => {
        console.log('Error creating tar file...')
      })
    } catch (e) { 
      console.error('Error downloading file: '+ e.message)
    }
  }
  
/*  const fetchImage = async (id) => {
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
        })

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
  }*/
  

export const main = async () => {
    //await queryImages()
    
    const imageIds = await queryImages()
    for (let i = 0; i < imageIds.length; i++) {
        try {
            await fetchImage(imageIds[i])     
        } catch (err) { 
            console.error('Error downloading image: ', err)
        }
           
    }
}

//main()

const getImageName = async (id) => {
  try {
    const txn = await getTransaction({
      transactionId: id, 
      environment: 'mainnet'
    });  
    for (let i = 0; i < txn.tags.length; i++) {
      let namebuf = Buffer.from(txn.tags[i].name, 'base64')
      if (namebuf.toString('ascii') === 'filename') {
          let valuebuf = Buffer.from(txn.tags[i].value, 'base64')
          let filename = valuebuf.toString('ascii')
          return filename
      }
    }
  } catch (err) { 
    throw new Error('Error fetching file name: ', err)
  }  
}

const queryAllImages = async () => {

  const queryString = `query($first: Int, $cursor: String) {
    transactions(first: $first, after: $cursor, tags: [{name: "type", values: ["arhubcimg"]}]) {
        pageInfo {
            hasNextPage
        }
        edges {
            cursor
            node {
                id
                owner {
                    address
                }
                data {
                    size
                }
                block {
                    height,
                    timestamp
                }
                tags {
                    name,
                    value
                }
            }
        }
    }
  }`

  try {
    let res = await queryAllTransactionsGQL(queryString, {
      gateway: 'arweave.dev',
      filters: {
        first: 100
      }})
    const imageCount = res.length    
    var images = []
    for (let i = 0; i < imageCount; i++) {       
      const imageObj = {
        imageId: res[i].node.id,
        imageOwner: res[i].node.owner,
        imageName: await getImageName(res[i].node.id)
      }
      images.push(imageObj)      
    }
    console.log(images)
    return images
  } catch (e) { 
    throw new Error('Failed to get images...', e)
  }

}




    