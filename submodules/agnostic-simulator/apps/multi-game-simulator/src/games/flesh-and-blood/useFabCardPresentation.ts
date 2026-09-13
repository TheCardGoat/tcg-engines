import { useEffect, useSyncExternalStore } from "react";
import type { FabPresentationDefinition, FabPresentationLoadResult } from "./cardArt";
import { useFabPresentationRegistry } from "./FabPresentationCatalog";
export type FabPresentationLoadState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly result: FabPresentationLoadResult }
  | { readonly kind: "error"; readonly message: string };

/** Missing presentation never gates a usable engine state. */
export function useFabCardPresentation(
  definitions: readonly FabPresentationDefinition[],
  requestKey: string | number,
): FabPresentationLoadState {
  const registry = useFabPresentationRegistry();
  useSyncExternalStore(registry.subscribe, registry.getSnapshot, registry.getSnapshot);
  useEffect(() => {
    void registry.ensure(definitions);
  }, [registry, definitions, requestKey]);
  return {
    kind: "ready",
    result: {
      missingIds: definitions
        .filter(
          (definition) =>
            !registry.getRecords().records[definition.canonicalId] &&
            !registry.getRecords().aliases[definition.canonicalId],
        )
        .map((definition) => definition.canonicalId),
      loadedShardCount: 0,
    },
  };
}
