import { warp, configurreWallet } from "./configureWarpServer.js";
import { transactionId } from "./transactionid.js";

const read = async () => { 
    let wallet = await configurreWallet()
    const contract = warp.contract(transactionId).connect(wallet)
    const { cachedValue } = await contract.readState()
    console.log('Contract state: ' + JSON.stringify(cachedValue))
}

read()