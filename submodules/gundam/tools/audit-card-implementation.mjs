import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const cardsRoot = join(repoRoot, "packages/cards/src/cards");
const outFile = join(repoRoot, "docs/card-implementation-audit.md");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return [path];
  });
}

function matchString(src, key) {
  const start = src.search(new RegExp(`${key}:\\s*["'\`]`));
  if (start === -1) return "";
  const colon = src.indexOf(":", start);
  let index = colon + 1;
  while (/\s/.test(src[index] ?? "")) index += 1;
  const quote = src[index];
  if (quote !== '"' && quote !== "'" && quote !== "`") return "";
  index += 1;
  let value = "";
  let escaped = false;
  for (; index < src.length; index += 1) {
    const char = src[index];
    if (escaped) {
      value += `\\${char}`;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) break;
    value += char;
  }
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

function extractArrayBody(src, key) {
  const marker = `${key}: [`;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  let index = start + marker.length - 1;
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  for (; index < src.length; index += 1) {
    const char = src[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) inString = false;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return src.slice(start + marker.length, index);
    }
  }
  return null;
}

function extractSourceTexts(effectsBody) {
  if (!effectsBody) return [];
  return [...effectsBody.matchAll(/sourceText:\s*"((?:\\.|[^"\\])*)"/g)].map((match) =>
    JSON.parse(`"${match[1]}"`),
  );
}

function extractTimings(effectsBody) {
  if (!effectsBody) return [];
  const timings = new Set();
  for (const match of effectsBody.matchAll(/timing:\s*\[([\s\S]*?)\]/g)) {
    for (const timing of match[1].matchAll(/"([^"]+)"/g)) timings.add(timing[1]);
  }
  return [...timings].sort((a, b) => a.localeCompare(b));
}

function hasEmptyDirectives(effectsBody) {
  return Boolean(effectsBody?.match(/directives:\s*\[\s*\]/));
}

function hasNoEffects(effectsBody) {
  return effectsBody !== null && effectsBody.trim() === "";
}

