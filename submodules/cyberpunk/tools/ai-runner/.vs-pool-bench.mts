/// <reference types="node" />
/**
 * Scratch: one deck vs ALL others, seat-balanced, profiles bound on both
 * seats. Prints per-opponent and aggregate win rate for the target deck.
 * Control lock same as the vs-Johnny harness.
 */
import {
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  runAutoMatch,
  withDeckProfile,
} from "@tcg/cyberpunk-engine";
import {
  createAuthoredBotLabDecks,
  createStructuredCatalog,
  deckListFromGenerated,
} from "./src/legal-decks.ts";
import { deckProfileFor } from "./src/deck-profiles.ts";
import { createTestPlayers } from "./src/test-catalog.ts";

const deckId = process.argv[2]!;
const SEATS = Number(process.env.BENCH_SEATS ?? 8);
const decks = createAuthoredBotLabDecks();
const catalog = createStructuredCatalog();
const players = createTestPlayers();
const deck = decks.find((d) => d.id === deckId)!;
const candidate = withDeckProfile(
  createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
  deckProfileFor(deck.id)!,
);

let sumW = 0, sumL = 0;
for (const opp of decks) {
  if (opp.id === deck.id) continue;
  const opponent = withDeckProfile(
    createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
    deckProfileFor(opp.id)!,
  );
  let w = 0, l = 0, draws = 0;
  for (let i = 0; i < SEATS; i++) {
    const seed = `vs-pool/${deck.id}/vs-${opp.id}/match-${i}`;
    for (const asP1 of [true, false]) {
      const r = runAutoMatch({
        players,
        decks: asP1
          ? [deckListFromGenerated(deck, "p1"), deckListFromGenerated(opp, "p2")]
          : [deckListFromGenerated(opp, "p1"), deckListFromGenerated(deck, "p2")],
        strategies: asP1 ? [candidate, opponent] : [opponent, candidate],
        catalog,
        seed,
      });
      if (r.winnerId === null) draws++;
      else if ((r.winnerId === "p1") === asP1) w++;
      else l++;
    }
  }
  sumW += w; sumL += l;
  console.log(`vs ${opp.id.padEnd(48)} ${String(w).padStart(2)}-${String(l).padEnd(2)} ${(w / (w + l) * 100).toFixed(0)}%`);
}
console.log(`\n${deck.id}: ${sumW}-${sumL} over ${sumW + sumL} decisive games (${(sumW / (sumW + sumL) * 100).toFixed(1)}%)`);
