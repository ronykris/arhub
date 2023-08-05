import { warp, configurreWallet } from "./configureWarpServer.js";
import { transactionId } from "./transactionid.js";
import { v4 as uuid } from 'uuid'

const createImage = async (tag, name, visibility = 'true' ) => { 
    let wallet = await configurreWallet()
    const contract = warp.contract(transactionId).connect(wallet)

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