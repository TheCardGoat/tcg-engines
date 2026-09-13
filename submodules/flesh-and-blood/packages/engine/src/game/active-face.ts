import type { FabFaceId } from "@tcg/flesh-and-blood-types";
import type { FabRegisteredCardDefinition } from "../cards.ts";
import type { FabActiveFaceState } from "./objects.ts";

type PairedLayout = Extract<
  FabRegisteredCardDefinition["layout"],
  { readonly kind: "flip" | "twin" | "transcend" }
>;

export function initialFabActiveFace(
  definition: FabRegisteredCardDefinition,
  location: "inside" | "outside" = "outside",
): FabActiveFaceState {
  const layout = definition.layout;
  switch (layout.kind) {
    case "single":
    case "split":
      return { kind: "single" };
    case "flip":
    case "transcend":
      return paired(layout, [layout.front.faceId]);
    case "twin":
      return location === "inside"
        ? paired(layout, [layout.front.faceId])
        : paired(layout, [layout.front.faceId, layout.back.faceId]);
  }
}

/** Select a named twin face when an effect creates that token directly into the arena. */
export function initialFabActiveFaceForCreatedName(
  definition: FabRegisteredCardDefinition,
  name: string,
  location: "inside" | "outside" = "inside",
): FabActiveFaceState {
  if (definition.layout.kind !== "twin") return initialFabActiveFace(definition, location);
  const normalized = normalizeFaceName(name);
  const matches = [definition.layout.front, definition.layout.back].filter(
    (face) => normalizeFaceName(face.name) === normalized,
  );
  return matches.length === 1
    ? selectFabActiveFace(definition, matches[0]!.faceId)
    : initialFabActiveFace(definition, location);
}

/** CR 9.1 family-specific new-card reset. */
export function resetFabActiveFace(
  definition: FabRegisteredCardDefinition,
  previous: FabActiveFaceState,
  location: "inside" | "outside" = "outside",
): FabActiveFaceState {
  if (definition.layout.kind === "transcend" && isBackActive(definition.layout, previous)) {
    return paired(definition.layout, [definition.layout.back.faceId]);
  }
  return initialFabActiveFace(definition, location);
}

export function fabActiveFaceLocationForZone(zone: string): "inside" | "outside" {
  return zone === "stack" ||
    zone === "arena" ||
    zone === "combatChain" ||
    zone === "equipment" ||
    zone === "heroZone"
    ? "inside"
    : "outside";
}

export function selectFabActiveFace(
  definition: FabRegisteredCardDefinition,
  faceId: FabFaceId,
): FabActiveFaceState {
  const layout = requirePairedLayout(definition);
  if (faceId !== layout.front.faceId && faceId !== layout.back.faceId) {
    throw new Error(`FAB face ${faceId} does not belong to ${definition.canonicalId}.`);
  }
  return paired(layout, [faceId]);
}

export function assertValidFabActiveFace(
  definition: FabRegisteredCardDefinition,
  state: FabActiveFaceState,
): void {
  const layout = definition.layout;
  if (layout.kind === "single" || layout.kind === "split") {
    if (state.kind !== "single") {
      throw new Error(`FAB non-paired card ${definition.canonicalId} has paired face state.`);
    }
    return;
  }
  if (state.kind !== "paired" || state.family !== layout.kind) {
    throw new Error(`FAB ${layout.kind} card ${definition.canonicalId} has invalid face family.`);
  }
  const allowed = new Set([layout.front.faceId, layout.back.faceId]);
  if (
    state.activeFaceIds.length === 0 ||
    new Set(state.activeFaceIds).size !== state.activeFaceIds.length ||
    !state.activeFaceIds.every((id) => allowed.has(id)) ||
    (layout.kind !== "twin" && state.activeFaceIds.length !== 1)
  ) {
    throw new Error(`FAB ${layout.kind} card ${definition.canonicalId} has invalid active faces.`);
  }
}

function requirePairedLayout(definition: FabRegisteredCardDefinition): PairedLayout {
  const layout = definition.layout;
  if (layout.kind === "single" || layout.kind === "split") {
    throw new Error(`FAB card ${definition.canonicalId} does not have paired faces.`);
  }
  return layout;
}

function paired(
  layout: PairedLayout,
  activeFaceIds: readonly [FabFaceId, ...FabFaceId[]],
): FabActiveFaceState {
  return { kind: "paired", family: layout.kind, activeFaceIds };
}

function isBackActive(layout: PairedLayout, state: FabActiveFaceState): boolean {
  return state.kind === "paired" && state.activeFaceIds.includes(layout.back.faceId);
}

function normalizeFaceName(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
