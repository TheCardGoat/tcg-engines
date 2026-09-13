import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import path from "node:path";
import {
  GRAND_ARCHIVE_CARD_TYPES,
  GRAND_ARCHIVE_CLASSES,
  GRAND_ARCHIVE_ELEMENTS,
  GRAND_ARCHIVE_REFERENCE_KINDS,
  type GrandArchiveCardDefinition,
  type GrandArchiveCardReference,
  type GrandArchiveCatalog,
  type GrandArchiveCost,
  type GrandArchivePrinting,
  type GrandArchiveRawSnapshot,
  type GrandArchiveRelatedFaceDefinition,
  type GrandArchiveSpeed,
} from "@tcg/grand-archive-types";

const API_ORIGIN = "https://api.gatcg.com";

export class GrandArchiveCatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GrandArchiveCatalogError";
  }
}

type UnknownRecord = Record<string, unknown>;
function record(value: unknown, pathName: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new GrandArchiveCatalogError(`${pathName} must be an object.`);
  return value as UnknownRecord;
}
function string(value: unknown, pathName: string): string {
  if (typeof value !== "string" || value.length === 0)
    throw new GrandArchiveCatalogError(`${pathName} must be a non-empty string.`);
  return value;
}
function nullableString(value: unknown, pathName: string): string | null {
  if (value === null || value === "") return null;
  return string(value, pathName);
}
function nullableNumber(value: unknown, pathName: string): number | null {
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new GrandArchiveCatalogError(`${pathName} must be a finite number or null.`);
  return value;
}
function array(value: unknown, pathName: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new GrandArchiveCatalogError(`${pathName} must be an array.`);
  return value;
}
function stringArray(value: unknown, pathName: string): readonly string[] {
  return array(value, pathName).map((item, index) => string(item, `${pathName}[${index}]`));
}
function knownArray<const Values extends readonly string[]>(
  value: unknown,
  values: Values,
  pathName: string,
): readonly Values[number][] {
  return stringArray(value, pathName).map((item) => {
    if (!(values as readonly string[]).includes(item))
      throw new GrandArchiveCatalogError(
        `${pathName} contains unknown official vocabulary ${item}.`,
      );
    return item as Values[number];
  });
}
function cost(value: unknown, pathName: string): GrandArchiveCost {
  const input = record(value, pathName);
  const kind = string(input.type, `${pathName}.type`);
  if (kind === "none") {
    if (input.value !== null)
      throw new GrandArchiveCatalogError(`${pathName}.value must be null for a none cost.`);
    return { type: "none", value: null };
  }
  if (kind === "memory" || kind === "reserve")
    return { type: kind, value: string(input.value, `${pathName}.value`) };
  throw new GrandArchiveCatalogError(`${pathName}.type has unsupported value ${kind}.`);
}
function speed(value: unknown, pathName: string): GrandArchiveSpeed | null {
  if (value === null) return null;
  if (value === true) return "fast";
  if (value === false) return "slow";
  throw new GrandArchiveCatalogError(`${pathName} must be boolean or null.`);
}
function references(value: unknown, pathName: string): readonly GrandArchiveCardReference[] {
  return array(value, pathName).map((item, index) => {
    const input = record(item, `${pathName}[${index}]`);
    const kind = string(input.kind, `${pathName}[${index}].kind`);
    if (!(GRAND_ARCHIVE_REFERENCE_KINDS as readonly string[]).includes(kind))
      throw new GrandArchiveCatalogError(
        `${pathName}[${index}].kind has unsupported value ${kind}.`,
      );
    return {
      kind: kind as GrandArchiveCardReference["kind"],
      name: string(input.name, `${pathName}[${index}].name`),
      slug: string(input.slug, `${pathName}[${index}].slug`),
    };
  });
}
function printing(value: unknown, pathName: string): GrandArchivePrinting {
  const input = record(value, pathName);
  const set = record(input.set, `${pathName}.set`);
  const image = string(input.image, `${pathName}.image`);
  const configuration = string(input.configuration, `${pathName}.configuration`);
  if (configuration !== "default" && configuration !== "flip")
    throw new GrandArchiveCatalogError(
      `${pathName}.configuration has unsupported value ${configuration}.`,
    );
  const orientation = input.orientation;
  if (orientation !== null && orientation !== "front" && orientation !== "back")
    throw new GrandArchiveCatalogError(`${pathName}.orientation has unsupported value.`);
  return {
    id: string(input.uuid, `${pathName}.uuid`),
    artId: string(input.uuid, `${pathName}.uuid`),
    setCode: string(set.prefix, `${pathName}.set.prefix`),
    collectorNumber: string(input.collector_number, `${pathName}.collector_number`),
    rarity: String(nullableNumber(input.rarity, `${pathName}.rarity`) ?? ""),
    imageUrl: new URL(image, API_ORIGIN).toString(),
    externalIds: { gatcgIndex: string(input.uuid, `${pathName}.uuid`) },
    editionSlug: string(input.slug, `${pathName}.slug`),
    configuration,
    orientation,
    illustrator: nullableString(input.illustrator, `${pathName}.illustrator`),
    flavor: nullableString(input.flavor, `${pathName}.flavor`),
    set: {
      id: string(set.id, `${pathName}.set.id`),
      prefix: string(set.prefix, `${pathName}.set.prefix`),
      name: string(set.name, `${pathName}.set.name`),
      language: string(set.language, `${pathName}.set.language`),
      releaseDate: string(set.release_date, `${pathName}.set.release_date`),
    },
  };
}
function relatedFace(value: unknown, pathName: string): GrandArchiveRelatedFaceDefinition {
  const input = record(value, pathName);
  const edition = record(input.edition, `${pathName}.edition`);
  const orientation = edition.orientation;
  if (orientation !== "front" && orientation !== "back")
    throw new GrandArchiveCatalogError(`${pathName}.edition.orientation must identify a face.`);
  return {
    canonicalId: string(input.uuid, `${pathName}.uuid`),
    slug: string(input.slug, `${pathName}.slug`),
    name: string(input.name, `${pathName}.name`),
    types: knownArray(input.types, GRAND_ARCHIVE_CARD_TYPES, `${pathName}.types`),
    subtypes: stringArray(input.subtypes, `${pathName}.subtypes`),
    classes: knownArray(input.classes, GRAND_ARCHIVE_CLASSES, `${pathName}.classes`),
    elements: knownArray(input.elements, GRAND_ARCHIVE_ELEMENTS, `${pathName}.elements`),
    cost: cost(input.cost, `${pathName}.cost`),
    memoryCost: nullableNumber(input.cost_memory, `${pathName}.cost_memory`),
    reserveCost: nullableNumber(input.cost_reserve, `${pathName}.cost_reserve`),
    level: nullableNumber(input.level, `${pathName}.level`),
    power: nullableNumber(input.power, `${pathName}.power`),
    life: nullableNumber(input.life, `${pathName}.life`),
    durability: nullableNumber(input.durability, `${pathName}.durability`),
    speed: speed(input.speed, `${pathName}.speed`),
    effect: nullableString(input.effect, `${pathName}.effect`),
    effectRaw: nullableString(input.effect_raw, `${pathName}.effect_raw`),
    effectHtml: nullableString(input.effect_html, `${pathName}.effect_html`),
    orientation,
  };
}
function normalizeCard(value: unknown, index: number): GrandArchiveCardDefinition {
  const pathName = `payload.cards[${index}]`;
  const input = record(value, pathName);
  const cardId = string(input.uuid, `${pathName}.uuid`);
  const editions = array(input.editions, `${pathName}.editions`);
  const printings = editions.map((edition, editionIndex) =>
    printing(edition, `${pathName}.editions[${editionIndex}]`),
  );
  if (printings.length === 0) throw new GrandArchiveCatalogError(`${pathName} has no editions.`);
  const relatedFacesById = new Map<string, GrandArchiveRelatedFaceDefinition>();
  for (const [editionIndex, value] of editions.entries()) {
    const editionPath = `${pathName}.editions[${editionIndex}]`;
    const edition = record(value, editionPath);
    const orientations = edition.other_orientations ?? [];
    for (const [orientationIndex, orientation] of array(
      orientations,
      `${editionPath}.other_orientations`,
    ).entries()) {
      const face = relatedFace(
        orientation,
        `${editionPath}.other_orientations[${orientationIndex}]`,
      );
      const existing = relatedFacesById.get(face.canonicalId);
      if (existing && JSON.stringify(existing) !== JSON.stringify(face))
        throw new GrandArchiveCatalogError(
          `${editionPath}.other_orientations has conflicting definitions for ${face.canonicalId}.`,
        );
      relatedFacesById.set(face.canonicalId, face);
    }
  }
  return {
    canonicalId: cardId,
    slug: string(input.slug, `${pathName}.slug`),
    name: string(input.name, `${pathName}.name`),
    externalIds: { gatcgIndex: cardId },
    types: knownArray(input.types, GRAND_ARCHIVE_CARD_TYPES, `${pathName}.types`),
    subtypes: stringArray(input.subtypes, `${pathName}.subtypes`),
    classes: knownArray(input.classes, GRAND_ARCHIVE_CLASSES, `${pathName}.classes`),
    elements: knownArray(input.elements, GRAND_ARCHIVE_ELEMENTS, `${pathName}.elements`),
    cost: cost(input.cost, `${pathName}.cost`),
    memoryCost: nullableNumber(input.cost_memory, `${pathName}.cost_memory`),
    reserveCost: nullableNumber(input.cost_reserve, `${pathName}.cost_reserve`),
    level: nullableNumber(input.level, `${pathName}.level`),
    power: nullableNumber(input.power, `${pathName}.power`),
    life: nullableNumber(input.life, `${pathName}.life`),
    durability: nullableNumber(input.durability, `${pathName}.durability`),
    speed: speed(input.speed, `${pathName}.speed`),
    effect: nullableString(input.effect, `${pathName}.effect`),
    effectRaw: nullableString(input.effect_raw, `${pathName}.effect_raw`),
    effectHtml: nullableString(input.effect_html, `${pathName}.effect_html`),
    legality:
      input.legality === null
        ? null
        : Object.fromEntries(
            Object.entries(record(input.legality, `${pathName}.legality`)).map(
              ([format, value]) => {
                const limit = nullableNumber(
                  record(value, `${pathName}.legality.${format}`).limit,
                  `${pathName}.legality.${format}.limit`,
                );
                if (limit === null)
                  throw new GrandArchiveCatalogError(
                    `${pathName}.legality.${format}.limit must be a number.`,
                  );
                return [format, { limit }];
              },
            ),
          ),
    references: references(input.references, `${pathName}.references`),
    referencedBy: references(input.referenced_by, `${pathName}.referenced_by`),
    relatedFaces: [...relatedFacesById.values()].sort((left, right) =>
      left.canonicalId.localeCompare(right.canonicalId),
    ),
    printings,
  };
}

