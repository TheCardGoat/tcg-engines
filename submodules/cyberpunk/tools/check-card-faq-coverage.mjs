import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { rawCards } from "../packages/cards/src/generated.ts";

import { auditFaqInventory, renderFaqInventory } from "./card-faq-inventory.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "docs/card-faq-coverage.json"), "utf8"));
const faqs = new Map();
for (const card of rawCards) {
  for (const ruling of card.rulings ?? []) {
    if (ruling.kind !== "faq" || ruling.language_code !== "en") continue;
    const previous = faqs.get(ruling.id);
    if (previous && (previous.question !== ruling.question || previous.answer !== ruling.answer)) {
      throw new Error(`Conflicting scraped FAQ text for ${ruling.id}`);
    }
    faqs.set(ruling.id, ruling);
  }
}
const {
  links: references,
  conflicts,
  sourceCount,
  verifiedSourceCount,
} = auditFaqInventory(manifest, faqs);
const links = references.map((test) => {
  const path = resolve(root, test.file);
  if (
    !test.file.startsWith("packages/engine/") ||
    relative(root, path).startsWith("..") ||
    !existsSync(path)
  ) {
    throw new Error(`Invalid test reference: ${test.file}`);
  }
  return { ...test, path };
});
const inventoryPath = resolve(root, "docs/card-faq-inventory.md");
const inventory = renderFaqInventory(manifest);
if (process.argv.includes("--write-inventory")) writeFileSync(inventoryPath, inventory);
if (!existsSync(inventoryPath) || readFileSync(inventoryPath, "utf8") !== inventory) {
  throw new Error(
    "FAQ inventory is out of date. Run node tools/check-card-faq-coverage.mjs --write-inventory.",
  );
}
let directory;
try {
  const args = process.argv.slice(2);
  let reportPath;
  let testExit = 0;
  if (args.includes("--run-tests") || args.includes("--all-tests")) {
    directory = mkdtempSync(resolve(tmpdir(), "cyberpunk-faq-"));
    reportPath = resolve(directory, "results.json");
    const files = args.includes("--all-tests") ? [] : [...new Set(links.map((test) => test.file))];
    const result = spawnSync(
      "vp",
      [
        "test",
        ...files,
        "--reporter=default",
        "--reporter=json",
        `--outputFile.json=${reportPath}`,
      ],
      { cwd: root, stdio: "inherit" },
    );
    if (result.error) throw result.error;
    testExit = result.status ?? 1;
  } else if (args.includes("--report")) {
    reportPath = args[args.indexOf("--report") + 1];
    if (!reportPath) throw new Error("--report requires a Vitest JSON report path.");
  }
  if (reportPath) {
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    const executed = new Map();
    for (const suite of report.testResults) {
      for (const test of suite.assertionResults) {
        const key = `${resolve(suite.name)}\n${test.title}`;
        const statuses = executed.get(key) ?? [];
        statuses.push(test.status);
        executed.set(key, statuses);
      }
    }
    const failed = links.filter((test) => {
      const statuses = executed.get(`${test.path}\n${test.title}`);
      return !statuses?.length || statuses.some((status) => status !== "passed");
    });
    if (failed.length)
      throw new Error(
        `FAQ references must name passing executed tests:\n${failed.map((test) => `${test.faqIds.join(", ")}: ${test.file} > ${test.title}`).join("\n")}`,
      );
    console.log(
      `${verifiedSourceCount} source FAQs (${manifest.entries.length - conflicts.length} consolidated entries) verified by passing tests; ${conflicts.length} source conflicts have passing current-behavior tests.`,
    );
    process.exitCode = testExit;
  } else {
    console.log(
      `${sourceCount} scraped FAQs consolidated into ${manifest.entries.length} entries: ${verifiedSourceCount} source FAQs mapped, ${conflicts.length} unresolved source conflicts. Use --run-tests to verify the linked tests.`,
    );
  }
  for (const entry of conflicts)
    console.log(
      `SOURCE CONFLICT: ${entry.sources.map((source) => source.slug).join(", ")}: ${entry.conflict.reason}`,
    );
} finally {
  if (directory) rmSync(directory, { recursive: true, force: true });
}
