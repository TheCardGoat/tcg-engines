#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  getGrandArchiveAutomatedActionStrategyOption,
  GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES,
  runGrandArchiveAutomatedBench,
} from "../src/automation/index.ts";
import { createGrandArchiveCatalogSmokeFixture } from "../src/automation/catalog-smoke-fixture.ts";

function printHelp(): void {
  const strategyIds = GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.map((option) => option.id).join(
    ", ",
  );
  console.log(`Usage: automated-bench [options]

Options:
  --strategy <id>       ${strategyIds} (default ${DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID})
  --matches <n>         number of deterministic cases (default 8)
  --seed-base <n>       first numeric engine seed (default 1000)
  --max-actions <n>     action cap per match (default 400)
  --label <text>        report label (defaults to strategy id)
  --out <file>          report JSON path (default reports/bench.json)
`);
}

function parseArgs(argv: readonly string[]): Readonly<Record<string, string>> {
  const parsed: Record<string, string> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") continue;
    if (argument === "--help" || argument === "-h") {
      parsed.help = "true";
      continue;
    }
    if (!argument?.startsWith("--")) throw new Error(`Unexpected argument: ${argument ?? ""}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
    parsed[argument.slice(2)] = value;
    index += 1;
  }
  return parsed;
}

function positiveInteger(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive safe integer`);
  }
  return parsed;
}

function integer(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(`${label} must be a safe integer`);
  return parsed;
}

function strategyOption(value: string) {
  const option = getGrandArchiveAutomatedActionStrategyOption(value);
  if (option) return option;
  throw new Error(
    `Unknown strategy ${value}; expected ${GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.map((candidate) => candidate.id).join(", ")}`,
  );
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  const selectedStrategy = strategyOption(
    args.strategy ?? DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  );
  const matches = positiveInteger(args.matches ?? "8", "matches");
  const seedBase = integer(args["seed-base"] ?? "1000", "seed-base");
  const maximumActions = positiveInteger(args["max-actions"] ?? "400", "max-actions");
  const label = args.label ?? selectedStrategy.id;
  const outPath = resolve(args.out ?? "reports/bench.json");
  const report = runGrandArchiveAutomatedBench({
    label,
    cases: Array.from({ length: matches }, (_, index) => {
      const seed = seedBase + index;
      return {
        id: `seed:${seed}`,
        createInput: () => ({
          ...createGrandArchiveCatalogSmokeFixture(seed),
          maximumActions,
          defaultStrategy: selectedStrategy.strategy,
        }),
      };
    }),
  });

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `${report.label}: ${report.summary.finished}/${report.summary.matches} finished; ` +
      `avgActions ${report.summary.averageActions.toFixed(1)}; ` +
      `terminations ${JSON.stringify(report.summary.terminations)}`,
  );
  console.log(`Wrote ${outPath}`);
  if (report.summary.unfinished > 0) process.exitCode = 2;
}

main();
