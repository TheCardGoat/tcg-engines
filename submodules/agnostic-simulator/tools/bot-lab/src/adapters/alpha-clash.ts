import { fileURLToPath } from "node:url";
import {
  BOT_CORE_SCHEMA_VERSION,
  stableBotHash,
  type BotCandidateManifestV1,
  type BotDeckPair,
  type BotStrategyDescriptorV1,
} from "@tcg/bot-core";
import { botCandidateManifestV1Schema } from "@tcg/bot-core/schemas";
import { allCards } from "../../../../../alpha-clash/packages/cards/src/index.ts";
import type { BotLabAdapter } from "../adapter.ts";
import { sourceTreeRevision } from "../revisions.ts";
import { strategyDescriptor } from "./shared.ts";
import {
  ALPHA_CLASH_META_DECKS,
  auditAlphaClashDeck,
  resolveAlphaClashLabDeck,
} from "./alpha-clash/decks.ts";
import { validateAlphaClashOverrides } from "./alpha-clash/policy.ts";
import { runAlphaClashPracticeMatch } from "./alpha-clash/runner.ts";

const ENGINE_ROOT = fileURLToPath(
  new URL("../../../../../alpha-clash/packages/engine/src", import.meta.url),
);
const POLICY_ROOT = fileURLToPath(
  new URL("../../../../packages/alpha-clash/alpha-clash-server-adapter/src", import.meta.url),
);
const STRATEGY_ID = "practice-v1";
const DEFAULT_STRATEGY_ID = "meta-v1";
const descriptor = (id: string): BotStrategyDescriptorV1 | undefined =>
  [STRATEGY_ID, "meta-v1", "meta-v2", "meta-v3"].includes(id)
    ? strategyDescriptor({
        game: "alpha-clash",
        id,
        label:
          id === STRATEGY_ID
            ? "Existing practice policy (calibration only)"
            : `Meta deck heuristic ${id}`,
        strategyVersion: id === "meta-v3" ? "3" : id === "meta-v2" ? "2" : "1",
        informationPolicy: "oracle",
        cardProfileVersion: "none",
        productionEligible: false,
      })
    : undefined;

const META_PAIRS: readonly BotDeckPair[] = [
  { id: "clarity-mirror", deckA: "clarity-hyper-aggro", deckB: "clarity-hyper-aggro" },
  { id: "absence-mirror", deckA: "absence-makati", deckB: "absence-makati" },
  { id: "clarity-vs-absence", deckA: "clarity-hyper-aggro", deckB: "absence-makati" },
];

function requireStrategy(id: string): BotStrategyDescriptorV1 {
  const strategy = descriptor(id);
  if (!strategy) throw new Error(`Unknown Alpha Clash strategy: ${id}`);
  return strategy;
}

function verifyCandidate(manifest: BotCandidateManifestV1): BotStrategyDescriptorV1 {
  const strategy = requireStrategy(manifest.candidateId);
  if (manifest.informationPolicy !== strategy.informationPolicy) {
    throw new Error("Alpha Clash practice policy requires oracle information policy");
  }
  if (manifest.candidateId === STRATEGY_ID && Object.keys(manifest.changes).length) {
    throw new Error("Alpha Clash practice-v1 does not accept heuristic overrides");
  }
  validateAlphaClashOverrides(manifest.changes);
  return strategy;
}

