import Arweave from 'arweave'
import fs from 'fs'
import { configurreWallet, warp } from './configureWarpServer.js'
import path from "path";

let key = await configurreWallet()

const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
/*
const tags = [
    { name: "filename", value: `arhub/${path.parse(fileToUpload).name}` },
    { name: "type", value: "cimage"},
]*/

const fileToUpload = "./hello-world.tar"; 
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
console.log(`uri: https://www.arweave.net/${transaction.id}`)
