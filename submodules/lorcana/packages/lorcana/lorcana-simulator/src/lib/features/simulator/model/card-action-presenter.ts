import type { PlayCardDisabledReason } from "@tcg/lorcana-engine";
import { m } from "$lib/i18n/messages.js";
import { formatPlayCardDisabledReason } from "@/features/simulator/model/play-card-disabled-reason-i18n.js";
import type {
  CardActionCategoryId,
  CardActionView,
  ExecutableMoveEntry,
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
} from "@/features/simulator/model/contracts.js";

/**
 * Per-category reason accessors the presenter calls when a play / shift / sing
 * action is blocked (i.e. the engine produced no executable move for that
 * category). Each returns `null` when the action is playable OR not applicable
 * to the card (e.g. no Shift keyword for `getShiftDisabledReason`).
 *
 * Defined as a separate type so callers (game-context) can pass a single bag
 * of callbacks instead of three loose props.
 */
export interface PlayCardDisabledReasonAccessors {
  getStandardPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getShiftPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getSingPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getInkActionDisabledReason?: (cardId: string) => string | null;
}

function resolveBlockedReason(
  cardId: string,
  accessor: ((cardId: string) => PlayCardDisabledReason | null) | undefined,
  fallback: string,
): string {
  if (!accessor) return fallback;
  const reason = accessor(cardId);
  if (!reason) return fallback;
  return formatPlayCardDisabledReason(reason);
}

const CARD_ACTION_ORDER: readonly CardActionCategoryId[] = [
  "play-card",
  "shift-card",
  "sing-card",
  "ink-card",
  "quest",
  "challenge",
  "move-to-location",
  "activate-ability",
] as const;

function hasKeyword(card: LorcanaCardSnapshot, keyword: string): boolean {
  return (card.keywords ?? []).includes(keyword);
}

function getSourceCardId(move: ExecutableMoveEntry): string | null {
  switch (move.presentation.categoryId) {
    case "ink-card":
    case "play-card":
    case "shift-card":
    case "sing-card":
    case "quest":
    case "activate-ability": {
      const cardId = (move.params as { cardId?: unknown }).cardId;
      return typeof cardId === "string" ? cardId : null;
    }
    case "challenge": {
      const attackerId = (move.params as { attackerId?: unknown }).attackerId;
      return typeof attackerId === "string" ? attackerId : null;
    }
    case "move-to-location": {
      const characterId = (move.params as { characterId?: unknown }).characterId;
      return typeof characterId === "string" ? characterId : null;
    }
    default:
      return null;
  }
}

function getTargetCardId(move: ExecutableMoveEntry): string | null {
  switch (move.presentation.categoryId) {
    case "play-card":
    case "shift-card": {
      const targets = (move.params as { targets?: unknown }).targets;
      return Array.isArray(targets) && typeof targets[0] === "string" ? targets[0] : null;
    }
    case "sing-card": {
      const singer = (move.params as { singer?: unknown }).singer;
      return typeof singer === "string" ? singer : null;
    }
    case "challenge": {
      const defenderId = (move.params as { defenderId?: unknown }).defenderId;
      return typeof defenderId === "string" ? defenderId : null;
    }
    case "move-to-location": {
      const locationId = (move.params as { locationId?: unknown }).locationId;
      return typeof locationId === "string" ? locationId : null;
    }
    default:
      return null;
  }
}

function getPlayActionDetail(
  card: LorcanaCardSnapshot,
  move: ExecutableMoveEntry,
): string | undefined {
  const params = move.params as {
    amount?: unknown;
    cost?: unknown;
  };

  if (typeof params.amount === "number" && Number.isFinite(params.amount)) {
    return `${params.amount} ink`;
  }

  if (params.cost === "free") {
    return "Free";
  }

  if (params.cost === "shift") {
    if (
      typeof card.shiftInkCost === "number" &&
      Number.isFinite(card.shiftInkCost) &&
      typeof card.shiftPlayCost === "number" &&
      Number.isFinite(card.shiftPlayCost)
    ) {
      return card.shiftPlayCost === card.shiftInkCost
        ? `${card.shiftInkCost} ink`
        : `Pay ${card.shiftPlayCost} ink (${card.shiftInkCost} base)`;
    }

    if (typeof card.shiftInkCost === "number" && Number.isFinite(card.shiftInkCost)) {
      return `${card.shiftInkCost} ink`;
    }

    return "Shift";
  }

  if (params.cost === "sing") {
    return "Sing";
  }

  if (params.cost === "singTogether") {
    return "Sing Together";
  }

  if (params.cost === "sacrifice") {
    return "Banish Item";
  }

  if (params.cost === "exert-items") {
    return "Exert 4 Items";
  }

  if (params.cost === "put-on-deck-bottom") {
    return "Put Toy on Deck Bottom";
  }

  if (typeof card.playCost === "number") {
    return `${card.playCost} ink`;
  }

  if (typeof card.cost === "number") {
    return `${card.cost} ink`;
  }

  return undefined;
}