export const alphaClashBotLabAdapter: BotLabAdapter = {
  game: "alpha-clash",
  adapterVersion: "2",
  getEngineRevision: () =>
    stableBotHash({
      engine: sourceTreeRevision(ENGINE_ROOT),
      policy: sourceTreeRevision(POLICY_ROOT),
      labPolicy: sourceTreeRevision(fileURLToPath(new URL("./alpha-clash", import.meta.url))),
      evaluationCore: sourceTreeRevision(
        fileURLToPath(new URL("../../../../packages/bot-core/src", import.meta.url)),
      ),
    }),
  getCardCatalogHash: () => stableBotHash({ cards: allCards(), decks: ALPHA_CLASH_META_DECKS }),
  getCurrentDefaultStrategyId: () => DEFAULT_STRATEGY_ID,
  getStrategyDescriptor: descriptor,
  getCandidateDescriptor: verifyCandidate,
  getPromotionDeckPairs: (suiteId) => {
    if (suiteId === "meta" || suiteId === "smoke") return META_PAIRS;
    throw new Error(`Unknown Alpha Clash BotLab suite: ${suiteId}. Known: meta, smoke`);
  },
  runMatch: ({ scheduledMatch, candidateManifest, baselineStrategyId }) => {
    verifyCandidate(candidateManifest);
    requireStrategy(baselineStrategyId);
    const candidateSeat = scheduledMatch.p1Controller === "candidate" ? "p1" : "p2";
    const candidateDeckId =
      candidateSeat === "p1" ? scheduledMatch.p1DeckId : scheduledMatch.p2DeckId;
    const baselineDeckId =
      candidateSeat === "p1" ? scheduledMatch.p2DeckId : scheduledMatch.p1DeckId;
    return runAlphaClashPracticeMatch({
      ...scheduledMatch,
      candidateSeat,
      candidateDeckId,
      baselineDeckId,
      candidateStrategyId: candidateManifest.candidateId,
      baselineStrategyId,
      candidateOverrides: validateAlphaClashOverrides(candidateManifest.changes),
      candidateDeck: resolveAlphaClashLabDeck(candidateDeckId),
      baselineDeck: resolveAlphaClashLabDeck(baselineDeckId),
    });
  },
  replayMatch: (record, report) => {
    verifyCandidate(report.manifest);
    requireStrategy(report.baseline.id);
    return runAlphaClashPracticeMatch({
      ...record,
      candidateStrategyId: report.manifest.candidateId,
      baselineStrategyId: report.baseline.id,
      candidateOverrides: validateAlphaClashOverrides(report.manifest.changes),
      candidateDeck: resolveAlphaClashLabDeck(record.candidateDeckId),
      baselineDeck: resolveAlphaClashLabDeck(record.baselineDeckId),
    });
  },
  planPromotion: () => {
    throw new Error("Alpha Clash laboratory strategies have no production promotion target");
  },
  doctor: () => {
    const checks = ALPHA_CLASH_META_DECKS.map((deck) => {
      const audit = auditAlphaClashDeck(deck);
      return {
        name: deck.id,
        ok: audit.ready,
        detail:
          `${audit.mainCount} main + ${audit.sideCount} side; ${deck.source}; ` +
          audit.issues.map((issue) => `${issue.zone}: ${issue.name} [${issue.reason}]`).join("; "),
      };
    });
    return { ok: checks.every((check) => check.ok), checks };
  },
  train: (raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("Alpha Clash manifest plan must be an object");
    }
    const candidateId = "candidateId" in raw ? raw.candidateId : DEFAULT_STRATEGY_ID;
    const parentStrategyId = "parentStrategyId" in raw ? raw.parentStrategyId : DEFAULT_STRATEGY_ID;
    const manifest = botCandidateManifestV1Schema.parse({
      schemaVersion: BOT_CORE_SCHEMA_VERSION,
      game: "alpha-clash",
      candidateId,
      parentStrategyId,
      informationPolicy: "oracle",
      hypothesis:
        "hypothesis" in raw
          ? raw.hypothesis
          : "Calibrate the meta-v1 laboratory policy on the published meta decks; no trained improvement is claimed.",
      engineRevision: alphaClashBotLabAdapter.getEngineRevision(),
      cardCatalogHash: alphaClashBotLabAdapter.getCardCatalogHash(),
      adapterVersion: alphaClashBotLabAdapter.adapterVersion,
      changes: "changes" in raw ? raw.changes : {},
      evaluation: {
        suiteId: "meta",
        seedBase: "alpha-clash-meta-v1",
        minimumBlocks: 3,
        maximumBlocks: 3,
        batchSize: 3,
        confidenceLevel: 0.95,
        minimumMeanImprovement: 0,
        maximumCellRegression: 1,
        ...("evaluation" in raw && raw.evaluation && typeof raw.evaluation === "object"
          ? raw.evaluation
          : {}),
      },
    });
    verifyCandidate(manifest);
    requireStrategy(manifest.parentStrategyId);
    alphaClashBotLabAdapter.getPromotionDeckPairs(manifest.evaluation.suiteId);
    return manifest;
  },
};
