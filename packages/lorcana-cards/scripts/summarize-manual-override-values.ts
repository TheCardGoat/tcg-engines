/**
 * Summarize the extracted manual override values
 */

import { readFileSync } from "fs";
import { join } from "path";

interface Result {
  searchText: string;
  found: boolean;
  cardName?: string;
  values?: number[];
  actualText?: string;
}

function main() {
  const rootDir = join(__dirname, "..");
  const resultsPath = join(rootDir, "scripts/manual-override-values.json");

  const results = JSON.parse(readFileSync(resultsPath, "utf-8")) as Result[];

  const found = results.filter(
    (r) => r.found && r.values && r.values.length > 0,
  );
  const foundNoValues = results.filter(
    (r) => r.found && (!r.values || r.values.length === 0),
  );
  const notFound = results.filter((r) => !r.found);

  console.log("=".repeat(80));
  console.log("MANUAL OVERRIDE VALUES SUMMARY");
  console.log("=".repeat(80));
  console.log(`\nTotal entries: ${results.length}`);
  console.log(`  ✓ Found with values: ${found.length}`);
  console.log(`  ✓ Found (no {d} placeholders): ${foundNoValues.length}`);
  console.log(`  ✗ Not found: ${notFound.length}`);

  if (found.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("ENTRIES WITH NUMERIC VALUES:");
    console.log("=".repeat(80));
    found.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.cardName || "Unknown"}`);
      console.log(`   Text: ${r.searchText.substring(0, 100)}...`);
      console.log(`   Values: [${r.values!.join(", ")}]`);
      console.log(`   Actual: ${r.actualText?.substring(0, 100)}...`);
    });
  }

  if (notFound.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("ENTRIES NOT FOUND:");
    console.log("=".repeat(80));
    notFound.slice(0, 10).forEach((r, i) => {
      console.log(`${i + 1}. ${r.searchText.substring(0, 80)}...`);
    });
    if (notFound.length > 10) {
      console.log(`\n... and ${notFound.length - 10} more`);
    }
  }
}

if (require.main === module) {
  main();
}
