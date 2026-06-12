import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DECK_FIXTURES } from "../../lib/features/simulator-devtools/deck-fixtures/index.js";
import {
  buildCuratedSuiteSummaryLine,
  buildTriageDigestConsoleOutput,
  getStrategyArtifactRoot,
  runCuratedStrategySuite,
  strategyArtifactsExist,
} from "./strategy-suite.js";

const STRATEGY_SUITE_TIMEOUT_MS = process.env.CI ? 120_000 : 90_000;
const RUN_STRATEGY_SMOKE_SUITE =
  Boolean(process.env.CI) || process.env.RUN_STRATEGY_SMOKE_SUITE === "1";

describe("strategy evaluation suite", () => {
  it.if(RUN_STRATEGY_SMOKE_SUITE)(
    "runs the curated matchup matrix without deadlocks and writes artifacts",
    () => {
      const { digest, summary } = runCuratedStrategySuite();

      expect(summary.matches.length).toBe(DECK_FIXTURES.length * 2);
      expect(summary.matches.every((match) => match.deadlock === false)).toBe(true);
      expect(strategyArtifactsExist(summary)).toBe(true);
      expect(summary.matches.every((match) => match.endReason === "winner")).toBe(true);
      expect(existsSync(join(getStrategyArtifactRoot(), "run-summary.json"))).toBe(true);
      expect(existsSync(join(getStrategyArtifactRoot(), "benchmark-summary.json"))).toBe(true);
      expect(existsSync(join(getStrategyArtifactRoot(), "benchmark-summary.md"))).toBe(true);
      expect(existsSync(join(getStrategyArtifactRoot(), "triage-digest.md"))).toBe(true);

      console.log(buildCuratedSuiteSummaryLine(summary));
      console.log(buildTriageDigestConsoleOutput(digest));
    },
    { timeout: STRATEGY_SUITE_TIMEOUT_MS },
  );
});
