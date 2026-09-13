#!/usr/bin/env node
/**
 * Cycle the shipped FAB bench across every adult CC-legal hero until the
 * wall-clock budget elapses. Writes timestamped reports and a learnings index.
 *
 * Usage:
 *   node --experimental-transform-types --no-warnings scripts/self-improve-12h.ts \
 *     --out-dir <dir> --hours 12 --matches 2
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { listAdultCcLegalHeroPrintings } from "../src/automation/adult-cc-heroes.ts";
import { runFabBenchWithTranscripts } from "../src/automation/bench/index.ts";
import { listFabDecks } from "../src/automation/deck-catalog.ts";
import { validateFabDeckTextFixture } from "../src/automation/validate-text-deck.ts";

const UNPLAYABLE = new Set([
  "max-actions",
  "stall",
  "illegal",
  "engine-throw",
  "snapshot-refusal",
]);

function arg(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  return value && !value.startsWith("--") ? value : fallback;
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function appendLog(path: string, line: string): void {
  writeFileSync(path, `${line}\n`, { flag: "a" });
}

const outDir = resolve(arg("out-dir", "reports/self-improve-12h"));
const hours = Number.parseFloat(arg("hours", "12"));
const matches = Number.parseInt(arg("matches", "2"), 10);
const maxActions = Number.parseInt(arg("max-actions", "250"), 10);
const budgetMs = hours * 60 * 60 * 1000;
const logPath = resolve(outDir, "self-improve-12h.log");
const indexPath = resolve(outDir, "hero-loop-index.json");

mkdirSync(outDir, { recursive: true });
mkdirSync(resolve(outDir, "cycles"), { recursive: true });

const library = fleshAndBloodDeckCardLibrary;
const heroes = listAdultCcLegalHeroPrintings(library);
const ccLists = listFabDecks({ format: "classic-constructed" });
const seats = heroes.map((hero) => {
  const fixture = ccLists.find((deck) => {
    if (deck.hero !== hero.name) return false;
    const result = validateFabDeckTextFixture(library, deck);
    return result.valid && result.unresolved.length === 0;
  });
  return { hero, deckId: fixture?.id ?? null };
});

function readOriginalStart(path: string): Date | null {
  if (!existsSync(path)) return null;
  const line = readFileSync(path, "utf8")
    .split("\n")
    .find((entry) => entry.startsWith("START "));
  const match = line?.match(/^START (\S+)/);
  const parsed = match ? new Date(match[1]) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

const priorStart = readOriginalStart(logPath);
const start = priorStart ?? new Date();
if (!priorStart) {
  appendLog(
    logPath,
    `START ${start.toISOString()} hours=${hours} matches=${matches} heroes=${seats.length}`,
  );
} else {
  appendLog(logPath, `RESUME ${new Date().toISOString()} originalStart=${start.toISOString()}`);
}

const index: {
  start: string;
  end?: string;
  seats: typeof seats;
  cycles: Array<Record<string, unknown>>;
} = existsSync(indexPath)
  ? (JSON.parse(readFileSync(indexPath, "utf8")) as {
      start: string;
      end?: string;
      seats: typeof seats;
      cycles: Array<Record<string, unknown>>;
    })
  : { start: start.toISOString(), seats, cycles: [] };
index.start = start.toISOString();
index.seats = seats;
if (!Array.isArray(index.cycles)) index.cycles = [];
delete index.end;
writeJson(indexPath, index);

let cycle = index.cycles.length;

while (Date.now() - start.getTime() < budgetMs) {
  const seat = seats[cycle % seats.length]!;
  cycle += 1;
  const cycleStarted = new Date();
  if (!seat.deckId) {
    const note = {
      cycle,
      hero: seat.hero.name,
      at: cycleStarted.toISOString(),
      error: "no validator-clean CC list",
    };
    index.cycles.push(note);
    writeJson(indexPath, index);
    appendLog(logPath, `CYCLE ${cycle} SKIP ${seat.hero.name} no-deck`);
    continue;
  }
  const seedBase = `improve-${seat.hero.slug}-c${cycle}`;
  const transcriptsDir = resolve(outDir, "cycles", String(cycle), "transcripts");
  mkdirSync(transcriptsDir, { recursive: true });
  try {
    const { report, transcripts } = runFabBenchWithTranscripts({
      cardLibrary: library,
      p1Strategy: "hero-profile",
      p2Strategy: "value-extract",
      p1Deck: seat.deckId,
      p2Deck: "cc-guilherme-coutinho-rhinar",
      matches,
      seedBase,
      maxActions,
      label: `${seat.hero.name} cycle ${cycle}`,
    });
    for (const transcript of transcripts) {
      writeJson(resolve(transcriptsDir, `${transcript.seed}.json`), transcript);
    }
    const unplayable = transcripts.filter((transcript) => UNPLAYABLE.has(transcript.termination));
    const snapshotRefusals = transcripts.filter((transcript) => transcript.termination === "snapshot-refusal");
    const learnings = {
      cycle,
      at: cycleStarted.toISOString(),
      finishedAt: new Date().toISOString(),
      hero: seat.hero.name,
      deckId: seat.deckId,
      seedBase,
      matchCount: matches,
      terminations: report.summary.terminations,
      unplayableCount: unplayable.length,
      snapshotRefusalCount: snapshotRefusals.length,
      unplayableSeeds: unplayable.map((transcript) => ({
        seed: transcript.seed,
        termination: transcript.termination,
        error: transcript.error ?? null,
      })),
      p1Wins: report.summary.p1Wins,
      p2Wins: report.summary.p2Wins,
      keepReject: "none-this-cycle",
      note:
        unplayable.length > 0
          ? "playability track: unplayable terminations recorded for coach"
          : "playable batch; heuristic lesson deferred to coach",
    };
    writeJson(resolve(outDir, "cycles", String(cycle), "learnings.json"), learnings);
    writeJson(resolve(outDir, "cycles", String(cycle), "bench.json"), report);
    index.cycles.push(learnings);
    writeJson(indexPath, index);
    appendLog(
      logPath,
      `CYCLE ${cycle} ${cycleStarted.toISOString()} hero=${seat.hero.name} deck=${seat.deckId} seed=${seedBase} unplayable=${unplayable.length} terms=${JSON.stringify(report.summary.terminations)}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const note = {
      cycle,
      hero: seat.hero.name,
      deckId: seat.deckId,
      at: cycleStarted.toISOString(),
      error: message,
    };
    index.cycles.push(note);
    writeJson(indexPath, index);
    appendLog(logPath, `CYCLE ${cycle} ERROR ${seat.hero.name} ${message}`);
  }
}

const end = new Date();
index.end = end.toISOString();
writeJson(indexPath, index);
appendLog(
  logPath,
  `END ${end.toISOString()} elapsedMs=${end.getTime() - start.getTime()} cycles=${cycle}`,
);
