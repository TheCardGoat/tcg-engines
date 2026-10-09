import type { CardZone, ScryDestination, ScryDestinationZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { MatchState, ScryPendingChoice } from "../types/match-state.ts";
import { defOf } from "../state/lookups.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";
import { SeededRNG } from "../state/rng.ts";
import { resolveTarget } from "../effects/target-resolver.ts";
import type { Operations } from "../operations/index.ts";

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
  playerId: PlayerId,
  cardId: CardInstanceId,
  zone: ScryDestinationZone,
  operations: Operations,
): boolean {
  const player = state.G.players[playerId as string];
  if (!player) return false;

  for (const zoneName of ["deck", "hand", "trash", "field"] as const) {
    const index = player.zones[zoneName].indexOf(cardId);
    if (index !== -1) player.zones[zoneName].splice(index, 1);
  }

  const card = state.G.cardIndex[cardId as string];
  if (!card) return false;
  const fromZone = card.zone;

  if (zone === "deckBottom") {
    card.zone = "deck";
    card.meta = createDefaultMetaForZone("deck");
    player.zones.deck.push(cardId);
  } else if (zone === "deckTop") {
    card.zone = "deck";
    card.meta = createDefaultMetaForZone("deck");
    player.zones.deck.unshift(cardId);
  } else {
    card.zone = zone as CardZone;
    card.meta = createDefaultMetaForZone(zone as CardZone);
    player.zones[zone].push(cardId);
  }
  // Reordering a card within the deck is still a visible placement action.
  if (fromZone !== card.zone || zone === "deckBottom" || zone === "deckTop") {
    operations.event.emit({
      type: "cardMoved",
      cardId,
      fromZone,
      toZone: card.zone,
      playerId,
      ...(zone === "deckBottom"
        ? { deckPlacement: "bottom" as const }
        : zone === "deckTop"
          ? { deckPlacement: "top" as const }
          : {}),
    });
  }
  return fromZone === "deck" && card.zone === "deck";
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
        if (
          destination.target &&
          !resolveTarget(destination.target, {
            state,
            sourceCardId: typedChoice.payload.sourceCardId,
            sourcePlayerId: typedChoice.payload.sourcePlayerId,
            abilityIndex: typedChoice.payload.abilityIndex,
            contextTargets: typedChoice.payload.contextTargets,
            boundTargets: typedChoice.payload.boundTargets,
          }).includes(cardId as string)
        ) {
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
    const foundCards: CardInstanceId[] = explicitDestinations.flatMap((destination) =>
      getSubmittedCards(input, destination),
    );
    const foundDestination = explicitDestinations.find((destination) =>
      getSubmittedCards(input, destination).some((cardId) => foundCards.includes(cardId)),
    );
    const shouldRevealFoundCards = foundDestination?.reveal === true;
    let deckReordered = false;

    for (const destination of explicitDestinations) {
      const cardIds = getSubmittedCards(input, destination);
      if (destination.reveal && cardIds.length > 0) {
        operations.event.emit({
          type: "cardsRevealed",
          cardIds,
          playerId,
          audience: "public",
          fromZone: "deck",
          ownerId: playerId,
          sourceCardId: choice.payload.sourceCardId,
        });
      }
      for (const cardId of cardIds) {
        assigned.add(cardId as string);
        deckReordered =
          moveCardToScryDestination(state, playerId, cardId, destination.zone, operations) ||
          deckReordered;
      }
    }

    const remainder = orderedRemainder(
      choice.payload.revealedCardIds.filter((id) => !assigned.has(id as string)),
      remainderDestination,
      state,
    );
    for (const cardId of remainder) {
      deckReordered =
        moveCardToScryDestination(state, playerId, cardId, remainderDestination.zone, operations) ||
        deckReordered;
    }
    if (deckReordered) {
      operations.event.emit({ type: "deckCardsPlaced", playerId });
    }
    const selectedCardNames = foundCards
      .map((cardId) => state.G.cardIndex[cardId])
      .filter((card): card is NonNullable<typeof card> => card !== undefined)
      .map((card) => defOf(card).displayName ?? defOf(card).name);
    operations.game.setPendingChoice(undefined);

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
