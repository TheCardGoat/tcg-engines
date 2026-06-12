import {
  monteCarloGreedyStrategy,
  monteCarloStrategy,
  firstLegalStrategy,
  greedyStrategy,
  randomStrategy,
  runAutoMatch,
  type AIStrategy,
} from "@tcg/cyberpunk-engine";
import {
  listStrategies,
  runBatch,
  runBatchParallel,
  runTournament,
  type BatchOptions,
  type BatchSummary,
  type TournamentSummary,
} from "./runner.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./test-catalog.ts";
import { createRealCatalog, createRealDecks } from "./real-catalog.ts";
import { buildRecording, loadRecording, replayRecording, saveRecording } from "./replay.ts";
import { trainGreedy } from "./train.ts";

const SAVEABLE_STRATEGIES: Record<string, AIStrategy> = {
  "first-legal": firstLegalStrategy,
  random: randomStrategy,
  greedy: greedyStrategy,
  "monte-carlo": monteCarloStrategy,
  "monte-carlo-greedy": monteCarloGreedyStrategy,
};

interface ParsedArgs {
  mode: "batch" | "tournament" | "replay" | "train";
  strategyA: string;
  strategyB: string;
  strategies?: string[];
  /** Path to write the first match's recording for the `replay` subcommand. */
  saveLog?: string;
  /** Path to a previously-saved recording to replay. */
  replayPath?: string;
  matches: number;
  seed: string;
  maxSteps?: number;
  verbose: boolean;
  realCards: boolean;
  workers: number;
  /** Training: total candidate evaluations. */
  iterations?: number;
  /** Training: where to write the best weights JSON. */
  output?: string;
  /** Training: baseline opponent name. */
  opponent?: string;
}

function parsePositiveInt(flag: string, raw: string | undefined): number {
  if (raw === undefined || raw.startsWith("--")) {
    throw new Error(`${flag} requires a positive integer value`);
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0 || String(n) !== raw) {
    throw new Error(`${flag} must be a positive integer (got "${raw}")`);
  }
  return n;
}

function parseStrategyList(flag: string, raw: string | undefined): string[] {
  if (raw === undefined || raw.startsWith("--")) {
    throw new Error(`${flag} requires a comma-separated list`);
  }
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (list.length === 0) throw new Error(`${flag} cannot be empty`);
  return list;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: Partial<ParsedArgs> = {};
  let mode: ParsedArgs["mode"] = "batch";
  let verbose = false;
  let realCards = false;
  let workers = 1;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    const next = argv[i + 1];
    switch (arg) {
      case "--strategy-a":
        args.strategyA = next;
        i++;
        break;
      case "--strategy-b":
        args.strategyB = next;
        i++;
        break;
      case "--strategies":
        args.strategies = parseStrategyList("--strategies", next);
        i++;
        break;
      case "--tournament":
        mode = "tournament";
        break;
      case "--verbose":
      case "-v":
        verbose = true;
        break;
      case "--real-cards":
        realCards = true;
        break;
      case "--workers":
        workers = parsePositiveInt("--workers", next);
        i++;
        break;
      case "--save-log":
        if (next === undefined || next.startsWith("--")) {
          throw new Error(`--save-log requires a path`);
        }
        args.saveLog = next;
        i++;
        break;
      case "train":
        mode = "train";
        break;
      case "--iterations":
        args.iterations = parsePositiveInt("--iterations", next);
        i++;
        break;
      case "--output":
        if (next === undefined || next.startsWith("--")) {
          throw new Error(`--output requires a path`);
        }
        args.output = next;
        i++;
        break;
      case "--opponent":
        if (next === undefined || next.startsWith("--")) {
          throw new Error(`--opponent requires a strategy name`);
        }
        args.opponent = next;
        i++;
        break;
      case "replay":
        mode = "replay";
        if (next === undefined || next.startsWith("--")) {
          throw new Error(`replay requires a path argument`);
        }
        args.replayPath = next;
        i++;
        break;
      case "--matches":
        args.matches = parsePositiveInt("--matches", next);
        i++;
        break;
      case "--seed":
        args.seed = next;
        i++;
        break;
      case "--max-steps":
        args.maxSteps = parsePositiveInt("--max-steps", next);
        i++;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        if (arg.startsWith("--")) {
          throw new Error(`Unknown flag: ${arg}`);
        }
    }
  }
  return {
    mode,
    strategyA: args.strategyA ?? "greedy",
    strategyB: args.strategyB ?? "random",
    strategies: args.strategies,
    matches: args.matches ?? 10,
    seed: args.seed ?? `cli-${Date.now()}`,
    maxSteps: args.maxSteps,
    verbose,
    realCards,
    workers,
    saveLog: args.saveLog,
    replayPath: args.replayPath,
    iterations: args.iterations,
    output: args.output,
    opponent: args.opponent,
  };
}

