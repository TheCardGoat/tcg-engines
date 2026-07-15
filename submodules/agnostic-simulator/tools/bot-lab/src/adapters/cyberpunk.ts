import { fileURLToPath } from "node:url";

import {
  AUTOMATED_ACTION_STRATEGIES,
  CYBERPUNK_AUTOMATION_REVISION,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  isGreedyWeights,
  createGreedyStrategy,
  runAutoMatch,
  type AutoMatchResult,
} from "@tcg/cyberpunk-engine";
import {
  stableBotHash,
  type BotEvaluationReportV1,
  type BotMatchRecordV1,
  type BotTerminationReason,
} from "@tcg/bot-core";

import { createTestPlayers } from "../../../../../cyberpunk/tools/ai-runner/src/test-catalog.ts";
import {
  createLegalDeckPool,
  createStructuredCatalog,
  deckListFromGenerated,
  type GeneratedDeck,
} from "../../../../../cyberpunk/tools/ai-runner/src/legal-decks.ts";
import { trainGreedy } from "../../../../../cyberpunk/tools/ai-runner/src/train.ts";
import type { BotLabAdapter, BotLabMatchInput } from "../adapter.ts";
import { candidateWinner, promotionWrite, strategyDescriptor } from "./shared.ts";

const PROMOTION_PATH = fileURLToPath(
  new URL(
    "../../../../../cyberpunk/packages/engine/src/automation/promotions/current.json",
    import.meta.url,
  ),
);

const REAL_DECK_POOL = createLegalDeckPool("legal-permutations").decks.slice(0, 6);
const REAL_DECKS_BY_ID = new Map(REAL_DECK_POOL.map((deck) => [deck.id, deck]));

function requiredDeck(id: string): GeneratedDeck {
  const deck = REAL_DECKS_BY_ID.get(id);
  if (!deck) throw new Error(`Unknown Cyberpunk bot-lab deck: ${id}`);
  return deck;
}

function descriptor(id: string) {
  const option = getAutomatedActionStrategyOption(id);
  if (!option) return undefined;
  return strategyDescriptor({
    game: "cyberpunk",
    id,
    label: option.label,
    strategyVersion: CYBERPUNK_AUTOMATION_REVISION,
    informationPolicy: option.informationPolicy,
    cardProfileVersion: "2",
    productionEligible: option.testOnly !== true,
  });
}

function requiredEvaluationStrategy(id: string) {
  const option = getAutomatedActionStrategyOption(id);
  if (!option) throw new Error(`Unknown Cyberpunk evaluation strategy: ${id}`);
  return option.strategy;
}

function termination(reason: AutoMatchResult["reason"]): BotTerminationReason {
  if (reason === "deckOut") return "deck-out";
  if (reason === "concede") return "player-concession";
  if (reason === "illegal") return "illegal-command";
  if (reason === "stuck") return "unsupported-prompt";
  if (reason === "repeatedState") return "repeated-state";
  if (reason === "maxSteps") return "max-actions";
  return "rules-win";
}

function run(input: {
  readonly seed: string;
  readonly candidateSeat: "p1" | "p2";
  readonly candidateStrategyId: string;
  readonly candidateWeights?: unknown;
  readonly baselineStrategyId: string;
  readonly blockId: string;
  readonly legId: string;
  readonly p1DeckId: string;
  readonly p2DeckId: string;
}): BotMatchRecordV1 {
  const candidate =
    input.candidateWeights && typeof input.candidateWeights === "object"
      ? createGreedyStrategy(
          input.candidateWeights as Parameters<typeof createGreedyStrategy>[0],
          input.candidateStrategyId,
        )
      : requiredEvaluationStrategy(input.candidateStrategyId);
  const baseline = requiredEvaluationStrategy(input.baselineStrategyId);
  const candidateIsP1 = input.candidateSeat === "p1";
  const p1Deck = requiredDeck(input.p1DeckId);
  const p2Deck = requiredDeck(input.p2DeckId);
  const result = runAutoMatch({
    players: createTestPlayers(),
    decks: [deckListFromGenerated(p1Deck, "p1"), deckListFromGenerated(p2Deck, "p2")],
    strategies: candidateIsP1 ? [candidate, baseline] : [baseline, candidate],
    catalog: createStructuredCatalog(),
    seed: input.seed,
  });
  const winnerIsP1 = result.winnerId === null ? null : result.winnerId === "p1";
  return {
    blockId: input.blockId,
    legId: input.legId,
    seed: input.seed,
    candidateSeat: input.candidateSeat,
    candidateDeckId: candidateIsP1 ? input.p1DeckId : input.p2DeckId,
    baselineDeckId: candidateIsP1 ? input.p2DeckId : input.p1DeckId,
    winner: candidateWinner({ winnerIsP1, candidateSeat: input.candidateSeat }),
    termination: termination(result.reason),
    turnCount: result.turnCount,
    actionCount: result.stepCount,
    finalStateHash: result.finalStateHash,
  };
}

