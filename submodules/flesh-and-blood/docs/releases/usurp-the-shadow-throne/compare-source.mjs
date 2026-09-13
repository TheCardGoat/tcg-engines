import { readFile } from "node:fs/promises";

const input = process.argv[2];
if (!input) throw new Error("Usage: node compare-source.mjs <scraper-snapshot.json>");
const baseline = JSON.parse(
  await readFile(new URL("./preview-source.json", import.meta.url), "utf8"),
);
const next = JSON.parse(await readFile(input, "utf8"));
if (!Array.isArray(next.payload?.cards))
  throw new Error("Expected a FAB Cube scraper snapshot with payload.cards");
const setCards = next.payload.cards.filter((card) =>
  card.printings?.some((printing) => printing.set_id === "IAR"),
);
if (!setCards.length)
  throw new Error("Snapshot has no IAR printings; refusing an empty comparison");
const before = new Map(baseline.cards.map((row) => [row.card.unique_id, row.card]));
const after = new Map(setCards.map((card) => [card.unique_id, card]));
if (after.size !== setCards.length) throw new Error("Duplicate canonical IDs in new snapshot");
const changes = [];
for (const [id, card] of after) {
  const old = before.get(id);
  if (!old) {
    changes.push({ id, name: card.name, color: card.color, status: "added" });
    continue;
  }
  const fields = [...new Set([...Object.keys(old), ...Object.keys(card)])].filter(
    (key) => JSON.stringify(old[key]) !== JSON.stringify(card[key]),
  );
  if (fields.length)
    changes.push({ id, name: card.name, color: card.color, status: "changed", fields });
}
for (const [id, card] of before)
  if (!after.has(id)) changes.push({ id, name: card.name, color: card.color, status: "removed" });
console.log(
  JSON.stringify(
    {
      baseline: baseline.metadata.sourceCommit,
      next: next.sourceVersion,
      variants: after.size,
      changes,
    },
    null,
    2,
  ),
);