function printUsage(): void {
  console.log(`Usage: ai-runner [options]
       ai-runner replay <path>          Replay a saved recording

Modes:
  (default)             Single matchup: --strategy-a vs --strategy-b
  --tournament          Round-robin every strategy against every other
  replay <path>         Replay a saved recording, asserting per-step
                        stateID parity (catches determinism regressions)
  train                 Hill-climb GreedyWeights vs a fixed opponent; write
                        best weights to --output. Use --matches as the
                        matches-per-evaluation budget and --iterations as the
                        total candidate count.

Common options:
  --matches <n>         Matches per pairing (default: 10)
  --seed <string>       Base seed (default: cli-<timestamp>)
  --max-steps <n>       Hard cap on per-match decision steps
  -v, --verbose         Dump the per-step log of the first failing match
                        (or the first match if all pass)
  --real-cards          Use real @tcg/cyberpunk-cards decks instead of the
                        hand-rolled fixture (exercises actual card text)
  --workers <n>         Run the batch across N worker threads (single-matchup
                        mode only; default 1). Splits matches evenly with
                        distinct seed prefixes per worker.
  --save-log <path>     Save the first match as a replayable recording
                        (single-matchup mode only). Replay later via
                        \`ai-runner replay <path>\`.
  -h, --help            Show this help

Single-matchup options:
  --strategy-a <name>   Strategy for player 1 (default: greedy)
  --strategy-b <name>   Strategy for player 2 (default: random)

Tournament options:
  --strategies <list>   Comma-separated subset (default: every built-in)
                        e.g. --strategies greedy,random

Training options:
  --iterations <n>      Total mutation candidates to evaluate (default: 50)
  --opponent <name>     Baseline opponent strategy (default: greedy)
  --output <path>       Write the best weights JSON to this path

Strategies: ${listStrategies().join(", ")}`);
}

