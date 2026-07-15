/**
 * Deck-manipulation effect handlers.
 *
 * `lookAtTopDeck` implements the "look at top N, optionally tutor one,
 * return the rest" pattern found on cards like Saint Gabriel Institute,
 * Flit Asuno's 【When Linked】, and The Path to Victory or Defeat.
 *
 * Player decisions arrive through deckLookAnswers, populated from the
 * public pending-choice protocol. Ordered deck arrays store their top card
 * at the end, so revealed cards are read in draw order and explicit top /
 * bottom routes are applied without exposing the rest of the hidden deck.
 *
 * The deterministic branches are retained only for legacy execution paths
 * that invoke the directive without a pending answer.
 */

import type { Card, TargetFilter } from "@tcg/gundam-types";
import type { PlayerId } from "../../../types/branded.ts";
import type { EffectExecutionContext } from "../executor.ts";
import type { DeckLookAnswer } from "../../types.ts";
import { payCost as payEffectCost } from "../../moves/core/play-card-shared.ts";
import {
  buildTargetResolutionContext,
  computeEffectiveCostInTrash,
  getAvailableResources,
} from "../../rules/derived-state.ts";
import { evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { emitGundamLog } from "../../logging.ts";
import { enqueueObserverTriggers, enqueueOwnCardTriggers } from "../pending-effects.ts";
import { takeTopCards } from "../../../runtime/zone-order.ts";

export function handleLookAtTopDeckAction(
  count: number,
  returnMode: "topAndBottom" | "chooseTop" | "topOrTrash",
  remainingDestination: "bottom" | "trash" | undefined,
  randomizeRemainingToBottom: boolean,
  tutorFilter: TargetFilter | undefined,
  tutorDestination: "hand" | "battleArea" | undefined,
  ctx: EffectExecutionContext,
): void {
  const playerId = ctx.sourcePlayerId;
  const deckCards = ctx.framework.zones.getCards({ zone: "deck", playerId });
  if (deckCards.length === 0) return;

  const topN = takeTopCards(deckCards, count);

  // Revealed top-N is visible only to the searcher (rule 7-3-2: looking
  // at a zone doesn't expose it to the opponent).
  emitGundamLog(ctx.framework, {
    type: "gundam.effect.deckRevealed",
    values: { playerId, cardIds: topN },
    visibility: { mode: "PRIVATE", visibleTo: [playerId as PlayerId] },
    category: "action",
  });

  let tutored: string | undefined;
  const answer =
    ctx.currentDirectiveIndex === undefined
      ? undefined
      : ctx.deckLookAnswers?.[ctx.currentDirectiveIndex];

  if (tutorFilter) {
    const tgtCtx = buildTargetResolutionContext(ctx.G, playerId, ctx.framework, {
      sourceCardId: ctx.sourceCardId,
    });
    // Build RuntimeCard list for revealed top-N. evaluateTargetFilter needs
    // RuntimeCard-shaped inputs; use framework.cards.get to look up each.
    const revealed = topN
      .map((id) => ctx.framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => !!c);
    // The candidate pool is already restricted to the deck's top-N. Inject
    // `zone: "deck"` so the TargetFilter's implicit-zone default (battleArea
    // for `cardType: "unit"`) doesn't reject a perfectly-revealed deck card.
    // Card data omits the redundant `zone` field on tutorFilters because the
    // operation is inherently deck-scoped.
    const scopedFilter: TargetFilter = { ...tutorFilter, zone: tutorFilter.zone ?? "deck" };
    const matches = evaluateTargetFilter(scopedFilter, revealed, tgtCtx) as readonly string[];
    if (answer?.tutorCardId && matches.includes(answer.tutorCardId)) {
      tutored = answer.tutorCardId;
    } else if (matches.length > 0 && !answer) {
      tutored = matches[0];
    }
  }

  if (tutored) {
    const destination = tutorDestination ?? "hand";
    ctx.framework.zones.moveCard(tutored, { zone: destination, playerId });
    if (destination === "battleArea") {
      ctx.G.turnMetadata.deployedThisTurn.push(tutored);
      ctx.G.exhausted[tutored] = false;
      ctx.framework.cards.patchMeta(tutored, { exhausted: false, deployedThisTurn: true });
      const event = {
        type: "unitDeployed",
        cardId: tutored,
        playerId,
        fromZone: "deck",
      };
      enqueueOwnCardTriggers(ctx.G, event, tutored, playerId, ctx.framework);
      enqueueObserverTriggers(ctx.G, event, ctx.framework, tutored);
    }
    // Printed tutor effects reveal the selected card before it enters a
    // hidden hand. The looked-at group remains private, but this identity is
    // public so both players can verify that the chosen card matched.
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.cardTutored",
      values: { playerId, cardId: tutored },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
    if (destination === "battleArea") {
      emitGundamLog(ctx.framework, {
        type: "gundam.effect.movedToZone",
        values: { cardId: tutored, from: "deck", to: "battleArea" },
        visibility: { mode: "PUBLIC" },
        category: "action",
      });
    }
  }

  const remaining = topN.filter((id) => id !== tutored);
  if (remaining.length === 0) return;

  if (randomizeRemainingToBottom) {
    moveCardsToBottom(ctx.framework.random.shuffle([...remaining]), playerId, ctx);
    return;
  }

  if (answer) {
    applyDeckLookAnswer(remaining, answer, playerId, ctx);
    return;
  }

  if (returnMode === "topOrTrash") {
    for (const id of remaining) {
      ctx.framework.zones.moveCard(id, { zone: "trash", playerId });
    }
    return;
  }

  if (returnMode === "chooseTop") {
    if (remainingDestination) {
      const toMove = remaining.slice(1);
      if (remainingDestination === "trash") {
        for (const id of toMove) {
          ctx.framework.zones.moveCard(id, { zone: "trash", playerId });
        }
      } else {
        moveCardsToBottom(toMove, playerId, ctx);
      }
      return;
    }

    // Send all remaining cards to the bottom of the deck in revealed order.
    moveCardsToBottom(remaining, playerId, ctx);
    return;
  }

  // Legacy topAndBottom fallback when no player answer was supplied:
  //
  //   - count = 1: move the single card to the bottom. This exercises the
  //     "Return it to the top or bottom" choice and is the strategically
  //     interesting branch tests care about (the card leaves its original
  //     position). A future PendingDeckRevealPrompt can let the player
  //     pick; for now the deterministic bottom-placement unblocks all
  //     GD02-025 / GD01-039 tests.
  //
  //   - count > 1: first half stays on top (already there — no-op),
  //     second half goes to the bottom. For odd counts the top gets the
  //     extra card.
  if (remaining.length === 1) {
    // Single card → move to bottom.
    moveCardsToBottom(remaining, playerId, ctx);
    return;
  }

  const topHalf = Math.ceil(remaining.length / 2);
  const toBottom = remaining.slice(topHalf);
  moveCardsToBottom(toBottom, playerId, ctx);
}

function applyDeckLookAnswer(
  remaining: readonly string[],
  answer: DeckLookAnswer,
  playerId: string,
  ctx: EffectExecutionContext,
): void {
  const remainingSet = new Set(remaining);
  const toTrash = uniqueKnown(answer.toTrash, remainingSet);
  const toBottom = uniqueKnown(answer.toBottom, remainingSet).filter((id) => !toTrash.includes(id));
  const toTop = uniqueKnown(answer.toTop, remainingSet).filter(
    (id) => !toTrash.includes(id) && !toBottom.includes(id),
  );

  for (const id of toTrash) {
    ctx.framework.zones.moveCard(id, { zone: "trash", playerId });
  }
  moveCardsToBottom(toBottom, playerId, ctx);
  moveCardsToTop(toTop, playerId, ctx);
}

/** `ids` are ordered top-most first. */
function moveCardsToTop(
  ids: readonly string[],
  playerId: string,
  ctx: EffectExecutionContext,
): void {
  for (const id of ids.toReversed()) {
    ctx.framework.zones.moveCard(id, { zone: "deck", playerId });
  }
}

/** `ids` are ordered bottom-most first. */
function moveCardsToBottom(
  ids: readonly string[],
  playerId: string,
  ctx: EffectExecutionContext,
): void {
  for (const id of ids.toReversed()) {
    ctx.framework.zones.moveCard(id, { zone: "deck", playerId }, { index: 0 });
  }
}

function uniqueKnown(ids: readonly string[] | undefined, allowed: ReadonlySet<string>): string[] {
  const out: string[] = [];
  for (const id of ids ?? []) {
    if (!allowed.has(id) || out.includes(id)) continue;
    out.push(id);
  }
  return out;
}

/**
 * Choose one matching Unit card in the controller's trash and deploy it.
 *
 * Minimal auto-resolve: picks the chosen target when provided, otherwise
 * the first Unit that satisfies the optional target filter / `levelAtMost`.
 * `payCost: true` pays the deployed card's printed cost from active
 * resources; if the controller cannot pay, the optional deploy does not
 * resolve.
 */
export function handleDeployFromTrashAction(
  levelAtMost: number | undefined,
  payCost: boolean,
  target: TargetFilter | undefined,
  ctx: EffectExecutionContext,
): void {
  const playerId = ctx.sourcePlayerId;
  const trash = ctx.framework.zones.getCards({ zone: "trash", playerId });

  const runtimeTrash = trash
    .map((id) => ctx.framework.cards.get(id))
    .filter((card): card is NonNullable<typeof card> => !!card);
  const tgtCtx = buildTargetResolutionContext(ctx.G, playerId, ctx.framework, {
    sourceCardId: ctx.sourceCardId,
  });
  const scopedFilter: TargetFilter = target ?? {
    owner: "friendly",
    cardType: "unit",
    zone: "trash",
  };
  const filteredIds = evaluateTargetFilter(
    { ...scopedFilter, zone: scopedFilter.zone ?? "trash" },
    runtimeTrash,
    tgtCtx,
  ) as readonly string[];
  const filteredSet = new Set(filteredIds);

  const candidates = trash.filter((cardId) => {
    if (!filteredSet.has(cardId)) return false;
    const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
    if (!def || def.type !== "unit") return false;
    return !(levelAtMost !== undefined && typeof def.level === "number" && def.level > levelAtMost);
  });
  const orderedCandidates =
    ctx.chosenTargets !== undefined
      ? ctx.chosenTargets.filter((id) => candidates.includes(id))
      : candidates;
  const cardId = orderedCandidates[0];
  if (!cardId) return;

  const def = ctx.framework.cards.getDefinition(cardId) as Card | undefined;
  if (!def || def.type !== "unit") return;

  const effectiveCost = computeEffectiveCostInTrash(cardId, playerId, ctx.G, ctx.framework);
  if (payCost) {
    const available = getAvailableResources(playerId, ctx.G, ctx.framework);
    if (available < effectiveCost) return;
    payEffectCost({ payResources: effectiveCost }, cardId, playerId, ctx.G, ctx.framework);
  }

  ctx.framework.zones.moveCard(cardId, { zone: "battleArea", playerId });
  ctx.G.turnMetadata.deployedThisTurn.push(cardId);
  ctx.G.exhausted[cardId] = false;
  ctx.framework.cards.patchMeta(cardId, { exhausted: false, deployedThisTurn: true });
  const event = {
    type: "unitDeployed",
    cardId,
    playerId,
    fromZone: "trash",
  };
  enqueueOwnCardTriggers(ctx.G, event, cardId, playerId, ctx.framework);
  enqueueObserverTriggers(ctx.G, event, ctx.framework, cardId);
  emitGundamLog(ctx.framework, {
    type: "gundam.effect.movedToZone",
    values: { cardId, from: "trash", to: "battleArea" },
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}
