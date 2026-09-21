import { useEffect } from "react";
import type { FabPresentationDefinition, FabPresentationLoadResult } from "./cardArt";
import { useFabPresentationRegistry, useFabPresentationSnapshot } from "./FabPresentationCatalog";
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
  const snapshot = useFabPresentationSnapshot();
  useEffect(() => {
    void registry.ensure(definitions);
  }, [registry, definitions, requestKey]);
  const missingIds = definitions
    .filter(
      (definition) =>
        !registry.getRecords().records[definition.canonicalId] &&
        !registry.getRecords().aliases[definition.canonicalId],
    )
    .map((definition) => definition.canonicalId);
  if (snapshot.status === "error") {
    return {
      kind: "error",
      message: snapshot.error ?? "Card images could not be loaded.",
    };
  }
  const unavailable = new Set(snapshot.unavailableCanonicalIds);
  if (
    snapshot.status === "loading" ||
    missingIds.some((canonicalId) => !unavailable.has(canonicalId))
  ) {
    return { kind: "loading" };
  }
  return {
    kind: "ready",
    result: {
      missingIds,
      loadedShardCount: 0,
    },
  };
}
