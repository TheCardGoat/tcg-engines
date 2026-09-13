#!/usr/bin/env node
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { runFabBenchWithTranscripts } from "../src/automation/bench/index.ts";

const { report, transcripts } = runFabBenchWithTranscripts({
  cardLibrary: fleshAndBloodDeckCardLibrary,
  p1Strategy: "hero-profile",
  p2Strategy: "value-extract",
  p1Deck: "cc-edinburgh-5th-vynnset",
  p2Deck: "cc-edinburgh-1st-gravy-bones",
  matches: 4,
  seedBase: "improve-vynnset-iron-maiden-replay-drain",
  maxActions: 400,
  label: "Vynnset, Iron Maiden",
});
console.log(
  JSON.stringify(
    {
      terminations: report.summary.terminations,
      p1Wins: report.summary.p1Wins,
      avgTurns: report.summary.avgTurns,
      seeds: transcripts.map((transcript) => ({
        seed: transcript.seed,
        termination: transcript.termination,
        actionCount: transcript.actionCount,
        error: transcript.error ?? null,
      })),
    },
    null,
    2,
  ),
);
