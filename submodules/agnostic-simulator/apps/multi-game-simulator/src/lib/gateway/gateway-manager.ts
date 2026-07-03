import { createGatewayConnectionManager, type GatewayConnectionManager } from "@tcg/gateway-client";
import { normalizeOrigin } from "@tcg/simulator-runtime/gateway";
import type { RuntimeApiEnv } from "../../runtime/gameRuntimeApi";

/**
 * Module-level singleton: the ONE source of truth for gateway sockets in the
 * app. The root `clientLoader` acquires the namespace for presence; LiveMatch
 * acquires the SAME namespace (ref-count → 2) for the match. Repeated acquires
 * of a slug reuse one underlying socket — see `@tcg/gateway-client`.
 *
 * The manager owns the wire contract, single-use ticket clearing, reconnect
 * backoff, and ref-counting. The app owns origin resolution and credential
 * acquisition (SSR ticket + JWT).
 */
let manager: GatewayConnectionManager | null = null;

function resolveGatewayOrigin(): string {
  const env = import.meta.env as RuntimeApiEnv;
  const explicit = env.VITE_GAME_SERVER_WS_URL ?? env.VITE_GATEWAY_WS_URL;
  // The manager appends `/${slug}` internally, so hand it the bare origin.
  return normalizeOrigin(explicit ?? "wss://gateway.tcg.online");
}

export function getGatewayManager(): GatewayConnectionManager {
  if (!manager) {
    manager = createGatewayConnectionManager({
      gatewayOrigin: resolveGatewayOrigin(),
      // The library owns the latency ping loop. 5s matches the simulator's
      // live-match latency cadence; samples surface via `handle.onLatency`
      // and `state.latencyMs`.
      ping: { intervalMs: 5_000 },
    });
  }
  return manager;
}

/**
 * Reset the singleton (tests only). Tears down any live sockets so a fresh
 * manager is constructed on the next `getGatewayManager()` call.
 */
export function resetGatewayManagerForTests(): void {
  manager?.destroy();
  manager = null;
}
