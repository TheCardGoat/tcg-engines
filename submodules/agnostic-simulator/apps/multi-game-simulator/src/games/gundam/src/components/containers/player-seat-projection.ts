import { useMemo } from "react";

import type { BoardProjection } from "../../game/index.ts";
import type { GameCardData, PlayerInfo } from "../ui/types.ts";
import { countActiveResources, mapZone, toGameCardData, zoneCount } from "./mappers.ts";

export interface PlayerSeatProjection {
  readonly player: PlayerInfo;
  readonly play: readonly GameCardData[];
  readonly resourceArea: readonly GameCardData[];
  readonly base: readonly GameCardData[];
  readonly shields: readonly GameCardData[];
  readonly discard: readonly GameCardData[];
  readonly removalArea: readonly GameCardData[];
  readonly availableResources: number;
  readonly handCount: number;
}

interface GundamGLike {
  readonly pilotAssignments?: Readonly<Record<string, string>>;
}

/**
 * Project the authoritative game view into the stable data consumed by one
 * player seat. Interaction-only state such as selection and targeting stays
 * outside this projection so it can update without rebuilding every card.
 */
export function projectPlayerSeat(view: BoardProjection, playerId: string): PlayerSeatProjection {
  // Fold paired pilots into their host unit so the play zone renders one
  // visual slot per fielded mech (with the pilot peeking out below it),
  // matching the official Gundam digital UI. Standalone pilot entries are
  // filtered out of `play` — they live on the unit's `pairedPilot` field.
  const rawPlay = mapZone(view, "battleArea", playerId).map((card) => toGameCardData(view, card));
  const pilotAssignments = (view.G as GundamGLike).pilotAssignments ?? {};
  const pairedPilotIds = new Set(Object.values(pilotAssignments));
  const playIndex = new Map(rawPlay.map((card) => [card.id ?? "", card]));
  const play = rawPlay
    .filter((card) => !(card.id && pairedPilotIds.has(card.id)))
    .map((card) => {
      const pilotId = card.id ? pilotAssignments[card.id] : undefined;
      const pairedPilot = pilotId ? playIndex.get(pilotId) : undefined;
      return pairedPilot ? { ...card, pairedPilot } : card;
    });

  return {
    player: {
      name: playerId,
      clock: "\u2014",
      colors: [],
      deck: zoneCount(view, "deck", playerId),
      resourceDeck: zoneCount(view, "resourceDeck", playerId),
      discard: zoneCount(view, "trash", playerId),
      shields: zoneCount(view, "shieldArea", playerId),
    },
    play,
    resourceArea: mapZone(view, "resourceArea", playerId).map((card) => toGameCardData(view, card)),
    base: mapZone(view, "baseSection", playerId).map((card) => toGameCardData(view, card)),
    shields: mapZone(view, "shieldArea", playerId).map((card) => toGameCardData(view, card)),
    discard: mapZone(view, "trash", playerId).map((card) => toGameCardData(view, card)),
    removalArea: mapZone(view, "removalArea", playerId).map((card) => toGameCardData(view, card)),
    availableResources: countActiveResources(view, playerId),
    handCount: zoneCount(view, "hand", playerId),
  };
}

/**
 * Preserve card and zone references until the presentation view itself
 * changes. Clock, drag, and pending-interaction renders can then reuse the
 * authoritative seat projection.
 */
export function usePlayerSeatProjection(
  view: BoardProjection,
  playerId: string,
): PlayerSeatProjection {
  return useMemo(() => projectPlayerSeat(view, playerId), [playerId, view]);
}
