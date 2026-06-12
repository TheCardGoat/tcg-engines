#!/usr/bin/env bun

/**
 * Orchestration script for card generation pipeline
 *
 * Fetches latest Lorcast and Ravensburger data by default. Use --skip-fetch
 * only when re-running generation with cached inputs (e.g. iterating on generation logic).
 *
 * Runs all card generation steps in the correct order:
 * 1. fetch-inputs - Fetch latest data from Ravensburger and Lorcast APIs
 * 2. generate-cards - Build canonical cards, IDs, printings; write TS files and data JSON
 * 3. generate-card-aux - Build aux KV maps and validation report
 * 4. generate-localization - Build per-locale localization JSON files
 * 5. embed-card-i18n - Embed locale metadata into canonical cards and generated TS card files
 * 6. format - Format source with oxfmt
 *
 * Usage:
 *   bun run generate-cards:all
 *   bun run generate-cards:all --skip-fetch   # Use cached inputs (data/inputs/)
 *   bun run generate-cards:all --skip-format       # Skip formatting (e.g. when CI handles it)
 *   bun run generate-cards:all --skip-aux          # Skip aux generation (not recommended)
 *   bun run generate-cards:all --skip-localization # Skip localization + embedded i18n regeneration
 *   bun run generate-cards:all --skip-i18n         # Skip only embedded i18n regeneration
 */

import path from "node:path";
import { $ } from "bun";

const PACKAGE_ROOT = path.resolve(import.meta.dir, "..");

interface Step {
  name: string;
  script: string;
  skipFlag?: string;
  /** When true, run as `bun run ${script}` (npm script); otherwise run as `bun ${script}` (file path) */
  runNpmScript?: boolean;
}

const steps: Step[] = [
  {
    name: "fetch-inputs",
    script: path.join(PACKAGE_ROOT, "scripts/fetch-inputs.ts"),
    skipFlag: "--skip-fetch",
  },
  {
    name: "generate-cards",
    script: path.join(PACKAGE_ROOT, "scripts/generate-cards.ts"),
  },
  {
    name: "generate-card-aux",
    script: path.join(PACKAGE_ROOT, "scripts/generate-card-aux.ts"),
    skipFlag: "--skip-aux",
  },
  {
    name: "generate-localization",
    script: path.join(PACKAGE_ROOT, "scripts/generate-localization.ts"),
    skipFlag: "--skip-localization",
  },
  {
    name: "embed-card-i18n",
    script: path.join(PACKAGE_ROOT, "scripts/embed-card-i18n.ts"),
    skipFlag: "--skip-i18n",
  },
  {
    name: "format",
    script: "format",
    skipFlag: "--skip-format",
    runNpmScript: true,
  },
];

async function main() {
  const args = process.argv.slice(2);
  const skipFlags = new Set(args);

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║           CARD GENERATION PIPELINE                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  for (const step of steps) {
    if (step.skipFlag && skipFlags.has(step.skipFlag)) {
      console.log(`\n${"─".repeat(60)}`);
      console.log(`⏭️  Skipping: ${step.name} (${step.skipFlag})`);
      console.log(`${"─".repeat(60)}`);
      continue;
    }

    console.log(`\n${"═".repeat(60)}`);
    console.log(`▶ Running: ${step.name}`);
    console.log(`${"═".repeat(60)}\n`);

    try {
      if (step.runNpmScript) {
        await $`bun run ${step.script}`;
      } else {
        await $`bun ${step.script}`;
      }
    } catch {
      console.error(`\n❌ Step "${step.name}" failed!`);
      process.exit(1);
    }
  }

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║           PIPELINE COMPLETE                                ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
}

main();
