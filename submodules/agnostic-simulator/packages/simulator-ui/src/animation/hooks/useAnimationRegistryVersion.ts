import { useCallback, useSyncExternalStore } from "react";

import type { AnimationNodeRegistry } from "../lib/node-registry";

export function useAnimationRegistryVersion(registry: AnimationNodeRegistry): number {
  const subscribe = useCallback((listener: () => void) => registry.subscribe(listener), [registry]);
  const getSnapshot = useCallback(() => registry.getVersion(), [registry]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
