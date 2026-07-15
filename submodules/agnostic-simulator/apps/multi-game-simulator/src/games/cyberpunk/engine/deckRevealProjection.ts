import { defOf, type MatchState } from "@tcg/cyberpunk-engine";
import type { SimulatorDeckReveal, SimulatorDeckRevealCard } from "@tcg/simulator-contract";

export function buildCyberpunkDeckReveal(input: {
  id: string;
  zoneId: string;
  ownerId: string | undefined;
  position?: SimulatorDeckReveal["position"];
  visibility?: SimulatorDeckReveal["visibility"];
  turnNumber: number;
  cardIds: readonly string[];
  fallbackNames?: readonly string[];
  count: number;
  matchState: MatchState;
  requireDeckPosition?: boolean;
}): SimulatorDeckReveal | undefined {
  if (input.count <= 0) {
    return undefined;
  }

  const position = input.position ?? "top";
  if (
    input.requireDeckPosition === true &&
    input.ownerId &&
    input.cardIds.length > 0 &&
    !cardIdsAtDeckPosition(input.matchState, input.ownerId, input.cardIds, position)
  ) {
    return undefined;
  }

  const visibility =
    input.visibility ??
    (input.cardIds.length > 0 || (input.fallbackNames?.length ?? 0) > 0 ? "public" : "private");

  return {
    id: input.id,
    zoneId: input.zoneId,
    ownerId: input.ownerId,
    position,
    visibility,
    turnNumber: input.turnNumber,
    count: input.count,
    cards:
      visibility === "public"
        ? input.cardIds.length > 0
          ? input.cardIds.map((cardId) => cardToDeckRevealCard(input.matchState, cardId))
          : (input.fallbackNames ?? []).map((name, index) => ({
              entityId: `${input.id}:${index}`,
              title: name,
              subtitle: "Revealed card",
            }))
        : [],
  };
}

export function cardToDeckRevealCard(
  matchState: MatchState,
  cardId: string,
): SimulatorDeckRevealCard {
  const card = matchState.G.cardIndex[cardId];
  if (!card) {
    return { entityId: cardId, title: "Revealed card" };
  }
  const definition = defOf(card);
  return {
    entityId: cardId,
    title: definition.displayName ?? definition.name,
    subtitle: [
      definition.type,
      typeof definition.cost === "number" ? `Cost ${definition.cost}` : undefined,
      typeof definition.power === "number" ? `Power ${definition.power}` : undefined,
    ]
      .filter((part): part is string => part !== undefined)
      .join(" / "),
    imageUrl: definition.imageUrl,
    frameColor: cardFrameColor(definition.color),
  };
}

export function cardFrameColor(color: string | undefined): string | undefined {
  switch (color) {
    case "blue":
      return "#3b82f6";
    case "green":
      return "#22c55e";
    case "red":
      return "#ef4444";
    case "yellow":
      return "#eab308";
    default:
      return undefined;
  }
}

function cardIdsAtDeckPosition(
  matchState: MatchState,
  ownerId: string,
  cardIds: readonly string[],
  position: SimulatorDeckReveal["position"],
): boolean {
  const deck = matchState.G.players[ownerId]?.zones.deck.map(String) ?? [];
  const expected =
    position === "bottom" ? deck.slice(-cardIds.length) : deck.slice(0, cardIds.length);
  return cardIds.every((cardId, index) => expected[index] === cardId);
}
