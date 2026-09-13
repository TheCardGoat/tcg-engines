import type { Card } from "@tcg/gundam-types";
import { exbExBase001 } from "./ex-base.ts";
import { exrExResource001 } from "./ex-resource.ts";

export const GUNDAM_HOST_SETUP_SLOT_EX_BASE = "ex-base";
export const GUNDAM_HOST_SETUP_SLOT_EX_RESOURCE = "ex-resource";

/**
 * Default setup-token definitions for hosts that do not choose Atelier art.
 *
 * The defaults are the normal booster-pack tokens (`EXB-001` / `EXR-001`),
 * matching the platform setup-slot defaults in
 * `platform/.../gundam-alt-art-adapter.ts`. Hosts that resolve a profile's
 * Atelier selection inject per-player definitions instead.
 */
export function defaultGundamSetupCards(
  playerIds: readonly string[],
): Record<string, Record<string, Card>> {
  return Object.fromEntries(
    playerIds.map((playerId) => [
      playerId,
      {
        [GUNDAM_HOST_SETUP_SLOT_EX_BASE]: exbExBase001,
        [GUNDAM_HOST_SETUP_SLOT_EX_RESOURCE]: exrExResource001,
      },
    ]),
  );
}
