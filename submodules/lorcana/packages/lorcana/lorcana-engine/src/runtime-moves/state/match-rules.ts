/**
 * Match Rules
 *
 * Match-level rule options chosen when a match is created, such as Pack Rush
 * (Comprehensive Rules 10.2): opening hand size, lore to win, what happens on
 * an empty deck, and a locked starting inkwell. Every option defaults to the
 * normal game; a match created without options is unchanged.
 *
 * - Opening hand: read by the mulligan phase (`runtime-flow-config.ts`).
 * - Lore to win: seeded into `G.loreToWin` at setup and used as the base by
 *   `recomputeLoreToWin`, so card modifications still apply on top.
 * - Empty deck: `"reshuffle-discard"` (CR 10.2.5). A player who runs out of
 *   cards shuffles their discard into a new deck instead of losing. See
 *   {@link refillDeckFromDiscard} for when that happens.
 * - Starting inkwell: placed by `boardSetup` before opening hands (CR 10.2.2);
 *   the cards carry `meta.lockedInInkwell`, which keeps them in the inkwell
 *   (10.2.2.1, enforced by zone operations) and out of chosen targets (10.2.2.2).
 */

import type { Draft } from "mutative";
import type { MatchState, PlayerId } from "#core";
import type { DrawCardsArgs, ZoneOperationsAPI } from "../../core/runtime/zone-operations";
import type {
  LorcanaG,
  LorcanaMatchRules,
  LorcanaMatchRulesInput,
  LorcanaStartingInkwellRule,
} from "../../types";
import { DEFAULT_LORE_TO_WIN } from "./game-state-check";
import { recordDiscardExitThisTurn } from "./turn-metrics";

export { isInkwellZoneKey, isLockedInkwellCardMeta } from "./locked-inkwell";

/** Cards in each opening hand in a normal game. */
export const DEFAULT_OPENING_HAND_SIZE = 7;

type MatchRulesG = Pick<LorcanaG, "matchRules">;

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Validate match rule options and keep only the values that differ from the
 * normal game. Returns `undefined` when nothing differs, so a match created
 * with default values stores exactly what a match created without options does.
 *
 * @throws Error when an option is out of range or unknown.
 */
export function normalizeLorcanaMatchRules(
  input: LorcanaMatchRulesInput | undefined,
): LorcanaMatchRules | undefined {
  if (!input) {
    return undefined;
  }

  const rules: LorcanaMatchRules = {};

  if (input.openingHandSize !== undefined) {
    if (!isNonNegativeInteger(input.openingHandSize)) {
      throw new Error("matchRules.openingHandSize must be a non-negative integer");
    }
    if (input.openingHandSize !== DEFAULT_OPENING_HAND_SIZE) {
      rules.openingHandSize = input.openingHandSize;
    }
  }

  if (input.loreToWin !== undefined) {
    if (!isNonNegativeInteger(input.loreToWin) || input.loreToWin < 1) {
      throw new Error("matchRules.loreToWin must be a positive integer");
    }
    if (input.loreToWin !== DEFAULT_LORE_TO_WIN) {
      rules.loreToWin = input.loreToWin;
    }
  }

  if (input.emptyDeck !== undefined) {
    if (input.emptyDeck !== "lose" && input.emptyDeck !== "reshuffle-discard") {
      throw new Error('matchRules.emptyDeck must be "lose" or "reshuffle-discard"');
    }
    if (input.emptyDeck === "reshuffle-discard") {
      rules.emptyDeck = "reshuffle-discard";
    }
  }

  return Object.keys(rules).length > 0 ? rules : undefined;
}

/**
 * Check a starting-inkwell option against the match's players and decks.
 *
 * @param owners - card instance ids owned by each player (the match's cards maps)
 * @throws Error when the option is malformed or names a card the player doesn't own.
 */
