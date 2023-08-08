import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import jwkToPem from 'jwk-to-pem';
import { KJUR } from 'jsrsasign';
import CryptoJS from 'crypto-js';
import {
    API_ID_JWT,
    DecodedJWT,
    InitializeJWKProps,
    InitializeJWKReturnProps,
    JWKBackupTxnProps,
    JWKBackupTxnReturnProps,
    LogInReturnProps,
    LogOutReturnProps,
    PingReturnProps,
    ReadContractReturnProps,
    SendTransactionArweaveProps,
    SendTransactionArweaveReturnProps,
    SendTransactionBundlrProps,
    SendTransactionBundlrReturnProps,
    SendTransactionWarpProps,
    SendTransactionWarpReturnProps,
    SignTransactionArweaveProps,
    SignTransactionArweaveReturnProps,
    SignTransactionBundlrProps,
    SignTransactionBundlrReturnProps,
    SignTransactionWarpProps,
    SignTransactionWarpReturnProps,
    UserDetailsReturnProps,
    getAPIIDReturnProps,
    readCustomContractProps,
    readCustomContractReturnProps,
    useOthentProps,
    useOthentReturnProps,
    verifyArweaveDataProps,
    verifyArweaveDataReturnProps,
    verifyBundlrDataProps,
    verifyBundlrDataReturnProps,
    CustomAuthParams,
    queryWalletAddressTxnsProps,
    queryWalletAddressTxnsReturnProps,
    UploadDataType,
    EncryptDataProps,
    EncryptDataReturnProps,
    DecryptDataProps,
    DecryptDataReturnProps,
    DeployWarpContractProps,
    DeployWarpContractReturnProps,
  } from "../types/index.js";




// sha256
async function sha256(message: string | BufferSource) {
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        typeof message != "string" ? message : new TextEncoder().encode(message)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}



