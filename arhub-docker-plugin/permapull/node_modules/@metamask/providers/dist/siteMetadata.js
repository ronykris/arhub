"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSiteMetadata = void 0;
const messages_1 = __importDefault(require("./messages"));
const utils_1 = require("./utils");
/**
 * Sends site metadata over an RPC request.
 *
 * @param engine - The JSON RPC Engine to send metadata over.
 * @param log - The logging API to use.
 */
async function sendSiteMetadata(engine, log) {
    try {
        const domainMetadata = await getSiteMetadata();
        // call engine.handle directly to avoid normal RPC request handling
        engine.handle({
            jsonrpc: '2.0',
            id: 1,
            method: 'metamask_sendDomainMetadata',
            params: domainMetadata,
        }, utils_1.NOOP);
    }
    catch (error) {
        log.error({
            message: messages_1.default.errors.sendSiteMetadata(),
            originalError: error,
        });
    }
}
exports.sendSiteMetadata = sendSiteMetadata;
/**
 * Get site metadata.
 *
 * @returns The site metadata.
 */
async function getSiteMetadata() {
    return {
        name: getSiteName(window),
        icon: await getSiteIcon(window),
    };
}
/**
 * Extract a name for the site from the DOM.
 *
 * @param windowObject - The window object to extract the site name from.
 * @returns The site name.
 */
function getSiteName(windowObject) {
    const { document } = windowObject;
    const siteName = document.querySelector('head > meta[property="og:site_name"]');
    if (siteName) {
        return siteName.content;
    }
    const metaTitle = document.querySelector('head > meta[name="title"]');
    if (metaTitle) {
        return metaTitle.content;
    }
    if (document.title && document.title.length > 0) {
        return document.title;
    }
    return window.location.hostname;
}
/**
 * Extract an icon for the site from the DOM.
 *
 * @param windowObject - The window object to extract the site icon from.
 * @returns An icon URL, if one exists.
 */
async function getSiteIcon(windowObject) {
    const { document } = windowObject;
    const icons = document.querySelectorAll('head > link[rel~="icon"]');
    for (const icon of Array.from(icons)) {
        if (icon && (await imgExists(icon.href))) {
            return icon.href;
        }
    }
    return null;
}
/**
 * Return whether the given image URL exists.
 *
 * @param url - The url of the image.
 * @returns Whether the image exists.
 */
async function imgExists(url) {
    return new Promise((resolve, reject) => {
        try {
            const img = document.createElement('img');
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        }
        catch (error) {
            reject(error);
        }
    });
}
//# sourceMappingURL=siteMetadata.js.map