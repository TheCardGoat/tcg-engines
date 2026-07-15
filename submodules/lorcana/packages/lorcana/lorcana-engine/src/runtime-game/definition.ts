/**
 * Lorcana Runtime Game Definition
 *
 * MatchRuntimeConfig for the Lorcana engine.
 */

import type { Draft } from "mutative";
import type { BoardSetupContext, PacketAnimationContext, PlayerId } from "#core";
import {
  filterMatchView,
  type FilteredMatchView,
  type MatchRuntimeConfig,
  type MatchState,
} from "#core";
import { createInitialLorcanaG } from "../types";
import { lorcanaRuntimeZones } from "../zones";
import { lorcanaRuntimeMoves } from "../runtime-moves";
import { createLorcanaRuntimeCardDeriver } from "../runtime-moves/state/runtime-card-derived";
import { lorcanaRuntimeFlow } from "../flow/runtime-flow-config";
import { projectLorcanaBoardView } from "./project-board";
import { deriveLorcanaPacketAnimations } from "./lorcanaPacketAnimations";
import { buildZoneRegistry } from "../core/runtime/zone-registry";

const DECK_ZONE_ID = "deck" as const;

function isMoveToLocationBoardMoveAnimationPayload(
  payload: unknown,
): payload is { variant: "move-to-location" } {
  return (
    payload !== null &&
    typeof payload === "object" &&
    (payload as { variant?: unknown }).variant === "move-to-location"
  );
}

/**
 * Lorcana runtime game configuration
 */
export const lorcanaRuntimeConfig: MatchRuntimeConfig = {
  name: "Disney Lorcana TCG",

  setup: ({ players }) => {
    if (players.length !== 2) {
      throw new Error("Lorcana requires exactly 2 players");
    }

    return createInitialLorcanaG(players[0].id as PlayerId, players[1].id as PlayerId);
  },

  boardSetup: (draft: Draft<MatchState>, ctx: BoardSetupContext) => {
    const { players, staticResources, random } = ctx;
    if (typeof staticResources.instances.entries !== "function") {
      return;
    }

    for (const player of players) {
      const deckZoneId = `${DECK_ZONE_ID}:${player.id}`;
      const deckCards =
        draft.ctx.zones.private.zoneCards[deckZoneId] ??
        (draft.ctx.zones.private.zoneCards[deckZoneId] = []);
      const instanceIds: string[] = [];
      for (const record of staticResources.instances.entries()) {
        if (record.ownerID === player.id) {
          instanceIds.push(record.instanceId);
        }
      }
      const shuffledIds = random.shuffle([...instanceIds]);
      for (let i = 0; i < shuffledIds.length; i++) {
        const cardId = shuffledIds[i];
        deckCards.push(cardId);
        draft.ctx.zones.private.cardIndex[cardId] = {
          zoneKey: deckZoneId,
          index: deckCards.length - 1,
          ownerID: player.id as PlayerId,
          controllerID: player.id as PlayerId,
        };
      }

      const summary =
        draft.ctx.zones.public.zoneSummaries[deckZoneId] ??
        (draft.ctx.zones.public.zoneSummaries[deckZoneId] = { revision: 0, count: 0 });
      summary.revision = 1;
      summary.count = deckCards.length;
    }
  },

  moves: lorcanaRuntimeMoves,
  flow: lorcanaRuntimeFlow,
  zones: lorcanaRuntimeZones,

  // This filters MatchState removing private information from it
  playerView: (state, roleCtx) => {
    // playerView only affects filtered/client-facing state snapshots.
    // Authoritative server projections are built from full state directly.
    return filterMatchView(
      state,
      roleCtx,
      buildZoneRegistry(lorcanaRuntimeZones, state.ctx.playerIds),
    );
  },

  // This return ALL the data the UI needs to render the board.
  projectBoard: (state, roleCtx, staticResources, projectionCtx) => {
    return projectLorcanaBoardView(
      state,
      roleCtx,
      staticResources,
      projectionCtx,
    ) as unknown as FilteredMatchView;
  },

  derivePacketAnimations: (context: PacketAnimationContext) => {
    const animations = deriveLorcanaPacketAnimations(context);
    // Temporarily disable all animations except pass-turn, challenge, and targeted actions.
    return animations.filter(
      (anim) =>
        anim.kind === "lorcana.turnChange" ||
        anim.kind === "lorcana.challenge" ||
        anim.kind === "lorcana.action" ||
        (anim.kind === "lorcana.boardMove" &&
          isMoveToLocationBoardMoveAnimationPayload(anim.payload)),
    );
  },

  // deriveRuntimeCard powers runtime card query APIs (cards.get/require) and derived methods.
  // It does not alter the raw EngineBoardProjection builder output.
  deriveRuntimeCard: createLorcanaRuntimeCardDeriver(),
};