function pct(part: number, total: number): string {
  if (total === 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

function printBatchSummary(summary: BatchSummary): void {
  const { matches, perPlayerWins, draws, reasonCounts, illegalCount } = summary;
  const p1 = perPlayerWins["p1"] ?? 0;
  const p2 = perPlayerWins["p2"] ?? 0;
  console.log("");
  console.log(`Strategy A (p1): ${summary.options.strategyA}`);
  console.log(`Strategy B (p2): ${summary.options.strategyB}`);
  console.log(`Matches:         ${matches}`);
  console.log(`Wins p1:         ${p1} (${pct(p1, matches)})`);
  console.log(`Wins p2:         ${p2} (${pct(p2, matches)})`);
  console.log(`Draws:           ${draws}`);
  console.log(`Illegal moves:   ${illegalCount}`);
  console.log(`Avg turns:       ${summary.averageTurnCount.toFixed(1)}`);
  console.log(`Avg steps:       ${summary.averageStepCount.toFixed(1)}`);
  console.log("Reasons:");
  for (const [reason, count] of Object.entries(reasonCounts)) {
    if (count > 0) console.log(`  ${reason.padEnd(14)} ${count}`);
  }
}

function printTournamentSummary(summary: TournamentSummary): void {
  const strategies = summary.options.strategies;
  const matches = summary.options.matches;
  // Cell map: a → b → "p1Wins-p2Wins"
  const cells = new Map<string, BatchSummary>();
  for (const c of summary.cells) cells.set(`${c.strategyA}|${c.strategyB}`, c.summary);

  console.log("");
  console.log(`Tournament: ${strategies.length} strategies, ${matches} matches per pairing`);
  console.log("");
  const labelWidth = Math.max(8, ...strategies.map((s) => s.length)) + 2;
  const colWidth = Math.max(10, ...strategies.map((s) => s.length + 5)); // "vs <name>" + padding
  const headerCells = strategies.map((s) => `vs ${s}`.padEnd(colWidth));
  console.log("".padEnd(labelWidth) + headerCells.join(""));
  for (const a of strategies) {
    const cellsStr = strategies
      .map((b) => {
        const cell = cells.get(`${a}|${b}`);
        if (!cell) return "—".padEnd(colWidth);
        const w = cell.perPlayerWins["p1"] ?? 0;
        const l = cell.perPlayerWins["p2"] ?? 0;
        return `${w}-${l}`.padEnd(colWidth);
      })
      .join("");
    console.log(a.padEnd(labelWidth) + cellsStr);
  }
  console.log("");
  console.log("Total wins by strategy (across both seats):");
  for (const [name, wins] of Object.entries(summary.totalWinsByStrategy).sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`  ${name.padEnd(14)} ${wins} (${pct(wins, summary.totalMatches * 2)} of seats)`);
  }
  console.log("");
  console.log(`Total matches: ${summary.totalMatches}`);
  console.log(`Illegal moves: ${summary.totalIllegal}`);
}

function printVerboseLog(summary: BatchSummary): void {
  const target = summary.firstFailingMatch ?? summary.firstMatch;
  if (!target) return;
  const tag = summary.firstFailingMatch ? "FIRST FAILING MATCH" : "FIRST MATCH";
  console.log("");
  console.log(`──── ${tag} (seed=${target.seed}) ────`);
  console.log(
    `reason=${target.reason} winner=${target.winnerId ?? "draw"} turns=${target.turnCount} steps=${target.stepCount}`,
  );
  for (const entry of target.log) {
    const r = entry.result;
    if (r.kind === "acted") {
      const args = JSON.stringify(r.decision.args ?? {});
      console.log(`  ${entry.stepIndex} ${entry.playerId} ${r.decision.move} ${args}`);
    } else if (r.kind === "illegal") {
      console.log(
        `  ${entry.stepIndex} ${entry.playerId} ILLEGAL ${r.decision.move} (${r.errorCode}: ${r.error})`,
      );
    } else if (r.kind === "stuck") {
      console.log(
        `  ${entry.stepIndex} ${entry.playerId} STUCK ${r.reason}${r.pendingType ? ` (pending=${r.pendingType})` : ""}`,
      );
    } else if (r.kind === "idle") {
      console.log(`  ${entry.stepIndex} ${entry.playerId} idle (${r.reason})`);
    }
  }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.mode === "replay") {
    if (!parsed.replayPath) throw new Error("replay mode requires a recording path");
    const recording = loadRecording(parsed.replayPath);
    const result = replayRecording(recording);
    console.log("");
    console.log(`Replay: ${parsed.replayPath}`);
    console.log(`  ${recording.strategyA} vs ${recording.strategyB} (seed=${recording.seed})`);
    console.log(`  steps compared: ${result.totalSteps} / ${recording.steps.length}`);
    if (result.matched) {
      console.log("  RESULT: matched ✓ (every step + stateID identical)");
      return;
    }
    console.log(`  RESULT: divergent — ${result.divergences.length} mismatch(es)`);
    for (const d of result.divergences.slice(0, 10)) {
      console.log(
        `    step ${d.stepIndex} ${d.field}: expected=${JSON.stringify(d.expected)} actual=${JSON.stringify(d.actual)}`,
      );
    }
    if (result.divergences.length > 10) {
      console.log(`    … (+${result.divergences.length - 10} more)`);
    }
    process.exit(3);
    return;
  }

  if (parsed.mode === "train") {
    const result = trainGreedy({
      opponent: parsed.opponent ?? "greedy",
      matchesPerEval: parsed.matches,
      iterations: parsed.iterations ?? 50,
      seed: parsed.seed,
      maxSteps: parsed.maxSteps,
      realCards: parsed.realCards,
      outputPath: parsed.output,
    });
    const delta = result.bestWinRate - result.baselineWinRate;
    console.log("");
    console.log(
      `Training complete: baseline ${(result.baselineWinRate * 100).toFixed(1)}% → best ${(
        result.bestWinRate * 100
      ).toFixed(1)}% (Δ ${(delta * 100).toFixed(1)}pp)`,
    );
    const accepted = result.steps.filter((s) => s.accepted).length;
    console.log(`Accepted ${accepted} / ${result.steps.length} mutations.`);
    return;
  }

  if (parsed.mode === "tournament") {
    const strategies = parsed.strategies ?? listStrategies();
    const summary = runTournament({
      strategies,
      matches: parsed.matches,
      seed: parsed.seed,
      maxSteps: parsed.maxSteps,
      realCards: parsed.realCards,
    });
    printTournamentSummary(summary);
    if (parsed.verbose) {
      for (const cell of summary.cells) {
        if (cell.summary.firstFailingMatch) {
          console.log("");
          console.log(`── ${cell.strategyA} vs ${cell.strategyB} ──`);
          printVerboseLog(cell.summary);
        }
      }
    }
    if (summary.totalIllegal > 0) process.exit(2);
    return;
  }

  if (parsed.workers > 1 && parsed.saveLog) {
    // The recording is built by re-running match-0 with `<seed>/match-0`,
    // but workers prefix their seeds as `<seed>/wN/match-i` — the captured
    // match isn't one the workers actually ran. Reject up front so users
    // don't get a recording that doesn't match the live batch.
    throw new Error(
      "--save-log is incompatible with --workers > 1 (the workers prefix seeds as <seed>/wN/match-i, so the captured match would not match any worker run). Re-run with --workers 1 to save a recording.",
    );
  }

  const opts: BatchOptions = {
    strategyA: parsed.strategyA,
    strategyB: parsed.strategyB,
    matches: parsed.matches,
    seed: parsed.seed,
    maxSteps: parsed.maxSteps,
    realCards: parsed.realCards,
  };
  const summary =
    parsed.workers > 1 ? await runBatchParallel(opts, parsed.workers) : runBatch(opts);
  printBatchSummary(summary);
  if (parsed.verbose) printVerboseLog(summary);
  if (parsed.saveLog) {
    saveFirstMatchRecording(parsed, opts, parsed.saveLog);
    console.log(`\nSaved recording: ${parsed.saveLog}`);
  }
  if (summary.illegalCount > 0) process.exit(2);
}