export function normalizeGrandArchiveSnapshot(
  snapshot: GrandArchiveRawSnapshot,
): GrandArchiveCatalog {
  if (snapshot.source !== "gatcg-index-api")
    throw new GrandArchiveCatalogError("Unsupported raw snapshot source.");
  const payload = record(snapshot.payload, "payload");
  const cards = array(payload.cards, "payload.cards")
    .map(normalizeCard)
    .sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const card of cards) {
    if (ids.has(card.canonicalId))
      throw new GrandArchiveCatalogError(`Duplicate card UUID ${card.canonicalId}.`);
    if (slugs.has(card.slug))
      throw new GrandArchiveCatalogError(`Duplicate card slug ${card.slug}.`);
    ids.add(card.canonicalId);
    slugs.add(card.slug);
  }
  return {
    schemaVersion: 1,
    game: "grand-archive",
    provenance: {
      source: snapshot.source,
      sourceUrl: snapshot.sourceUrl,
      openApiUrl: snapshot.openApiUrl,
      fetchedAt: snapshot.fetchedAt,
      sha256: snapshot.sha256,
    },
    cards,
  };
}

export async function readAndNormalizeGrandArchiveSnapshot(
  snapshotPath: string,
): Promise<GrandArchiveCatalog> {
  const source = await readFile(snapshotPath);
  const parsed: unknown = JSON.parse(
    (snapshotPath.endsWith(".gz") ? gunzipSync(source) : source).toString("utf8"),
  );
  const envelope = record(parsed, "snapshot");
  if (envelope.schemaVersion !== 1)
    throw new GrandArchiveCatalogError("Unsupported raw snapshot schema version.");
  if (envelope.source !== "gatcg-index-api")
    throw new GrandArchiveCatalogError("Unsupported raw snapshot source.");
  const snapshot: GrandArchiveRawSnapshot = {
    schemaVersion: 1,
    source: "gatcg-index-api",
    sourceUrl: string(envelope.sourceUrl, "snapshot.sourceUrl"),
    openApiUrl: string(envelope.openApiUrl, "snapshot.openApiUrl"),
    fetchedAt: string(envelope.fetchedAt, "snapshot.fetchedAt"),
    sha256: string(envelope.sha256, "snapshot.sha256"),
    payload: envelope.payload,
  };
  const actualSha256 = createHash("sha256").update(JSON.stringify(snapshot.payload)).digest("hex");
  if (snapshot.sha256 !== actualSha256) {
    throw new GrandArchiveCatalogError(
      `Raw snapshot checksum mismatch: expected ${snapshot.sha256}, received ${actualSha256}.`,
    );
  }
  return normalizeGrandArchiveSnapshot(snapshot);
}
export async function writeGrandArchiveCatalog(
  catalog: GrandArchiveCatalog,
  outputDirectory: string,
): Promise<void> {
  const outputPath = path.join(outputDirectory, "grand-archive-catalog.ts");
  const temporary = `${outputPath}.tmp`;
  const { cards, ...metadata } = catalog;
  const chunks = Array.from({ length: Math.ceil(cards.length / 100) }, (_, index) =>
    cards.slice(index * 100, (index + 1) * 100),
  );
  const declarations = chunks
    .map(
      (chunk, index) =>
        `const grandArchiveCardChunk${index}: GrandArchiveCatalog["cards"] = ${JSON.stringify(chunk, null, 2)};`,
    )
    .join("\n\n");
  const spreads = chunks.map((_, index) => `  ...grandArchiveCardChunk${index},`).join("\n");
  const provenance = JSON.stringify(metadata.provenance, null, 2).replaceAll("\n", "\n  ");
  const source = `import type { GrandArchiveCatalog } from "@tcg/grand-archive-types";\n\n${declarations}\n\nconst grandArchiveCards: GrandArchiveCatalog["cards"] = [\n${spreads}\n];\n\nexport const grandArchiveCatalog: GrandArchiveCatalog = {\n  schemaVersion: ${metadata.schemaVersion},\n  game: ${JSON.stringify(metadata.game)},\n  provenance: ${provenance},\n  cards: grandArchiveCards,\n};\n`;
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(temporary, source);
  await rename(temporary, outputPath);
}
