/**
 * generate-card-tests.ts
 *
 * One-shot script that creates a test scaffold for every non-resource card
 * in packages/cards/src/cards.  For each card file it writes a matching
 * test file under packages/engine/tests/cards/{set}/{type}/{file}.test.ts
 * containing one `it.skip` per effect (keyed by sourceText).
 *
 * Run with:  npx tsx tools/generate-card-tests.ts
 *        or: bun tools/generate-card-tests.ts
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CARDS_DIR = join(ROOT, "packages/cards/src/cards");
const TESTS_DIR = join(ROOT, "packages/engine/tests/cards");

// ── helpers ──────────────────────────────────────────────────────────────────

function extractFirst(text: string, re: RegExp): string | undefined {
  return re.exec(text)?.[1];
}

function extractAll(text: string, re: RegExp): string[] {
  const results: string[] = [];
  let m: RegExpExecArray | null;
  const clone = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = clone.exec(text)) !== null) {
    results.push(m[1]);
  }
  return results;
}

/**
 * Escape a string for use inside a double-quoted JS string literal.
 * Handles backslashes, double quotes, and newlines.
 */
function escapeForString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ── walk card directories ────────────────────────────────────────────────────

async function walkCards(): Promise<{ cardFile: string; set: string; type: string }[]> {
  const sets = await readdir(CARDS_DIR);
  const entries: { cardFile: string; set: string; type: string }[] = [];

  for (const set of sets) {
    if (set === "index.ts") continue;
    const setDir = join(CARDS_DIR, set);
    let types: string[];
    try {
      types = await readdir(setDir);
    } catch {
      continue;
    }

    for (const type of types) {
      if (type === "resource") continue; // exclude resource cards
      const typeDir = join(setDir, type);
      let files: string[];
      try {
        files = await readdir(typeDir);
      } catch {
        continue;
      }

      for (const file of files) {
        if (!file.endsWith(".ts") || file === "index.ts") continue;
        entries.push({ cardFile: join(typeDir, file), set, type });
      }
    }
  }

  return entries;
}

// ── generate test content ────────────────────────────────────────────────────

function buildTestFile(
  exportName: string,
  cardName: string,
  cardNumber: string,
  sourceTexts: string[],
): string {
  const effectBlocks = sourceTexts
    .map(
      (text) =>
        `  it.skip("${escapeForString(text)}", () => {\n    const engine = GundamTestEngine.create();\n    // TODO\n  });`,
    )
    .join("\n\n");

  return `import { describe, it } from "vite-plus/test";
import { GundamTestEngine } from "../../../../src/gundam/testing/index.ts";
import { ${exportName} } from "@tcg/gundam-cards";

describe("${escapeForString(cardName)} (${cardNumber})", () => {
${effectBlocks}
});
`;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const entries = await walkCards();
  let written = 0;
  let skipped = 0;

  for (const { cardFile, set, type } of entries) {
    const source = await readFile(cardFile, "utf-8");

    const exportName = extractFirst(source, /export const (\w+)/);
    const cardName = extractFirst(source, /name:\s*"([^"]+)"/);
    const cardNumber = extractFirst(source, /cardNumber:\s*"([^"]+)"/);

    if (!exportName || !cardName || !cardNumber) {
      console.warn(`  SKIP (parse failure): ${relative(ROOT, cardFile)}`);
      skipped++;
      continue;
    }

    // sourceText values may span escaped characters
    const sourceTexts = extractAll(source, /sourceText:\s*"((?:[^"\\]|\\.)*)"/);

    const testContent = buildTestFile(exportName, cardName, cardNumber, sourceTexts);

    const fileName = basename(cardFile, ".ts") + ".test.ts";
    const outDir = join(TESTS_DIR, set, type);
    const outFile = join(outDir, fileName);

    await mkdir(outDir, { recursive: true });
    await writeFile(outFile, testContent, "utf-8");
    written++;
  }

  console.log(`Done. ${written} test files written, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
