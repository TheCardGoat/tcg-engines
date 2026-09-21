/// <reference types="node" />
/**
 * Scratch harness: decks 2-10 vs the locked Johnny control, seat-balanced.
 * Both seats run the profile-bound default strategy; the Johnny seat's
 * profile is pinned by content hash so any accidental edit fails loudly.
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
import { authoredDeckStrategyProfiles, deckProfileFor } from "./src/deck-profiles.ts";
import { createTestPlayers } from "./src/test-catalog.ts";

const CONTROL_ID = "authored-johnny-fight-ready-steal";
/** FNV-1a of the locked control profile; bump ONLY when intentionally re-locking. */
const CONTROL_LOCK = "FNVA1:";
function fnv1a(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
const controlJson = JSON.stringify(authoredDeckStrategyProfiles[CONTROL_ID]);
const controlHash = CONTROL_LOCK + fnv1a(controlJson);
if (process.env.CONTROL_LOCK && process.env.CONTROL_LOCK !== controlHash) {
  console.error(`CONTROL PROFILE CHANGED!\nexpected ${process.env.CONTROL_LOCK}\nactual   ${controlHash}`);
  process.exit(3);
}
console.log(`control lock: ${controlHash}`);

const SEATS = Number(process.env.BENCH_SEATS ?? 10);
const decks = createAuthoredBotLabDecks();
const catalog = createStructuredCatalog();
const players = createTestPlayers();
const controlDeck = decks.find((d) => d.id === CONTROL_ID)!;
const controlStrategy = withDeckProfile(
  createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
  deckProfileFor(CONTROL_ID)!,
);

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : decks.map((d) => d.id).filter((id) => id !== CONTROL_ID);

let sumWins = 0, sumGames = 0;
for (const deckId of targets) {
  const deck = decks.find((d) => d.id === deckId);
  if (!deck || deck.id === CONTROL_ID) throw new Error(`bad target deck: ${deckId}`);
  const candidate = withDeckProfile(
    createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default"),
    deckProfileFor(deck.id)!,
  );
  let wins = 0, losses = 0, draws = 0, games = 0;
  for (let i = 0; i < SEATS; i++) {
    const seed = `vs-johnny/${deck.id}/match-${i}`;
    for (const candidateAsP1 of [true, false]) {
      const result = runAutoMatch({
        players,
        decks: candidateAsP1
          ? [deckListFromGenerated(deck, "p1"), deckListFromGenerated(controlDeck, "p2")]
          : [deckListFromGenerated(controlDeck, "p1"), deckListFromGenerated(deck, "p2")],
        strategies: candidateAsP1 ? [candidate, controlStrategy] : [controlStrategy, candidate],
        catalog,
        seed,
      });
      games++;
      if (result.winnerId === null) draws++;
      else if ((result.winnerId === "p1") === candidateAsP1) wins++;
      else losses++;
    }
  }
  sumWins += wins; sumGames += wins + losses;
  console.log(`${deck.id.padEnd(48)} ${String(wins).padStart(3)}-${String(losses).padEnd(3)} (draws ${draws}) ${(wins / (wins + losses) * 100).toFixed(1)}%`);
}
if (targets.length > 1) console.log(`\nTOTAL vs control: ${sumWins}-${sumGames - sumWins} over ${sumGames} decisive games (${(sumWins / sumGames * 100).toFixed(1)}%)`);