export function validateStartingInkwellRule(
  rule: LorcanaStartingInkwellRule,
  playerIds: readonly string[],
  owners: Readonly<Record<string, readonly string[]>>,
): void {
  if (rule.locked !== undefined && typeof rule.locked !== "boolean") {
    throw new Error("matchRules.startingInkwell.locked must be a boolean");
  }

  if (rule.source === "deck-top") {
    if (!isNonNegativeInteger(rule.count)) {
      throw new Error("matchRules.startingInkwell.count must be a non-negative integer");
    }
    for (const playerId of playerIds) {
      const deckSize = owners[playerId]?.length ?? 0;
      if (rule.count > deckSize) {
        throw new Error(
          `matchRules.startingInkwell.count is ${rule.count} but ${playerId} has ${deckSize} cards`,
        );
      }
    }
    return;
  }

  if (rule.source !== "card-ids") {
    throw new Error('matchRules.startingInkwell.source must be "deck-top" or "card-ids"');
  }

  const seen = new Set<string>();
  for (const [playerId, cardIds] of Object.entries(rule.cardIds ?? {})) {
    if (!playerIds.includes(playerId)) {
      throw new Error(`matchRules.startingInkwell.cardIds names unknown player ${playerId}`);
    }
    const owned = new Set(owners[playerId] ?? []);
    for (const cardId of cardIds) {
      if (!owned.has(cardId)) {
        throw new Error(
          `matchRules.startingInkwell.cardIds: ${cardId} is not a card of ${playerId}`,
        );
      }
      if (seen.has(cardId)) {
        throw new Error(`matchRules.startingInkwell.cardIds lists ${cardId} twice`);
      }
      seen.add(cardId);
    }
  }
}

/** Opening hand size for this match (CR 10.2.3 for Pack Rush). */
export function getOpeningHandSize(G: MatchRulesG | undefined): number {
  return G?.matchRules?.openingHandSize ?? DEFAULT_OPENING_HAND_SIZE;
}

/** Lore needed to win before card modifications (CR 1.8.1.1, 10.2.4). */
export function getBaseLoreToWin(G: MatchRulesG | undefined): number {
  return G?.matchRules?.loreToWin ?? DEFAULT_LORE_TO_WIN;
}

/** Whether an empty deck is refilled from the discard instead of losing (CR 10.2.5). */
export function reshufflesDiscardOnEmptyDeck(G: MatchRulesG | undefined): boolean {
  return G?.matchRules?.emptyDeck === "reshuffle-discard";
}

/**
 * Store the match rules in the initial `G`. When the lore goal differs from 20
 * every player's threshold is seeded in `G.loreToWin`, so anything reading that
 * map (including consumers outside the engine) sees the match's goal.
 * Returns `G` unchanged when there are no rules.
 */
export function applyMatchRulesToInitialG(
  G: LorcanaG,
  rules: LorcanaMatchRules | undefined,
): LorcanaG {
  if (!rules) {
    return G;
  }

  const next: LorcanaG = { ...G, matchRules: { ...rules } };
  if (rules.loreToWin !== undefined) {
    next.loreToWin = Object.fromEntries(
      Object.keys(G.lore).map((playerId) => [playerId, rules.loreToWin!]),
    ) as Record<PlayerId, number>;
  }
  return next;
}

function reindexZone(draft: Draft<MatchState>, zoneKey: string): void {
  const cards = draft.ctx.zones.private.zoneCards[zoneKey] ?? [];
  for (const [index, cardId] of cards.entries()) {
    const entry = draft.ctx.zones.private.cardIndex[cardId];
    if (entry) {
      entry.index = index;
    }
  }
  const summary =
    draft.ctx.zones.public.zoneSummaries[zoneKey] ??
    (draft.ctx.zones.public.zoneSummaries[zoneKey] = { revision: 0, count: 0 });
  summary.count = cards.length;
  summary.revision += 1;
}

/**
 * Put each player's starting ink into their inkwell (CR 10.2.2). Runs in
 * `boardSetup`, after the decks are built and before any player acts, so it
 * happens before opening hands are drawn. The cards enter ready and face down,
 * like ink put there by a turn action, and are marked locked unless
 * `rule.locked` is `false`.
 */
export function placeStartingInkwell(
  draft: Draft<MatchState>,
  playerIds: readonly string[],
  rule: LorcanaStartingInkwellRule,
): void {
  const locked = rule.locked !== false;
  const cardMeta = draft.ctx.zones.private.cardMeta;

  for (const playerId of playerIds) {
    const deckKey = `deck:${playerId}`;
    const inkwellKey = `inkwell:${playerId}`;
    const deck = draft.ctx.zones.private.zoneCards[deckKey] ?? [];
    const chosen: string[] =
      rule.source === "deck-top"
        ? deck.slice(deck.length - rule.count).reverse()
        : [...(rule.cardIds[playerId] ?? [])].filter((cardId) => deck.includes(cardId));
    if (chosen.length === 0) {
      continue;
    }

    const chosenSet = new Set(chosen);
    draft.ctx.zones.private.zoneCards[deckKey] = deck.filter((cardId) => !chosenSet.has(cardId));
    const inkwell =
      draft.ctx.zones.private.zoneCards[inkwellKey] ??
      (draft.ctx.zones.private.zoneCards[inkwellKey] = []);

    for (const cardId of chosen) {
      inkwell.push(cardId);
      const entry = draft.ctx.zones.private.cardIndex[cardId];
      draft.ctx.zones.private.cardIndex[cardId] = {
        zoneKey: inkwellKey,
        index: inkwell.length - 1,
        ownerID: (entry?.ownerID ?? playerId) as PlayerId,
        controllerID: (entry?.controllerID ?? entry?.ownerID ?? playerId) as PlayerId,
      };
      cardMeta[cardId] = {
        ...cardMeta[cardId],
        state: "ready",
        publicFaceState: "faceDown",
        ...(locked ? { lockedInInkwell: true } : {}),
      };
    }

    reindexZone(draft, deckKey);
    reindexZone(draft, inkwellKey);
  }
}

