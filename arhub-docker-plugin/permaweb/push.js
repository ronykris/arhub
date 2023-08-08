import Arweave from 'arweave'
import fs from 'fs'
import { configurreWallet, warp } from './configureWarpServer.js'
import path from "path";
import process from 'process'

const upload = async(file) => {

    let key = await configurreWallet()

    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
    });

    try {
        //const fileToUpload = "./hello-world.tar"; 
        const fileToUpload = file; 
        const fileBuffer = fs.readFileSync(fileToUpload)

        const arweaveWallet = await arweave.wallets.jwkToAddress(key)
        const arweaveWalletBalance = await arweave.wallets.getBalance(arweaveWallet);
        console.log(arweaveWalletBalance)

        const transaction = await arweave.createTransaction({
            data: fileBuffer,
            key
        })
        transaction.addTag( "filename", `${path.parse(fileToUpload).name}`)
        transaction.addTag( "type", "arhubcimg")
        transaction.addTag( "Content-Type", "application/x-tar")
        await arweave.transactions.sign(transaction, key)
        const response = await arweave.transactions.post(transaction)
        console.log(response)
        const status = await arweave.transactions.getStatus(transaction.id)

        console.log(`Txn ${transaction.id} completed with status ${status}`)
        let uri = `https://www.arweave.net/${transaction.id}`
        console.log(`uri: https://www.arweave.net/${transaction.id}`)
        return uri
    } catch (e) {
        console.error('Error uploading file: ' + e.message)
    }
    
}

const args = process.argv.slice(2)
if ( args.length === 0 ) {
    throw new Error('No arguments were specified. Aborting...')
} else {
    console.log('Pushing image:');
    for (const arg of args) {
        console.log('* ' + arg);
        upload(arg)
    }
}