function buildEnabledCategoryAction(
  card: LorcanaCardSnapshot,
  categoryId: CardActionCategoryId,
  moves: ExecutableMoveEntry[],
): CardActionView {
  const costType = (moves[0]?.params as { cost?: string })?.cost;
  const isAlternativeCost =
    costType === "sacrifice" || costType === "exert-items" || costType === "put-on-deck-bottom";
  const label =
    categoryId === "quest" && typeof card.loreValue === "number"
      ? `${m["sim.actions.label.quest"]({})} for ${card.loreValue} lore`
      : (moves[0]?.presentation.categoryLabel ?? categoryId);
  const detail =
    categoryId === "play-card" || categoryId === "shift-card"
      ? getPlayActionDetail(card, moves[0]!)
      : undefined;
  const interaction =
    categoryId === "challenge" || categoryId === "move-to-location"
      ? "expand-on-click"
      : "execute-or-select";
  const idSuffix = isAlternativeCost ? `:${costType}` : "";

  return {
    id: `${categoryId}:${card.cardId}${idSuffix}`,
    cardId: card.cardId,
    categoryId,
    label,
    ...(detail ? { detail } : {}),
    interaction,
    enabled: true,
    moves,
  };
}

function buildBlockedAction(
  card: LorcanaCardSnapshot,
  categoryId: CardActionCategoryId,
  reason: string,
): CardActionView {
  const label =
    categoryId === "quest" && typeof card.loreValue === "number"
      ? `${m["sim.actions.label.quest"]({})} for ${card.loreValue} lore`
      : categoryId === "challenge"
        ? m["sim.actions.label.challenge"]({})
        : categoryId === "move-to-location"
          ? m["sim.actions.label.moveToLocation"]({})
          : categoryId === "play-card"
            ? m["sim.actions.label.playCard"]({})
            : categoryId === "shift-card"
              ? m["sim.actions.label.shiftCard"]({})
              : categoryId === "ink-card"
                ? m["sim.actions.label.inkCard"]({})
                : m["sim.actions.label.activateAbility"]({});

  return {
    id: `disabled:${categoryId}:${card.cardId}`,
    cardId: card.cardId,
    categoryId,
    label,
    interaction: "execute-or-select",
    enabled: false,
    reason,
    moves: [],
  };
}

function buildDeferredEnabledAction(
  card: LorcanaCardSnapshot,
  categoryId: Extract<CardActionCategoryId, "challenge" | "move-to-location">,
): CardActionView {
  return {
    id: `${categoryId}:${card.cardId}`,
    cardId: card.cardId,
    categoryId,
    label:
      categoryId === "challenge"
        ? m["sim.actions.label.challenge"]({})
        : m["sim.actions.label.moveToLocation"]({}),
    interaction: "expand-on-click",
    enabled: true,
    moves: [],
  };
}

function getQuestBlockedReason(card: LorcanaCardSnapshot): string {
  if (card.isDrying) {
    return m["sim.card.tags.freshInk.tooltip"]({});
  }
  if (card.readyState === "exerted") {
    return "This character is exerted.";
  }
  if (card.hasQuestRestriction) {
    return m["sim.card.tags.cantQuest.tooltip"]({});
  }
  return "This character cannot quest right now.";
}

function getChallengeBlockedReason(card: LorcanaCardSnapshot): string {
  if (card.isDrying) {
    return m["sim.card.tags.freshInk.tooltip"]({});
  }
  if (card.readyState === "exerted") {
    return "This character is exerted.";
  }
  return "No legal challenge targets right now.";
}

function getMoveBlockedReason(_card: LorcanaCardSnapshot): string {
  return "No legal locations to move to right now.";
}

function getShiftBlockedReason(_card: LorcanaCardSnapshot): string {
  return "This card cannot be shifted right now.";
}

export function getCardActionSourceCardId(move: ExecutableMoveEntry): string | null {
  return getSourceCardId(move);
}

export function getCardActionTargetCardId(move: ExecutableMoveEntry): string | null {
  return getTargetCardId(move);
}

