import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId } from "./identity.ts";

export const GRAND_ARCHIVE_ZONES = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "field",
  "effects-stack",
  "intent",
  "pantheon",
  "inner-lineage",
  "loaded",
] as const satisfies readonly GrandArchiveZone[];

export const GRAND_ARCHIVE_PRIVATE_ZONES = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "pantheon",
] as const satisfies readonly GrandArchiveZone[];

export function createEmptyGrandArchiveZones(): Record<
  GrandArchiveZone,
  readonly GrandArchiveObjectId[]
> {
  return {
    "main-deck": [],
    "material-deck": [],
    hand: [],
    memory: [],
    graveyard: [],
    banishment: [],
    field: [],
    "effects-stack": [],
    intent: [],
    pantheon: [],
    "inner-lineage": [],
    loaded: [],
  };
}
