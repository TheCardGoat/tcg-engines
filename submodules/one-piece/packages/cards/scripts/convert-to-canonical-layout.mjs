// Convert the cards package to the canonical per-type layout: every card
// definition lives at src/cards/<type>/<canonical-id>-<slug>.ts (lowercase),
// with a sibling .i18n.ts, and per-type index barrels at src/cards/<type>/.
// Set membership lives only in printings[]. The legacy <SET>/<type>/ tree is
// deleted. ST01's shared authoring helpers move to src/cards/st01-helpers.ts.
//
//   node --experimental-strip-types scripts/convert-to-canonical-layout.mjs --apply
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_SRC = join(__dirname, "..", "src", "cards");
const APPLY = process.argv.includes("--apply");

const TYPE_DIRS = new Set(["leaders", "characters", "events", "stages", "don"]);

function listCardFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listCardFiles(path);
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".i18n.ts") || entry.name === "index.ts")
      return [];
    return [path];
  });
}

const moves = [];
for (const path of listCardFiles(CARDS_SRC)) {
  const rel = path.slice(CARDS_SRC.length + 1); // e.g. "OP05/leaders/001-sabo.ts"
  const parts = rel.split("/");
  if (parts.length !== 3) {
    console.log(`SKIP (unexpected layout): ${rel}`);
    continue;
  }
  const [setDir, typeDir] = parts;
  if (!TYPE_DIRS.has(typeDir)) {
    console.log(`SKIP (unexpected type dir): ${rel}`);
    continue;
  }

  const text = readFileSync(path, "utf8");
  const id = /^ {2}id: "([^"]+)",$/m.exec(text)?.[1];
  const slug = /^ {2}slug: "([^"]+)",$/m.exec(text)?.[1];
  const constName = /export const (\w+):/.exec(text)?.[1];
  if (!id || !slug || !constName) {
    console.log(`SKIP (no id/slug/const): ${rel}`);
    continue;
  }

  const baseName = `${id.toLowerCase()}-${slug.split("/")[0]}`;
  moves.push({
    from: path,
    to: join(CARDS_SRC, typeDir, `${baseName}.ts`),
    i18nFrom: path.replace(/\.ts$/, ".i18n.ts"),
    i18nTo: join(CARDS_SRC, typeDir, `${baseName}.i18n.ts`),
    isSt01: setDir === "ST01",
    typeDir,
    constName,
    baseName,
    text,
  });
}

console.log(`defs to move: ${moves.length}`);
const byTarget = new Map();
for (const move of moves) byTarget.set(move.typeDir, (byTarget.get(move.typeDir) ?? 0) + 1);
for (const [type, count] of [...byTarget].sort((left, right) => left.localeCompare(right)))
  console.log(`  ${type}: ${count}`);

if (!APPLY) {
  console.log("(dry run — no files written)");
  process.exit(0);
}

for (const typeDir of TYPE_DIRS) mkdirSync(join(CARDS_SRC, typeDir), { recursive: true });

// move defs + i18n siblings; ST01 files rewrite their helper import path
for (const move of moves) {
  let text = move.text;
  if (move.isSt01) text = text.replaceAll('"../helpers.ts"', '"../st01-helpers.ts"');
  writeFileSync(move.to, text);

  let i18nText = readFileSync(move.i18nFrom, "utf8");
  if (move.isSt01) i18nText = i18nText.replaceAll('"../helpers.ts"', '"../st01-helpers.ts"');
  writeFileSync(move.i18nTo, i18nText);

  rmSync(move.from);
  rmSync(move.i18nFrom);
}

// move the ST01 helpers file next to the type dirs
const helpersText = readFileSync(join(CARDS_SRC, "ST01", "helpers.ts"), "utf8");
rmSync(join(CARDS_SRC, "ST01", "helpers.ts"));
writeFileSync(join(CARDS_SRC, "st01-helpers.ts"), helpersText);

// per-type index barrels
for (const [typeDir] of [...byTarget].sort((left, right) => left.localeCompare(right))) {
  const lines = moves
    .filter((m) => m.typeDir === typeDir)
    .map((m) => `export { ${m.constName} } from "./${m.baseName}.ts";`)
    .sort((left, right) => left.localeCompare(right));
  writeFileSync(join(CARDS_SRC, typeDir, "index.ts"), lines.join("\n") + "\n");
}

// delete the legacy set directories
for (const entry of readdirSync(CARDS_SRC, { withFileTypes: true })) {
  if (entry.isDirectory() && !TYPE_DIRS.has(entry.name)) {
    rmSync(join(CARDS_SRC, entry.name), { recursive: true });
  }
}

// root barrel
const rootLines = [...TYPE_DIRS]
  .toArray()
  .sort()
  .map((typeDir) => `export * from "./${typeDir}/index.ts";`);
writeFileSync(join(CARDS_SRC, "index.ts"), rootLines.join("\n") + "\n");

console.log(`moved ${moves.length} definitions into per-type layout`);
