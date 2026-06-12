import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "bun:test";
import {
  deckAwareLoreRaceAutomatedActionStrategy,
  type AutomatedActionDecisionTrace,
} from "@tcg/lorcana-engine";
import {
  amberAmethystAggressive,
  amberSteelGoofyLilo,
  steelSapphireMidrange,
} from "../../lib/features/simulator-devtools/deck-fixtures/index.js";
import { simulateAutomatedDeckMatch } from "./strategy-suite.js";

const artifactRoots: string[] = [];

function readTraceHeuristic(
  trace: AutomatedActionDecisionTrace | undefined,
  key: string,
): boolean | number | string | undefined {
  return trace?.selectedCandidate?.heuristics.find((heuristic) => heuristic.key === key)?.value;
}

afterEach(() => {
  while (artifactRoots.length > 0) {
    const artifactRoot = artifactRoots.pop();
    if (artifactRoot) {
      rmSync(artifactRoot, { force: true, recursive: true });
    }
  }
});

describe("deck-aware strategy fixture integration", () => {
  it(
    "derives color-pair heuristics from real fixture deck contents instead of fixture ids",
    () => {
      const artifactRoot = mkdtempSync(join(tmpdir(), "deck-aware-strategy-"));
      artifactRoots.push(artifactRoot);

      const summary = simulateAutomatedDeckMatch({
        artifactRoot,
        matchId: "deck-aware-fixture-color-derivation",
        playerOne: {
          fixture: amberAmethystAggressive,
          id: "amberAmethystAggressive",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        playerTwo: {
          fixture: steelSapphireMidrange,
          id: "steelSapphireMidrange",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        seed: "deck-aware-strategy:fixture-color-derivation",
        turnLimit: 20,
      });

      const traces = readFileSync(summary.artifactPaths.strategyDecisions, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AutomatedActionDecisionTrace);
      const playerOneTrace = traces.find(
        (trace) => trace.actorId === "player_one" && trace.selectedCandidate,
      );
      const playerTwoTrace = traces.find(
        (trace) => trace.actorId === "player_two" && trace.selectedCandidate,
      );
      const playerOneWeightedTrace = traces.find(
        (trace) =>
          trace.actorId === "player_one" &&
          readTraceHeuristic(trace, "topWeightContributors") !== undefined &&
          readTraceHeuristic(trace, "topWeightContributors") !== "none",
      );

      expect(readTraceHeuristic(playerOneTrace, "profileName")).toBe("amethyst-ruby");
      expect(readTraceHeuristic(playerTwoTrace, "profileName")).toBe("sapphire-steel");
      expect(readTraceHeuristic(playerOneTrace, "matchupPair")).toBe(
        "amethyst-ruby__vs__sapphire-steel",
      );
      expect(readTraceHeuristic(playerTwoTrace, "matchupPair")).toBe(
        "sapphire-steel__vs__amethyst-ruby",
      );
      expect(readTraceHeuristic(playerOneTrace, "turnBucket")).toBe("opening");
      expect(readTraceHeuristic(playerOneWeightedTrace, "topWeightContributors")).not.toBe("none");
    },
    { timeout: 20000 },
  );

  it(
    "changes opening trace heuristics for the same sapphire-steel fixture across opponent colors",
    () => {
      const aggressiveArtifactRoot = mkdtempSync(join(tmpdir(), "deck-aware-opening-amber-steel-"));
      const controlArtifactRoot = mkdtempSync(join(tmpdir(), "deck-aware-opening-amethyst-ruby-"));
      artifactRoots.push(aggressiveArtifactRoot, controlArtifactRoot);

      const amberSteelSummary = simulateAutomatedDeckMatch({
        artifactRoot: aggressiveArtifactRoot,
        matchId: "deck-aware-opening-vs-amber-steel",
        playerOne: {
          fixture: steelSapphireMidrange,
          id: "steelSapphireMidrange",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        playerTwo: {
          fixture: amberSteelGoofyLilo,
          id: "amberSteelGoofyLilo",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        seed: "deck-aware-strategy:opening-vs-amber-steel",
        turnLimit: 20,
      });
      const amethystRubySummary = simulateAutomatedDeckMatch({
        artifactRoot: controlArtifactRoot,
        matchId: "deck-aware-opening-vs-amethyst-ruby",
        playerOne: {
          fixture: steelSapphireMidrange,
          id: "steelSapphireMidrange",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        playerTwo: {
          fixture: amberAmethystAggressive,
          id: "amberAmethystAggressive",
          strategy: deckAwareLoreRaceAutomatedActionStrategy,
        },
        seed: "deck-aware-strategy:opening-vs-amethyst-ruby",
        turnLimit: 20,
      });

      const amberSteelTraces = readFileSync(
        amberSteelSummary.artifactPaths.strategyDecisions,
        "utf8",
      )
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AutomatedActionDecisionTrace);
      const amethystRubyTraces = readFileSync(
        amethystRubySummary.artifactPaths.strategyDecisions,
        "utf8",
      )
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AutomatedActionDecisionTrace);

      const amberSteelOpeningTrace = amberSteelTraces.find(
        (trace) =>
          trace.actorId === "player_one" &&
          trace.selectedCandidate?.family === "putCardIntoInkwell",
      );
      const amethystRubyOpeningTrace = amethystRubyTraces.find(
        (trace) =>
          trace.actorId === "player_one" &&
          trace.selectedCandidate?.family === "putCardIntoInkwell",
      );

      expect(readTraceHeuristic(amberSteelOpeningTrace, "profileName")).toBe("sapphire-steel");
      expect(readTraceHeuristic(amethystRubyOpeningTrace, "profileName")).toBe("sapphire-steel");
      expect(readTraceHeuristic(amberSteelOpeningTrace, "matchupPair")).toBe(
        "sapphire-steel__vs__amber-steel",
      );
      expect(readTraceHeuristic(amethystRubyOpeningTrace, "matchupPair")).toBe(
        "sapphire-steel__vs__amethyst-ruby",
      );
      expect(readTraceHeuristic(amberSteelOpeningTrace, "turnBucket")).toBe("opening");
      expect(readTraceHeuristic(amethystRubyOpeningTrace, "turnBucket")).toBe("opening");
      expect(readTraceHeuristic(amberSteelOpeningTrace, "openingFamilyBias")).toBe(1);
      expect(readTraceHeuristic(amethystRubyOpeningTrace, "openingFamilyBias")).toBe(0);
    },
    { timeout: 20000 },
  );
});
