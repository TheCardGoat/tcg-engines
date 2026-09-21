export const GATEWAY_PACKET_LOG_STORAGE_KEY = "tcg:gateway-packet-log";

/**
 * Packet logging is on when the localStorage flag is "1", off when it is "0",
 * and otherwise defaults to ON on staging hosts so QA sees every gateway
 * packet (both directions) without manual setup.
 */
export function isGatewayPacketLoggingEnabled(): boolean {
  try {
    const flag = globalThis.localStorage?.getItem(GATEWAY_PACKET_LOG_STORAGE_KEY);
    if (flag === "1") return true;
    if (flag === "0") return false;
    return isStagingHost();
  } catch {
    return false;
  }
}

export function isStagingHost(): boolean {
  try {
    const hostname = globalThis.location?.hostname ?? "";
    return hostname === "staging.cardgoat.org" || hostname.startsWith("staging.");
  } catch {
    return false;
  }
}
