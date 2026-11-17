/**
 * Lorcana Runtime Game Definition
 *
 * MatchRuntimeConfig for the Lorcana engine.
 */

import type { Draft } from "mutative";
import type {
  BoardSetupContext,
  MoveExecutionContext,
  MoveRecord,
  PacketAnimationContext,
  PlayerId,
} from "#core";
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
import {
  applyMatchRulesToInitialG,
  normalizeLorcanaMatchRules,
  placeStartingInkwell,
  refillEmptyDecksAfterMove,
  validateStartingInkwellRule,
} from "../runtime-moves/state/match-rules";
import type { LorcanaMatchRulesInput } from "../types";

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
 * Run each move, then apply the match's empty-deck rule (Pack Rush, CR 10.2.5)
 * once the move has settled. A no-op unless the match uses
 * `matchRules.emptyDeck: "reshuffle-discard"`.
 */
function withEmptyDeckRefill(moves: MoveRecord): MoveRecord {
  return Object.fromEntries(
    Object.entries(moves).map(([moveId, move]) => [
      moveId,
      {
        ...move,
        execute: (context: MoveExecutionContext) => {
          move.execute(context);
          refillEmptyDecksAfterMove(context);
        },
      },
    ]),
  );
}

/**
 * Lorcana runtime game configuration
 */
export const lorcanaRuntimeConfig: MatchRuntimeConfig = {
  name: "Disney Lorcana TCG",

  setup: ({ players }) => {
    if (players.length < 2) {
      throw new Error("Lorcana requires at least 2 players");
    }

    return createInitialLorcanaG(
      players[0].id as PlayerId,
      players[1].id as PlayerId,
      ...players.slice(2).map((player) => player.id as PlayerId),
    );
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

  moves: withEmptyDeckRefill(lorcanaRuntimeMoves),
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

/**
 * Apply match rule options (e.g. Pack Rush, CR 10.2) to a runtime config: the
 * rules are stored in the initial `G`, and a starting inkwell is placed by
 * `boardSetup`. Returns `config` itself when `input` is undefined, so a match
 * created without options uses the unchanged config.
 *
 * @param owners - card instance ids owned by each player, to check `card-ids`
 * @throws Error when an option is invalid.
 */
export function withLorcanaMatchRules(
  config: MatchRuntimeConfig,
  input: LorcanaMatchRulesInput | undefined,
  playerIds: readonly string[],
  owners: Readonly<Record<string, readonly string[]>>,
): MatchRuntimeConfig {
  if (!input) {
    return config;
  }

  const rules = normalizeLorcanaMatchRules(input);
  const startingInkwell = input.startingInkwell;
  if (startingInkwell) {
    validateStartingInkwellRule(startingInkwell, playerIds, owners);
  }

  const baseSetup = config.setup;
  const baseBoardSetup = config.boardSetup;
  return {
    ...config,
    ...(rules ? { setup: (args) => applyMatchRulesToInitialG(baseSetup(args), rules) } : {}),
    ...(startingInkwell
      ? {
          boardSetup: (draft, ctx) => {
            baseBoardSetup?.(draft, ctx);
            placeStartingInkwell(
              draft,
              ctx.players.map((player) => player.id),
              startingInkwell,
            );
          },
        }
      : {}),
  };
}
