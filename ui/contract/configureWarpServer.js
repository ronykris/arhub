import { WarpFactory } from "warp-contracts"
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import fs from 'fs'

const environment = process.env.WARPENV || 'testnet'
let warp

if (environment === 'testnet') { 
    warp = WarpFactory.forTestnet().use(new DeployPlugin());
} else {
    throw new Error('Env not set correctly...')
}

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
}

export {
    configurreWallet,
    warp
}