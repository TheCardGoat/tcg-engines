#!/usr/bin/env node
// Canonical card layout audit — wired into the workspace `ci:check` task.
//
// Fails when the authored card tree drifts out of the canonical per-type
// layout introduced by the canonical-card consolidation:
//   - legacy set directories must not reappear under src/
//   - card files live only at src/cards/<type>/<slug>.ts
//   - filenames must be plain slugs; each slug owns exactly one file
//   - every card has a `<slug>.i18n.ts` sibling (the localization extension
//     point — FAB/One Piece file pattern), and the card literal carries NO
//     card-level display text (it lives in the sibling)
//
// Card files, barrels, and printing metadata are authored and reviewed
// directly. No generator may overwrite card abilities.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const cardsSrc = resolve(currentDir, "../src");

const LEGACY_SET_DIRS = [
  "alpha",
  "spoiler",
  "promo",
  "PRM01",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
];

const TYPE_DIRS = ["legends", "units", "gear", "programs"];

const CARD_FILE_TEXT_PROPERTIES = [
  "name",
  "subname",
  "displayName",
  "rulesText",
  "flavorText",
  "description",
  "youtubeUrl",
  "sourceUrl",
];

const problems = [];

for (const set of LEGACY_SET_DIRS) {
  if (existsSync(join(cardsSrc, set))) {
    problems.push(
      `legacy set directory src/${set} must not exist — cards live in src/cards/<type>/`,
    );
  }
}

const cardsDir = join(cardsSrc, "cards");
if (!existsSync(cardsDir)) {
  problems.push("src/cards is missing — the canonical card tree does not exist");
}

// Top-level (2-space indent) properties of the defineCyberpunkCard literal.
// Nested keys (set.name, ability `.text(...)`) are deeper-indented and never
// match.
const cardTextPropertyPattern = new RegExp(`^  (?:${CARD_FILE_TEXT_PROPERTIES.join("|")}):`, "m");

const slugOwners = new Map();
const i18nSiblings = new Map();
for (const type of TYPE_DIRS) {
  const typeDir = join(cardsDir, type);
  if (!existsSync(typeDir)) {
    problems.push(`src/cards/${type} is missing`);
    continue;
  }
  for (const entry of readdirSync(typeDir)) {
    if (entry === "index.ts") continue;
    if (!entry.endsWith(".ts")) {
      problems.push(`unexpected non-TypeScript entry src/cards/${type}/${entry}`);
      continue;
    }
    const isI18nSibling = entry.endsWith(".i18n.ts");
    const slug = isI18nSibling ? entry.replace(/\.i18n\.ts$/, "") : entry.replace(/\.ts$/, "");
    if (!/^[a-z0-9-]+$/.test(slug)) {
      problems.push(`filename must be the card slug: src/cards/${type}/${entry}`);
      continue;
    }
    if (isI18nSibling) {
      i18nSiblings.set(slug, type);
      continue;
    }
    const owner = slugOwners.get(slug);
    if (owner) {
      problems.push(
        `slug "${slug}" owns two files: src/cards/${owner}/${entry} and src/cards/${type}/${entry}`,
      );
      continue;
    }
    slugOwners.set(slug, type);
    if (!existsSync(join(typeDir, `${slug}.i18n.ts`))) {
      problems.push(`missing i18n sibling src/cards/${type}/${slug}.i18n.ts`);
    }
    const source = readFileSync(join(typeDir, entry), "utf8");
    if (cardTextPropertyPattern.test(source)) {
      problems.push(
        `src/cards/${type}/${entry} carries card-level display text — move it to ${slug}.i18n.ts`,
      );
    }
  }
}

for (const [slug, type] of i18nSiblings) {
  if (!slugOwners.has(slug)) {
    problems.push(`orphan i18n sibling src/cards/${type}/${slug}.i18n.ts`);
  }
}

if (problems.length > 0) {
  console.error("Canonical card layout audit failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Canonical card layout OK (${slugOwners.size} cards + i18n siblings in src/cards/<type>/)`,
);
