import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { CardInstance } from "../types/card-instance.ts";
import type { GameState } from "../types/match-state.ts";
import type { CardInstanceId } from "../types/branded.ts";
import { getDefinition, tryGetDefinition } from "./card-registry.ts";

export function tryGetInstance(
  G: GameState,
  id: CardInstanceId | string,
): CardInstance | undefined {
  return G.cardIndex[id as unknown as string];
}

export function getInstance(G: GameState, id: CardInstanceId | string): CardInstance {
  const inst = tryGetInstance(G, id);
  if (!inst) throw new Error(`Card instance not found: ${id as unknown as string}`);
  return inst;
}

/** Static definition for a given card instance. Throws if either lookup fails. */
export function getDefinitionFor(G: GameState, id: CardInstanceId | string): CardDefinition {
  return getDefinition(getInstance(G, id).definitionId);
}

/** Sugar: definition for a CardInstance you already have a reference to. */
export function defOf(card: CardInstance): CardDefinition {
  return getDefinition(card.definitionId);
}

export function tryDefOf(card: CardInstance): CardDefinition | undefined {
  return tryGetDefinition(card.definitionId);
}
