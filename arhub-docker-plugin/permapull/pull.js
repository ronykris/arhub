import fs from 'fs';
import base64url from 'base64url'
import { getTransaction } from 'arweavekit/transaction'
import Arweave from 'arweave'

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

const fetchImage = async (id) => { 
    try {
      const txn = await getTransaction({
        transactionId: id, 
        environment: 'mainnet'
      });  
      const filename = await getImageName(id)
      const dataArray = txn.data
      const bindata = base64url.toBuffer(dataArray)
      const tarFilePath = './img/' + filename + '.tar'
      const writeStream = fs.createWriteStream(tarFilePath);
      writeStream.write(bindata);
      writeStream.end();
      writeStream.on('finish', () => {
        writeStream.close()
        console.log('Image pulled successfully.');
      });           
      writeStream.on('error', err => {
        console.log('Error creating tar file...', err)
      })
    } catch (e) { 
      console.error('Error downloading file: '+ e.message)
    }
  }


  const getImage = async (id) => { 
    try {

      const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      });

      const txn = await arweave.transactions.getData(id);  
      const filename = await getImageName(id)
      const dataArray = txn
      const bindata = base64url.toBuffer(dataArray)
      const tarFilePath = './img/' + filename + '.tar'
      const writeStream = fs.createWriteStream(tarFilePath);
      writeStream.write(bindata);
      writeStream.end();
      writeStream.on('finish', () => {
        writeStream.close()
        console.log('Image pulled successfully.');
      });           
      writeStream.on('error', err => {
        console.log('Error creating tar file...', err)
      })
    } catch (e) { 
      console.error('Error downloading file: '+ e.message)
    }
  }

  const args = process.argv.slice(2)
  if ( args.length === 0 ) {
      throw new Error('No arguments were supplied. Aborting...')
  } else {
      console.log('Pulling image:');
      for (const arg of args) {
          console.log('* ' + arg);
          getImage(arg)
      }
  }



    