export function buildCardActionViews(options: {
  card: LorcanaCardSnapshot;
  executableMoves: ExecutableMoveEntry[];
  ownerSide: LorcanaPlayerSide | null;
  challengeReadyCardIds: string[];
  movableToLocationCardIds: string[];
  /**
   * Optional per-category disabled-reason accessors. When provided, the
   * presenter pulls a localized tooltip from the engine for blocked
   * play / shift actions instead of a generic "can't be played" string.
   */
  disabledReasonAccessors?: PlayCardDisabledReasonAccessors;
}): CardActionView[] {
  const {
    card,
    executableMoves,
    ownerSide,
    challengeReadyCardIds,
    movableToLocationCardIds,
    disabledReasonAccessors,
  } = options;
  if (!ownerSide || card.ownerSide !== ownerSide) {
    return [];
  }

  const cardMoves = executableMoves.filter((move) => getSourceCardId(move) === card.cardId);
  const groupedMoves = new Map<CardActionCategoryId, ExecutableMoveEntry[]>();

  for (const move of cardMoves) {
    const categoryId = move.presentation.categoryId;
    if (
      categoryId !== "activate-ability" &&
      categoryId !== "challenge" &&
      categoryId !== "ink-card" &&
      categoryId !== "move-to-location" &&
      categoryId !== "play-card" &&
      categoryId !== "shift-card" &&
      categoryId !== "sing-card" &&
      categoryId !== "quest"
    ) {
      continue;
    }

    const existing = groupedMoves.get(categoryId);
    if (existing) {
      existing.push(move);
      continue;
    }

    groupedMoves.set(categoryId, [move]);
  }

  const actions: CardActionView[] = [];
  for (const categoryId of CARD_ACTION_ORDER) {
    const moves = groupedMoves.get(categoryId) ?? [];

    if (moves.length > 0) {
      // Split alternative cost play-card moves into separate action chips
      if (categoryId === "play-card") {
        const standardMoves = moves.filter((move) => {
          const cost = (move.params as { cost?: unknown }).cost;
          return cost !== "sacrifice" && cost !== "exert-items" && cost !== "put-on-deck-bottom";
        });
        const alternativeCostMoves = moves.filter((move) => {
          const cost = (move.params as { cost?: unknown }).cost;
          return cost === "sacrifice" || cost === "exert-items" || cost === "put-on-deck-bottom";
        });
        if (standardMoves.length > 0) {
          actions.push(buildEnabledCategoryAction(card, categoryId, standardMoves));
        }
        for (const altMove of alternativeCostMoves) {
          actions.push(buildEnabledCategoryAction(card, categoryId, [altMove]));
        }
        if (standardMoves.length === 0 && alternativeCostMoves.length === 0) {
          actions.push(buildEnabledCategoryAction(card, categoryId, moves));
        }
      } else {
        actions.push(buildEnabledCategoryAction(card, categoryId, moves));
      }
      continue;
    }

    if (categoryId === "play-card" && (card.zoneId === "hand" || card.zoneId === "limbo")) {
      const reasonText = resolveBlockedReason(
        card.cardId,
        disabledReasonAccessors?.getStandardPlayDisabledReason,
        "This card cannot be played right now.",
      );
      actions.push(buildBlockedAction(card, categoryId, reasonText));
      continue;
    }

    if (
      categoryId === "shift-card" &&
      (card.zoneId === "hand" || card.zoneId === "limbo") &&
      hasKeyword(card, "Shift")
    ) {
      const reasonText = resolveBlockedReason(
        card.cardId,
        disabledReasonAccessors?.getShiftPlayDisabledReason,
        getShiftBlockedReason(card),
      );
      actions.push(buildBlockedAction(card, categoryId, reasonText));
      continue;
    }

    if (
      categoryId === "sing-card" &&
      (card.zoneId === "hand" || card.zoneId === "limbo") &&
      card.actionSubtype === "song"
    ) {
      const reasonText = resolveBlockedReason(
        card.cardId,
        disabledReasonAccessors?.getSingPlayDisabledReason,
        "This song cannot be sung right now.",
      );
      actions.push(buildBlockedAction(card, categoryId, reasonText));
      continue;
    }

    if (
      categoryId === "ink-card" &&
      (card.zoneId === "hand" || card.zoneId === "discard") &&
      card.inkable !== false
    ) {
      actions.push(
        buildBlockedAction(
          card,
          categoryId,
          disabledReasonAccessors?.getInkActionDisabledReason?.(card.cardId) ??
            "This card cannot be inked right now.",
        ),
      );
      continue;
    }

    if (card.zoneId !== "play" || card.cardType !== "character") {
      continue;
    }

    if (categoryId === "quest") {
      actions.push(buildBlockedAction(card, categoryId, getQuestBlockedReason(card)));
      continue;
    }

    if (categoryId === "challenge") {
      actions.push(
        challengeReadyCardIds.includes(card.cardId)
          ? buildDeferredEnabledAction(card, categoryId)
          : buildBlockedAction(card, categoryId, getChallengeBlockedReason(card)),
      );
      continue;
    }

    if (categoryId === "move-to-location") {
      actions.push(
        movableToLocationCardIds.includes(card.cardId)
          ? buildDeferredEnabledAction(card, categoryId)
          : buildBlockedAction(card, categoryId, getMoveBlockedReason(card)),
      );
    }
  }

  return actions;
}
