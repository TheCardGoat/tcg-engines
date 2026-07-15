#!/usr/bin/env bun

import { getAllCards } from "../src/cards/index";
import { analyzeCards, collectCardFilePaths } from "./smoke-test/analysis";
import { parseCliOptions, printHumanReadableReport } from "./smoke-test/reporting";

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const filePaths = collectCardFilePaths();
  const cards = await getAllCards();
  const report = analyzeCards(cards, filePaths, options);

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  printHumanReadableReport(report.summary, report.findings, options.limit);
}

await main();
