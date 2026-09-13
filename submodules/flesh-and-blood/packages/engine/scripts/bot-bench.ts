#!/usr/bin/env node
/**
 * FAB bot bench CLI.
 *
 *   vp run bench --dir packages/engine -- bench --p1 hero-profile --p2 value-extract --matches 8
 *   vp run bench --dir packages/engine -- diff --baseline reports/a.json --candidate reports/b.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import {
  diffFabBenchReports,
  runFabBenchWithTranscripts,
  type FabBenchOptions,
  type FabBenchReport,
  type FabMatchTranscript,
} from "../src/automation/bench/index.ts";
import { writeFabSnapshotRefusalReport } from "../src/snapshot/refusal-report.ts";

function printHelp(): void {
  console.log(`Usage:
  bot-bench bench [options]
  bot-bench diff --baseline <file> --candidate <file> [--for p1|p2]

bench options:
  --p1 <strategy>         default hero-profile
  --p2 <strategy>         default value-extract
  --p1-deck <id>          catalog deck id (default cc-edinburgh-1st-gravy-bones)
  --p2-deck <id>          catalog deck id (default cc-guilherme-coutinho-rhinar)
  --matches <n>           default 8
  --seed-base <string>    default bench
  --max-actions <n>       default 400
  --out <file>            report JSON path
  --transcripts <dir>     write one whole-match transcript per seed
  --label <string>
`);
}

function parseArgs(argv: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]!;
    if (arg === "--" || arg === "--help" || arg === "-h") {
      if (arg !== "--") out.help = "1";
      continue;
    }
    if (!arg.startsWith("--")) {
      if (!out.cmd) out.cmd = arg;
      continue;
    }
    const key = arg.slice(2);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    out[key] = value;
    index += 1;
  }
  return out;
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function bench(args: Record<string, string>): void {
  const options: FabBenchOptions = {
    cardLibrary: fleshAndBloodDeckCardLibrary,
    p1Strategy: args.p1 ?? "hero-profile",
    p2Strategy: args.p2 ?? "value-extract",
    p1Deck: args["p1-deck"] ?? "cc-edinburgh-1st-gravy-bones",
    p2Deck: args["p2-deck"] ?? "cc-guilherme-coutinho-rhinar",
    matches: Number.parseInt(args.matches ?? "8", 10),
    seedBase: args["seed-base"] ?? "bench",
    maxActions: Number.parseInt(args["max-actions"] ?? "400", 10),
    label: args.label,
  };
  const outPath = resolve(args.out ?? "reports/bench.json");
  if (args.transcripts) {
    const { report, transcripts } = runFabBenchWithTranscripts(options);
    const dir = resolve(args.transcripts);
    mkdirSync(dir, { recursive: true });
    for (const transcript of transcripts) {
      writeJson(resolve(dir, `${transcript.seed}.json`), transcript);
    }
    writeJson(outPath, report);
    printReport(report, outPath);
    writeRefusalReports(transcripts);
    console.log(`Wrote ${transcripts.length} transcripts to ${dir}`);
    return;
  }
  const { report, transcripts } = runFabBenchWithTranscripts(options);
  writeJson(outPath, report);
  printReport(report, outPath);
  writeRefusalReports(transcripts);
}

/** Persist named-invariant evidence for any snapshot-refusal termination. */
function writeRefusalReports(transcripts: readonly FabMatchTranscript[]): void {
  for (const transcript of transcripts) {
    if (transcript.termination !== "snapshot-refusal" || !transcript.snapshotRefusal) continue;
    const path = writeFabSnapshotRefusalReport({
      label: `bench:${transcript.seed}`,
      message: transcript.snapshotRefusal.message,
      issues: transcript.snapshotRefusal.issues,
      stateSummary: transcript.snapshotRefusal.stateSummary,
      rejectedSnapshot: transcript.snapshotRefusal.rejectedSnapshot,
    });
    console.error(
      `SNAPSHOT REFUSAL in ${transcript.seed} (strategy ` +
        `${transcript.p1Strategy} vs ${transcript.p2Strategy}, deck ` +
        `${transcript.p1Deck}): ${transcript.snapshotRefusal.message}\n` +
        `  evidence: ${path}\n` +
        `  replay: FAB_SNAPSHOT_FUZZ_DECKS=${transcript.p1Deck} vp test run src/snapshot/snapshot-fuzz.test.ts`,
    );
  }
}

function printReport(report: FabBenchReport, outPath: string): void {
  console.log(
    `${report.options.p1Strategy} vs ${report.options.p2Strategy}  ` +
      `p1 ${report.summary.p1Wins}/${report.summary.matches} ` +
      `(${(report.summary.p1WinRate * 100).toFixed(1)}%)  ` +
      `avgTurns ${report.summary.avgTurns.toFixed(1)}  ` +
      `terms ${JSON.stringify(report.summary.terminations)}`,
  );
  console.log(`Wrote ${outPath}`);
}

function diff(args: Record<string, string>): void {
  if (!args.baseline || !args.candidate) {
    throw new Error("diff requires --baseline and --candidate");
  }
  const baseline = JSON.parse(readFileSync(resolve(args.baseline), "utf8")) as FabBenchReport;
  const candidate = JSON.parse(readFileSync(resolve(args.candidate), "utf8")) as FabBenchReport;
  const result = diffFabBenchReports(baseline, candidate, args.for === "p2" ? "p2" : "p1");
  const outPath = args.out ? resolve(args.out) : undefined;
  if (outPath) writeJson(outPath, result);
  console.log(`${result.verdict}: ${result.reason}`);
  console.log(
    `flipped ${result.flipped} gained ${result.gained} lost ${result.lost} ` +
      `hangDelta ${result.hangDelta} illegalDelta ${result.illegalDelta} ` +
      `p1WinRateDelta ${result.p1WinRateDelta.toFixed(3)}`,
  );
}

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.cmd) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}
if (args.cmd === "bench") bench(args);
else if (args.cmd === "diff") diff(args);
else {
  printHelp();
  process.exit(1);
}
