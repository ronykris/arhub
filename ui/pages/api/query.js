import fs from 'fs';
//import Arweave from 'arweave'
import base64url from 'base64url'
import { queryAllTransactionsGQL } from 'arweavekit/graphql'
import { getTransaction } from 'arweavekit/transaction'


export default function getImageList(req, res) {
  const images = queryAllImages()
  if (images) {
    res.status(200).json(images)
  } else {
    res.status(400).json({status: 'error', message: 'Images were not found'})
  }
}

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




    