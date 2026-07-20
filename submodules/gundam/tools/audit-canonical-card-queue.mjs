#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CARDS_ROOT = join(ROOT, "packages", "cards", "src", "cards");
const STATE_PATH = join(ROOT, "docs", "card-audit", "inventory-state.json");
const SET_ORDER = [
  "gd01",
  "gd02",
  "gd03",
  "gd04",
  "st01",
  "st02",
  "st03",
  "st04",
  "st05",
  "st06",
  "st07",
  "st08",
  "st09",
  "t",
];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function quotedField(source, field) {
  return source.match(new RegExp(`\\b${field}\\s*:\\s*"([^"]+)"`))?.[1];
}

function hasAuthoredAbility(source) {
  return /\beffects\s*:\s*\[\s*\{/.test(source) || /\bkeywordEffects\s*:\s*\[\s*\{/.test(source);
}

function setRank(set) {
  const rank = SET_ORDER.indexOf(set);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
}

function preferCanonicalOwner(current, candidate) {
  if (!current) return candidate;
  if (current.set === "beta" && candidate.set !== "beta") return candidate;
  if (current.set !== "beta" && candidate.set === "beta") return current;
  return candidate.path.localeCompare(current.path) < 0 ? candidate : current;
}

const state = JSON.parse(readFileSync(STATE_PATH, "utf8"));
const verifiedSets = new Set(state.verifiedSets);
const verifiedCardIds = new Set(state.verifiedCardIds);

const definitions = walk(CARDS_ROOT)
  .filter((path) => path.endsWith(".ts"))
  .filter((path) => !path.endsWith(".test.ts"))
  .filter((path) => !path.endsWith(`${sep}index.ts`))
  .flatMap((path) => {
    const source = readFileSync(path, "utf8");
    const cardNumber = quotedField(source, "cardNumber");
    if (!cardNumber) return [];
    const rel = relative(ROOT, path);
    const set = relative(CARDS_ROOT, path).split(sep)[0];
    return [
      {
        cardNumber,
        name: quotedField(source, "name") ?? "Unknown",
        type: quotedField(source, "type") ?? "unknown",
        set,
        path: rel,
        testPath: rel.replace(/\.ts$/, ".test.ts"),
        hasAbility: hasAuthoredAbility(source),
      },
    ];
  });

const canonicalById = new Map();
for (const definition of definitions) {
  canonicalById.set(
    definition.cardNumber,
    preferCanonicalOwner(canonicalById.get(definition.cardNumber), definition),
  );
}

const canonicalAbilityCards = [...canonicalById.values()].filter((card) => card.hasAbility);
const remaining = canonicalAbilityCards
  .filter((card) => !verifiedSets.has(card.set) && !verifiedCardIds.has(card.cardNumber))
  .sort(
    (a, b) =>
      setRank(a.set) - setRank(b.set) ||
      a.cardNumber.localeCompare(b.cardNumber, "en", { numeric: true }) ||
      a.path.localeCompare(b.path),
  );

const waveSizeArg = process.argv.find((arg) => arg.startsWith("--wave-size="));
const waveSize = waveSizeArg ? Number.parseInt(waveSizeArg.split("=")[1] ?? "", 10) : undefined;
const queue = waveSize === undefined ? remaining : remaining.slice(0, waveSize);

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      {
        definitions: definitions.length,
        canonicalCards: canonicalById.size,
        canonicalAbilityCards: canonicalAbilityCards.length,
        verifiedAbilityCards: canonicalAbilityCards.length - remaining.length,
        remainingAbilityCards: remaining.length,
        queue,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Definitions: ${definitions.length}`);
  console.log(`Canonical cards: ${canonicalById.size}`);
  console.log(`Canonical ability cards: ${canonicalAbilityCards.length}`);
  console.log(`Verified ability cards: ${canonicalAbilityCards.length - remaining.length}`);
  console.log(`Remaining ability cards: ${remaining.length}`);
  console.log("");
  for (const [index, card] of queue.entries()) {
    console.log(
      `${String(index + 1).padStart(3, "0")} ${card.cardNumber} ${card.name} | ${card.path} | ${card.testPath}`,
    );
  }
}
