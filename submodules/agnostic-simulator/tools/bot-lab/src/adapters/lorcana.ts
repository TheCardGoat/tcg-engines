import { fileURLToPath } from "node:url";

import {
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
} from "@tcg/lorcana-engine";
import {
  stableBotHash,
  type BotEvaluationReportV1,
  type BotMatchRecordV1,
  type BotTerminationReason,
} from "@tcg/bot-core";

import { DECK_FIXTURES } from "../../../../../lorcana/packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/deck-fixtures/index.ts";
import {
  simulateAutomatedDeckMatch,
  type StrategyMatchSummary,
} from "../../../../../lorcana/packages/lorcana/lorcana-simulator/src/testing/ai-strategy/strategy-suite.ts";
import { CORE_STRATEGY_BENCHMARK_DECK_IDS } from "../../../../../lorcana/packages/lorcana/lorcana-simulator/src/testing/ai-strategy/strategy-iteration.ts";
import type { BotLabAdapter, BotLabMatchInput } from "../adapter.ts";
import { candidateWinner, promotionWrite, strategyDescriptor } from "./shared.ts";

const PROMOTION_PATH = fileURLToPath(
  new URL(
    "../../../../../lorcana/packages/lorcana/lorcana-engine/src/automation/promotions/current.json",
    import.meta.url,
  ),
);
const ARTIFACT_ROOT = "/tmp/tcg-bot-lab/lorcana";

function descriptor(id: string) {
  const option = getAutomatedActionStrategyOption(id);
  if (!option) return undefined;
  return strategyDescriptor({
    game: "lorcana",
    id,
    label: option.label,
    strategyVersion: "1",
    informationPolicy: option.informationPolicy,
    cardProfileVersion: "best-ai-v1",
    productionEligible: option.testOnly !== true,
  });
}

function mapTermination(summary: StrategyMatchSummary): BotTerminationReason {
  if (summary.endReason === "automation-concession") return "automation-concession";
  if (summary.endReason === "repeated-state-deadlock") return "repeated-state";
  if (summary.endReason === "turn-limit" || summary.endReason === "action-limit")
    return "max-actions";
  if (summary.gameEndReason?.toLowerCase().includes("deck")) return "deck-out";
  if (summary.gameEndReason?.toLowerCase().includes("concede")) return "player-concession";
  return "rules-win";
}

function run(input: {
  readonly seed: string;
  readonly candidateSeat: "p1" | "p2";
  readonly candidateDeckId: string;
  readonly baselineDeckId: string;
  readonly candidateStrategyId: string;
  readonly baselineStrategyId: string;
  readonly blockId: string;
  readonly legId: string;
}): BotMatchRecordV1 {
  const candidateDeck = DECK_FIXTURES.find((fixture) => fixture.id === input.candidateDeckId);
  const baselineDeck = DECK_FIXTURES.find((fixture) => fixture.id === input.baselineDeckId);
  if (!candidateDeck || !baselineDeck) throw new Error("Unknown Lorcana bot-lab deck");
  const candidate = getSafeAutomatedActionStrategyOption(input.candidateStrategyId);
  const baseline = getSafeAutomatedActionStrategyOption(input.baselineStrategyId);
  const candidateIsP1 = input.candidateSeat === "p1";
  const summary = simulateAutomatedDeckMatch({
    artifactRoot: ARTIFACT_ROOT,
    matchId: `${input.blockId}/${input.legId}`.replaceAll("/", "__"),
    seed: input.seed,
    playerOne: candidateIsP1
      ? {
          fixture: candidateDeck,
          id: input.candidateDeckId,
          strategy: candidate.strategy,
          strategyId: candidate.id,
        }
      : {
          fixture: baselineDeck,
          id: input.baselineDeckId,
          strategy: baseline.strategy,
          strategyId: baseline.id,
        },
    playerTwo: candidateIsP1
      ? {
          fixture: baselineDeck,
          id: input.baselineDeckId,
          strategy: baseline.strategy,
          strategyId: baseline.id,
        }
      : {
          fixture: candidateDeck,
          id: input.candidateDeckId,
          strategy: candidate.strategy,
          strategyId: candidate.id,
        },
  });
  const winnerIsP1 = summary.winner === undefined ? null : summary.winner === "player_one";
  return {
    blockId: input.blockId,
    legId: input.legId,
    seed: input.seed,
    candidateSeat: input.candidateSeat,
    candidateDeckId: input.candidateDeckId,
    baselineDeckId: input.baselineDeckId,
    winner: candidateWinner({ winnerIsP1, candidateSeat: input.candidateSeat }),
    termination: mapTermination(summary),
    turnCount: summary.turns,
    actionCount: summary.actions,
    finalStateHash: stableBotHash({
      winner: summary.winner,
      loreTotals: summary.loreTotals,
      turns: summary.turns,
      actions: summary.actions,
    }),
    diagnostics: {
      deadlockConcedeCount: summary.deadlockConcedeCount,
      unsupported: summary.diagnosticCounts.unsupported,
      validation: summary.diagnosticCounts.validation,
    },
  };
}

export const lorcanaBotLabAdapter: BotLabAdapter = {
  game: "lorcana",
  adapterVersion: "1",
  getEngineRevision: () => stableBotHash("lorcana-bot-v1"),
  getCardCatalogHash: () => stableBotHash(DECK_FIXTURES.map((fixture) => fixture.id)),
  getCurrentDefaultStrategyId: () => getSafeAutomatedActionStrategyOption().id,
  getStrategyDescriptor: descriptor,
  getCandidateDescriptor: (manifest) => {
    const value = descriptor(manifest.candidateId);
    if (!value) throw new Error(`Unknown Lorcana strategy: ${manifest.candidateId}`);
    return value;
  },
  getPromotionDeckPairs: () =>
    CORE_STRATEGY_BENCHMARK_DECK_IDS.map((deckId) => ({
      id: `${deckId}-mirror`,
      deckA: deckId,
      deckB: deckId,
    })),
  runMatch: (input: BotLabMatchInput) => {
    const candidateSeat = input.scheduledMatch.p1Controller === "candidate" ? "p1" : "p2";
    return run({
      seed: input.scheduledMatch.seed,
      candidateSeat,
      candidateDeckId:
        candidateSeat === "p1" ? input.scheduledMatch.p1DeckId : input.scheduledMatch.p2DeckId,
      baselineDeckId:
        candidateSeat === "p1" ? input.scheduledMatch.p2DeckId : input.scheduledMatch.p1DeckId,
      candidateStrategyId: input.candidateManifest.candidateId,
      baselineStrategyId: input.baselineStrategyId,
      blockId: input.scheduledMatch.blockId,
      legId: input.scheduledMatch.legId,
    });
  },
  replayMatch: (record: BotMatchRecordV1, report: BotEvaluationReportV1) =>
    run({
      ...record,
      candidateStrategyId: report.candidate.id,
      baselineStrategyId: report.baseline.id,
    }),
  planPromotion: (record) => promotionWrite(PROMOTION_PATH, record),
  doctor: () => ({
    ok: CORE_STRATEGY_BENCHMARK_DECK_IDS.length === 4,
    checks: [
      {
        name: "decks",
        ok: true,
        detail: `${CORE_STRATEGY_BENCHMARK_DECK_IDS.length} core promotion decks`,
      },
      { name: "default", ok: true, detail: getSafeAutomatedActionStrategyOption().id },
    ],
  }),
};
