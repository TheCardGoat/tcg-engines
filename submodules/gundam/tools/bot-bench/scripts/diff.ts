#!/usr/bin/env node
/**
 * Diff two bench reports. Prints a structured JSON diff to stdout (so
 * Claude can pipe it into context) plus a brief verdict line to stderr.
 *
 * Usage:
 *   node --experimental-transform-types --no-warnings scripts/diff.ts \
 *     --baseline reports/baseline.json \
 *     --candidate reports/candidate.json \
 *     [--for p1|p2]
 *
 * `--experimental-transform-types` (not `--strip-types`) is required —
 * see `bench.ts` for the rationale. Prefer `vp run diff` in normal use.
 */

import { diffReports, loadReport } from "../src/index.ts";

interface CliArgs {
  baseline: string;
  candidate: string;
  for: "p1" | "p2";
  out?: string;
  help?: boolean;
}

const DEFAULTS: CliArgs = {
  baseline: "",
  candidate: "",
  for: "p1",
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
    out[key] = value;
  }
  return out as unknown as CliArgs;
}

function printHelp(): void {
  process.stdout.write(
    `bot-bench diff — compare two bench reports.\n\n` +
      `  --baseline <path>   Path to baseline JSON report.\n` +
      `  --candidate <path>  Path to candidate JSON report.\n` +
      `  --for <p1|p2>       Perspective to diff from. Default p1.\n` +
      `  --out <path>        Optional output path; otherwise prints to stdout.\n`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.baseline === "" || args.candidate === "") {
    throw new Error("--baseline and --candidate are both required");
  }
  const forValue: string = args.for;
  if (forValue !== "p1" && forValue !== "p2") {
    throw new Error(`--for must be "p1" or "p2", got "${forValue}"`);
  }

  const baseline = loadReport(args.baseline);
  const candidate = loadReport(args.candidate);
  const diff = diffReports(baseline, candidate, args.for);

  const json = JSON.stringify(diff, null, 2);
  if (args.out) {
    const { writeFileSync, mkdirSync } = await import("node:fs");
    const { dirname, resolve } = await import("node:path");
    const path = resolve(args.out);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, json, "utf8");
    process.stderr.write(`wrote diff → ${path}\n`);
  } else {
    process.stdout.write(`${json}\n`);
  }
  process.stderr.write(`verdict: ${diff.verdict}\n`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  process.stderr.write(`diff failed: ${message}\n`);
  process.exit(1);
});
