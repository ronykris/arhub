import { WarpFactory } from "warp-contracts"
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import fs from 'fs'
import Arweave from "arweave";

const environment = process.env.WARPENV || 'testnet'
let warp
const arweave = Arweave.init({});

if (environment === 'testnet') { 
    warp = WarpFactory.forTestnet().use(new DeployPlugin());
} else {
    throw new Error('Env not set correctly...')
}
/*
const configurreWallet = async () => { 
    try {
        if (environment === 'testnet') {
            try {
                return JSON.parse(fs.readFileSync('./testwallet.json', 'utf8'))
            } catch (e) { 
                const { jwk } = await warp.generateWallet()
                fs.writeFileSync('./testwallet.json', JSON.stringify(jwk))
                return jwk
            }
        } 

    } catch (e) {
        console.error('Error configuring wallet: ' + e.message)
    }
}*/

const configurreWallet = async () => { 
    try { 
        if (environment === 'testnet') {
            try {
                return JSON.parse(fs.readFileSync('./testwallet.json', 'utf8'))                
            } catch (e) { 
                const key = await arweave.wallets.generate()                    
                console.log(key)
                fs.writeFileSync('./testwallet.json', JSON.stringify(key))
                return key                
            }
        }
    } 
                /*const { jwk } = await warp.generateWallet()
                fs.writeFileSync('./testwallet.json', JSON.stringify(jwk))
                return jwk*/
    catch (e) {
            console.error('Error configuring wallet: ' + e.message)

    } 
}


export {
    configurreWallet,
    warp
}