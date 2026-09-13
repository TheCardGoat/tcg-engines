#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { listAdultCcLegalHeroPrintings } from "../src/automation/adult-cc-heroes.ts";
import { runFabBenchWithTranscripts } from "../src/automation/bench/index.ts";
import { listFabDecks } from "../src/automation/deck-catalog.ts";
import { validateFabDeckTextFixture } from "../src/automation/validate-text-deck.ts";

const scratch = process.argv[2];
if (!scratch) throw new Error("usage: bench-remaining-cc-heroes.ts <scratch-dir>");

const library = fleshAndBloodDeckCardLibrary;
const cc = listFabDecks({ format: "classic-constructed" });
const remaining = [];
for (const hero of listAdultCcLegalHeroPrintings(library)) {
  if (existsSync(`${scratch}/${hero.slug}-iter1/baseline.json`)) continue;
  const fixture = cc.find(
    (deck) => deck.hero === hero.name && validateFabDeckTextFixture(library, deck).valid,
  );
  if (!fixture) continue;
  remaining.push({ slug: hero.slug, name: hero.name, deckId: fixture.id });
}
console.log(`remaining ${remaining.length}`);
writeFileSync(`${scratch}/remaining-heroes.json`, `${JSON.stringify(remaining, null, 2)}\n`);

for (const hero of remaining) {
  const out = `${scratch}/${hero.slug}-iter1`;
  mkdirSync(`${out}/transcripts`, { recursive: true });
  const { report, transcripts } = runFabBenchWithTranscripts({
    cardLibrary: library,
    p1Strategy: "hero-profile",
    p2Strategy: "value-extract",
    p1Deck: hero.deckId,
    p2Deck: "cc-edinburgh-1st-gravy-bones",
    matches: 4,
    seedBase: `improve-${hero.slug}-1`,
    maxActions: 400,
    label: hero.name,
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
        hero: hero.name,
        deckId: hero.deckId,
        seedBase: `improve-${hero.slug}-1`,
        matchCount: 4,
        terminations: terms,
        unplayableCount,
        p1Wins: report.summary.p1Wins,
        avgTurns: report.summary.avgTurns,
        heuristicLesson: "none this iteration",
        keepReject: "no heuristic this iteration",
      },
      null,
      2,
    )}\n`,
  );
  console.log(hero.slug, JSON.stringify(terms), "p1", report.summary.p1Wins);
}
