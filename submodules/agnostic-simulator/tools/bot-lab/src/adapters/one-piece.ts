import { fileURLToPath } from "node:url";

import {
  createSt01MirrorPracticeConfig,
  getOnePieceAutomatedActionStrategyOption,
  getSafeOnePieceAutomatedActionStrategyOption,
  runBotMatch,
} from "../../../../../one-piece/packages/engine/src/index.ts";
import { stableBotHash, type BotEvaluationReportV1, type BotMatchRecordV1 } from "@tcg/bot-core";

import type { BotLabAdapter, BotLabMatchInput } from "../adapter.ts";
import { candidateWinner, promotionWrite, strategyDescriptor } from "./shared.ts";

const PROMOTION_PATH = fileURLToPath(
  new URL(
    "../../../../../one-piece/packages/engine/src/automation/promotions/current.json",
    import.meta.url,
  ),
);

function descriptor(id: string) {
  const option = getOnePieceAutomatedActionStrategyOption(id);
  if (!option) return undefined;
  return strategyDescriptor({
    game: "one-piece",
    id,
    label: option.label,
    strategyVersion: "1",
    informationPolicy: option.informationPolicy,
    cardProfileVersion: "1",
    productionEligible: option.testOnly !== true,
  });
}

function run(input: {
  readonly seed: string;
  readonly candidateSeat: "p1" | "p2";
  readonly candidateStrategyId: string;
  readonly baselineStrategyId: string;
  readonly blockId: string;
  readonly legId: string;
}): BotMatchRecordV1 {
  const candidate = getSafeOnePieceAutomatedActionStrategyOption(
    input.candidateStrategyId,
  ).strategy;
  const baseline = getSafeOnePieceAutomatedActionStrategyOption(input.baselineStrategyId).strategy;
  const candidateIsP1 = input.candidateSeat === "p1";
  const result = runBotMatch(
    createSt01MirrorPracticeConfig({ firstPlayer: "south", seed: input.seed }),
    {
      south: candidateIsP1 ? candidate : baseline,
      north: candidateIsP1 ? baseline : candidate,
    },
    { maxCommands: 1_000, seed: input.seed },
  );
  const winnerIsP1 = result.winner === null ? null : result.winner === "south";
  return {
    blockId: input.blockId,
    legId: input.legId,
    seed: input.seed,
    candidateSeat: input.candidateSeat,
    candidateDeckId: "st01",
    baselineDeckId: "st01",
    winner: candidateWinner({ winnerIsP1, candidateSeat: input.candidateSeat }),
    termination: result.termination,
    turnCount: result.finalState.turnNumber,
    actionCount: result.totalCommands,
    finalStateHash: stableBotHash({
      winner: result.finalState.winner,
      turn: result.finalState.turnNumber,
      players: result.finalState.players,
    }),
    diagnostics: { illegalCommands: result.illegalCommands },
  };
}

export const onePieceBotLabAdapter: BotLabAdapter = {
  game: "one-piece",
  adapterVersion: "1",
  getEngineRevision: () => stableBotHash("one-piece-bot-v1"),
  getCardCatalogHash: () => stableBotHash(createSt01MirrorPracticeConfig()),
  getCurrentDefaultStrategyId: () => getSafeOnePieceAutomatedActionStrategyOption().id,
  getStrategyDescriptor: descriptor,
  getCandidateDescriptor: (manifest) => {
    const value = descriptor(manifest.candidateId);
    if (!value) throw new Error(`Unknown One Piece strategy: ${manifest.candidateId}`);
    return value;
  },
  getPromotionDeckPairs: () => [{ id: "st01-mirror", deckA: "st01", deckB: "st01" }],
  runMatch: (input: BotLabMatchInput) =>
    run({
      seed: input.scheduledMatch.seed,
      candidateSeat: input.scheduledMatch.p1Controller === "candidate" ? "p1" : "p2",
      candidateStrategyId: input.candidateManifest.candidateId,
      baselineStrategyId: input.baselineStrategyId,
      blockId: input.scheduledMatch.blockId,
      legId: input.scheduledMatch.legId,
    }),
  replayMatch: (record: BotMatchRecordV1, report: BotEvaluationReportV1) =>
    run({
      seed: record.seed,
      candidateSeat: record.candidateSeat,
      candidateStrategyId: report.candidate.id,
      baselineStrategyId: report.baseline.id,
      blockId: record.blockId,
      legId: record.legId,
    }),
  planPromotion: (record) => promotionWrite(PROMOTION_PATH, record),
  doctor: () => ({
    ok: true,
    checks: [
      { name: "default", ok: true, detail: getSafeOnePieceAutomatedActionStrategyOption().id },
      { name: "seeded-harness", ok: true, detail: "ST01 mirror adapter available" },
    ],
  }),
};
