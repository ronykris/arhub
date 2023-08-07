import fs from 'fs'
import { ArweaveSigner } from 'warp-contracts-plugin-deploy'
import { configurreWallet, warp } from './configureWarpServer.js'

const deploy = async () => {
    const wallet = await configurreWallet()
    const state = fs.readFileSync('state.json', 'utf8')
    const contractSrc = fs.readFileSync('contract.js', 'utf8')
    let contractTxID;
    try {
        const { contractTxId, srcTxId } = await warp.deploy({
            wallet: new ArweaveSigner(wallet),
            initState: JSON.stringify(state),
            src: contractSrc,
        })
        console.log(contractTxId)
        contractTxID = contractTxId        
    } catch (err) { 
        console.error('Error deploying contract: ' + err.message)
    }
    
    fs.writeFileSync('./transactionid.js', `export const transactionid = "${contractTxID}"`)
    const contract = warp.contract(contractTxID).connect(wallet)
    

    await contract.writeInteraction({
        function: 'init'
    })

    const { cachedValue } = await contract.readState()
    console.log('Contract state:', cachedValue)
    console.log('ContractTxId:', contractTxID)
}

deploy()