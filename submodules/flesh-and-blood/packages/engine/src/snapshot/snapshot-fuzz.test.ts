import { describe, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { FAB_DECK_TEXT_FIXTURES } from "../automation/deck-text-fixtures.ts";
import { runFuzzMatch } from "../testing/snapshot-fuzz-runner.ts";
import { writeFabSnapshotRefusalReport } from "./refusal-report.ts";

/**
 * Local snapshot-refusal fuzzer (run with FAB_SNAPSHOT_FUZZ=1):
 *
 *   FAB_SNAPSHOT_FUZZ=1 vp test run src/snapshot/snapshot-fuzz.test.ts
 *
 * Plays uniformly random legal commands on real catalog decks with randomized
 * priority-automation modes, serializing after EVERY command. Any state the
 * engine cannot persist is a P0 bug; on refusal this dumps the command
 * history, the named failed invariants, and the rejected snapshot DTO to
 * reports/snapshot-fuzz/ for offline root-causing.
 */

const SEEDS_PER_DECK = Number(process.env.FAB_SNAPSHOT_FUZZ_SEEDS ?? 3);
const DECK_FILTER = process.env.FAB_SNAPSHOT_FUZZ_DECKS?.split(",").filter(Boolean);

describe("local FAB snapshot-refusal fuzz", () => {
  it.skipIf(process.env.CI === "true" || process.env.FAB_SNAPSHOT_FUZZ !== "1")(
    "keeps every intermediate state of random play persistable",
    () => {
      const decks = FAB_DECK_TEXT_FIXTURES.map((fixture) => fixture.id).filter(
        (id) => !DECK_FILTER || DECK_FILTER.includes(id),
      );
      const terminations = new Map<string, number>();
      for (const player1DeckId of decks) {
        for (let index = 0; index < SEEDS_PER_DECK; index += 1) {
          const seed = `snapshot-fuzz:${player1DeckId}:${index}`;
          try {
            const { termination } = runFuzzMatch({
              cardLibrary: fleshAndBloodDeckCardLibrary,
              seed,
              player1DeckId,
            });
            terminations.set(termination, (terminations.get(termination) ?? 0) + 1);
          } catch (error) {
            const refusal = error as {
              issues?: unknown;
              stateSummary?: unknown;
              rejectedSnapshot?: unknown;
              fuzzHistory?: unknown;
              message?: string;
            };
            writeFabSnapshotRefusalReport({
              label: seed,
              message: refusal.message ?? String(error),
              issues: refusal.issues,
              stateSummary: refusal.stateSummary,
              rejectedSnapshot: refusal.rejectedSnapshot,
              history: refusal.fuzzHistory,
            });
            throw error;
          }
        }
      }
      console.log("snapshot fuzz terminations", Object.fromEntries(terminations));
    },
    1_200_000,
  );
});
