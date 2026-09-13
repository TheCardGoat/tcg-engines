#!/usr/bin/env node
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { runFabBenchWithTranscripts } from "../src/automation/bench/index.ts";

const { report, transcripts } = runFabBenchWithTranscripts({
  cardLibrary: fleshAndBloodDeckCardLibrary,
  p1Strategy: "hero-profile",
  p2Strategy: "value-extract",
  p1Deck: "cc-coverage-bravo-showstopper",
  p2Deck: "cc-edinburgh-1st-gravy-bones",
  matches: 4,
  seedBase: "improve-bravo-showstopper-replay-drain",
  maxActions: 400,
  label: "Bravo, Showstopper",
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
        turnCount: transcript.turnCount,
        error: transcript.error ?? null,
      })),
    },
    null,
    2,
  ),
);
