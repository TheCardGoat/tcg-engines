export interface SimulatorExternalCommandGate {
  readonly setBlocked: (blocked: boolean) => void;
  readonly isBlocked: () => boolean;
  readonly subscribe: (listener: () => void) => () => void;
}

export function createSimulatorExternalCommandGate(): SimulatorExternalCommandGate {
  let blocked = false;
  const listeners = new Set<() => void>();
  return {
    setBlocked(next) {
      if (next === blocked) return;
      blocked = next;
      for (const listener of listeners) listener();
    },
    isBlocked: () => blocked,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const externalCommandGates = new WeakMap<object, SimulatorExternalCommandGate>();

/**
 * Returns the one shared animation command gate associated with an external
 * engine/runtime object. This lets React providers, command adapters, and bots
 * enforce the same gate without a game-owned playback registry.
 */
export function simulatorExternalCommandGateFor(owner: object): SimulatorExternalCommandGate {
  const existing = externalCommandGates.get(owner);
  if (existing) return existing;
  const gate = createSimulatorExternalCommandGate();
  externalCommandGates.set(owner, gate);
  return gate;
}
