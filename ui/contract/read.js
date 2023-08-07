import { warp, configurreWallet } from "./configureWarpServer.js";
import { transactionid } from "./transactionid.js";

const read = async () => { 
    console.log(transactionid)
    let wallet = await configurreWallet()
    const contract = warp.contract(transactionid).connect(wallet)
    const { cachedValue } = await contract.readState()
    console.log('Contract state: ' + JSON.stringify(cachedValue))
}

read()