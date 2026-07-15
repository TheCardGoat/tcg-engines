import type {
  CardTargetDSL,
  CardZone,
  ScryDestination,
  ScryDestinationZone,
} from "@tcg/cyberpunk-types";
import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { MatchState, ScryPendingChoice } from "../types/match-state.ts";
import { defOf } from "../state/lookups.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";
import { SeededRNG } from "../state/rng.ts";

export interface ResolveScryInput extends MoveInput {
  args: {
    destinations: Array<{
      zone: ScryDestinationZone;
      cardIds: string[];
    }>;
  };
}

function destinationKey(destination: Pick<ScryDestination, "zone" | "remainder">): string {
  return destination.remainder ? `${destination.zone}:remainder` : destination.zone;
}

function getSubmittedCards(
  input: ResolveScryInput,
  destination: ScryDestination,
): CardInstanceId[] {
  const key = destinationKey(destination);
  const submitted =
    input.args.destinations.find((entry) => destinationKey(entry) === key) ??
    input.args.destinations.find((entry) => entry.zone === destination.zone);
  return (submitted?.cardIds ?? []) as CardInstanceId[];
}

function costMatchesGigValueOf(
  state: MatchState,
  cardCost: number,
  target: NonNullable<CardTargetDSL["costEqualsGigValueOf"]>,
): boolean {
  if (target.selector === "bound") {
    const boundIds = state.G.turnMetadata.currentTrigger?.boundTargets[target.id] ?? [];
    return boundIds.some((id) => state.G.gigDice[id]?.faceValue === cardCost);
  }

  if (target.selector !== "gig") return false;

  const values = Object.values(state.G.gigDice)
    .filter((gig) => gig.ownerId !== undefined)
    .filter((gig) => {
      if (target.controller === "friendly")
        return gig.ownerId === state.G.turnMetadata.activePlayerId;
      if (target.controller === "rival") return gig.ownerId !== state.G.turnMetadata.activePlayerId;
      return true;
    })
    .map((gig) => gig.faceValue);
  return values.includes(cardCost);
}

function cardMatchesTarget(
  state: MatchState,
  cardId: CardInstanceId,
  target?: CardTargetDSL,
): boolean {
  if (!target) return true;
  const card = state.G.cardIndex[cardId as string];
  if (!card) return false;
  const cardDef = defOf(card);

  if (target.cardTypes && !target.cardTypes.includes(cardDef.type)) return false;
  if (target.classifications) {
    const cardClassifications = cardDef.classifications ?? [];
    if (
      !target.classifications.some((classification) => cardClassifications.includes(classification))
    ) {
      return false;
    }
  }
  if (target.minCost !== undefined && (cardDef.cost ?? 0) < target.minCost) return false;
  if (target.maxCost !== undefined && (cardDef.cost ?? 0) > target.maxCost) return false;
  if (target.minPower !== undefined && (cardDef.power ?? 0) < target.minPower) return false;
  if (target.maxPower !== undefined && (cardDef.power ?? 0) > target.maxPower) return false;
  if (
    target.costEqualsGigValueOf &&
    !costMatchesGigValueOf(state, cardDef.cost ?? 0, target.costEqualsGigValueOf)
  ) {
    return false;
  }

  return true;
}

function orderedRemainder(
  cardIds: CardInstanceId[],
  destination: ScryDestination,
  state: MatchState,
): CardInstanceId[] {
  if (destination.order === "random") {
    return new SeededRNG(state.ctx.seed).shuffle(cardIds);
  }
  return [...cardIds];
}

function moveCardToScryDestination(
  state: MatchState,
  playerId: string,
  cardId: CardInstanceId,
  zone: ScryDestinationZone,
): void {
  const player = state.G.players[playerId];
  if (!player) return;

  for (const zoneName of ["deck", "hand", "trash", "field"] as const) {
    const index = player.zones[zoneName].indexOf(cardId);
    if (index !== -1) player.zones[zoneName].splice(index, 1);
  }

  const card = state.G.cardIndex[cardId as string];
  if (!card) return;

  if (zone === "deckBottom") {
    card.zone = "deck";
    card.meta = createDefaultMetaForZone("deck");
    player.zones.deck.push(cardId);
    return;
  }

  if (zone === "deckTop") {
    card.zone = "deck";
    card.meta = createDefaultMetaForZone("deck");
    player.zones.deck.unshift(cardId);
    return;
  }

  card.zone = zone as CardZone;
  card.meta = createDefaultMetaForZone(zone as CardZone);
  player.zones[zone].push(cardId);
}