export const cyberpunkBotLabAdapter: BotLabAdapter = {
  game: "cyberpunk",
  adapterVersion: "3",
  getEngineRevision: () =>
    stableBotHash({
      revision: CYBERPUNK_AUTOMATION_REVISION,
      strategies: AUTOMATED_ACTION_STRATEGIES.map((option) => ({
        id: option.id,
        informationPolicy: option.informationPolicy,
        testOnly: option.testOnly === true,
      })),
    }),
  getCardCatalogHash: () => stableBotHash([...createStructuredCatalog().entries()]),
  getCurrentDefaultStrategyId: () => getSafeAutomatedActionStrategyOption().id,
  getStrategyDescriptor: descriptor,
  getCandidateDescriptor: (manifest) => {
    const registered = descriptor(manifest.candidateId);
    if (registered) return registered;
    if (!isGreedyWeights(manifest.changes.greedyWeights)) {
      throw new Error("An unregistered Cyberpunk candidate must provide valid greedyWeights");
    }
    return strategyDescriptor({
      game: "cyberpunk",
      id: manifest.candidateId,
      label: `${manifest.candidateId} (trained)`,
      strategyVersion: CYBERPUNK_AUTOMATION_REVISION,
      informationPolicy: manifest.informationPolicy,
      cardProfileVersion: "2",
      productionEligible: true,
    });
  },
  getPromotionDeckPairs: () => {
    const pairs = REAL_DECK_POOL.map((deck) => ({
      id: `${deck.id}-mirror`,
      deckA: deck.id,
      deckB: deck.id,
    }));
    for (let index = 0; index + 1 < REAL_DECK_POOL.length; index += 2) {
      const a = REAL_DECK_POOL[index]!;
      const b = REAL_DECK_POOL[index + 1]!;
      pairs.push({ id: `${a.id}-vs-${b.id}`, deckA: a.id, deckB: b.id });
    }
    return pairs;
  },
  runMatch: (input: BotLabMatchInput) =>
    run({
      seed: input.scheduledMatch.seed,
      candidateSeat: input.scheduledMatch.p1Controller === "candidate" ? "p1" : "p2",
      candidateStrategyId: input.candidateManifest.candidateId,
      candidateWeights: input.candidateManifest.changes.greedyWeights,
      baselineStrategyId: input.baselineStrategyId,
      blockId: input.scheduledMatch.blockId,
      legId: input.scheduledMatch.legId,
      p1DeckId: input.scheduledMatch.p1DeckId,
      p2DeckId: input.scheduledMatch.p2DeckId,
    }),
  replayMatch: (record: BotMatchRecordV1, report: BotEvaluationReportV1) =>
    run({
      seed: record.seed,
      candidateSeat: record.candidateSeat,
      candidateStrategyId: report.candidate.id,
      candidateWeights: report.manifest.changes.greedyWeights,
      baselineStrategyId: report.baseline.id,
      blockId: record.blockId,
      legId: record.legId,
      p1DeckId: record.candidateSeat === "p1" ? record.candidateDeckId : record.baselineDeckId,
      p2DeckId: record.candidateSeat === "p1" ? record.baselineDeckId : record.candidateDeckId,
    }),
  planPromotion: (record) => promotionWrite(PROMOTION_PATH, record),
  doctor: () => ({
    ok: true,
    checks: [
      { name: "default", ok: true, detail: getSafeAutomatedActionStrategyOption().id },
      { name: "real-catalog", ok: true, detail: `${createStructuredCatalog().size} cards` },
      {
        name: "legal-decks",
        ok: REAL_DECK_POOL.length > 0,
        detail: `${REAL_DECK_POOL.length} decks`,
      },
    ],
  }),
  train: (raw) => {
    const plan = (raw ?? {}) as {
      opponent?: string;
      matchesPerEval?: number;
      iterations?: number;
      seed?: string;
      maxSteps?: number;
      evaluation?: Partial<{
        minimumBlocks: number;
        maximumBlocks: number;
        batchSize: number;
      }>;
    };
    const seed = plan.seed ?? "bot-lab-cyberpunk-train";
    const result = trainGreedy({
      opponent: plan.opponent ?? "default",
      matchesPerEval: plan.matchesPerEval ?? 20,
      iterations: plan.iterations ?? 40,
      seed,
      maxSteps: plan.maxSteps,
      realCards: true,
      log: () => {},
    });
    const candidateId = `greedy-trained-${stableBotHash(result.bestWeights).split(":")[1]}`;
    return {
      schemaVersion: 1,
      game: "cyberpunk",
      candidateId,
      parentStrategyId: "default",
      informationPolicy: "public",
      hypothesis: "Seat-balanced hill climbing improves the public greedy heuristic.",
      engineRevision: cyberpunkBotLabAdapter.getEngineRevision(),
      cardCatalogHash: cyberpunkBotLabAdapter.getCardCatalogHash(),
      adapterVersion: cyberpunkBotLabAdapter.adapterVersion,
      changes: {
        greedyWeights: result.bestWeights,
        trainingBaselineWinRate: result.baselineWinRate,
        trainingBestWinRate: result.bestWinRate,
      },
      training: {
        generator: "seat-balanced-hill-climb",
        seed,
        iterations: plan.iterations ?? 40,
        corpusId: "cyberpunk-real-single-v1",
      },
      evaluation: {
        suiteId: "promotion",
        seedBase: `${seed}/holdout`,
        minimumBlocks: plan.evaluation?.minimumBlocks ?? 200,
        maximumBlocks: plan.evaluation?.maximumBlocks ?? 2_000,
        batchSize: plan.evaluation?.batchSize ?? 100,
        confidenceLevel: 0.95,
        minimumMeanImprovement: 0.02,
        maximumCellRegression: 0.05,
      },
    };
  },
};
