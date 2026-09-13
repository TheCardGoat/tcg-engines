import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";
import { FAB_DOUBLE_FACED_CARD_SPECS } from "../src/authoring/reviewed-card-layouts.ts";

const CATALOG_ROOT = fileURLToPath(new URL("../src/generated/", import.meta.url));
const GENERATED_ROOT = CATALOG_ROOT;
const check = process.argv.includes("--check");
function recordFor(card, printings) {
  if (!card.name) throw new Error(`Missing name for ${card.canonicalId}`);
  const printingArt = Object.fromEntries(
    printings.flatMap((printing) => {
      // Empty pairs are explicit source gaps, never an excuse to borrow another
      // printing's art. A partial pair or provider URL is a broken catalog.
      if (!printing.imageUrl && !printing.boardImageUrl)
        return [
          [
            printing.id,
            {
              locale: printing.locale || "en-US",
              ...(printing.artId ? { artId: printing.artId } : {}),
            },
          ],
        ];
      if (
        !/^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/.test(
          printing.boardImageUrl ?? "",
        ) ||
        !/^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/.test(
          printing.imageUrl ?? "",
        ) ||
        !printing.locale
      )
        throw new Error(`Invalid square/full asset pair for ${card.canonicalId}/${printing.id}`);
      return [
        [
          printing.id,
          {
            locale: printing.locale,
            ...(printing.artId ? { artId: printing.artId } : {}),
            boardImageUrl: printing.boardImageUrl,
            printedImageUrl: printing.imageUrl,
          },
        ],
      ];
    }),
  );
  // Catalog order already encodes source quality; match fabDefaultPrintingId.
  const defaultPrintingId =
    printings.find((printing) => printingArt[printing.id]?.boardImageUrl)?.id ?? printings[0]?.id;
  const defaultArt = defaultPrintingId ? printingArt[defaultPrintingId] : undefined;
  const boardImageUrl = defaultArt?.boardImageUrl;
  const printedImageUrl = defaultArt?.printedImageUrl;
  return {
    canonicalId: card.canonicalId,
    slug: card.slug,
    name: card.name,
    ...(defaultPrintingId ? { defaultPrintingId } : {}),
    ...(boardImageUrl ? { boardImageUrl } : {}),
    ...(printedImageUrl ? { printedImageUrl } : {}),
    printings: printingArt,
    imageAspectRatio: card.playedHorizontally ? 2079 / 1488 : 63 / 88,
    keywords: card.cardKeywords ?? [],
  };
}

const catalog = JSON.parse(
  await readFile(path.join(CATALOG_ROOT, "flesh-and-blood-card-data.json"), "utf8"),
);
const printings = JSON.parse(
  await readFile(path.join(CATALOG_ROOT, "flesh-and-blood-printings.json"), "utf8"),
);
if (
  catalog.schemaVersion !== 1 ||
  printings.schemaVersion !== 1 ||
  catalog.game !== "flesh-and-blood" ||
  printings.game !== catalog.game ||
  !catalog.provenance?.sha256 ||
  printings.catalogSha256 !== catalog.provenance.sha256 ||
  !Array.isArray(catalog.cards) ||
  !printings.printingsByCanonicalId
) {
  throw new Error("Expected matching FAB card-data and printing catalogs.");
}
// Localized catalogs are joined by canonical id, never by translated names.
// Validate their catalog revision and the same published square/full contract.
const localizedCatalogs = await Promise.all(
  (await readdir(CATALOG_ROOT))
    .filter((name) => /^flesh-and-blood-localized-printings-[\w-]+\.json$/.test(name))
    .sort()
    .map(async (name) => {
      const localized = JSON.parse(await readFile(path.join(CATALOG_ROOT, name), "utf8"));
      if (
        localized.schemaVersion !== 1 ||
        localized.game !== catalog.game ||
        localized.catalogSha256 !== catalog.provenance.sha256 ||
        !localized.locale ||
        !localized.printingsByCanonicalId
      ) {
        throw new Error(`Incompatible localized printing catalog: ${name}`);
      }
      for (const entries of Object.values(localized.printingsByCanonicalId)) {
        if (!Array.isArray(entries) || entries.some((entry) => entry.locale !== localized.locale)) {
          throw new Error(`Invalid localized printing locale: ${name}`);
        }
      }
      return localized;
    }),
);
const records = catalog.cards.map((card) => {
  const entries = printings.printingsByCanonicalId[card.canonicalId];
  if (!Array.isArray(entries)) throw new Error(`Missing printings for ${card.canonicalId}`);
  const localizedEntries = localizedCatalogs.flatMap(
    (localized) => localized.printingsByCanonicalId[card.canonicalId] ?? [],
  );
  return recordFor(card, [...entries, ...localizedEntries]);
});

const recordsById = Object.fromEntries(
  records
    .sort((a, b) => a.canonicalId.localeCompare(b.canonicalId))
    .map((record) => [record.canonicalId, record]),
);
for (const spec of FAB_DOUBLE_FACED_CARD_SPECS) {
  const front = recordsById[spec.frontCanonicalId];
  const back = recordsById[spec.backCanonicalId];
  if (!front || !back) throw new Error(`Missing reviewed face: ${spec.frontCanonicalId}`);
  front.faces = {
    [`${spec.frontCanonicalId}:face:front`]: spec.frontCanonicalId,
    [`${spec.frontCanonicalId}:face:back`]: spec.backCanonicalId,
  };
}
const candidates = new Map();
for (const record of records) {
  const pitch = /-(red|yellow|blue)$/i.exec(record.slug)?.[1]?.toLowerCase();
  for (const identity of [
    record.canonicalId,
    record.slug,
    record.name,
    record.name.replace(/\s+\/\/\s+/g, " "),
    `token:${record.slug}`,
    ...Object.keys(record.printings),
    ...(pitch ? [`${record.name} (${pitch})`] : []),
  ]) {
    const ids = candidates.get(identity) ?? new Set();
    ids.add(record.canonicalId);
    candidates.set(identity, ids);
  }
}
const aliases = Object.fromEntries(
  [...candidates]
    .filter(([, ids]) => ids.size === 1)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([alias, ids]) => [alias, [...ids][0]]),
);
const artifact = { schemaVersion: 1, game: "flesh-and-blood", records: recordsById, aliases };
const bytes = JSON.stringify(artifact) + "\n";
const revision = createHash("sha256").update(bytes).digest("hex");
const reference = {
  revision,
  url: `https://cdn.tcg.online/public/fab/presentation/${revision}.json`,
};
const outputs = {
  "presentation-catalog.json": bytes,
  "presentation-revision.ts": `// Generated by generate-presentation-catalog.mjs.\nexport const FAB_PRESENTATION_CATALOG = ${JSON.stringify(reference, null, 2)} as const;\n`,
};
for (const [name, contents] of Object.entries(outputs)) {
  const output = path.join(GENERATED_ROOT, name);
  if (check) {
    if ((await readFile(output, "utf8").catch(() => "")) !== contents)
      throw new Error(`Stale generated presentation: ${name}`);
  } else {
    await mkdir(GENERATED_ROOT, { recursive: true });
    await writeFile(output, contents);
  }
}
console.log(
  `${check ? "Verified" : "Generated"} ${records.length} presentation records: ${revision}`,
);
