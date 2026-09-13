/**
 * Deck-pair benchmark harness for One Piece bot strategies.
 *
 * Runs ordered (strategy matchup × deck pair) matrices through runBotMatch,
 * alternating the first player, and aggregates wins/illegal/stuck/command
 * counts per deck pair and per strategy matchup. Deterministic: every game
 * seed derives from `seedBase` plus a running game index.
 *
 * CLI (from packages/engine):
 *   bun run src/automation/benchmark.ts                 # quick report
 *   bun run src/automation/benchmark.ts --games=20 --full
 */
import "@tcg/op-cards";
import type { MatchConfig, MatchSeat } from "../types.ts";
import {
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
  valueRankedStrategy,
  type OnePieceBotStrategyLike,
} from "./bot-strategies.ts";
import { aggressiveAgent, heuristicAgent } from "./heuristic-strategy.ts";
import { runBotMatch } from "./bot-harness.ts";
import { TEST_DECKS, type TestDeckId } from "./test-decks.ts";

export const BENCHMARK_STRATEGIES: Record<string, OnePieceBotStrategyLike> = {
  heuristic: heuristicAgent,
  aggressive: aggressiveAgent,
  greedy: greedyStrategy,
  valueRanked: valueRankedStrategy,
  firstLegal: firstLegalStrategy,
  random: randomStrategy,
  passOnly: passOnlyStrategy,
};

export type BenchmarkStrategyId = keyof typeof BENCHMARK_STRATEGIES;

const ALL_DECK_IDS = Object.keys(TEST_DECKS) as TestDeckId[];

export interface DeckBenchmarkOptions {
  /** Games per (strategy matchup, deck pair) cell. */
  games?: number;
  seedBase?: number;
  /** Ordered strategy pairs; south plays the first id, north the second. */
  matchups?: readonly [BenchmarkStrategyId, BenchmarkStrategyId][];
  /** Decks included in the pair matrix (default: all). */
  deckIds?: readonly TestDeckId[];
  /** Cross pairs per deck in addition to its mirror (cyclic over deckIds). */
  crossPairs?: number;
  maxCommands?: number;
}

export interface DeckPairBenchmarkResult {
  southStrategy: BenchmarkStrategyId;
  northStrategy: BenchmarkStrategyId;
  southDeck: TestDeckId;
  northDeck: TestDeckId;
  games: number;
  wins: Record<MatchSeat, number>;
  draws: number;
  stuck: number;
  illegalCommands: number;
  avgCommands: number;
}

export interface MatchupBenchmarkTotal {
  southStrategy: BenchmarkStrategyId;
  northStrategy: BenchmarkStrategyId;
  games: number;
  southWins: number;
  northWins: number;
  draws: number;
  stuck: number;
  illegalCommands: number;
  avgCommands: number;
  /** South-strategy win rate over decisive games. */
  southWinRate: number;
}

export interface DeckBenchmarkReport {
  results: DeckPairBenchmarkResult[];
  totals: MatchupBenchmarkTotal[];
}

export function buildDeckPairs(
  deckIds: readonly TestDeckId[],
  crossPairs: number,
): readonly [TestDeckId, TestDeckId][] {
  const pairs: [TestDeckId, TestDeckId][] = [];
  for (const [index, deckId] of deckIds.entries()) {
    pairs.push([deckId, deckId]);
    for (let offset = 1; offset <= crossPairs && offset < deckIds.length; offset++) {
      pairs.push([deckId, deckIds[(index + offset) % deckIds.length]!]);
    }
  }
  return pairs;
}

function deckMatchConfig(
  southDeck: TestDeckId,
  northDeck: TestDeckId,
  firstPlayer: MatchSeat,
  seed: number,
): MatchConfig {
  const south = TEST_DECKS[southDeck];
  const north = TEST_DECKS[northDeck];
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
        playerName: `South(${southDeck})`,
      },
      north: {
        leaderCardId: north.leaderId,
        mainDeck: [...north.mainDeck],
        playerName: `North(${northDeck})`,
      },
    },
  };
}

