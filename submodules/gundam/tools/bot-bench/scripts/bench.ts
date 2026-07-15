#!/usr/bin/env node
/**
 * bot-bench CLI — run N self-play matches between two strategies and emit
 * a JSON report. Designed for both human use (terminal summary) and Claude
 * consumption (machine-readable report file).
 *
 * Usage:
 *   node --experimental-transform-types --no-warnings scripts/bench.ts \
 *     --p1 greedy-legal --p2 value-ranked \
 *     --p1-deck ef-starter --p2-deck seed-aggro \
 *     --matches 50 --out reports/baseline.json
 *
 * `--experimental-transform-types` (not `--strip-types`) is required because
 * the engine package uses TypeScript parameter properties on `MatchRuntime` /
 * `GundamPlayerActions`, which Node's strip-only mode rejects. The wired
 * `vp run bench` script in `package.json` passes the right flag — prefer
 * that over invoking node directly.
 *
 * Defaults match the `/improve-bot` skill's "baseline" run so a re-execution
 * with no args produces a comparable baseline.
 */

import { resolve } from "node:path";

import { classifyRegressions, parseFailOn } from "../src/regression.ts";
import { buildReplay, saveReplay } from "../src/replay.ts";
import { runBench, saveReport, type BenchOptions } from "../src/run.ts";
import { listStrategies, type BenchStrategyId } from "../src/strategies.ts";
import { REGISTERED_DECKS, type BenchDeckId } from "../src/runtime.ts";

interface CliArgs {
  p1: BenchStrategyId;
  p2: BenchStrategyId;
  "p1-deck": BenchDeckId;
  "p2-deck": BenchDeckId;
  matches: number;
  "seed-base": string;
  "max-actions": number;
  out: string;
  "save-replay"?: string;
  "fail-on"?: string;
  label?: string;
  help?: boolean;
}

const DEFAULTS: CliArgs = {
  p1: "greedy-legal",
  p2: "greedy-legal",
  "p1-deck": "ef-starter",
  "p2-deck": "ef-starter",
  matches: 30,
  "seed-base": "bench",
  "max-actions": 1500,
  out: "",
};

function parseArgs(argv: readonly string[]): CliArgs {
  const out = { ...DEFAULTS } as unknown as Record<string, unknown>;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--help" || arg === "-h") {
      out.help = true;
      continue;
    }
    // Bare `--` is the POSIX end-of-options marker; `vp run` inserts it
    // between the task name and the forwarded args. Skip it silently.
    if (arg === "--") continue;
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    i++;
    if (key === "matches" || key === "max-actions") {
      out[key] = Number.parseInt(value, 10);
    } else {
      out[key] = value;
    }
  }
  return out as unknown as CliArgs;
}

function validate(args: CliArgs): void {
  const strategies = listStrategies();
  if (!strategies.includes(args.p1)) {
    throw new Error(`Unknown --p1 strategy "${args.p1}". Available: ${strategies.join(", ")}`);
  }
  if (!strategies.includes(args.p2)) {
    throw new Error(`Unknown --p2 strategy "${args.p2}". Available: ${strategies.join(", ")}`);
  }
  const decks = Object.keys(REGISTERED_DECKS) as BenchDeckId[];
  if (!decks.includes(args["p1-deck"])) {
    throw new Error(`Unknown --p1-deck "${args["p1-deck"]}". Available: ${decks.join(", ")}`);
  }
  if (!decks.includes(args["p2-deck"])) {
    throw new Error(`Unknown --p2-deck "${args["p2-deck"]}". Available: ${decks.join(", ")}`);
  }
  if (!Number.isInteger(args.matches) || args.matches <= 0) {
    throw new Error(`--matches must be a positive integer, got ${args.matches}`);
  }
  if (!Number.isInteger(args["max-actions"]) || args["max-actions"] <= 0) {
    throw new Error(`--max-actions must be a positive integer, got ${args["max-actions"]}`);
  }
}

function printHelp(): void {
  const strategies = listStrategies().join(", ");
  const decks = Object.keys(REGISTERED_DECKS).join(", ");
  process.stdout.write(
    `bot-bench — run self-play matches between two strategies.\n\n` +
      `  --p1 <id>          Strategy for player one. Options: ${strategies}\n` +
      `  --p2 <id>          Strategy for player two. Options: ${strategies}\n` +
      `  --p1-deck <id>     Deck for player one. Options: ${decks}\n` +
      `  --p2-deck <id>     Deck for player two. Options: ${decks}\n` +
      `  --matches <n>      Number of matches in the run. Default 30.\n` +
      `  --seed-base <s>    Per-match seed = "<s>-<i>". Default "bench".\n` +
      `  --max-actions <n>  Hard cap on planner invocations per match. Default 1500.\n` +
      `  --label <text>     Optional report label.\n` +
      `  --out <path>       Output path for JSON report. Default reports/<auto>.json\n` +
      `  --save-replay <p>  Also write a deterministic replay artifact.\n` +
      `  --fail-on <list>   Exit 2 on configured regressions: non-game-won,max-actions,concede-failed,error-code.\n`,
  );
}

function defaultOutPath(args: CliArgs): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const tag = args.label ? args.label.replace(/[^a-zA-Z0-9_-]/g, "_") : args.p1;
  return resolve(`reports/${tag}-${stamp}.json`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  validate(args);

  const options: BenchOptions = {
    p1Strategy: args.p1,
    p2Strategy: args.p2,
    p1Deck: args["p1-deck"],
    p2Deck: args["p2-deck"],
    matches: args.matches,
    seedBase: args["seed-base"],
    maxActions: args["max-actions"],
    ...(args.label ? { label: args.label } : {}),
  };

  const outPath = args.out !== "" ? resolve(args.out) : defaultOutPath(args);

  process.stdout.write(
    `Running ${options.matches} matches: ${options.p1Strategy}/${options.p1Deck} vs ${options.p2Strategy}/${options.p2Deck}\n`,
  );

  const startedAt = Date.now();
  let lastPrintedPct = -1;
  const report = runBench(options, (i) => {
    const pct = Math.floor((i / options.matches) * 100);
    if (pct >= lastPrintedPct + 10) {
      lastPrintedPct = pct;
      process.stdout.write(`  ${i}/${options.matches} (${pct}%)\n`);
    }
  });
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

  saveReport(report, outPath);
  if (args["save-replay"]) {
    const replayPath = resolve(args["save-replay"]);
    saveReplay(replayPath, buildReplay(options));
    process.stdout.write(`  replay:     ${replayPath}\n`);
  }

  const s = report.summary;
  process.stdout.write(
    `\nDone in ${elapsed}s — wrote ${outPath}\n` +
      `  p1 win-rate: ${(s.p1WinRate * 100).toFixed(1)}%\n` +
      `  p2 win-rate: ${(s.p2WinRate * 100).toFixed(1)}%\n` +
      `  draws:       ${(s.drawRate * 100).toFixed(1)}%\n` +
      `  avg turns:   ${s.avgTurns.toFixed(1)}\n` +
      `  avg actions: ${s.avgActions.toFixed(0)}\n` +
      `  avg match:   ${s.avgElapsedMs.toFixed(0)}ms\n`,
  );

  const failOn = parseFailOn(args["fail-on"]);
  if (failOn.length > 0) {
    const regression = classifyRegressions(report, failOn);
    if (!regression.passed) {
      process.stderr.write(
        `\nRegression policy failed:\n${regression.findings
          .map((finding) => `  - ${finding.message}`)
          .join("\n")}\n`,
      );
      process.exit(2);
    }
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  process.stderr.write(`bench failed: ${message}\n`);
  process.exit(1);
});