/**
 * Re-run match 0 in-process so we can capture the full `runAutoMatch`
 * result (worker results don't bubble up the per-step decision payload).
 * Same seed prefix as the live batch (`<seed>/match-0`), so the recording
 * is reproducible.
 */
function saveFirstMatchRecording(parsed: ParsedArgs, opts: BatchOptions, path: string): void {
  const strategyA = SAVEABLE_STRATEGIES[parsed.strategyA];
  const strategyB = SAVEABLE_STRATEGIES[parsed.strategyB];
  if (!strategyA || !strategyB) {
    throw new Error(
      `--save-log can't capture strategy ${!strategyA ? parsed.strategyA : parsed.strategyB}`,
    );
  }
  const seed = `${opts.seed}/match-0`;
  const result = runAutoMatch({
    players: createTestPlayers(),
    decks: opts.realCards ? createRealDecks() : createTestDecks(),
    strategies: [strategyA, strategyB],
    catalog: opts.realCards ? createRealCatalog() : createTestCatalog(),
    seed,
    maxSteps: opts.maxSteps,
  });
  const recording = buildRecording({
    result,
    strategyA: parsed.strategyA,
    strategyB: parsed.strategyB,
    seed,
    realCards: opts.realCards ?? false,
    maxSteps: opts.maxSteps,
  });
  saveRecording(path, recording);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
