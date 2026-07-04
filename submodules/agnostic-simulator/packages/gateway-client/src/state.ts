import type { GatewayConnectionState } from "./types.js";

export const INITIAL_GATEWAY_STATE: GatewayConnectionState = {
  status: "idle",
  authenticated: false,
  authMethod: null,
  connectionId: null,
  latencyMs: null,
  reconnectAttempt: 0,
  error: null,
  authStatus: "ok",
};

export interface StateStore {
  get(): GatewayConnectionState;
  set(patch: Partial<GatewayConnectionState>): void;
  subscribe(cb: (state: GatewayConnectionState) => void): () => void;
}

/**
 * Minimal per-namespace state store. Not reactive-framework-specific — callers
 * poll via {@link GatewayHandle.getState} or subscribe through
 * {@link GatewayHandle.subscribeState}. `subscribe` fires once immediately with
 * the current snapshot and on every subsequent change.
 */
export function createStateStore(): StateStore {
  let current: GatewayConnectionState = { ...INITIAL_GATEWAY_STATE };
  const subscribers = new Set<(state: GatewayConnectionState) => void>();

  return {
    get: () => current,
    set: (patch) => {
      current = { ...current, ...patch };
      for (const cb of subscribers) cb(current);
    },
    subscribe: (cb) => {
      subscribers.add(cb);
      cb(current);
      return () => {
        subscribers.delete(cb);
      };
    },
  };
}