export const resolveScryMove: MoveDefinition<ResolveScryInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") {
      return { valid: false, error: "No scry pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice", errorCode: "NOT_YOUR_CHOICE" };
    }

    const typedChoice = choice as ScryPendingChoice;
    const revealed = new Set(typedChoice.payload.revealedCardIds.map((id) => id as string));
    const assigned = new Set<string>();

    for (const destination of typedChoice.payload.destinations) {
      if (destination.remainder) continue;
      const cards = getSubmittedCards(input, destination);
      const min = destination.min ?? 0;
      const max = destination.max ?? Number.POSITIVE_INFINITY;
      if (cards.length < min) {
        return {
          valid: false,
          error: `Must select at least ${min} card(s)`,
          errorCode: "TOO_FEW_SELECTED",
        };
      }
      if (cards.length > max) {
        return {
          valid: false,
          error: `Cannot select more than ${max} card(s)`,
          errorCode: "TOO_MANY_SELECTED",
        };
      }
      for (const cardId of cards) {
        if (!revealed.has(cardId as string)) {
          return {
            valid: false,
            error: "Selected card is not in the scry window",
            errorCode: "INVALID_CHOICE",
          };
        }
        if (assigned.has(cardId as string)) {
          return {
            valid: false,
            error: "Selected card was assigned twice",
            errorCode: "DUPLICATE_CHOICE",
          };
        }
        if (!cardMatchesTarget(state, cardId, destination.target)) {
          return {
            valid: false,
            error: "Card does not match destination filter",
            errorCode: "INVALID_CARD",
          };
        }
        assigned.add(cardId as string);
      }
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ScryPendingChoice;
    const player = state.G.players[playerId as string];
    if (!player) return;

    const destinations = choice.payload.destinations;
    const explicitDestinations = destinations.filter((destination) => !destination.remainder);
    const remainderDestination =
      destinations.find((destination) => destination.remainder) ??
      ({ zone: "deckBottom", remainder: true } satisfies ScryDestination);

    const assigned = new Set<string>();
    const foundCards: CardInstanceId[] = [];

    for (const destination of explicitDestinations) {
      const cardIds = getSubmittedCards(input, destination);
      for (const cardId of cardIds) {
        assigned.add(cardId as string);
        foundCards.push(cardId);
        moveCardToScryDestination(state, playerId as string, cardId, destination.zone);
      }
    }

    const remainder = orderedRemainder(
      choice.payload.revealedCardIds.filter((id) => !assigned.has(id as string)),
      remainderDestination,
      state,
    );
    for (const cardId of remainder) {
      moveCardToScryDestination(state, playerId as string, cardId, remainderDestination.zone);
    }
    const selectedCardNames = foundCards
      .map((cardId) => state.G.cardIndex[cardId])
      .filter((card): card is NonNullable<typeof card> => card !== undefined)
      .map((card) => defOf(card).displayName ?? defOf(card).name);
    const foundDestination = explicitDestinations.find((destination) =>
      getSubmittedCards(input, destination).some((cardId) => foundCards.includes(cardId)),
    );
    const shouldRevealFoundCards = foundDestination?.reveal === true;

    operations.game.setPendingChoice(undefined);

    if (foundCards.length > 0 && shouldRevealFoundCards) {
      operations.event.emit({
        type: "cardsRevealed",
        cardIds: foundCards,
        playerId,
      });
    }

    operations.event.emit({
      type: "searchPerformed",
      playerId,
      zone: "deck",
      found: foundCards.length,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveSearchDeck",
      params: {
        count: foundCards.length,
        looked: choice.payload.revealedCardIds.length,
      },
      playerId,
      category: "search",
      cardIds: foundCards,
    });
    if (foundCards.length > 0 && foundDestination && shouldRevealFoundCards) {
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.resolveSearchDeckNamed",
        params: {
          count: foundCards.length,
          looked: choice.payload.revealedCardIds.length,
          destination: foundDestination.zone,
          selectedCardNames: selectedCardNames.join(", "),
          remainderCount: remainder.length,
        },
        playerId,
        category: "search",
        cardIds: foundCards,
      });
    }

    resumeCurrentTrigger(state, operations);
  },
};
