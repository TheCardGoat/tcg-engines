#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { runFabBenchWithTranscripts } from "../src/automation/bench/index.ts";

const scratch = process.argv[2];
const tag = process.argv[3] ?? "replay-drain";
if (!scratch) throw new Error("usage: rebench-unplayable-heroes.ts <scratch-dir> [tag]");

type Learnings = {
  readonly hero?: string;
  readonly deckId?: string;
  readonly seedBase?: string;
  readonly unplayableCount?: number;
  readonly terminations?: Record<string, number>;
};

const seen = new Set<string>();
const jobs: Array<{ slug: string; hero: string; deckId: string }> = [];
for (const name of readdirSync(scratch)) {
  const path = `${scratch}/${name}/learnings.json`;
  if (!existsSync(path)) continue;
  const learnings = JSON.parse(readFileSync(path, "utf8")) as Learnings;
  const deckId = learnings.deckId;
  const hero = learnings.hero;
  if (!deckId || !hero || seen.has(deckId)) continue;
  if ((learnings.unplayableCount ?? 0) < 1) continue;
  seen.add(deckId);
  jobs.push({ slug: name.replace(/-iter\d+$/, ""), hero, deckId });
}

jobs.sort((left, right) => left.slug.localeCompare(right.slug));
writeFileSync(`${scratch}/rebench-${tag}-jobs.json`, `${JSON.stringify(jobs, null, 2)}\n`);
console.log(`jobs ${jobs.length} tag=${tag}`);

const library = fleshAndBloodDeckCardLibrary;
for (const job of jobs) {
  const out = `${scratch}/${job.slug}-${tag}`;
  mkdirSync(`${out}/transcripts`, { recursive: true });
  const seedBase = `improve-${job.slug}-${tag}`;
  const { report, transcripts } = runFabBenchWithTranscripts({
    cardLibrary: library,
    p1Strategy: "hero-profile",
    p2Strategy: "value-extract",
    p1Deck: job.deckId,
    p2Deck: "cc-edinburgh-1st-gravy-bones",
    matches: 4,
    seedBase,
    maxActions: 400,
    label: job.hero,
  });
  writeFileSync(`${out}/baseline.json`, `${JSON.stringify(report, null, 2)}\n`);
  for (const transcript of transcripts) {
    writeFileSync(`${out}/transcripts/${transcript.seed}.json`, `${JSON.stringify(transcript)}\n`);
  }
  const terms = report.summary.terminations;
  const unplayableCount =
    (terms["max-actions"] ?? 0) +
    (terms.concede ?? 0) +
    (terms.illegal ?? 0) +
    (terms["engine-throw"] ?? 0) +
    (terms.stall ?? 0) +
    (terms["snapshot-refusal"] ?? 0);
  writeFileSync(
    `${out}/learnings.json`,
    `${JSON.stringify(
      {
        hero: job.hero,
        deckId: job.deckId,
        seedBase,
        matchCount: 4,
        terminations: terms,
        unplayableCount,
        p1Wins: report.summary.p1Wins,
        avgTurns: report.summary.avgTurns,
        heuristicLesson: "none this iteration",
        keepReject: "no heuristic this iteration",
        note: "replay after auto-pass drain success-check + Base of the Mountain any-number answers",
      },
      null,
      2,
    )}\n`,
  );
  console.log(
    job.slug,
    JSON.stringify(terms),
    "unplayable",
    unplayableCount,
    "p1",
    report.summary.p1Wins,
  );
}
