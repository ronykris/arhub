import Bundlr from "@bundlr-network/client";
import path from "path";
import { configurreWallet, warp } from './configureWarpServer.js'

    let key = await configurreWallet()

    const bundlr = new Bundlr("http://node1.bundlr.network", "arweave", key);
 
    const amountToFund = 1;
    const fundAmountAtomic = bundlr.utils.toAtomic(amountToFund);
    const fundTx = await bundlr.fund(fundAmountAtomic);

    const fileToUpload = "./hello-world.tar"; 

    const tags = [
        { name: "filename", value: `arhub/${path.parse(fileToUpload).name}` },
        { name: "type", value: "cimage"},
    ];

 
//const privateKey = JSON.parse(fs.readFileSync("walletFile.txt").toString());
 
try {    
	const response = await bundlr.uploadFile(fileToUpload, tags);
	console.log(`File uploaded ==> https://arweave.net/${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}