import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { hasCard } from "../../../../one-piece/packages/cards/src/index.ts";
import { TEST_DECKS } from "../../../../one-piece/packages/engine/src/automation/test-decks.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metaDir = join(root, "decks/meta");
const playableDir = join(root, "decks/playable");
mkdirSync(playableDir, { recursive: true });

const metaFiles = readdirSync(metaDir).filter((f) => f.endsWith(".json") && f !== "index.json");
const report: Array<Record<string, unknown>> = [];

for (const f of metaFiles) {
  const deck = JSON.parse(readFileSync(join(metaDir, f), "utf8")) as {
    id: string;
    leaderId: string;
    mainDeck: string[];
  };
  const missing: string[] = [];
  if (!hasCard(deck.leaderId)) missing.push(deck.leaderId);
  for (const id of deck.mainDeck) {
    if (!hasCard(id) && !missing.includes(id)) missing.push(id);
  }
  report.push({
    id: deck.id,
    leaderId: deck.leaderId,
    missingCount: missing.length,
    missing,
    mainDeckCount: deck.mainDeck.length,
  });
  console.log(
    `${deck.id}: missing ${missing.length} card ids (leader+unique main gaps), main=${deck.mainDeck.length}`,
  );
}

const playableIndex: {
  source: string;
  decks: Array<{ id: string; path: string; leaderId: string }>;
  metaPlayableMap: Record<string, string>;
  note: string;
} = {
  source: "engine TEST_DECKS",
  decks: [],
  metaPlayableMap: {
    "blue-yellow-nami": "blue-control",
    "purple-enel": "purple-ramp",
    "green-blue-luffy": "green-midrange",
    "black-yellow-blackbeard": "black-removal",
    "purple-yellow-rosinante": "yellow-trigger",
  },
  note: "Limitless OP16 meta decks live under decks/meta. Many OP15/OP16 printings are not yet in the catalog; play uses engine TEST_DECK archetype stand-ins mapped by meta share order.",
};

for (const [id, def] of Object.entries(TEST_DECKS)) {
  const payload = {
    id,
    name: id,
    leaderId: def.leaderId,
    mainDeck: def.mainDeck,
    mainDeckCount: def.mainDeck.length,
    description: def.description,
    playable: true,
    source: "one-piece engine test-decks",
  };
  writeFileSync(join(playableDir, `${id}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  playableIndex.decks.push({ id, path: `decks/playable/${id}.json`, leaderId: def.leaderId });
  console.log(`playable ${id}: leader=${def.leaderId} count=${def.mainDeck.length}`);
}

writeFileSync(join(playableDir, "index.json"), `${JSON.stringify(playableIndex, null, 2)}\n`);
writeFileSync(join(root, "decks/meta-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log("done");
