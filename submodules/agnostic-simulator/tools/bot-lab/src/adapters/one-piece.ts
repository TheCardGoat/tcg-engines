import { fileURLToPath } from "node:url";

import {
  getOnePieceAutomatedActionStrategyOption,
  getSafeOnePieceAutomatedActionStrategyOption,
  runBotMatch,
  ST01_LEADER_CARD_ID,
  ST01_MAIN_DECK,
  TEST_DECKS,
  type MatchConfig,
  type MatchSeat,
  type OnePieceBotAgent,
  type TestDeckId,
} from "../../../../../one-piece/packages/engine/src/index.ts";
import { stableBotHash, type BotEvaluationReportV1, type BotMatchRecordV1 } from "@tcg/bot-core";

import { getAllCards } from "../../../../../one-piece/packages/cards/src/index.ts";
import type { BotLabAdapter, BotLabMatchInput } from "../adapter.ts";
import { catalogRevision, sourceTreeRevision } from "../revisions.ts";
import { candidateWinner, promotionWrite, strategyDescriptor } from "./shared.ts";

const PROMOTION_PATH = fileURLToPath(
  new URL(
    "../../../../../one-piece/packages/engine/src/automation/promotions/current.json",
    import.meta.url,
  ),
);

/**
 * Engine behavior code lives in `packages/engine/src` (including the bot
 * strategies under `src/automation`); tests are excluded so test-only changes
 * do not trip the evaluation drift guards.
 */
const ENGINE_SRC_ROOT = fileURLToPath(
  new URL("../../../../../one-piece/packages/engine/src/", import.meta.url),
);

/** Official ST01 starter mirror plus the six mono-color automation archetypes. */
const ARCHETYPE_DECK_IDS = Object.keys(TEST_DECKS) as TestDeckId[];

export type OnePieceBotLabDeckId = "st01" | TestDeckId;

const ALL_DECK_IDS: readonly OnePieceBotLabDeckId[] = ["st01", ...ARCHETYPE_DECK_IDS];

/**
 * Fixed shuffle of tournament opponents for the `tournament` suite. Static so
 * evaluation manifests and replays stay reproducible; the paired scheduler
 * still randomizes strategy seats and match seeds.
 */
const TOURNAMENT_OPPONENTS: readonly OnePieceBotLabDeckId[] = [
  "blue-control",
  "yellow-trigger",
  "red-aggro",
  "black-removal",
  "green-midrange",
  "purple-ramp",
  "st01",
];

function resolveDeck(deckId: string): { leaderId: string; mainDeck: readonly string[] } {
  if (deckId === "st01") {
    return { leaderId: ST01_LEADER_CARD_ID, mainDeck: ST01_MAIN_DECK };
  }
  const deck = TEST_DECKS[deckId as TestDeckId];
  if (!deck) {
    throw new Error(`Unknown One Piece bot-lab deck: ${deckId}. Known: ${ALL_DECK_IDS.join(", ")}`);
  }
  return { leaderId: deck.leaderId, mainDeck: deck.mainDeck };
}

function matchConfig(
  southDeckId: string,
  northDeckId: string,
  firstPlayer: MatchSeat,
  seed: string | number,
): MatchConfig {
  const south = resolveDeck(southDeckId);
  const north = resolveDeck(northDeckId);
  return {
    firstPlayer,
    seed,
    shuffleDecks: true,
    openingHandSize: 5,
    skipFirstTurnDraw: true,
    maxCharacterSlots: 5,
    players: {
      south: {
        leaderCardId: south.leaderId,
        mainDeck: [...south.mainDeck],
        playerName: `South(${southDeckId})`,
      },
      north: {
        leaderCardId: north.leaderId,
        mainDeck: [...north.mainDeck],
        playerName: `North(${northDeckId})`,
      },
    },
  };
}

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

function botAgentFor(strategyId: string): OnePieceBotAgent {
  const option = getSafeOnePieceAutomatedActionStrategyOption(strategyId);
  return { id: option.id, choose: option.strategy, resolvePrompt: option.resolvePrompt };
}

function tournamentPairs() {
  if (ALL_DECK_IDS.length !== TOURNAMENT_OPPONENTS.length) {
    throw new Error("One Piece tournament deck and opponent fixture counts must match");
  }
  return ALL_DECK_IDS.map((deckA, index) => {
    const deckB = TOURNAMENT_OPPONENTS[index]!;
    return { id: `${deckA}-vs-${deckB}`, deckA, deckB };
  });
}

