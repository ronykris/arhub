import { warp, configurreWallet } from "./configureWarpServer.js";
import { transactionid } from "./transactionid.js";
import { v4 as uuid } from 'uuid'

const createImage = async (tag, name, visibility = 'true' ) => { 
    let wallet = await configurreWallet()
    const contract = warp.contract(transactionid).connect(wallet)

    await contract.writeInteraction({
        function: 'createImage',
        image: {
            id: uuid(), 
            tag: tag, 
            name: name,             
            visibility: visibility
        }
    })
}

createImage()