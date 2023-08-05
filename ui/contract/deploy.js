import fs from 'fs'
import { configurreWallet, warp } from './configureWarpServer.js'

const deploy = async () => {
    const wallet = configurreWallet()
    const state = fs.readFileSync('state.json', 'utf8')
    const contractSrc = fs.readFileSync('contract.js', 'utf8')

    const { contractTxId } = await warp.createContract.deploy({
        wallet,
        initState: state,
        src: contractSrc,
    })

    fs.writeFileSync('../transactionid.js', `export const transactionid = ${contractTxId}`)
    const contract = warp.contract(contractTxId).connect(wallet)

    await contract.writeInteraction({
        function: 'init'
    })

    const { cachedValue } = await contract.readState()
    console.log('Contract state:', cachedValue)
    console.log('ContractTxId:', contractTxId)
}

deploy()