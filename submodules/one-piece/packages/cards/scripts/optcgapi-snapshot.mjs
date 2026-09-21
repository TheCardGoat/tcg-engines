// Fetch optcgapi set data into a local snapshot used by repair-printings.mjs.
// One-off tooling for the canonical-card migration; run from the cards package:
//   node --experimental-strip-types scripts/optcgapi-snapshot.mjs
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SNAPSHOT_DIR = process.env.OP_API_SNAPSHOT_DIR ?? "/tmp/op-api-snapshot";
const BASE_URL = "https://www.optcgapi.com/api";

// API set ids are dashed ("OP-01", "PRB-02", "OP14-EB04"); catalog set codes
// are not. OP14-EB04 and OP15-EB04 are real combined products holding both
// OP14-/OP15- and EB04-numbered cards.
const API_SET_IDS = [
  ...[
    "OP-01",
    "OP-02",
    "OP-03",
    "OP-04",
    "OP-05",
    "OP-06",
    "OP-07",
    "OP-08",
    "OP-09",
    "OP-10",
    "OP-11",
    "OP-12",
    "OP-13",
    "OP-16",
    "OP-17",
  ],
  ...["EB-01", "EB-02", "EB-03"],
  "PRB-01",
  "PRB-02",
  "OP14-EB04",
  "OP15-EB04",
];

mkdirSync(SNAPSHOT_DIR, { recursive: true });

for (const setId of API_SET_IDS) {
  const file = join(SNAPSHOT_DIR, `${setId}.json`);
  if (existsSync(file)) {
    console.log(`skip (cached): ${setId}`);
    continue;
  }
  process.stdout.write(`fetch ${setId} ... `);
  const res = await fetch(`${BASE_URL}/sets/${setId}/`);
  if (!res.ok) {
    console.log(`FAILED (${res.status})`);
    continue;
  }
  const cards = await res.json();
  writeFileSync(file, JSON.stringify(cards, null, 1));
  console.log(`${cards.length} cards`);
}
console.log(`snapshot dir: ${SNAPSHOT_DIR}`);
