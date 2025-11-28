import { ProxyAgent } from 'undici';

/**
 * Creates fetch options with ProxyAgent if ZALO_PROXY_URL is defined.
 * This is used to bypass IP restrictions (e.g. Zalo requires Vietnam IP).
 */
export function getProxyOptions() {
  const proxyUrl = process.env.ZALO_PROXY_URL;

  if (proxyUrl) {
    console.log('🌐 Using Proxy:', proxyUrl.replace(/:[^:]*@/, ':***@')); // Log masked URL
    const dispatcher = new ProxyAgent(proxyUrl);
    return { dispatcher };
  }

  return {};
}