function promotionPairs() {
  // Mirrors for every archetype + a cyclic cross-pair so each deck faces a
  // different color, matching the engine deck-benchmark matrix shape.
  const pairs: { id: string; deckA: string; deckB: string }[] = [];
  for (const [index, deckId] of ALL_DECK_IDS.entries()) {
    pairs.push({ id: `${deckId}-mirror`, deckA: deckId, deckB: deckId });
    const cross = ALL_DECK_IDS[(index + 1) % ALL_DECK_IDS.length]!;
    pairs.push({ id: `${deckId}-vs-${cross}`, deckA: deckId, deckB: cross });
  }
  return pairs;
}

function smokePairs() {
  return [
    { id: "st01-mirror", deckA: "st01", deckB: "st01" },
    { id: "red-aggro-mirror", deckA: "red-aggro", deckB: "red-aggro" },
    { id: "blue-control-vs-green-midrange", deckA: "blue-control", deckB: "green-midrange" },
  ] as const;
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
  const candidate = botAgentFor(input.candidateStrategyId);
  const baseline = botAgentFor(input.baselineStrategyId);
  const candidateIsP1 = input.candidateSeat === "p1";
  // South is always p1 in bot-lab seat mapping for One Piece.
  const southDeckId = candidateIsP1 ? input.candidateDeckId : input.baselineDeckId;
  const northDeckId = candidateIsP1 ? input.baselineDeckId : input.candidateDeckId;
  const result = runBotMatch(
    matchConfig(southDeckId, northDeckId, "south", input.seed),
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
    candidateDeckId: input.candidateDeckId,
    baselineDeckId: input.baselineDeckId,
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
  // v2: multi-deck promotion matrix (ST01 + six color archetypes) + tournament suite.
  adapterVersion: "2",
  getEngineRevision: () => sourceTreeRevision(ENGINE_SRC_ROOT),
  getCardCatalogHash: () => catalogRevision(getAllCards()),
  getCurrentDefaultStrategyId: () => getSafeOnePieceAutomatedActionStrategyOption().id,
  getStrategyDescriptor: descriptor,
  getCandidateDescriptor: (manifest) => {
    const value = descriptor(manifest.candidateId);
    if (!value) throw new Error(`Unknown One Piece strategy: ${manifest.candidateId}`);
    return value;
  },
  getPromotionDeckPairs: (suiteId) => {
    if (suiteId === "smoke") return [...smokePairs()];
    if (suiteId === "tournament") return tournamentPairs();
    if (suiteId === "promotion") return promotionPairs();
    // Back-compat: historical manifests used suiteId "promotion" with a single
    // st01-mirror pair under adapter v1. Unknown ids fail loudly.
    throw new Error(
      `Unknown One Piece BotLab suite: ${suiteId}. Known: smoke, promotion, tournament`,
    );
  },
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
      seed: record.seed,
      candidateSeat: record.candidateSeat,
      candidateDeckId: record.candidateDeckId,
      baselineDeckId: record.baselineDeckId,
      candidateStrategyId: report.candidate.id,
      baselineStrategyId: report.baseline.id,
      blockId: record.blockId,
      legId: record.legId,
    }),
  planPromotion: (record) => promotionWrite(PROMOTION_PATH, record),
  doctor: () => {
    const deckCount = ALL_DECK_IDS.length;
    const strategies = ["heuristic", "aggressive", "value-ranked", "greedy"].every((id) =>
      Boolean(getOnePieceAutomatedActionStrategyOption(id)),
    );
    const suitesOk =
      smokePairs().length >= 1 &&
      promotionPairs().length >= deckCount &&
      tournamentPairs().length === deckCount;
    return {
      ok: strategies && suitesOk && deckCount >= 7,
      checks: [
        {
          name: "default",
          ok: true,
          detail: getSafeOnePieceAutomatedActionStrategyOption().id,
        },
        {
          name: "strategies",
          ok: strategies,
          detail: "heuristic, aggressive, value-ranked, greedy registered",
        },
        {
          name: "decks",
          ok: deckCount >= 7,
          detail: `${deckCount} decks: ${ALL_DECK_IDS.join(", ")}`,
        },
        {
          name: "suites",
          ok: suitesOk,
          detail: `smoke=${smokePairs().length} promotion=${promotionPairs().length} tournament=${tournamentPairs().length}`,
        },
      ],
    };
  },
};
