import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { parseEffectText, parseActions, parseInlineCondition } from "../src/effect-parser/index.ts";
const cardsDir = "packages/op-cards/src/cards";
let totalCards = 0,
  fullyParsed = 0,
  totalSegments = 0,
  parsedSegments = 0;
let unparsedGroups: Record<string, number> = {};
function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.endsWith(".ts") || entry === "index.ts") continue;
    const content = readFileSync(full, "utf-8");
    const effectMatch = content.match(/effect:\s*"((?:[^"\\]|\\.)*)"/s);
    if (!effectMatch) continue;
    const effectText = effectMatch[1]!.replace(/\\n/g, "\n").replace(/\\"/g, '"');
    if (!effectText.trim()) continue;
    totalCards++;
    const parsed = parseEffectText(effectText);
    let ok = true;
    for (const seg of parsed.segments) {
      let actionText = seg.rawActionText;
      if (!actionText.trim()) continue;
      totalSegments++;
      let hasChoice = false;
      if (seg.choiceItems && seg.choiceItems.length > 0) {
        for (const item of seg.choiceItems) {
          let t = item;
          const ic = parseInlineCondition(t);
          if (ic) t = ic.remainingText;
          if (parseActions(t).parsed.length > 0) hasChoice = true;
        }
      }
      const ic = parseInlineCondition(actionText);
      if (ic) actionText = ic.remainingText;
      const r = parseActions(actionText);
      if (r.parsed.length > 0 || hasChoice) {
        parsedSegments++;
      } else {
        ok = false;
        unparsedGroups[seg.rawActionText.slice(0, 150)] =
          (unparsedGroups[seg.rawActionText.slice(0, 150)] || 0) + 1;
      }
    }
    if (ok) fullyParsed++;
  }
}
walk(cardsDir);
console.log(`\n=== Coverage Report ===`);
console.log(`Total cards: ${totalCards}`);
console.log(`Fully parsed: ${fullyParsed} (${((fullyParsed / totalCards) * 100).toFixed(1)}%)`);
console.log(
  `Segments: ${parsedSegments}/${totalSegments} (${((parsedSegments / totalSegments) * 100).toFixed(1)}%)`,
);
console.log(`Unparsed: ${totalSegments - parsedSegments}`);
const sorted = Object.entries(unparsedGroups).sort((a, b) => b[1] - a[1]);
console.log(`\nAll unparsed patterns (${sorted.length} unique):`);
for (const [p, c] of sorted) console.log(`  ${c}x: ${p}`);