// Othent
export async function Othent(params: useOthentProps): Promise<useOthentReturnProps> {
    const API_ID = params.API_ID;
    const callbackURL = window.location.href
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/use-othent',
        data: { API_ID, callbackURL }
    })
    .then((API_valid) => {
        if (API_valid.data.success === false) {
            throw new Error('Please specify an API ID (you can get one from Othent.io)');
        }


        // auth0
        const getAuth0Client = () => createAuth0Client({
            domain: "auth.othent.io",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
            authorizationParams: {
                redirect_uri: window.location.origin
            }
        });

        function getTokenSilently(auth0: Auth0Client, authParams: CustomAuthParams) {
            return auth0.getTokenSilently({
                detailedResponse: true,
                authorizationParams: authParams,
                cacheMode: 'off'
            })
        }


        // get API keys
        async function getAPIID(): Promise<getAPIIDReturnProps> {
            const auth0 = await getAuth0Client()
            const authParams = { transaction_input: JSON.stringify({ othentFunction: "API_ID" }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: API_ID_JWT = jwt_decode(JWT)
            if (decoded_JWT.contract_id) {
                return { API_ID: decoded_JWT.API_ID }
            } else {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
        }


        // process data
        async function processData(data: UploadDataType): Promise<Buffer> {
            let dataBuffer: Buffer;
            if (data instanceof File) {
                dataBuffer = await readFileData(data);
            } else if (typeof data === 'string') {
                dataBuffer = Buffer.from(data, 'utf8');
            } else if (Buffer.isBuffer(data)) {
                dataBuffer = data;
            } else if (data instanceof ArrayBuffer || data instanceof SharedArrayBuffer) {
                dataBuffer = Buffer.from(data);
            } else if (data instanceof Uint8Array) {
                dataBuffer = Buffer.from(data.buffer);
            } else {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            return dataBuffer
        }


        // query a wallet addresses transactions
        async function queryWalletAddressTxns(params: queryWalletAddressTxnsProps): Promise<queryWalletAddressTxnsReturnProps> {
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/query-wallet-address-txns',
                data: { walletAddress: params.walletAddress }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
        }




        // ping server
        async function ping(): Promise<PingReturnProps> {
            return await axios({
                method: 'GET',
                url: 'https://server.othent.io/',
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
        }



        // log in
        async function logIn(): Promise<LogInReturnProps> {
            const auth0 = await getAuth0Client();
            const isAuthenticated = await auth0.isAuthenticated();
            if (isAuthenticated) {
                return await userDetails() as UserDetailsReturnProps
            } else {
                const options = {
                    authorizationParams: {
                        transaction_input: JSON.stringify({
                            othentFunction: "idToken",
                        }),
                        redirect_uri: window.location.origin
                    }
                };
                let decoded_JWT: DecodedJWT| null = null;
                let JWT: string = "";
                try {
                    await auth0.loginWithPopup(options);
                    const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
                    const accessToken = await getTokenSilently(auth0, authParams)
                    JWT = accessToken.id_token;
                    decoded_JWT = jwt_decode(JWT)
                } catch (error) {
                    let errorMessage = "Error: Login required";
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    throw new Error('Your browser is blocking us! Please turn off your shields or allow cross site cookies! :)')
                }
                if (decoded_JWT && decoded_JWT.contract_id) { 
                    delete decoded_JWT.nonce
                    delete decoded_JWT.sid
                    delete decoded_JWT.aud
                    delete decoded_JWT.iss
                    delete decoded_JWT.iat
                    delete decoded_JWT.exp
                    delete decoded_JWT.updated_at
                    return decoded_JWT
                } else {
                    return await axios({
                        method: 'POST',
                        url: 'https://server.othent.io/create-user',
                        data: { JWT, API_ID }
                    })
                    .then(response => {
                        const new_user_details = response.data
                        return {
                            contract_id: new_user_details.contract_id,
                            given_name: new_user_details.given_name,
                            family_name: new_user_details.family_name,
                            nickname: new_user_details.nickname,
                            name: new_user_details.name,
                            picture: new_user_details.picture,
                            locale: new_user_details.locale,
                            email: new_user_details.email,
                            email_verified: new_user_details.email_verified,
                            sub: new_user_details.sub,
                            success: new_user_details.success,
                            message: new_user_details.message
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                        throw error;
                    });
                }
            }
        }



        // log out
        async function logOut(): Promise<LogOutReturnProps> {
            const auth0 = await getAuth0Client();
            await auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
            return { response: 'User logged out' }
        }




        async function userDetails(): Promise<UserDetailsReturnProps> {
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (decoded_JWT.contract_id) {
                delete decoded_JWT.nonce
                delete decoded_JWT.sid
                delete decoded_JWT.aud
                delete decoded_JWT.iss
                delete decoded_JWT.iat
                delete decoded_JWT.exp
                delete decoded_JWT.updated_at
                return decoded_JWT;
            } else {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
        }





        // read contract
        async function readContract(): Promise<ReadContractReturnProps> {
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token;
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/read-contract',
                data: { JWT }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }





        // sign transaction warp
        async function signTransactionWarp(params: SignTransactionWarpProps): Promise<SignTransactionWarpReturnProps> {
            params.tags ??= []
            const warpData = {
                function: params.othentFunction,
                data: {
                    toContractId: params.data.toContractId,
                    toContractFunction: params.data.toContractFunction,
                    txnData: params.data.txnData
                }
            }
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                warpData: warpData,
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{success: false, message:"Please create a Othent account"}`)
            }
            return { JWT: accessToken.id_token, tags: params.tags };

        }




        // send transaction - Warp
        async function sendTransactionWarp(params: SendTransactionWarpProps): Promise<SendTransactionWarpReturnProps> {
            const JWT = params.JWT
            const tags = params.tags
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/send-transaction',
                data: { JWT, tags, API_ID }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });

        }




        // sign functions (AR+Bndlr) readFileData
        async function readFileData(file: File): Promise<Buffer> {
            return new Promise<Buffer>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileData = reader.result as ArrayBuffer;
                    const buffer = Buffer.from(fileData);
                    resolve(buffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }



        // sign transaction arweave
        async function signTransactionArweave(params: SignTransactionArweaveProps): Promise<SignTransactionArweaveReturnProps> {
            params.tags ??= [];
            const dataBuffer = await processData(params.data)
            if (!dataBuffer) {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            const file_hash = await sha256(dataBuffer);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
            return { data: dataBuffer, JWT: accessToken.id_token, tags: params.tags };

        }




        // send transaction - Arweave
        async function sendTransactionArweave(params: SendTransactionArweaveProps): Promise<SendTransactionArweaveReturnProps> {
            const data = params.data;
            const blob = new Blob([data])
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('dataHashJWT', params.JWT);
            formData.append('API_ID', API_ID);
            formData.append('tags', JSON.stringify(params.tags));
            return await fetch('https://server.othent.io/upload-data-arweave', {
                method: 'POST',
                body: formData
                
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        }








        // sign transaction - bundlr
        async function signTransactionBundlr(params: SignTransactionBundlrProps): Promise<SignTransactionBundlrReturnProps> {
            params.tags ??= [];
            const dataBuffer = await processData(params.data)
            if (!dataBuffer) {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            const file_hash = await sha256(dataBuffer);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
            return { data: dataBuffer, JWT: accessToken.id_token, tags: params.tags };
        }



        // send transaction - bundlr
        async function sendTransactionBundlr(params: SendTransactionBundlrProps): Promise<SendTransactionBundlrReturnProps> {
            const data = params.data;
            const blob = new Blob([data]);
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("dataHashJWT", params.JWT);
            formData.append("API_ID", API_ID);
            formData.append("tags", JSON.stringify(params.tags));
            return await fetch("https://server.othent.io/upload-data-bundlr", {
                method: "POST",
                body: formData,
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
        }








        // backup keyfile
        async function initializeJWK(params: InitializeJWKProps): Promise<InitializeJWKReturnProps> {
            const privateKey = params.privateKey
            const key = JSON.stringify(privateKey)
            const key1 = JSON.parse(key)
            const JWK_public_key = null
            const JWK_public_key_PEM = jwkToPem(key1);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key_PEM, JWK_public_key } }
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const PEM_key_JWT = accessToken.id_token;
            return axios({
                method: 'POST',
                url: 'https://server.othent.io/initialize-JWK',
                data: { PEM_key_JWT, API_ID }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }
        



        // JWK backup transaction
        async function JWKBackupTxn(params: JWKBackupTxnProps): Promise<JWKBackupTxnReturnProps> {
            const payload = {
                iat: Math.floor(Date.now() / 1000),
                sub: params.sub,
                contract_id: params.contract_id,
                tags: params.tags,
                contract_input: {
                    data: params.data,
                    othentFunction: params.othentFunction
                }
            };
            const privateKey = params.privateKey
            const privatePem = jwkToPem(privateKey, { private: true });
            const header = { alg: 'RS256', typ: 'JWT', exp: Math.floor(Date.now() / 1000) + (60 * 60) };
            const JWK_signed_JWT = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privatePem);
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/JWK-backup-transaction',
                data: { JWK_signed_JWT, API_ID }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }



        // Read custom contract
        async function readCustomContract(params: readCustomContractProps): Promise<readCustomContractReturnProps> {
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/read-custom-contract',
                data: { contract_id: params.contract_id }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }






        async function verifyArweaveData(params: verifyArweaveDataProps): Promise<verifyArweaveDataReturnProps> {
            let getTagHash = await fetch(`https://arweave.net/tx/${params.transactionId}`, {
                headers: {
                    responseType: 'arraybuffer' 
                } 
            });
            let decodedVerifyJWT: any;
            const getTagHashJson = await getTagHash.json()
            getTagHashJson.tags.map((tag: { name: string, value: string }) => {
                if (atob(tag.name) === 'File-Hash-JWT') {
                    decodedVerifyJWT = jwt_decode(atob(tag.value))
                }
            });
            const tagHash = decodedVerifyJWT.file_hash;
            let axiosResponse: AxiosResponse<ArrayBuffer> = await axios.get(`https://arweave.net/${params.transactionId}`, { 
                responseType: 'arraybuffer'
            });
            let getOnChainData = axiosResponse.data;
            const onChainHash = await sha256(getOnChainData);
            if (tagHash === onChainHash) {
                return {
                    validData: true,
                    contract_id: decodedVerifyJWT.contract_id,
                    onChainHash: onChainHash,
                    tagHash: tagHash,
                    iat: decodedVerifyJWT.iat,
                    userId: decodedVerifyJWT.sub
                }
            } else {
                return {
                    validData: false,
                    onChainHash: onChainHash,
                    tagHash: tagHash
                }
            }
        }








        // Verify bundlr data
        async function verifyBundlrData(params: verifyBundlrDataProps): Promise<verifyBundlrDataReturnProps> {
            let getTagHash = await fetch(`https://gateway.bundlr.network/tx/${params.transactionId}`, {
                headers: {
                    responseType: 'arraybuffer' 
                } 
            });
            let decodedVerifyJWT: any;
            const getTagHashJson = await getTagHash.json()
            getTagHashJson.tags.map((tag: { name: string, value: string }) => {
                if (tag.name === 'File-Hash-JWT') {
                    decodedVerifyJWT = jwt_decode(tag.value);
                }
            });
            const tagHash = decodedVerifyJWT.file_hash;
            let axiosResponse: AxiosResponse<ArrayBuffer> = await axios.get(`https://arweave.net/${params.transactionId}`, { 
                responseType: 'arraybuffer'
            });
            let getOnChainData = axiosResponse.data;
            const onChainHash = await sha256(getOnChainData);
            if (tagHash === onChainHash) {
                return {
                    validData: true,
                    contract_id: decodedVerifyJWT.contract_id,
                    onChainHash: onChainHash,
                    tagHash: tagHash,
                    iat: decodedVerifyJWT.iat,
                    userId: decodedVerifyJWT.sub
                }
            } else {
                return {
                    validData: false,
                    onChainHash: onChainHash,
                    tagHash: tagHash
                }
            }
        }



        // encrypt data
        async function encryptData(params: EncryptDataProps): Promise<EncryptDataReturnProps> {
            const data = params.data;
            const key = params.key;
            const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
            return { encryptedData: encryptedData };
        }
        
        
        // decrypt data
        async function decryptData(params: DecryptDataProps): Promise<DecryptDataReturnProps> {
            const data = params.data;
            const key = params.key;
            const bytes = CryptoJS.AES.decrypt(data, key);
            const decryptedData = CryptoJS.enc.Utf8.stringify(bytes);
            return { decryptedData: decryptedData };
        }



        // Deploy a Warp contract
        async function deployWarpContract(params: DeployWarpContractProps): Promise<DeployWarpContractReturnProps> {
            params.tags ??= []
            const file_hash = await sha256(params.contractSrc);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: 'uploadData',
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/deploy-warp-contract',
                data: { 
                    contractSrc: params.contractSrc, 
                    contractState: params.state, 
                    JWT: JWT, 
                    tags: params.tags 
                }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }






        return {
            getAPIID,
            queryWalletAddressTxns,
            ping,
            logIn,
            logOut,
            userDetails,
            readContract,
            signTransactionWarp,
            sendTransactionWarp,
            signTransactionArweave,
            sendTransactionArweave,
            signTransactionBundlr,
            sendTransactionBundlr,
            initializeJWK,
            JWKBackupTxn,
            readCustomContract,
            verifyArweaveData,
            verifyBundlrData,
            encryptData,
            decryptData,
            deployWarpContract
        };
    })
    .catch((error) => {
        console.error('An error occurred:', error);
        throw error;
    });
}
export default { Othent };