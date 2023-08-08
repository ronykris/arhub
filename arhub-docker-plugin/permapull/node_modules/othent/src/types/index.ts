

// useOthent
export interface useOthentProps {
    API_ID: string
}
export interface useOthentReturnProps {
    getAPIID(): Promise<getAPIIDReturnProps>,
    queryWalletAddressTxns(params: queryWalletAddressTxnsProps): Promise<queryWalletAddressTxnsReturnProps>,
    ping(): Promise<PingReturnProps>,
    logIn(): Promise<LogInReturnProps>,
    logOut(): Promise<LogOutReturnProps>,
    userDetails(): Promise<UserDetailsReturnProps>,
    readContract(): Promise<ReadContractReturnProps>,
    signTransactionWarp(params: SignTransactionWarpProps): Promise<SignTransactionWarpReturnProps>,
    sendTransactionWarp(params: SendTransactionWarpProps): Promise<SendTransactionWarpReturnProps>,
    signTransactionArweave(params: SignTransactionArweaveProps): Promise<SignTransactionArweaveReturnProps>,
    sendTransactionArweave(params: SendTransactionArweaveProps): Promise<SendTransactionArweaveReturnProps>,
    signTransactionBundlr(params: SignTransactionBundlrProps): Promise<SignTransactionBundlrReturnProps>,
    sendTransactionBundlr(params: SendTransactionBundlrProps): Promise<SendTransactionBundlrReturnProps>,
    initializeJWK(params: InitializeJWKProps): Promise<InitializeJWKReturnProps>,
    JWKBackupTxn(params: JWKBackupTxnProps): Promise<JWKBackupTxnReturnProps>,
    readCustomContract(params: readCustomContractProps): Promise<readCustomContractReturnProps>,
    verifyArweaveData(params: verifyArweaveDataProps): Promise<verifyArweaveDataReturnProps>,
    verifyBundlrData(params: verifyBundlrDataProps): Promise<verifyBundlrDataReturnProps>,
}



// auth0
export interface CustomAuthParams {
    [key: string]: any;
}
  




// universal
export interface DecodedJWT {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    updated_at?: string,
    email: string,
    email_verified: string,
    iss?: string,
    aud?: string,
    iat?: number,
    exp?: number,
    sub: string,
    sid?: string,
    nonce?: string
}



// get API keys
export interface getAPIIDReturnProps {
    API_ID: string
}
export interface API_ID_JWT {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    updated_at?: string,
    email: string,
    email_verified: string,
    iss: string,
    aud: string,
    iat: number,
    exp: number,
    sub: string,
    sid: string,
    nonce: string
    API_ID: string
}



// query a wallet addresses transactions
export interface queryWalletAddressTxnsProps {
    walletAddress: string
}
export interface queryWalletAddressTxnsReturnProps {
    success: boolean,
    transactions: []
}



// ping
export interface PingReturnProps {
    response: boolean;
}





// logIn
export interface LogInReturnProps {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    email: string,
    email_verified: string,
    sub: string,
    success?: string,
    message?: string
}



// log out
export interface LogOutReturnProps {
    response: string
}


// user details
export interface UserDetailsReturnProps {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    email: string,
    email_verified: string,
    sub: string,
}



// read contract
export interface ReadContractReturnProps {
    state: object, 
    errors: object, 
    validity: object
}




// sign transaction Warp
export interface SignTransactionWarpProps {
    othentFunction: string,
    data: {
        toContractId: string,
        toContractFunction: string,
        txnData: object
    }
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SignTransactionWarpReturnProps {
    JWT: string, 
    tags?: {
        name: string;
        value: string;
    }[]
}
// send transaction - Warp
export interface SendTransactionWarpProps {
    JWT: string,
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SendTransactionWarpReturnProps {
    success: boolean,
    transactionId: string,
    bundlrId: string,
    errors: object,
    state: object
}


export type UploadDataType = string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File;


// sign transaction Arweave
export interface SignTransactionArweaveProps {
    othentFunction: string,
    data: UploadDataType;
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SignTransactionArweaveReturnProps {
    data: Buffer, 
    JWT: string
    tags?: {
        name: string;
        value: string;
    }[]
}
// send transaction - Arweave
export interface SendTransactionArweaveProps {
    data: Buffer, 
    JWT: string,
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SendTransactionArweaveReturnProps {
    success: boolean,
    transactionId: string,
}



// sign transaction - bundlr
export interface SignTransactionBundlrProps {
    othentFunction: string;
    data: UploadDataType;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  export interface SignTransactionBundlrReturnProps {
    data: Buffer;
    JWT: string;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  // send transaction - bundlr
  export interface SendTransactionBundlrProps {
    data: Buffer;
    JWT: string;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  export interface SendTransactionBundlrReturnProps {
    success: boolean;
    transactionId: string;
  }



// backup keyfile
export interface InitializeJWKProps {
    privateKey: object
}
export interface InitializeJWKReturnProps {
    success: boolean,
    transactionId: string,
}



// JWK transaction
export interface JWKBackupTxnProps {
    privateKey: {
        kty: "RSA";
        e: string;
        n: string;
        d?: string | undefined;
        p?: string | undefined;
        q?: string | undefined;
        dp?: string | undefined;
        dq?: string | undefined;
        qi?: string | undefined;
    },
    sub: string,
    contract_id: string,
    tags?: { name: string, value: string }[],
    data: object,
    othentFunction: string
}
export interface JWKBackupTxnReturnProps {
    validity: boolean,
    transactionId: string,
}



// Read custom contract
export interface readCustomContractProps {
    contract_id: string
}
export interface readCustomContractReturnProps {
    state: object, 
    errors: object, 
    validity: object
}




// Verify arweave data
export interface verifyArweaveDataProps {
    transactionId: string
}
export interface verifyArweaveDataReturnProps {
    validData: boolean,
    onChainHash: string,
    tagHash: string,
    contract_id?: string,
    iat?: number,
    userId?: string,
}



// Verify bundlr data
export interface verifyBundlrDataProps {
    transactionId: string
}
export interface verifyBundlrDataReturnProps {
    validData: boolean,
    onChainHash: string,
    tagHash: string,
    contract_id?: string,
    iat?: number,
    userId?: string,
}



// Encrypt data
export interface EncryptDataProps {
    data: string,
    key: string
}
export interface EncryptDataReturnProps {
    encryptedData: string
}


// Decrypted data
export interface DecryptDataProps {
    data: string,
    key: string
}
export interface DecryptDataReturnProps {
    decryptedData: string
}



// Verify bundlr data
export interface DeployWarpContractProps {
    contractSrc: string, 
    state: object, 
    tags?: { name: string, value: string }[] 
}
export interface DeployWarpContractReturnProps {
    contractTxId: string;
    srcTxId?: string;
}








