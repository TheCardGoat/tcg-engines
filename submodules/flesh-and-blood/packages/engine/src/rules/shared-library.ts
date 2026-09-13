/**
 * CR shared-library mode (Yorick LSS004): merge starting decks and redirect
 * deck/graveyard zone access to a single host seat for the match.
 */
import { registerFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import type { FabMatchState, FabZoneKind } from "../state.ts";
import { nextRandom, type FabPrngState } from "../random.ts";

const SHARED_LIBRARY_ZONES = ["deck", "graveyard"] as const satisfies readonly FabZoneKind[];

export function isSharedLibraryZone(zone: string): boolean {
  return zone === "deck" || zone === "graveyard";
}

/**
 * Player id whose physical deck/graveyard lists hold the communal library.
 * When shared-library mode is inactive, returns the requesting player.
 */
export function libraryPlayerId(
  state: Pick<FabMatchState, "sharedLibraryHostId">,
  playerId: string,
  zone: string,
): string {
  if (state.sharedLibraryHostId && isSharedLibraryZone(zone)) {
    return state.sharedLibraryHostId;
  }
  return playerId;
}

/** True when any seated hero has meta `start-game.sharedLibrary`. */
export function heroSharesLibrary(hero: FabCardDefinitionInput | undefined): boolean {
  if (!hero) return false;
  return registerFabCardDefinition(hero).base.abilities.some((ability) => {
    if (ability.kind !== "static" || ability.staticKind !== "meta") return false;
    const effect = ability.effect as
      | { type?: string; sharedLibrary?: readonly string[] }
      | undefined;
    return (
      effect?.type === "start-game" &&
      Array.isArray(effect.sharedLibrary) &&
      effect.sharedLibrary.some((z) => z === "deck" || z === "graveyard")
    );
  });
}

/**
 * Merge every seat's deck (and empty graveyards) into `hostPlayerId`, shuffle the
 * combined deck, clear non-host libraries, and stamp `sharedLibraryHostId`.
 * Call after decks are seated and before opening-hand draws when possible.
 */
export function applySharedLibraryMerge(
  state: FabMatchState,
  hostPlayerId: string,
  rngState: FabPrngState,
): FabPrngState {
  const host = state.players[hostPlayerId];
  if (!host) return rngState;
  const hostZones = state.containers.zonesByPlayerId[hostPlayerId];
  if (!hostZones) return rngState;

  const combined: string[] = [];
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    combined.push(...zones.deck);
    // Non-host decks/GYs are emptied after merge; host receives all deck cards.
    if (playerId !== hostPlayerId) {
      zones.deck = [];
      // Move any pre-seeded GY cards into the shared GY (rare in fixtures).
      hostZones.graveyard.push(...zones.graveyard);
      zones.graveyard = [];
    }
  }
  hostZones.deck = combined;

  // Deterministic Fisher–Yates using the match PRNG (same stream as init shuffle).
  let rng = rngState;
  for (let i = hostZones.deck.length - 1; i > 0; i -= 1) {
    const roll = nextRandom(rng);
    rng = roll.state;
    const j = Math.floor(roll.value * (i + 1));
    const tmp = hostZones.deck[i]!;
    hostZones.deck[i] = hostZones.deck[j]!;
    hostZones.deck[j] = tmp;
  }

  state.sharedLibraryHostId = hostPlayerId;
  return rng;
}

export { SHARED_LIBRARY_ZONES };
