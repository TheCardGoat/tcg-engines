import { describe, test } from "vite-plus/test";
import { strict as assert } from "node:assert";
import {
  formatDeckBenchmarkReport,
  runDeckBenchmark,
  type BenchmarkStrategyId,
  type DeckBenchmarkReport,
} from "./benchmark.ts";
import { TEST_DECKS, type TestDeckId } from "./test-decks.ts";
import {
  aggressiveAgent,
  AGGRESSIVE_POLICY,
  BALANCED_POLICY,
  heuristicAgent,
} from "./heuristic-strategy.ts";
import { randomStrategy } from "./bot-strategies.ts";
import { runBotMatch } from "./bot-harness.ts";
import {
  getOnePieceAutomatedActionStrategyOption,
  ONE_PIECE_AUTOMATED_ACTION_STRATEGIES,
  resolveOnePieceAutomatedActionStrategyOption,
} from "./strategy-registry.ts";
import { applyCommand, createMatch, getLegalCommands } from "../core.ts";
import type { MatchConfig, MatchSeat } from "../types.ts";

const extendedBatchTest = process.env.RUN_OP_BOT_BATCHES === "1" ? test : test.skip;

function assertClean(report: DeckBenchmarkReport) {
  const illegal = report.results.reduce((sum, r) => sum + r.illegalCommands, 0);
  assert.strictEqual(illegal, 0, `Expected 0 illegal commands, got ${illegal}`);
}

function southWinRate(
  report: DeckBenchmarkReport,
  south: BenchmarkStrategyId,
  opponent: BenchmarkStrategyId,
) {
  const total = report.totals.find(
    (t) => t.southStrategy === south && t.northStrategy === opponent,
  );
  assert.ok(total, `Missing matchup totals for ${south} vs ${opponent}`);
  return total.southWinRate;
}

const CHALLENGING: readonly BenchmarkStrategyId[] = ["heuristic", "aggressive"];

