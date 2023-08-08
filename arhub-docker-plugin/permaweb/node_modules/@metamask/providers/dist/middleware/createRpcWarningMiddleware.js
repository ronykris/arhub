"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRpcWarningMiddleware = void 0;
const constants_1 = require("../constants");
const messages_1 = __importDefault(require("../messages"));
/**
 * Create JSON-RPC middleware that logs warnings for deprecated RPC methods.
 *
 * @param log - The logging API to use.
 * @returns The JSON-RPC middleware.
 */
function createRpcWarningMiddleware(log) {
    const sentWarnings = {
        ethDecryptDeprecation: false,
        ethGetEncryptionPublicKeyDeprecation: false,
        walletWatchAssetNFTExperimental: false,
    };
    return (req, _res, next) => {
        if (!sentWarnings.ethDecryptDeprecation && req.method === 'eth_decrypt') {
            log.warn(messages_1.default.warnings.rpc.ethDecryptDeprecation);
            sentWarnings.ethDecryptDeprecation = true;
        }
        else if (!sentWarnings.ethGetEncryptionPublicKeyDeprecation &&
            req.method === 'eth_getEncryptionPublicKey') {
            log.warn(messages_1.default.warnings.rpc.ethGetEncryptionPublicKeyDeprecation);
            sentWarnings.ethGetEncryptionPublicKeyDeprecation = true;
        }
        else if (!sentWarnings.walletWatchAssetNFTExperimental &&
            req.method === 'wallet_watchAsset' &&
            [constants_1.ERC721, constants_1.ERC1155].includes(req.params?.type || '')) {
            log.warn(messages_1.default.warnings.rpc.walletWatchAssetNFTExperimental);
            sentWarnings.walletWatchAssetNFTExperimental = true;
        }
        next();
    };
}
exports.createRpcWarningMiddleware = createRpcWarningMiddleware;
//# sourceMappingURL=createRpcWarningMiddleware.js.map