function extractTodos(testSrc) {
  const todos = [];
  const regex =
    /\b(?:it|test)\.(todo|skip)\(\s*("((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|`([\s\S]*?)`)?/g;
  for (const match of testSrc.matchAll(regex)) {
    const raw = match[3] ?? match[4] ?? match[5] ?? "";
    todos.push({
      kind: match[1],
      text: raw.replace(/\s+/g, " ").trim(),
    });
  }
  return todos;
}

function bucketFor(card, todoText, sourceTexts, emptyDirectives, noEffects) {
  const haystack = `${card.effect} ${todoText} ${sourceTexts.join(" ")}`.toLowerCase();
  if (
    haystack.includes("<blocker>") ||
    haystack.includes("attack target") ||
    haystack.includes("must attack")
  )
    return "blocker or attack redirection";
  if (haystack.includes("burst") && card.type === "command") return "command burst dispatch";
  if (haystack.includes("ex base")) return "deploy/place EX Base";
  if (haystack.includes("ex resource")) return "place/use EX Resource";
  if (
    haystack.includes("paired pilot") ||
    haystack.includes("pair") ||
    haystack.includes("pilot-resident")
  )
    return "pilot pairing/link resident effects";
  if (haystack.includes("during link") || haystack.includes("when linked"))
    return "link timing triggers";
  if (haystack.includes("destroyed")) return "destroyed triggers";
  if (haystack.includes("draw-by-effect") || haystack.includes("when you draw"))
    return "draw-by-effect triggers";
  if (haystack.includes("trash")) return "trash recursion or trash-count conditions";
  if (haystack.includes("top") || haystack.includes("milled") || haystack.includes("deck"))
    return "deck reveal/mill conditions";
  if (haystack.includes("can't be destroyed") || haystack.includes("cannot be destroyed"))
    return "prevent destruction";
  if (haystack.includes("damage") && (haystack.includes("reduce") || haystack.includes("prevent")))
    return "damage prevention/reduction";
  if (haystack.includes("support")) return "support ability plumbing";
  if (haystack.includes("cost -") || haystack.includes("cost reduction"))
    return "zone cost modifiers";
  if (haystack.includes("if ") || haystack.includes("with ") || haystack.includes("instead"))
    return "conditional branches/replacements";
  if (emptyDirectives) return "unclassified parsed shell";
  if (noEffects && card.effect) return "unclassified parser gap";
  return "dedicated runtime scenario missing";
}

function isReminderOnly(card) {
  const normalized = card.effect.toLowerCase().replace(/<br>/g, "").replace(/\s+/g, " ").trim();
  if (card.type === "resource" && normalized === "(rest a resource when paying a cost.)")
    return true;
  if (
    card.type === "base" &&
    card.name === "EX Base" &&
    normalized.startsWith("(at the start of the game, place 1 active ex base")
  )
    return true;
  if (
    card.type === "resource" &&
    card.name === "EX Resource" &&
    normalized.startsWith("(at the start of the game, the second-turn player places 1")
  )
    return true;
  return false;
}

function isPrintedKeywordOnlyEffect(effectText) {
  const lines = effectText
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return false;

  return lines.every((line) => /^<[A-Za-z][\w\s-]*?(?:\s+\d+)?>\s*(?:\([^)]*\)\s*)*$/.test(line));
}

function isMeaningfulEffect(card) {
  if (!card.effect) return false;
  const normalized = card.effect.toLowerCase().replace(/<br>/g, "").replace(/\s+/g, " ").trim();
  if (!normalized || normalized === "-") return false;
  if (isPrintedKeywordOnlyEffect(card.effect)) return false;
  return !card.reminderOnly;
}

const cardFiles = walk(cardsRoot)
  .filter((file) => file.endsWith(".ts"))
  .filter((file) => !file.endsWith(".test.ts"))
  .filter((file) => !file.endsWith("/index.ts"));

const cards = cardFiles.map((file) => {
  const src = readFileSync(file, "utf8");
  const effectsBody = extractArrayBody(src, "effects");
  const testFile = file.replace(/\.ts$/, ".test.ts");
  const todos = existsSync(testFile) ? extractTodos(readFileSync(testFile, "utf8")) : [];
  const sourceTexts = extractSourceTexts(effectsBody);
  const emptyDirectives = hasEmptyDirectives(effectsBody);
  const noEffects = hasNoEffects(effectsBody);
  const card = {
    path: relative(repoRoot, file),
    testPath: existsSync(testFile) ? relative(repoRoot, testFile) : "",
    cardNumber: matchString(src, "cardNumber"),
    name: matchString(src, "name"),
    type: matchString(src, "type"),
    effect: matchString(src, "effect"),
    timings: extractTimings(effectsBody),
    sourceTexts,
    emptyDirectives,
    noEffects,
    todos,
  };
  const todoText = todos.map((todo) => todo.text).join(" ");
  card.bucket = bucketFor(card, todoText, sourceTexts, emptyDirectives, noEffects);
  card.reminderOnly = isReminderOnly(card);
  card.needsWork = Boolean(
    isMeaningfulEffect(card) &&
    (noEffects || emptyDirectives || todos.length > 0 || !card.testPath),
  );
  return card;
});

const needsWork = cards.filter((card) => card.needsWork);
const byBucket = Map.groupBy(needsWork, (card) => card.bucket);
const bySet = Map.groupBy(needsWork, (card) => card.cardNumber.split("-")[0] || "unknown");
const byType = Map.groupBy(needsWork, (card) => card.type || "unknown");

function table(rows) {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function countRows(grouped) {
  return [...grouped.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([name, items]) => [name, String(items.length)]);
}

const lines = [];
lines.push("# Card Implementation Audit");
lines.push("");
lines.push("Generated from `packages/cards/src/cards/**/*.ts` and matching card tests.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push(`- Total card definitions scanned: ${cards.length}`);
lines.push(
  `- Reminder/setup-only card definitions excluded: ${cards.filter((card) => card.reminderOnly).length}`,
);
lines.push(
  `- Cards with effect text still needing implementation or verification: ${needsWork.length}`,
);
lines.push(
  `- Cards with effect text but empty \`effects: []\`: ${
    needsWork.filter((card) => card.effect && card.noEffects).length
  }`,
);
lines.push(
  `- Cards with parsed effect shells that contain \`directives: []\`: ${
    needsWork.filter((card) => card.effect && card.emptyDirectives).length
  }`,
);
lines.push(
  `- Cards with todo/skip tests: ${needsWork.filter((card) => card.todos.length > 0).length}`,
);
lines.push(
  `- Cards with effect text and no matching test file: ${needsWork.filter((card) => card.effect && !card.testPath).length}`,
);
lines.push("");
lines.push("## Missing Work By Mechanic");
lines.push("");
lines.push(table([["Bucket", "Cards"], ...countRows(byBucket)]));
lines.push("");
lines.push("## Missing Work By Set");
lines.push("");
lines.push(table([["Set", "Cards"], ...countRows(bySet)]));
lines.push("");
lines.push("## Missing Work By Type");
lines.push("");
lines.push(table([["Type", "Cards"], ...countRows(byType)]));
lines.push("");
lines.push("## Card List");
lines.push("");
lines.push(
  table([
    ["Card", "Type", "Bucket", "Evidence"],
    ...needsWork
      .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber) || a.name.localeCompare(b.name))
      .map((card) => {
        const evidence = [];
        if (card.noEffects) evidence.push("empty effects");
        if (card.emptyDirectives) evidence.push("empty directives");
        if (card.todos.length > 0)
          evidence.push(
            card.todos.map((todo) => `${todo.kind}: ${todo.text || "unnamed"}`).join("<br>"),
          );
        if (!card.testPath) evidence.push("no test file");
        if (card.timings.length > 0) evidence.push(`timing: ${card.timings.join(", ")}`);
        return [
          `[${card.cardNumber} ${card.name}](../${card.path})`,
          card.type,
          card.bucket,
          evidence.join("<br>"),
        ];
      }),
  ]),
);
lines.push("");
lines.push("## Notes");
lines.push("");
lines.push(
  "- `parsed shell has no directives` means the parser identified a timing/header but produced no executable directives, so the engine has nothing meaningful to resolve.",
);
lines.push(
  "- `todo/skip` evidence means the card has an explicit pending card-level behavior test, even if part of its effect is already modeled.",
);
lines.push(
  "- Cards with only printed keywords and no effect text are excluded unless they have a pending test.",
);
lines.push("");

writeFileSync(outFile, `${lines.join("\n")}\n`);
console.log(`Wrote ${relative(repoRoot, outFile)}`);
console.log(`Cards scanned: ${cards.length}`);
console.log(`Cards needing implementation or verification: ${needsWork.length}`);
