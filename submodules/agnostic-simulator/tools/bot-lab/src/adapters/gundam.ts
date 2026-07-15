import { fileURLToPath } from "node:url";

import {
  fingerprint,
  getGundamAutomatedActionStrategyOption,
  getSafeGundamAutomatedActionStrategyOption,
  playMatch,
  type CandidateStrategy,
  type PlayMatchTermination,
} from "@tcg/gundam-engine";
import {
  stableBotHash,
  type BotEvaluationReportV1,
  type BotMatchRecordV1,
  type BotTerminationReason,
} from "@tcg/bot-core";

import {
  buildBenchRuntime,
  PLAYER_ONE,
  PLAYER_TWO,
  REGISTERED_DECKS,
} from "../../../../../gundam/tools/bot-bench/src/runtime.ts";
import { REGISTERED_STRATEGIES } from "../../../../../gundam/tools/bot-bench/src/strategies.ts";
import type { BotLabAdapter, BotLabMatchInput } from "../adapter.ts";
import { candidateWinner, promotionWrite, strategyDescriptor } from "./shared.ts";

const PROMOTION_PATH = fileURLToPath(
  new URL(
    "../../../../../gundam/packages/engine/src/automation/promotions/current.json",
    import.meta.url,
  ),
);

function strategyFor(id: string): CandidateStrategy {
  return (
    REGISTERED_STRATEGIES[id as keyof typeof REGISTERED_STRATEGIES] ??
    getSafeGundamAutomatedActionStrategyOption(id).strategy
  );
}

function mapTermination(
  termination: PlayMatchTermination,
  winReason: string | null,
): BotTerminationReason {
  if (termination === "automation-concession") return "automation-concession";
  if (termination === "repeated-state") return "repeated-state";
  if (termination === "max-actions-exceeded") return "max-actions";
  if (termination === "concede-failed") return "infrastructure-error";
  if (winReason === "DECK_OUT") return "deck-out";
  if (winReason === "CONCEDE") return "player-concession";
  return "rules-win";
}

function descriptor(id: string) {
  const option = getGundamAutomatedActionStrategyOption(id);
  return strategyDescriptor({
    game: "gundam",
    id,
    label: option?.label ?? id,
    strategyVersion: "1",
    informationPolicy: option?.informationPolicy ?? "oracle",
    cardProfileVersion: "1",
    productionEligible: option?.testOnly !== true,
  });
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
  const candidateDeck = REGISTERED_DECKS[input.candidateDeckId as keyof typeof REGISTERED_DECKS];
  const baselineDeck = REGISTERED_DECKS[input.baselineDeckId as keyof typeof REGISTERED_DECKS];
  if (!candidateDeck || !baselineDeck) throw new Error("Unknown Gundam bot-lab deck");
  const candidateIsP1 = input.candidateSeat === "p1";
  const { runtime, staticResources } = buildBenchRuntime({
    p1Deck: candidateIsP1 ? candidateDeck : baselineDeck,
    p2Deck: candidateIsP1 ? baselineDeck : candidateDeck,
    seed: input.seed,
  });
  const strategies = new Map([
    [PLAYER_ONE, strategyFor(candidateIsP1 ? input.candidateStrategyId : input.baselineStrategyId)],
    [PLAYER_TWO, strategyFor(candidateIsP1 ? input.baselineStrategyId : input.candidateStrategyId)],
  ]);
  const outcome = playMatch(runtime, strategies, staticResources, { trace: false });
  const winnerIsP1 = outcome.winner === null ? null : outcome.winner === PLAYER_ONE;
  return {
    blockId: input.blockId,
    legId: input.legId,
    seed: input.seed,
    candidateSeat: input.candidateSeat,
    candidateDeckId: input.candidateDeckId,
    baselineDeckId: input.baselineDeckId,
    winner: candidateWinner({ winnerIsP1, candidateSeat: input.candidateSeat }),
    termination: mapTermination(outcome.termination, outcome.winReason),
    turnCount: outcome.turnCount,
    actionCount: outcome.actionCount,
    finalStateHash: stableBotHash(fingerprint(outcome.finalState)),
  };
}

export const gundamBotLabAdapter: BotLabAdapter = {
  game: "gundam",
  adapterVersion: "1",
  getEngineRevision: () => stableBotHash(Object.keys(REGISTERED_STRATEGIES).sort()),
  getCardCatalogHash: () => stableBotHash(REGISTERED_DECKS),
  getCurrentDefaultStrategyId: () => getSafeGundamAutomatedActionStrategyOption().id,
  getStrategyDescriptor: (id) =>
    getGundamAutomatedActionStrategyOption(id) || id in REGISTERED_STRATEGIES
      ? descriptor(id)
      : undefined,
  getCandidateDescriptor: (manifest) => {
    const value = gundamBotLabAdapter.getStrategyDescriptor(manifest.candidateId);
    if (!value) throw new Error(`Unknown Gundam strategy: ${manifest.candidateId}`);
    return value;
  },
  getPromotionDeckPairs: () => [
    { id: "ef-mirror", deckA: "ef-starter", deckB: "ef-starter" },
    { id: "seed-mirror", deckA: "seed-aggro", deckB: "seed-aggro" },
    { id: "mixed-cross", deckA: "gd01-mixed", deckB: "seed-aggro" },
  ],
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
  planPromotion: (record) => {
    if (!getGundamAutomatedActionStrategyOption(record.promotedStrategyId)) {
      throw new Error("Gundam promotion requires the candidate in the canonical engine registry");
    }
    return promotionWrite(PROMOTION_PATH, record);
  },
  doctor: () => ({
    ok: Object.keys(REGISTERED_DECKS).length >= 3,
    checks: [
      {
        name: "decks",
        ok: Object.keys(REGISTERED_DECKS).length >= 3,
        detail: `${Object.keys(REGISTERED_DECKS).length} registered`,
      },
      { name: "default", ok: true, detail: getSafeGundamAutomatedActionStrategyOption().id },
    ],
  }),
};