function deckMatchConfig(
  southDeckId: TestDeckId,
  northDeckId: TestDeckId,
  firstPlayer: MatchSeat,
  seed: number,
): MatchConfig {
  const south = TEST_DECKS[southDeckId];
  const north = TEST_DECKS[northDeckId];
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

describe("One Piece challenging bot heuristics", () => {
  test("Registry: heuristic and aggressive are distinct oracle strategies with prompt resolvers", () => {
    const heuristic = getOnePieceAutomatedActionStrategyOption("heuristic");
    const aggressive = getOnePieceAutomatedActionStrategyOption("aggressive");
    assert.ok(heuristic, "heuristic registered");
    assert.ok(aggressive, "aggressive registered");
    assert.strictEqual(heuristic.informationPolicy, "oracle");
    assert.strictEqual(aggressive.informationPolicy, "oracle");
    assert.ok(heuristic.resolvePrompt, "heuristic has resolvePrompt");
    assert.ok(aggressive.resolvePrompt, "aggressive has resolvePrompt");
    assert.notStrictEqual(heuristic.strategy, aggressive.strategy);
    assert.notStrictEqual(BALANCED_POLICY.style, AGGRESSIVE_POLICY.style);
    assert.ok(
      AGGRESSIVE_POLICY.leaderAttackBias > BALANCED_POLICY.leaderAttackBias,
      "aggressive biases leader attacks higher",
    );
    assert.ok(
      AGGRESSIVE_POLICY.counterDonReserveCap < BALANCED_POLICY.counterDonReserveCap,
      "aggressive reserves less DON!! for counters",
    );

    const promoted = resolveOnePieceAutomatedActionStrategyOption(null, "heuristic");
    assert.strictEqual(promoted.id, "heuristic");

    const oracleIds = ONE_PIECE_AUTOMATED_ACTION_STRATEGIES.filter(
      (s) => s.informationPolicy === "oracle" && !s.testOnly,
    ).map((s) => s.id);
    assert.ok(oracleIds.includes("heuristic"));
    assert.ok(oracleIds.includes("aggressive"));
  });

  test("Registry smoke: both heuristics choose a legal representable command on a live match", () => {
    for (const id of ["heuristic", "aggressive"] as const) {
      const option = getOnePieceAutomatedActionStrategyOption(id);
      assert.ok(option, `${id} missing from registry`);
      const config = deckMatchConfig("red-aggro", "blue-control", "south", 42_000 + id.length);
      let state = createMatch(config);
      // Advance setup until main-phase-like legal commands exist (or finished).
      for (let step = 0; step < 80 && state.status !== "finished"; step++) {
        const pending = state.promptQueue.find((p) => p.status === "pending");
        if (pending && option.resolvePrompt) {
          const cmd = option.resolvePrompt(state, pending);
          if (cmd) {
            const result = applyCommand(state, cmd);
            assert.ok(result.accepted, `${id}: prompt resolve rejected: ${result.reason}`);
            state = result.state;
            continue;
          }
        }
        const legal = (
          state.status === "setup"
            ? [...getLegalCommands(state, "south"), ...getLegalCommands(state, "north")]
            : getLegalCommands(state)
        ).filter((d) => d.type !== "concede");
        if (legal.length === 0) break;
        const setupSeat = legal.find(
          (d): d is typeof d & { seat: MatchSeat } => d.seat === "south" || d.seat === "north",
        )?.seat;
        const seat: MatchSeat =
          state.status === "setup" ? (setupSeat ?? state.activeSeat) : state.activeSeat;
        const myLegal = legal.filter((d) => d.seat === seat);
        const chosen = option.strategy(state, seat, myLegal);
        assert.ok(chosen, `${id}: choose returned null with ${myLegal.length} legal commands`);
        const result = applyCommand(state, chosen);
        assert.ok(result.accepted, `${id}: command ${chosen.type} illegal: ${result.reason}`);
        state = result.state;
        if (state.status === "active" && state.phase === "main") {
          // Proved a live main-phase decision path.
          break;
        }
      }
      assert.ok(
        state.status === "active" || state.status === "finished" || state.status === "setup",
        `${id}: unexpected status ${state.status}`,
      );
    }
  });

  test("Policy distinction: aggressive and balanced policies differ on life-race levers", () => {
    assert.ok(AGGRESSIVE_POLICY.preferLeaderPressure);
    assert.ok(!BALANCED_POLICY.preferLeaderPressure);
    assert.ok(AGGRESSIVE_POLICY.rushPlayBonus > BALANCED_POLICY.rushPlayBonus);
    assert.ok(AGGRESSIVE_POLICY.counterWorthLife > BALANCED_POLICY.counterWorthLife);
    assert.ok(AGGRESSIVE_POLICY.blockLowLife > BALANCED_POLICY.blockLowLife);
    assert.ok(
      AGGRESSIVE_POLICY.firstPlayerCheapThreshold < BALANCED_POLICY.firstPlayerCheapThreshold,
    );
  });

  test("Regression: both challenging heuristics close out games instead of stalling", () => {
    // Seeds that previously stalled under weak attack policy at 0 opposing Life.
    const cases: Array<[seed: number, south: TestDeckId, north: TestDeckId, first: MatchSeat]> = [
      [12919, "red-aggro", "red-aggro", "north"],
      [10960, "red-aggro", "red-aggro", "south"],
      [11806, "yellow-trigger", "red-aggro", "south"],
    ];
    for (const agent of [heuristicAgent, aggressiveAgent]) {
      for (const [seed, southDeckId, northDeckId, firstPlayer] of cases) {
        const result = runBotMatch(
          deckMatchConfig(southDeckId, northDeckId, firstPlayer, seed),
          { south: agent, north: randomStrategy },
          { maxCommands: 500, seed },
        );
        assert.strictEqual(result.illegalCommands, 0, `${agent.id} seed ${seed}: illegal commands`);
        assert.ok(
          !result.stuck,
          `${agent.id} seed ${seed} (${southDeckId} vs ${northDeckId}): stalled (${result.termination})`,
        );
        assert.strictEqual(
          result.termination,
          "rules-win",
          `${agent.id} seed ${seed}: expected rules-win, got ${result.termination}`,
        );
      }
    }
  });

  // The full matchup matrix simulates thousands of full games; measured wall
  // time is ~19 minutes, so the default 180s test timeout is far too small.
  test(
    "Smoke: both heuristics beat firstLegal and random on diverse deck pairs",
    { timeout: 1_500_000 },
    () => {
      const deckIds: TestDeckId[] = ["red-aggro", "blue-control", "green-midrange"];
      const matchups: readonly [BenchmarkStrategyId, BenchmarkStrategyId][] = CHALLENGING.flatMap(
        (challenger) =>
          [
            [challenger, "firstLegal"],
            [challenger, "random"],
          ] as [BenchmarkStrategyId, BenchmarkStrategyId][],
      );
      const report = runDeckBenchmark({
        games: 6,
        seedBase: 5000,
        matchups,
        deckIds,
        crossPairs: 1,
      });

      console.log(formatDeckBenchmarkReport(report));

      assertClean(report);
      for (const challenger of CHALLENGING) {
        for (const opponent of ["firstLegal", "random"] as const) {
          const rate = southWinRate(report, challenger, opponent);
          assert.ok(rate >= 0.6, `${challenger} vs ${opponent} win rate ${rate} < 60%`);
        }
      }
    },
  );

  extendedBatchTest("Extended: both heuristics vs all baselines across the full deck suite", () => {
    const matchups: readonly [BenchmarkStrategyId, BenchmarkStrategyId][] = CHALLENGING.flatMap(
      (challenger) =>
        [
          [challenger, "greedy"],
          [challenger, "valueRanked"],
          [challenger, "firstLegal"],
          [challenger, "random"],
          [challenger, "heuristic"],
          [challenger, "aggressive"],
        ] as [BenchmarkStrategyId, BenchmarkStrategyId][],
    );
    const report = runDeckBenchmark({
      games: 10,
      seedBase: 6000,
      matchups,
      crossPairs: 3,
    });

    console.log(formatDeckBenchmarkReport(report));

    assertClean(report);
    for (const challenger of CHALLENGING) {
      for (const opponent of ["greedy", "firstLegal", "random"] as const) {
        const rate = southWinRate(report, challenger, opponent);
        assert.ok(rate >= 0.6, `${challenger} vs ${opponent} win rate ${rate} < 60%`);
      }
    }
  });
});
