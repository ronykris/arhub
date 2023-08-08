"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExternalExtensionProvider = void 0;
const detect_browser_1 = require("detect-browser");
const extension_port_stream_1 = __importDefault(require("extension-port-stream"));
const external_extension_config_json_1 = __importDefault(require("./external-extension-config.json"));
const MetaMaskInpageProvider_1 = require("../MetaMaskInpageProvider");
const StreamProvider_1 = require("../StreamProvider");
const utils_1 = require("../utils");
const browser = (0, detect_browser_1.detect)();
/**
 * Creates an external extension provider for the given extension type or ID.
 *
 * @param typeOrId - The extension type or ID.
 * @returns The external extension provider.
 */
function createExternalExtensionProvider(typeOrId = 'stable') {
    let provider;
    try {
        const extensionId = getExtensionId(typeOrId);
        const metamaskPort = chrome.runtime.connect(extensionId);
        const pluginStream = new extension_port_stream_1.default(metamaskPort);
        provider = new StreamProvider_1.StreamProvider(pluginStream, {
            jsonRpcStreamName: MetaMaskInpageProvider_1.MetaMaskInpageProviderStreamName,
            logger: console,
            rpcMiddleware: (0, utils_1.getDefaultExternalMiddleware)(console),
        });
        // This is asynchronous but merely logs an error and does not throw upon
        // failure. Previously this just happened as a side-effect in the
        // constructor.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        provider.initialize();
    }
    catch (error) {
        console.dir(`MetaMask connect error.`, error);
        throw error;
    }
    return provider;
}
exports.createExternalExtensionProvider = createExternalExtensionProvider;
/**
 * Gets the extension ID for the given extension type or ID.
 *
 * @param typeOrId - The extension type or ID.
 * @returns The extension ID.
 */
function getExtensionId(typeOrId) {
    const ids = browser?.name === 'firefox' ? external_extension_config_json_1.default.firefoxIds : external_extension_config_json_1.default.chromeIds;
    return ids[typeOrId] ?? typeOrId;
}
//# sourceMappingURL=createExternalExtensionProvider.js.map