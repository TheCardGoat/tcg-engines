// Split the legacy hand-authored ST01 bundle (17 card definitions in one
// index.ts) into the standard per-card file layout: cards/ST01/<type>/NNN-slug.ts
// + sibling .i18n.ts + per-type index files. The shared authoring helpers move
// to cards/ST01/helpers.ts.
//
//   node --experimental-strip-types scripts/split-st01-bundle.mjs --apply
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ST01_DIR = join(__dirname, "..", "src", "cards", "ST01");
const BUNDLED = join(ST01_DIR, "index.ts");
const APPLY = process.argv.includes("--apply");

const text = readFileSync(BUNDLED, "utf8");

// ---------- slice helpers ----------
function extractBlock(source, startMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) return null;
  let depth = 0;
  let inString = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inString = ch;
    else if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated block at ${startMarker}`);
}

// ---------- 1. helpers module ----------
const helpersEnd = text.indexOf("export const");
const helpersBlock = text.slice(0, helpersEnd);
const helpersTs = `${helpersBlock.trimEnd()}\n\nexport { i18n, printing, strawHat, supernovasStrawHat };\n`;

// ---------- 2. def blocks ----------
const defBlocks = [];
const re = /export const (\w+): (\w+) = /g;
const markers = [...text.matchAll(re)];
for (let i = 0; i < markers.length; i++) {
  const block = extractBlock(text, markers[i][0]);
  defBlocks.push({ constName: markers[i][1], typeName: markers[i][2], block });
}

const TYPE_DIR = {
  LeaderCard: "leaders",
  CharacterCard: "characters",
  EventCard: "events",
  StageCard: "stages",
};

function fieldOf(block, field) {
  const m = new RegExp(`^\\s{2}${field}: "([^"]+)",`, "m").exec(block);
  return m ? m[1] : null;
}

const outputs = []; // { file, content }
const perTypeExports = new Map();
for (const { constName, typeName, block } of defBlocks) {
  const id = fieldOf(block, "id");
  const slug = fieldOf(block, "slug");
  if (!id || !slug) throw new Error(`missing id/slug in ${constName}`);
  const num = id.split("-")[1];
  const namePart = slug.split("/")[0];
  const typeDir = TYPE_DIR[typeName];
  if (!typeDir) throw new Error(`unknown card type ${typeName} for ${constName}`);

  // i18n call -> sibling i18n file
  const i18nCall = /  i18n: i18n\(/.exec(block);
  if (!i18nCall) throw new Error(`no i18n call in ${constName}`);
  const callStart = block.indexOf(i18nCall[0]) + "  i18n: ".length;
  let depth = 0;
  let inString = null;
  let callEnd = -1;
  for (let i = callStart; i < block.length; i++) {
    const ch = block[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") inString = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) {
        callEnd = i + 1;
        break;
      }
    }
  }
  const callArgs = block.slice(callStart + "i18n(".length, callEnd - 1);
  const i18nConst = `${constName}I18n`;

  // only import the helpers this def actually uses
  const usedHelpers = ["printing"];
  if (block.includes("strawHat")) usedHelpers.push("strawHat");
  if (block.includes("supernovasStrawHat")) usedHelpers.push("supernovasStrawHat");

  const defContent = `import type { ${typeName} } from "@tcg/op-types";
import { ${usedHelpers.join(", ")} } from "../helpers.ts";
import { ${i18nConst} } from "./${num}-${namePart}.i18n.ts";

${block.replace(/  i18n: i18n\([\s\S]*\),/, `  i18n: ${i18nConst},`)}
`;
  const i18nContent = `import type { OPCardI18n } from "@tcg/op-types";
import { i18n } from "../helpers.ts";

export const ${i18nConst}: OPCardI18n = i18n(${callArgs});
`;
  const dir = join(ST01_DIR, typeDir);
  outputs.push({ file: join(dir, `${num}-${namePart}.ts`), content: defContent });
  outputs.push({ file: join(dir, `${num}-${namePart}.i18n.ts`), content: i18nContent });
  if (!perTypeExports.has(typeDir)) perTypeExports.set(typeDir, []);
  perTypeExports.get(typeDir).push(`export { ${constName} } from "./${num}-${namePart}.ts";`);
}
// drop unused helper imports where a def does not use them is left to fmt/lint;
// the shared helpers are imported by most defs.

console.log(`defs in bundle: ${defBlocks.length}`);
for (const [typeDir, exports] of perTypeExports)
  console.log(`  ${typeDir}: ${exports.length} defs`);
console.log("plus helpers.ts, per-type index.ts files, root index update, bundled file deletion");

if (!APPLY) {
  console.log("(dry run — no files written)");
  process.exit(0);
}

writeFileSync(join(ST01_DIR, "helpers.ts"), helpersTs);
for (const out of outputs) {
  mkdirSync(dirname(out.file), { recursive: true });
  writeFileSync(out.file, out.content);
}
for (const [typeDir, exports] of perTypeExports) {
  writeFileSync(join(ST01_DIR, typeDir, "index.ts"), exports.join("\n") + "\n");
}
rmSync(BUNDLED);
// root barrel: replace the bundled ST01 export with the per-type barrels
const rootIndex = join(ST01_DIR, "..", "index.ts");
const rootText = readFileSync(rootIndex, "utf8");
writeFileSync(
  rootIndex,
  rootText.replace(
    'export * from "./ST01/index.ts";',
    perTypeExports
      .keys()
      .map((typeDir) => `export * from "./ST01/${typeDir}/index.ts";`)
      .toArray()
      .join("\n"),
  ),
);
console.log(`wrote ${outputs.length + perTypeExports.size + 1} files; deleted bundled index.ts`);
