// Stop authoring the derived artVariants view on card definitions: every
// remaining `artVariants: [...]` block or `artVariants: undefined,` line is
// removed. printings[] is the sole source of art identity; consumers derive
// the variant view from printings.
//
//   node --experimental-strip-types scripts/strip-art-variants.mjs --apply
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_SRC = join(__dirname, "..", "src", "cards");
const APPLY = process.argv.includes("--apply");

function listCardFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listCardFiles(path);
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".i18n.ts") || entry.name === "index.ts")
      return [];
    return [path];
  });
}

let touched = 0;
for (const file of listCardFiles(CARDS_SRC)) {
  let text = readFileSync(file, "utf8");
  const original = text;

  const start = text.indexOf("  artVariants: [");
  if (start !== -1) {
    const end = text.indexOf("\n  ],", start);
    if (end === -1) throw new Error(`unterminated artVariants block in ${file}`);
    text = text.slice(0, start) + text.slice(end + "\n  ],".length + 1);
  }
  const undefinedLine = /  artVariants: undefined,\n/;
  text = text.replace(undefinedLine, "");

  if (text !== original) {
    touched++;
    if (APPLY) writeFileSync(file, text);
  }
}
console.log(`files with authored artVariants: ${touched}${APPLY ? " (stripped)" : " (dry run)"}`);