export function runDeckBenchmark(options: DeckBenchmarkOptions = {}): DeckBenchmarkReport {
  const games = options.games ?? 10;
  const seedBase = options.seedBase ?? 10000;
  const crossPairs = options.crossPairs ?? 3;
  const maxCommands = options.maxCommands ?? 500;
  const matchups =
    options.matchups ??
    ([
      ["heuristic", "firstLegal"],
      ["heuristic", "random"],
      ["aggressive", "firstLegal"],
      ["aggressive", "random"],
    ] as const);
  const deckIds = options.deckIds ?? ALL_DECK_IDS;
  const deckPairs = buildDeckPairs(deckIds, crossPairs);

  const results: DeckPairBenchmarkResult[] = [];
  let gameIndex = 0;

  for (const [southStrategy, northStrategy] of matchups) {
    for (const [southDeck, northDeck] of deckPairs) {
      const wins: Record<MatchSeat, number> = { south: 0, north: 0 };
      let draws = 0;
      let stuck = 0;
      let illegalCommands = 0;
      let totalCommands = 0;

      for (let game = 0; game < games; game++) {
        const seed = seedBase + gameIndex;
        gameIndex += 1;
        const config = deckMatchConfig(
          southDeck,
          northDeck,
          game % 2 === 0 ? "south" : "north",
          seed,
        );
        const result = runBotMatch(
          config,
          {
            south: BENCHMARK_STRATEGIES[southStrategy],
            north: BENCHMARK_STRATEGIES[northStrategy],
          },
          { maxCommands, seed },
        );

        if (result.stuck) {
          stuck += 1;
        } else if (result.winner) {
          wins[result.winner] += 1;
        } else {
          draws += 1;
        }
        illegalCommands += result.illegalCommands;
        totalCommands += result.totalCommands;
      }

      results.push({
        southStrategy,
        northStrategy,
        southDeck,
        northDeck,
        games,
        wins,
        draws,
        stuck,
        illegalCommands,
        avgCommands: Math.round((totalCommands / games) * 10) / 10,
      });
    }
  }

  const totals: MatchupBenchmarkTotal[] = matchups.map(([southStrategy, northStrategy]) => {
    const cells = results.filter(
      (r) => r.southStrategy === southStrategy && r.northStrategy === northStrategy,
    );
    const totalGames = cells.reduce((sum, r) => sum + r.games, 0);
    const southWins = cells.reduce((sum, r) => sum + r.wins.south, 0);
    const northWins = cells.reduce((sum, r) => sum + r.wins.north, 0);
    const draws = cells.reduce((sum, r) => sum + r.draws, 0);
    const stuck = cells.reduce((sum, r) => sum + r.stuck, 0);
    const illegalCommands = cells.reduce((sum, r) => sum + r.illegalCommands, 0);
    const avgCommands = cells.reduce((sum, r) => sum + r.avgCommands * r.games, 0) / totalGames;
    const decisive = southWins + northWins;
    return {
      southStrategy,
      northStrategy,
      games: totalGames,
      southWins,
      northWins,
      draws,
      stuck,
      illegalCommands,
      avgCommands: Math.round(avgCommands * 10) / 10,
      southWinRate: decisive > 0 ? Math.round((southWins / decisive) * 1000) / 1000 : 0,
    };
  });

  return { results, totals };
}

export function formatDeckBenchmarkReport(report: DeckBenchmarkReport): string {
  const lines: string[] = [];
  lines.push("=== Deck pair results ===");
  for (const r of report.results) {
    lines.push(
      `${r.southStrategy}(${r.southDeck}) vs ${r.northStrategy}(${r.northDeck}): ` +
        `S=${r.wins.south} N=${r.wins.north} D=${r.draws} stuck=${r.stuck} ` +
        `illegal=${r.illegalCommands} avgCmd=${r.avgCommands}`,
    );
  }
  lines.push("=== Matchup totals ===");
  for (const t of report.totals) {
    lines.push(
      `${t.southStrategy} vs ${t.northStrategy}: ${t.southWins}-${t.northWins} ` +
        `(${Math.round(t.southWinRate * 100)}% south win rate over ${t.games} games, ` +
        `D=${t.draws} stuck=${t.stuck} illegal=${t.illegalCommands} avgCmd=${t.avgCommands})`,
    );
  }
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry: bun run src/automation/benchmark.ts [--games=N] [--seed=N] [--full]
// ─────────────────────────────────────────────────────────────────────────────

function readNumberArg(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  if (!arg) return fallback;
  const parsed = Number(arg.slice(prefix.length));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readListArg(name: string): string[] | null {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  if (!arg) return null;
  return arg
    .slice(prefix.length)
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

if (import.meta.main) {
  const full = process.argv.includes("--full");
  const games = readNumberArg("games", full ? 10 : 6);
  const seedBase = readNumberArg("seed", 10000);

  const opponentArg = readListArg("opponents");
  const challengerArg = readListArg("challengers");
  const defaultOpponents: BenchmarkStrategyId[] = full
    ? ["greedy", "valueRanked", "firstLegal", "random", "heuristic", "aggressive"]
    : ["firstLegal", "random"];
  const defaultChallengers: BenchmarkStrategyId[] = ["heuristic", "aggressive"];
  const opponents = (opponentArg ?? defaultOpponents).map((id): BenchmarkStrategyId => {
    if (!(id in BENCHMARK_STRATEGIES)) {
      throw new Error(
        `Unknown strategy: ${id}. Known: ${Object.keys(BENCHMARK_STRATEGIES).join(", ")}`,
      );
    }
    return id as BenchmarkStrategyId;
  });
  const challengers = (challengerArg ?? defaultChallengers).map((id): BenchmarkStrategyId => {
    if (!(id in BENCHMARK_STRATEGIES)) {
      throw new Error(
        `Unknown strategy: ${id}. Known: ${Object.keys(BENCHMARK_STRATEGIES).join(", ")}`,
      );
    }
    return id as BenchmarkStrategyId;
  });
  const matchups: readonly [BenchmarkStrategyId, BenchmarkStrategyId][] = challengers.flatMap(
    (challenger) => opponents.map((opponent) => [challenger, opponent] as const),
  );

  const deckArg = readListArg("decks");
  const defaultDecks: TestDeckId[] = full
    ? ALL_DECK_IDS
    : ["red-aggro", "blue-control", "green-midrange"];
  const deckIds = (deckArg ?? defaultDecks).map((id): TestDeckId => {
    if (!(id in TEST_DECKS)) {
      throw new Error(`Unknown deck: ${id}. Known: ${ALL_DECK_IDS.join(", ")}`);
    }
    return id as TestDeckId;
  });

  const started = Date.now();
  const report = runDeckBenchmark({
    games,
    seedBase,
    matchups,
    deckIds,
    crossPairs: full ? 3 : 1,
  });
  console.log(formatDeckBenchmarkReport(report));
  console.log(`Completed in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}
