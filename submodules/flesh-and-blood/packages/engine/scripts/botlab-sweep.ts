#!/usr/bin/env node
/**
 * Full bot-lab sweep with the snapshot gate on.
 *
 *   node --experimental-transform-types --no-warnings scripts/botlab-sweep.ts --shard 0/4
 *
 * Matrix (every match serializes after EVERY accepted command):
 *   1. hero×hero     — every ordered pair of hero profiles that own a
 *                      tournament deck, each seated on that deck.
 *   2. hero×generic  — each such hero vs the 6 progressing generic strategies.
 *   3. deck gauntlet — every remaining tournament deck (hero-profile vs
 *                      random, 2 seeds) so clash/wager-heavy lists (Tuffnut,
 *                      Fang, …) get exercised too.
 *
 * Shard slices are deterministic (index into the ordered match list), so N
 * processes can run in parallel and results aggregate losslessly. Refusals
 * dump named-invariant evidence via writeFabSnapshotRefusalReport.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { playFabMatch } from "../src/automation/bench/play-match.ts";
import { FAB_DECK_TEXT_FIXTURES } from "../src/automation/deck-text-fixtures.ts";
import { FAB_HERO_PROFILE_BINDINGS } from "../src/automation/heuristic/profiles/hero-strategy-table.ts";
import { writeFabSnapshotRefusalReport } from "../src/snapshot/refusal-report.ts";
import type { FabMatchTranscript } from "../src/automation/bench/types.ts";

const LIFE = 10;
const MAX_ACTIONS = 400;

/** Progressing generic/dispatcher seats (stalling seats excluded by design). */
const GENERIC_STRATEGIES = [
  "hero-profile",
  "value-extract",
  "heuristic",
  "never-defend",
  "first-legal",
  "random",
] as const;

const HERO_STRATEGIES: readonly string[] = FAB_HERO_PROFILE_BINDINGS.map((binding) => binding.id);

function heroDeck(hero: string): string | undefined {
  return FAB_DECK_TEXT_FIXTURES.find((deck) => deck.hero.toLowerCase().includes(hero.toLowerCase()))
    ?.id;
}

interface SweepMatch {
  readonly label: string;
  readonly p1Strategy: string;
  readonly p2Strategy: string;
  readonly p1Deck?: string;
  readonly p2Deck?: string;
}

function buildMatchList(): SweepMatch[] {
  const seatedHeroes = HERO_STRATEGIES.filter((hero) => heroDeck(hero) !== undefined);
  const matches: SweepMatch[] = [];
  for (const p1 of seatedHeroes) {
    for (const p2 of seatedHeroes) {
      matches.push({
        label: `hero:${p1}-vs-${p2}`,
        p1Strategy: p1,
        p2Strategy: p2,
        p1Deck: heroDeck(p1),
        p2Deck: heroDeck(p2),
      });
    }
    for (const generic of GENERIC_STRATEGIES) {
      matches.push({
        label: `mixed:${p1}-vs-${generic}`,
        p1Strategy: p1,
        p2Strategy: generic,
        p1Deck: heroDeck(p1),
      });
    }
  }
  const gauntletDecks = FAB_DECK_TEXT_FIXTURES.map((deck) => deck.id).filter(
    (id) => !seatedHeroes.some((hero) => heroDeck(hero) === id),
  );
  for (const deck of gauntletDecks) {
    for (const seed of [0, 1]) {
      matches.push({
        label: `gauntlet:${deck}:${seed}`,
        p1Strategy: "hero-profile",
        p2Strategy: "random",
        p1Deck: deck,
      });
    }
  }
  return matches;
}

function main(): void {
  const shardArgIndex = process.argv.indexOf("--shard");
  const shardSpec = shardArgIndex >= 0 ? (process.argv[shardArgIndex + 1] ?? "0/1") : "0/1";
  const [shardIndex, shardCount] = shardSpec.split("/").map(Number) as [number, number];
  const matches = buildMatchList().filter((_, index) => index % shardCount === shardIndex);
  const terminations: Record<string, number> = {};
  const catches: Array<Record<string, unknown>> = [];
  const started = performance.now();

  for (const match of matches) {
    const seed = `botlab:${match.label}`;
    const transcript: FabMatchTranscript = playFabMatch({
      cardLibrary: fleshAndBloodDeckCardLibrary,
      seed,
      p1Strategy: match.p1Strategy,
      p2Strategy: match.p2Strategy,
      ...(match.p1Deck ? { p1Deck: match.p1Deck } : {}),
      ...(match.p2Deck ? { p2Deck: match.p2Deck } : {}),
      p1Life: LIFE,
      p2Life: LIFE,
      maxActions: MAX_ACTIONS,
      recordFrames: false,
      snapshotValidation: true,
    });
    terminations[transcript.termination] = (terminations[transcript.termination] ?? 0) + 1;
    // A cap is not a process hang, but it is an unresolved no-convergence
    // outcome.  Surface every one with its reproducible seed so it cannot be
    // mistaken for a successful self-play result or silently regress.
    const unhealthy = transcript.termination !== "life";
    if (unhealthy || transcript.snapshotRefusal) {
      const entry: Record<string, unknown> = {
        label: match.label,
        seed,
        termination: transcript.termination,
        winner: transcript.winnerId,
        actions: transcript.actionCount,
        turns: transcript.turnCount,
        error:
          transcript.error ??
          (transcript.termination === "max-actions"
            ? `Action cap (${MAX_ACTIONS}) reached before the game ended.`
            : null),
      };
      if (transcript.snapshotRefusal) {
        const path = writeFabSnapshotRefusalReport({
          label: `botlab:${match.label}`,
          message: transcript.snapshotRefusal.message,
          issues: transcript.snapshotRefusal.issues,
          stateSummary: transcript.snapshotRefusal.stateSummary,
          rejectedSnapshot: transcript.snapshotRefusal.rejectedSnapshot,
        });
        entry.refusalReport = path;
      }
      catches.push(entry);
      console.error(`CATCH ${match.label}: ${transcript.termination} ${transcript.error ?? ""}`);
    }
    process.stderr.write(`.`);
  }

  const elapsedS = ((performance.now() - started) / 1000).toFixed(0);
  const out = {
    shard: `${shardIndex}/${shardCount}`,
    matches: matches.length,
    elapsedS,
    terminations,
    catches,
  };
  const outPath = resolve(`reports/botlab-sweep/shard-${shardIndex}-of-${shardCount}.json`);
  mkdirSync(resolve("reports/botlab-sweep"), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, { flag: "w" });
  console.error(`\nshard ${shardIndex}/${shardCount}: ${matches.length} matches in ${elapsedS}s`);
  console.error(`terminations: ${JSON.stringify(terminations)}`);
  console.error(`catches: ${catches.length}`);
  console.error(`wrote ${outPath}`);
}

main();
