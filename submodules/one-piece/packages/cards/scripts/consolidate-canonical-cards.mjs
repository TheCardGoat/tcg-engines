// Consolidate the One Piece cards package to one definition per canonicalId:
// fold every reprint/alt-art definition into its canonical base definition's
// printings[], delete the variant files, split the legacy ST01 bundle, and
// stop authoring the derived artVariants view (printings[] is the source).
//
//   node --experimental-strip-types scripts/consolidate-canonical-cards.mjs            # dry run
//   node --experimental-strip-types scripts/consolidate-canonical-cards.mjs --apply    # rewrite
import { readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_SRC = join(__dirname, "..", "src", "cards");
const APPLY = process.argv.includes("--apply");

const { allCards } = await import(join(__dirname, "..", "src", "index.ts"));

// ---------- source-file mapping ----------
function listCardFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listCardFiles(path);
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".i18n.ts") || entry.name === "index.ts")
      return [];
    return [path];
  });
}
const fileForDefId = new Map();
for (const path of listCardFiles(CARDS_SRC)) {
  const text = readFileSync(path, "utf8");
  const ids = [...text.matchAll(/^ {2}id: "([^"]+)",$/gm)].map((m) => m[1]);
  if (ids.length === 1) fileForDefId.set(ids[0], path);
}
function i18nPathFor(defFile) {
  return defFile.replace(/\.ts$/, ".i18n.ts");
}

// ---------- grouping ----------
const groups = new Map();
for (const card of allCards) {
  if (!groups.has(card.canonicalId)) groups.set(card.canonicalId, []);
  groups.get(card.canonicalId).push(card);
}
const missingBase = [...groups.entries()].filter(
  ([, members]) => !members.some((m) => m.id === m.canonicalId),
);
if (missingBase.length > 0) {
  console.error(
    "ABORT: canonical groups without a base definition:",
    missingBase.map(([id]) => id).join(", "),
  );
  process.exit(1);
}

// ---------- printings merge ----------

const report = [];
let mergedGroups = 0;
for (const [canonicalId, members] of groups) {
  const base = members.find((m) => m.id === canonicalId);
  const variants = members.filter((m) => m.id !== canonicalId);
  if (variants.length === 0) continue;
  mergedGroups++;

  const seen = new Set();
  const merged = [];
  for (const printing of [...base.printings, ...variants.flatMap((v) => v.printings)]) {
    if (seen.has(printing.id)) continue;
    seen.add(printing.id);
    merged.push(printing);
  }
  merged.sort((a, b) => {
    if (a.id === canonicalId) return -1;
    if (b.id === canonicalId) return 1;
    return (
      a.setCode.localeCompare(b.setCode) ||
      a.collectorNumber.localeCompare(b.collectorNumber, undefined, { numeric: true }) ||
      a.id.localeCompare(b.id)
    );
  });

  const baseFile = fileForDefId.get(canonicalId);
  const variantFiles = variants.map((v) => fileForDefId.get(v.id));
  report.push({
    canonicalId,
    name: base.name,
    kept: merged.length,
    variants: variants.map((v) => v.id),
    baseFile,
    variantFiles,
    merged,
  });
}

console.log(`canonical groups with variants: ${mergedGroups}`);
console.log(`variant definitions to fold: ${report.reduce((n, r) => n + r.variants.length, 0)}`);

// ---------- rendering ----------
function renderPrintings(printings) {
  const entries = printings.map((p) => {
    const fields = [
      `      id: ${JSON.stringify(p.id)},`,
      `      artId: ${JSON.stringify(p.artId)},`,
      `      setCode: ${JSON.stringify(p.setCode)},`,
      `      collectorNumber: ${JSON.stringify(p.collectorNumber)},`,
      `      rarity: ${JSON.stringify(p.rarity)},`,
      `      imageUrl: ${JSON.stringify(p.imageUrl)},`,
    ];
    if (p.label !== undefined) fields.push(`      label: ${JSON.stringify(p.label)},`);
    return `    {\n${fields.join("\n")}\n    },`;
  });
  return `  printings: [\n${entries.join("\n")}\n  ],`;
}

function replaceBlock(text, header, replacement) {
  const start = text.indexOf(header);
  if (start === -1) return { text, replaced: false };
  // inline single-line block (e.g. `printings: [printing("ST01-001", "L")],`)
  const lineEnd = text.indexOf("\n", start);
  if (text.slice(start, lineEnd).trimEnd().endsWith("],")) {
    return { text: text.slice(0, start) + replacement + text.slice(lineEnd), replaced: true };
  }
  const end = text.indexOf("\n  ],", start);
  if (end === -1) throw new Error(`unterminated block ${header}`);
  const before = text.slice(0, start);
  const after = text.slice(end + "\n  ],".length);
  return { text: before + replacement + after, replaced: true };
}
function removeLine(text, prefix) {
  const lines = text.split("\n");
  const filtered = lines.filter((line) => !line.startsWith(prefix));
  return { text: filtered.join("\n"), removed: lines.length - filtered.length };
}

// ---------- apply ----------
if (!APPLY) {
  console.log("(dry run — no files written)");
  process.exit(0);
}

let rewrittenBases = 0;
let deletedDefs = 0;
for (const entry of report) {
  const { canonicalId, baseFile, variantFiles, merged, variants } = entry;
  if (!baseFile) {
    console.log(`SKIP (no base file): ${canonicalId}`);
    continue;
  }

  // rewrite base: merged printings, drop authored artVariants
  let text = readFileSync(baseFile, "utf8");
  text = replaceBlock(text, "  printings: [", renderPrintings(merged)).text;
  const artBlock = replaceBlock(text, "  artVariants: [", "");
  if (artBlock.replaced) {
    text = artBlock.text;
  } else {
    text = removeLine(text, "  artVariants: undefined,").text;
  }
  writeFileSync(baseFile, text);
  rewrittenBases++;

  // delete variant defs and their i18n siblings
  for (const [index, variantFile] of variantFiles.entries()) {
    if (!variantFile) {
      console.log(`SKIP (no variant file): ${variants[index]}`);
      continue;
    }
    rmSync(variantFile);
    try {
      rmSync(i18nPathFor(variantFile));
    } catch {}
    deletedDefs++;

    // drop the export line from the sibling per-type index
    const fileName = variantFile.split("/").pop().replace(/\.ts$/, "");
    const indexFile = join(dirname(variantFile), "index.ts");
    try {
      const indexText = readFileSync(indexFile, "utf8");
      const cleaned = indexText
        .split("\n")
        .filter((line) => !line.includes(`from "./${fileName}.ts"`))
        .join("\n");
      writeFileSync(indexFile, cleaned);
    } catch {
      console.log(`WARN (no index file): ${indexFile}`);
    }

    // delete the engine's mirrored (skipped) per-card test for this def
    const engineMirror = join(
      __dirname,
      "../../../packages/engine/src/cards",
      variantFile.slice(CARDS_SRC.length + 1).replace(/\.ts$/, ".test.ts"),
    );
    try {
      rmSync(engineMirror);
    } catch {}
  }
}

console.log(
  `rewrote ${rewrittenBases} base definitions; deleted ${deletedDefs} variant definitions`,
);
