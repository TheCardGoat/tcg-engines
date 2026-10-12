import type { DeckCard } from "@tcg/shared/game-adapter";
import { ALPHA_CLASH_META_DECKS, resolveAlphaClashLabDeck } from "./practice-decks";

export {
  ALPHA_CLASH_META_DECKS,
  auditAlphaClashDeck,
  containsUnparsed,
  resolveAlphaClashLabDeck,
  type AlphaClashLabDeck,
} from "./practice-decks";
export {
  ALPHA_CLASH_HEURISTICS,
  alphaClashHeuristicCommand,
  validateAlphaClashOverrides,
  type AlphaClashHeuristics,
} from "./heuristic";

// The lab evaluation keeps meta-v1 as its baseline. All meta policies are oracle.
export const ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY = "meta-v1";
export const ALPHA_CLASH_PRACTICE_STRATEGIES = [
  { id: ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY, name: "Recommended opponent" },
  { id: "practice-v1", name: "Basic opponent" },
] as const;

export const alphaClashPracticeDecks = ALPHA_CLASH_META_DECKS.map((deck) => ({
  id: deck.id,
  name: deck.id === "clarity-hyper-aggro" ? "Clarity Hyper Aggro" : "The Absence — Makati",
  contender: deck.contender,
  mainCount: deck.main.reduce((total, entry) => total + entry.count, 0),
  source: deck.source,
}));

/** Exact lab lists, with Contender and main sections. Sideboards are not played. */
export function getAlphaClashMetaPracticeDeck(id: string): readonly DeckCard[] | undefined {
  if (!ALPHA_CLASH_META_DECKS.some((deck) => deck.id === id)) return undefined;
  const resolved = resolveAlphaClashLabDeck(id);
  const counts = new Map<string, number>();
  for (const cardId of resolved.deckIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  return [
    { cardId: resolved.contenderId, quantity: 1, sectionId: "contender" },
    ...[...counts].map(([cardId, quantity]) => ({ cardId, quantity, sectionId: "main" })),
  ];
}

export function getAlphaClashPracticeCatalog() {
  return {
    decks: alphaClashPracticeDecks.map(({ id, name }) => ({ id, name })),
    strategies: ALPHA_CLASH_PRACTICE_STRATEGIES.map(({ id }) => ({ id })),
  };
}
