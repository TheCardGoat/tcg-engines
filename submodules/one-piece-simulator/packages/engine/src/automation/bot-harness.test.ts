import { describe, test } from "vite-plus/test";
import { strict as assert } from "node:assert";
import type { MatchConfig, MatchSeat } from "../types.ts";
import { runBotMatch } from "./bot-harness.ts";
import {
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
  valueRankedStrategy,
  type OnePieceBotStrategy,
} from "./bot-strategies.ts";

const DEFAULT_LEADER = "OP13-001";
const DECK_CARDS = [
  "EB01-005", // cost 1, power 3000
  "EB01-004", // cost 2, power 3000
  "EB01-025", // cost 3, power 5000
  "EB01-035", // cost 3, power 5000
];
const batchTest = process.env.RUN_OP_BOT_BATCHES === "1" ? test : test.skip;
const stressTest = process.env.RUN_OP_BOT_STRESS === "1" ? test : test.skip;

function buildDeck(): string[] {
  const deck: string[] = [];
  for (let i = 0; i < 50; i++) {
    deck.push(DECK_CARDS[i % DECK_CARDS.length]!);
  }
  return deck;
}

function createMatchConfig(
  seed: number | string,
  options: { firstPlayer?: MatchSeat } = {},
): MatchConfig {
  return {
    firstPlayer: options.firstPlayer ?? "south",
    seed,
    shuffleDecks: true,
    openingHandSize: 5,
    skipFirstTurnDraw: true,
    maxCharacterSlots: 5,
    players: {
      south: {
        leaderCardId: DEFAULT_LEADER,
        mainDeck: buildDeck(),
        playerName: "SouthBot",
      },
      north: {
        leaderCardId: DEFAULT_LEADER,
        mainDeck: buildDeck(),
        playerName: "NorthBot",
      },
    },
  };
}

type StrategyKey = "firstLegal" | "greedy" | "random" | "passOnly" | "valueRanked";

const STRATEGIES: Record<StrategyKey, OnePieceBotStrategy> = {
  firstLegal: firstLegalStrategy,
  greedy: greedyStrategy,
  random: randomStrategy,
  passOnly: passOnlyStrategy,
  valueRanked: valueRankedStrategy,
};

const MATCHUPS: readonly [StrategyKey, StrategyKey][] = [
  ["greedy", "greedy"],
  ["greedy", "valueRanked"],
  ["valueRanked", "valueRanked"],
  ["greedy", "passOnly"],
];

interface BatchResult {
  matchup: [StrategyKey, StrategyKey];
  games: number;
  wins: Record<MatchSeat, number>;
  draws: number;
  stuck: number;
  illegalCommands: number;
  avgCommands: number;
  maxCommands: number;
}

function runBatch(options: {
  games: number;
  seedBase: number;
  matchups?: readonly [StrategyKey, StrategyKey][];
  maxCommands?: number;
}): BatchResult[] {
  const matchups = options.matchups ?? MATCHUPS;
  const results: BatchResult[] = [];

  for (const [southKey, northKey] of matchups) {
    const southStrategy = STRATEGIES[southKey];
    const northStrategy = STRATEGIES[northKey];

    let wins: Record<MatchSeat, number> = { south: 0, north: 0 };
    let draws = 0;
    let stuckCount = 0;
    let totalIllegal = 0;
    let totalCommands = 0;
    let maxCmd = 0;

    for (let i = 0; i < options.games; i++) {
      const seed = options.seedBase + i;
      const config = createMatchConfig(seed, { firstPlayer: i % 2 === 0 ? "south" : "north" });
      const result = runBotMatch(
        config,
        {
          south: southStrategy,
          north: northStrategy,
        },
        { maxCommands: options.maxCommands ?? 500 },
      );

      if (result.stuck) {
        stuckCount++;
      } else if (result.winner) {
        wins[result.winner]++;
      } else {
        draws++;
      }

      totalIllegal += result.illegalCommands;
      totalCommands += result.totalCommands;
      maxCmd = Math.max(maxCmd, result.totalCommands);
    }

    results.push({
      matchup: [southKey, northKey],
      games: options.games,
      wins,
      draws,
      stuck: stuckCount,
      illegalCommands: totalIllegal,
      avgCommands: Math.round((totalCommands / options.games) * 10) / 10,
      maxCommands: maxCmd,
    });
  }

  return results;
}

function validateDecisionStructure() {
  const config = createMatchConfig(42);
  const result = runBotMatch(
    config,
    {
      south: greedyStrategy,
      north: greedyStrategy,
    },
    { maxCommands: 100 },
  );

  assert.ok(result.totalCommands > 0, "Match should produce at least one command");
  assert.ok(
    result.commandHistory.every((cmd, i) => {
      if (i === 0) return true;
      return typeof cmd.type === "string";
    }),
    "All commands should have valid types",
  );

  const state = result.finalState;
  assert.ok(
    state.commandHistory.length >= result.totalCommands,
    "State command history should match",
  );
  assert.ok(state.turnNumber >= 1, "At least one turn should have passed");

  return { passed: true, commandCount: result.totalCommands };
}