type DeckRefillCtx = {
  G: MatchRulesG & Pick<LorcanaG, "turnMetadata">;
  framework: {
    zones: Pick<ZoneOperationsAPI, "getCards" | "moveCards" | "shuffle">;
  };
};

/**
 * CR 10.2.5: when a player has run out of cards in their deck, they shuffle the
 * cards in their discard and place them face down as their new deck.
 *
 * Does nothing (returns `false`) unless the match uses
 * `emptyDeck: "reshuffle-discard"`, the deck is empty and the discard is not.
 *
 * Called when the rule is in force:
 * - when a draw needs a card and the deck is empty (draws continue from the
 *   new deck, so a draw is never lost to the empty deck);
 * - after every completed move, once no effect is waiting on a choice (the
 *   game state check points of CR 1.8.1), so a deck emptied mid-turn is
 *   refilled before anything else looks at it;
 * - when the player's turn ends with an empty deck, in place of the loss.
 * A player with an empty deck and an empty discard doesn't lose and draws nothing.
 */
export function refillDeckFromDiscard(ctx: DeckRefillCtx, playerId: PlayerId): boolean {
  if (!reshufflesDiscardOnEmptyDeck(ctx.G)) {
    return false;
  }

  const zones = ctx.framework.zones;
  if (zones.getCards({ zone: "deck", playerId }).length > 0) {
    return false;
  }

  const discard = zones.getCards({ zone: "discard", playerId });
  if (discard.length === 0) {
    return false;
  }

  zones.moveCards([...discard], { zone: "deck", playerId });
  zones.shuffle({ zone: "deck", playerId });
  recordDiscardExitThisTurn(ctx, discard.length);
  return true;
}

/**
 * Draw like `zones.drawCards`, refilling an empty deck from the discard first
 * when the match uses `emptyDeck: "reshuffle-discard"`. Without that rule this
 * is exactly `zones.drawCards(args)`.
 */
export function drawCardsUnderMatchRules(
  ctx: DeckRefillCtx & { framework: { zones: Pick<ZoneOperationsAPI, "drawCards"> } },
  args: DrawCardsArgs,
): string[] {
  const drawn = ctx.framework.zones.drawCards(args);
  const playerId = args.from.playerId as PlayerId | undefined;
  if (!playerId || args.from.zone !== "deck" || !reshufflesDiscardOnEmptyDeck(ctx.G)) {
    return drawn;
  }

  const all = [...drawn];
  while (all.length < args.count && refillDeckFromDiscard(ctx, playerId)) {
    all.push(...ctx.framework.zones.drawCards({ ...args, count: args.count - all.length }));
  }
  return all;
}

/**
 * Refill every player's empty deck from their discard, at a point where the
 * game is settled: the game hasn't ended and no effect, bag item or choice is
 * pending (cards in the middle of an effect may have left the deck only for
 * that effect). Does nothing unless the match uses `emptyDeck: "reshuffle-discard"`.
 */
export function refillEmptyDecksAfterMove(
  ctx: DeckRefillCtx & {
    G: Pick<LorcanaG, "pendingEffects" | "triggeredAbilities" | "pendingTurnTransition">;
    framework: {
      state: {
        playerIds: readonly PlayerId[];
        status: { gameEnded?: boolean };
        priority: { pendingChoice?: unknown };
      };
    };
  },
): void {
  if (!reshufflesDiscardOnEmptyDeck(ctx.G)) {
    return;
  }

  const state = ctx.framework.state;
  if (
    state.status.gameEnded ||
    state.priority.pendingChoice ||
    (ctx.G.pendingEffects?.length ?? 0) > 0 ||
    (ctx.G.triggeredAbilities?.bag?.items?.length ?? 0) > 0 ||
    ctx.G.pendingTurnTransition
  ) {
    return;
  }

  for (const playerId of state.playerIds) {
    refillDeckFromDiscard(ctx, playerId);
  }
}