function extractLearnings(batchResults: BatchResult[]): string[] {
  const learnings: string[] = [];

  for (const result of batchResults) {
    const [sKey, nKey] = result.matchup;
    const totalDecisive = result.games - result.draws - result.stuck;
    if (totalDecisive > 0) {
      const southWinRate = result.wins.south / totalDecisive;
      const northWinRate = result.wins.north / totalDecisive;
      if (Math.abs(southWinRate - northWinRate) > 0.3) {
        const stronger = southWinRate > northWinRate ? sKey : nKey;
        const weaker = southWinRate > northWinRate ? nKey : sKey;
        learnings.push(
          `Skewed matchup: ${stronger} beats ${weaker} (${Math.round(Math.max(southWinRate, northWinRate) * 100)}% win rate)`,
        );
      }
    }

    if (result.illegalCommands > 0) {
      learnings.push(`Illegal moves in ${sKey} vs ${nKey}: ${result.illegalCommands} total`);
    }

    if (result.stuck > 0) {
      learnings.push(`Stuck games in ${sKey} vs ${nKey}: ${result.stuck}/${result.games}`);
    }

    if (result.maxCommands >= 490) {
      learnings.push(
        `Max command ceiling hit in ${sKey} vs ${nKey}: ${result.maxCommands} commands`,
      );
    }
  }

  if (learnings.length === 0) {
    learnings.push("All matchups completed cleanly with no structural issues.");
  }

  return learnings;
}

describe("One Piece Bot Harness", () => {
  test("validate decision structure", () => {
    const validation = validateDecisionStructure();
    assert.ok(validation.passed, "Decision structure validation passed");
  });

  batchTest(
    "Batch 1: 50 games across strategy matchups",
    () => {
      const results = runBatch({ games: 50, seedBase: 1000 });

      let totalIllegal = 0;
      let totalStuck = 0;
      for (const result of results) {
        totalIllegal += result.illegalCommands;
        totalStuck += result.stuck;
      }

      console.log("=== Batch 1 Results (50 games) ===");
      for (const result of results) {
        const [s, n] = result.matchup;
        console.log(
          `${s} vs ${n}: S=${result.wins.south} N=${result.wins.north} D=${result.draws} stuck=${result.stuck} illegal=${result.illegalCommands} avgCmd=${result.avgCommands} maxCmd=${result.maxCommands}`,
        );
      }

      const learnings = extractLearnings(results);
      console.log("Learnings:", learnings);

      assert.strictEqual(totalIllegal, 0, `Expected 0 illegal commands, got ${totalIllegal}`);
      assert.ok(totalStuck < 10, `Expected <10 stuck games, got ${totalStuck}`);
    },
    30000,
  );

  batchTest(
    "Batch 2: 100 games across strategy matchups",
    () => {
      const results = runBatch({ games: 100, seedBase: 2000 });

      let totalIllegal = 0;
      let totalStuck = 0;
      for (const result of results) {
        totalIllegal += result.illegalCommands;
        totalStuck += result.stuck;
      }

      console.log("=== Batch 2 Results (100 games) ===");
      for (const result of results) {
        const [s, n] = result.matchup;
        console.log(
          `${s} vs ${n}: S=${result.wins.south} N=${result.wins.north} D=${result.draws} stuck=${result.stuck} illegal=${result.illegalCommands} avgCmd=${result.avgCommands} maxCmd=${result.maxCommands}`,
        );
      }

      const learnings = extractLearnings(results);
      console.log("Learnings:", learnings);

      assert.strictEqual(totalIllegal, 0, `Expected 0 illegal commands, got ${totalIllegal}`);
      assert.ok(totalStuck < 15, `Expected <15 stuck games, got ${totalStuck}`);
    },
    60000,
  );

  stressTest(
    "Batch 3: 1000 games across strategy matchups",
    () => {
      const results = runBatch({ games: 1000, seedBase: 3000 });

      let totalIllegal = 0;
      let totalStuck = 0;
      let totalGames = 0;
      for (const result of results) {
        totalIllegal += result.illegalCommands;
        totalStuck += result.stuck;
        totalGames += result.games;
      }

      console.log("=== Batch 3 Results (1000 games) ===");
      for (const result of results) {
        const [s, n] = result.matchup;
        console.log(
          `${s} vs ${n}: S=${result.wins.south} N=${result.wins.north} D=${result.draws} stuck=${result.stuck} illegal=${result.illegalCommands} avgCmd=${result.avgCommands} maxCmd=${result.maxCommands}`,
        );
      }

      const learnings = extractLearnings(results);
      console.log("Learnings:", learnings);

      assert.strictEqual(totalIllegal, 0, `Expected 0 illegal commands, got ${totalIllegal}`);
      assert.ok(totalStuck < 50, `Expected <50 stuck games, got ${totalStuck}`);

      console.log(`\n=== Summary ===`);
      console.log(`Total games: ${totalGames}`);
      console.log(`Total illegal: ${totalIllegal}`);
      console.log(`Total stuck: ${totalStuck}`);
      console.log(`Clean rate: ${(((totalGames - totalStuck) / totalGames) * 100).toFixed(1)}%`);
    },
    300000,
  );

  test("firstLegal strategy smoke test", () => {
    const results = runBatch({
      games: 1,
      seedBase: 4000,
      matchups: [["firstLegal", "firstLegal"]],
      maxCommands: 100,
    });

    const result = results[0]!;
    console.log(
      `firstLegal vs firstLegal: S=${result.wins.south} N=${result.wins.north} D=${result.draws} stuck=${result.stuck} illegal=${result.illegalCommands} avgCmd=${result.avgCommands}`,
    );

    assert.strictEqual(result.illegalCommands, 0, `Expected 0 illegal commands`);
  }, 30000);
});
