import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  RiftboundCardDefinition,
  RiftboundCatalog,
  RiftboundCatalogProvenance,
  PopulatedRiftboundCatalog,
  RiftboundTranslationCatalog,
  RiftboundImportContext,
  RiftboundRawSnapshot,
  RiftboundSetDefinition,
} from "@tcg/riftbound-types";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const ImageSchema = z
  .object({
    url: z.string().url(),
    dimensions: z
      .object({
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
  })
  .passthrough();

const GalleryValueSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    label: z.string(),
  })
  .passthrough();

const GalleryStatSchema = z
  .object({
    value: GalleryValueSchema,
  })
  .passthrough();

const GalleryRichTextSchema = z
  .object({
    richText: z.object({ type: z.string(), body: z.string() }).passthrough(),
  })
  .passthrough();

const GalleryCardSchema = z
  .object({
    id: z.string().min(1),
    collectorNumber: z.number().int().nonnegative(),
    name: z.string().min(1),
    publicCode: z.string().min(1),
    set: z.object({ value: GalleryValueSchema }).passthrough(),
    cardType: z
      .object({
        type: z.array(GalleryValueSchema),
        superType: z.array(GalleryValueSchema).optional(),
      })
      .passthrough(),
    rarity: z.object({ value: GalleryValueSchema }).passthrough(),
    domain: z.object({ values: z.array(GalleryValueSchema) }).passthrough(),
    cardImage: ImageSchema,
    orientation: z.enum(["portrait", "landscape"]),
    illustrator: z.object({ values: z.array(GalleryValueSchema).min(1) }).passthrough(),
    text: GalleryRichTextSchema.optional(),
    effect: GalleryRichTextSchema.optional(),
    energy: GalleryStatSchema.optional(),
    power: GalleryStatSchema.optional(),
    might: GalleryStatSchema.optional(),
    mightBonus: GalleryStatSchema.optional(),
    tags: z
      .object({ tags: z.array(z.string()) })
      .passthrough()
      .optional(),
    flags: z.array(GalleryValueSchema).optional(),
  })
  .passthrough();

const GalleryPayloadSchema = z.object({
  sets: z.array(
    z
      .object({
        id: z.string().min(1),
        name: z.string().min(1),
        collectorNumberMax: z.number().int().positive().optional(),
      })
      .passthrough(),
  ),
  cards: z.array(GalleryCardSchema).min(1),
  reportedTotal: z.number().int().positive(),
});

const RiotApiCardSchema = z
  .object({
    id: z.string().min(1),
    collectorNumber: z.union([z.string(), z.number()]),
    set: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional().default(""),
    type: z.string().min(1),
    rarity: z.string().min(1),
    faction: z.string().optional().default(""),
    stats: z
      .object({
        energy: z.number().optional(),
        might: z.number().optional(),
        cost: z.number().optional(),
        power: z.number().optional(),
      })
      .passthrough()
      .optional()
      .default({}),
    keywords: z.array(z.string()).optional().default([]),
    art: z
      .object({
        thumbnailURL: z.string().url().optional(),
        fullURL: z.string().url().optional(),
        artist: z.string().optional().default(""),
      })
      .passthrough(),
    flavorText: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
  })
  .passthrough();

const RiotApiPayloadSchema = z
  .object({
    game: z.string(),
    version: z.string().min(1),
    lastUpdated: z.string().optional(),
    sets: z.array(
      z
        .object({
          id: z.string().min(1),
          name: z.string().min(1),
          cards: z.array(RiotApiCardSchema),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const ALLOWED_DISPLAY_TAGS = ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"];
const FORBIDDEN_EXECUTABLE_KEYS = new Set([
  "ability",
  "abilities",
  "effect",
  "effects",
  "trigger",
  "triggers",
  "target",
  "targets",
  "legalActions",
  "engineAction",
]);

export class RiftboundCatalogError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RiftboundCatalogError";
  }
}

function schemaError(label: string, error: z.ZodError): RiftboundCatalogError {
  const issue = error.issues[0];
  const issuePath = issue?.path.length ? `.${issue.path.join(".")}` : "";
  return new RiftboundCatalogError(
    `${label}${issuePath}: ${issue?.message ?? "schema validation failed"}`,
    { cause: error },
  );
}

export function sanitizeRiftboundDisplayHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_DISPLAY_TAGS,
    allowedAttributes: {},
    disallowedTagsMode: "discard",
    nonTextTags: ["style", "script", "textarea", "option", "noscript", "iframe", "object"],
  }).trim();
}

function decodeHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
    if (body.startsWith("#x") || body.startsWith("#X")) {
      return String.fromCodePoint(Number.parseInt(body.slice(2), 16));
    }
    if (body.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(body.slice(1), 10));
    }
    return named[body.toLowerCase()] ?? entity;
  });
}

export function riftboundDisplayHtmlToPlainText(html: string): string {
  const withBreaks = sanitizeRiftboundDisplayHtml(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li)>/gi, "\n")
    .replace(/<li>/gi, "- ")
    .replace(/<[^>]+>/g, "");
  return decodeHtmlEntities(withBreaks)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function canonicalLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale.replaceAll("_", "-"))[0] ?? locale;
  } catch (error) {
    throw new RiftboundCatalogError(`Invalid catalog locale: ${locale}`, { cause: error });
  }
}

function numberFromGalleryStat(
  stat: z.infer<typeof GalleryStatSchema> | undefined,
): number | undefined {
  const id = stat?.value.id;
  if (id === undefined) return undefined;
  const value = typeof id === "number" ? id : Number(id);
  if (!Number.isFinite(value)) {
    throw new RiftboundCatalogError(`Gallery statistic must be numeric, received ${String(id)}.`);
  }
  return value;
}

function collectorNumberFromPublicCode(publicCode: string, fallback: number): string {
  const match = /^[^-]+-([^/]+)(?:\/.*)?$/i.exec(publicCode);
  return match?.[1] ?? String(fallback);
}

function artIdFromImageUrl(imageUrl: string, fallback: string): string {
  const match = /\/([a-f0-9]{32,64})-\d+x\d+\.[a-z0-9]+/i.exec(imageUrl);
  return match?.[1] ?? fallback;
}

/**
 * The gallery smart list's totalItems counts records the site never publishes,
 * so an equality check against it can never hold. Completeness is proven
 * structurally instead: every declared set must embed its full base collector
 * number range 1..collectorNumberMax; alternate printings beyond the base
 * range are optional by definition.
 */
function assertGalleryBaseNumbersCovered(
  sets: ReadonlyArray<{ id: string; collectorNumberMax?: number }>,
  cards: ReadonlyArray<{ set: { value: { id: string | number } }; collectorNumber: number }>,
): void {
  const embedded = new Map<string, Set<number>>();
  for (const card of cards) {
    const setId = String(card.set.value.id);
    let numbers = embedded.get(setId);
    if (!numbers) embedded.set(setId, (numbers = new Set<number>()));
    numbers.add(card.collectorNumber);
  }
  for (const set of sets) {
    if (set.collectorNumberMax === undefined) continue;
    const numbers = embedded.get(set.id);
    const missing: number[] = [];
    for (let n = 1; n <= set.collectorNumberMax; n += 1) {
      if (!numbers?.has(n)) missing.push(n);
    }
    if (missing.length > 0) {
      throw new RiftboundCatalogError(
        `gallery.set ${set.id}: missing base collector numbers ${missing.join(", ")}`,
      );
    }
  }
}

function normalizeGallery(payload: unknown): {
  sets: RiftboundSetDefinition[];
  cards: RiftboundCardDefinition[];
} {
  const result = GalleryPayloadSchema.safeParse(payload);
  if (!result.success) throw schemaError("gallery", result.error);
  if (result.data.cards.length > result.data.reportedTotal) {
    throw new RiftboundCatalogError(
      `gallery.reportedTotal: payload embeds ${result.data.cards.length} cards but reports only ${result.data.reportedTotal}`,
    );
  }
  assertGalleryBaseNumbersCovered(result.data.sets, result.data.cards);

  const sets = result.data.sets.map((set) => ({
    id: set.id,
    name: set.name,
    ...(set.collectorNumberMax === undefined ? {} : { collectorNumberMax: set.collectorNumberMax }),
  }));
  const cards = result.data.cards.map((card): RiftboundCardDefinition => {
    const setCode = String(card.set.value.id);
    const collectorNumber = collectorNumberFromPublicCode(card.publicCode, card.collectorNumber);
    const rulesTextHtml = card.text
      ? sanitizeRiftboundDisplayHtml(card.text.richText.body)
      : undefined;
    const effectTextHtml = card.effect
      ? sanitizeRiftboundDisplayHtml(card.effect.richText.body)
      : undefined;
    const cardTypes = [...(card.cardType.superType ?? []), ...card.cardType.type];
    if (cardTypes.length === 0) {
      throw new RiftboundCatalogError(
        `gallery card ${card.id}.cardType: at least one type required`,
      );
    }
    return {
      canonicalId: card.id,
      slug: card.id,
      name: card.name,
      printings: [
        {
          id: card.id,
          artId: artIdFromImageUrl(card.cardImage.url, card.id),
          upstreamPrintingId: card.id,
          setCode,
          collectorNumber,
          rarity: String(card.rarity.value.id),
          imageUrl: card.cardImage.url,
          artist: card.illustrator.values.map((artist) => artist.label).join(", "),
          ...(card.cardImage.dimensions ? { imageDimensions: card.cardImage.dimensions } : {}),
        },
      ],
      cardType: cardTypes.map((type) => String(type.id)).join(" "),
      domains: card.domain.values.map((domain) => String(domain.id)),
      ...(numberFromGalleryStat(card.energy) === undefined
        ? {}
        : { energy: numberFromGalleryStat(card.energy) }),
      ...(numberFromGalleryStat(card.power) === undefined
        ? {}
        : { power: numberFromGalleryStat(card.power) }),
      ...(numberFromGalleryStat(card.might) === undefined
        ? {}
        : { might: numberFromGalleryStat(card.might) }),
      ...(numberFromGalleryStat(card.mightBonus) === undefined
        ? {}
        : { mightBonus: numberFromGalleryStat(card.mightBonus) }),
      tags: card.tags?.tags ?? [],
      keywords: [],
      flags: card.flags?.map((flag) => String(flag.id)) ?? [],
      ...(rulesTextHtml
        ? {
            rulesTextHtml,
            rulesTextPlain: riftboundDisplayHtmlToPlainText(rulesTextHtml),
          }
        : {}),
      ...(effectTextHtml
        ? {
            effectTextHtml,
            effectTextPlain: riftboundDisplayHtmlToPlainText(effectTextHtml),
          }
        : {}),
      orientation: card.orientation,
    };
  });
  return { sets, cards };
}

function normalizeRiotApi(payload: unknown): {
  sets: RiftboundSetDefinition[];
  cards: RiftboundCardDefinition[];
  sourceVersion: string;
} {
  const result = RiotApiPayloadSchema.safeParse(payload);
  if (!result.success) throw schemaError("riot-content-api", result.error);
  const sets = result.data.sets.map((set) => ({ id: set.id, name: set.name }));
  const cards = result.data.sets.flatMap((set) =>
    set.cards.map((card): RiftboundCardDefinition => {
      const imageUrl = card.art.fullURL ?? card.art.thumbnailURL;
      if (!imageUrl) {
        throw new RiftboundCatalogError(`riot-content-api card ${card.id}.art: image URL required`);
      }
      const rulesTextHtml = card.description
        ? sanitizeRiftboundDisplayHtml(card.description)
        : undefined;
      return {
        canonicalId: card.id,
        slug: card.id,
        name: card.name,
        printings: [
          {
            id: card.id,
            artId: artIdFromImageUrl(imageUrl, card.id),
            upstreamPrintingId: card.id,
            setCode: card.set || set.id,
            collectorNumber: String(card.collectorNumber),
            rarity: card.rarity,
            imageUrl,
            artist: card.art.artist,
          },
        ],
        cardType: card.type,
        domains: card.faction ? [card.faction] : [],
        ...(card.stats.energy === undefined ? {} : { energy: card.stats.energy }),
        ...(card.stats.power === undefined ? {} : { power: card.stats.power }),
        ...(card.stats.might === undefined ? {} : { might: card.stats.might }),
        tags: card.tags,
        keywords: card.keywords,
        flags: [],
        ...(rulesTextHtml
          ? {
              rulesTextHtml,
              rulesTextPlain: riftboundDisplayHtmlToPlainText(rulesTextHtml),
            }
          : {}),
        ...(card.flavorText ? { flavorText: card.flavorText } : {}),
        orientation: "portrait",
      };
    }),
  );
  return { sets, cards, sourceVersion: result.data.version };
}

function collectorSortValue(value: string): [number, string] {
  const numeric = Number.parseInt(value, 10);
  return [Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric, value];
}

function sortCatalog(catalog: PopulatedRiftboundCatalog): PopulatedRiftboundCatalog {
  return {
    ...catalog,
    sets: [...catalog.sets].sort((left, right) => left.id.localeCompare(right.id)),
    cards: [...catalog.cards].sort((left, right) => {
      const leftPrinting = left.printings[0]!;
      const rightPrinting = right.printings[0]!;
      const setOrder = leftPrinting.setCode.localeCompare(rightPrinting.setCode);
      if (setOrder !== 0) return setOrder;
      const [leftNumber, leftText] = collectorSortValue(leftPrinting.collectorNumber);
      const [rightNumber, rightText] = collectorSortValue(rightPrinting.collectorNumber);
      return (
        leftNumber - rightNumber ||
        leftText.localeCompare(rightText) ||
        left.canonicalId.localeCompare(right.canonicalId)
      );
    }),
  };
}

function rejectDuplicateIdentities(catalog: RiftboundCatalog): void {
  const seenSets = new Set<string>();
  const seenCards = new Set<string>();
  const seenPrintings = new Set<string>();
  for (const set of catalog.sets) {
    if (seenSets.has(set.id)) throw new RiftboundCatalogError(`Duplicate set identity: ${set.id}`);
    seenSets.add(set.id);
  }
  for (const card of catalog.cards) {
    if (seenCards.has(card.canonicalId)) {
      throw new RiftboundCatalogError(`Duplicate canonical card identity: ${card.canonicalId}`);
    }
    seenCards.add(card.canonicalId);
    if (card.printings.length === 0) {
      throw new RiftboundCatalogError(`Card ${card.canonicalId} has no printing.`);
    }
    for (const printing of card.printings) {
      if (seenPrintings.has(printing.id)) {
        throw new RiftboundCatalogError(`Duplicate printing identity: ${printing.id}`);
      }
      seenPrintings.add(printing.id);
    }
  }
}

export function normalizeRiftboundCatalog(
  raw: unknown,
  context: RiftboundImportContext,
): PopulatedRiftboundCatalog {
  let normalized: {
    sets: RiftboundSetDefinition[];
    cards: RiftboundCardDefinition[];
  };
  let sourceVersion = context.sourceVersion;
  if (context.source === "riot-card-gallery") {
    normalized = normalizeGallery(raw);
  } else {
    const apiCatalog = normalizeRiotApi(raw);
    normalized = apiCatalog;
    sourceVersion ??= apiCatalog.sourceVersion;
  }
  const provenance: RiftboundCatalogProvenance = {
    source: context.source,
    sourceUrl: context.sourceUrl,
    locale: canonicalLocale(context.locale),
    fetchedAt: context.fetchedAt,
    ...(sourceVersion ? { sourceVersion } : {}),
    sha256: context.sha256,
    productionEligible: context.source === "riot-content-api",
  };
  const catalog = sortCatalog({
    schemaVersion: 1,
    game: "riftbound",
    provenance,
    sets: normalized.sets,
    cards: normalized.cards,
  });
  rejectDuplicateIdentities(catalog);
  return catalog;
}

function parseSnapshot(value: unknown): RiftboundRawSnapshot {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new RiftboundCatalogError("Raw snapshot must be an object.");
  }
  const snapshot = value as Partial<RiftboundRawSnapshot>;
  if (
    snapshot.schemaVersion !== 1 ||
    (snapshot.source !== "riot-card-gallery" && snapshot.source !== "riot-content-api") ||
    typeof snapshot.sourceUrl !== "string" ||
    typeof snapshot.locale !== "string" ||
    typeof snapshot.fetchedAt !== "string" ||
    typeof snapshot.sha256 !== "string" ||
    !("payload" in snapshot)
  ) {
    throw new RiftboundCatalogError("Raw snapshot metadata is malformed.");
  }
  const parsed = snapshot as RiftboundRawSnapshot;
  const actualSha256 = createHash("sha256").update(JSON.stringify(parsed.payload)).digest("hex");
  if (parsed.sha256 !== actualSha256) {
    throw new RiftboundCatalogError("Raw snapshot SHA-256 does not match its payload.");
  }
  return parsed;
}

export function catalogFromSnapshot(snapshotValue: unknown): PopulatedRiftboundCatalog {
  const snapshot = parseSnapshot(snapshotValue);
  return normalizeRiftboundCatalog(snapshot.payload, {
    source: snapshot.source,
    sourceUrl: snapshot.sourceUrl,
    locale: snapshot.locale,
    fetchedAt: snapshot.fetchedAt,
    ...(snapshot.sourceVersion ? { sourceVersion: snapshot.sourceVersion } : {}),
    sha256: snapshot.sha256,
  });
}

function assertNoExecutableRuleKeys(value: unknown, pathLabel = "catalog"): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoExecutableRuleKeys(entry, `${pathLabel}[${index}]`));
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_EXECUTABLE_KEYS.has(key)) {
      throw new RiftboundCatalogError(`Executable rule field is forbidden at ${pathLabel}.${key}.`);
    }
    assertNoExecutableRuleKeys(nested, `${pathLabel}.${key}`);
  }
}

function isApprovedProductionSourceUrl(sourceUrl: string): boolean {
  try {
    const url = new URL(sourceUrl);
    return url.protocol === "https:" && /^[a-z]+\.api\.riotgames\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}

export function verifyRiftboundCatalog(
  catalog: RiftboundCatalog,
): asserts catalog is PopulatedRiftboundCatalog {
  if (catalog.schemaVersion !== 1 || catalog.game !== "riftbound") {
    throw new RiftboundCatalogError("Catalog identity or schema version is invalid.");
  }
  if (!catalog.provenance) {
    throw new RiftboundCatalogError("Catalog provenance is required for generated data.");
  }
  if (!/^[a-f0-9]{64}$/.test(catalog.provenance.sha256)) {
    throw new RiftboundCatalogError("Catalog provenance SHA-256 is invalid.");
  }
  if (Number.isNaN(Date.parse(catalog.provenance.fetchedAt))) {
    throw new RiftboundCatalogError("Catalog provenance fetchedAt is invalid.");
  }
  canonicalLocale(catalog.provenance.locale);
  rejectDuplicateIdentities(catalog);
  assertNoExecutableRuleKeys(catalog);
}

export function assertProductionEligibleRiftboundCatalog(
  catalog: RiftboundCatalog,
): asserts catalog is PopulatedRiftboundCatalog {
  verifyRiftboundCatalog(catalog);
  if (
    catalog.provenance.source !== "riot-content-api" ||
    !catalog.provenance.productionEligible ||
    !catalog.provenance.sourceVersion ||
    !isApprovedProductionSourceUrl(catalog.provenance.sourceUrl)
  ) {
    throw new RiftboundCatalogError(
      "Riftbound production catalog requires versioned authenticated Riot content API provenance.",
    );
  }
}

export function formatRiftboundCatalogJson(catalog: RiftboundCatalog): string {
  verifyRiftboundCatalog(catalog);
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export function formatRiftboundCatalogModule(jsonFilename = "riftbound-catalog.json"): string {
  return [
    'import type { PopulatedRiftboundCatalog } from "@tcg/riftbound-types";',
    `import catalogJson from "./${jsonFilename}" with { type: "json" };`,
    "",
    "export const riftboundCatalog = catalogJson as PopulatedRiftboundCatalog;",
    "",
  ].join("\n");
}

export function extractRiftboundTranslations(
  catalog: RiftboundCatalog,
): RiftboundTranslationCatalog {
  verifyRiftboundCatalog(catalog);
  return {
    schemaVersion: 1,
    game: "riftbound",
    locale: catalog.provenance.locale,
    catalogSha256: catalog.provenance.sha256,
    sets: catalog.sets.map((set) => ({ setId: set.id, name: set.name })),
    cards: catalog.cards.map((card) => ({
      canonicalId: card.canonicalId,
      name: card.name,
      ...(card.rulesTextHtml ? { rulesTextHtml: card.rulesTextHtml } : {}),
      ...(card.rulesTextPlain ? { rulesTextPlain: card.rulesTextPlain } : {}),
      ...(card.effectTextHtml ? { effectTextHtml: card.effectTextHtml } : {}),
      ...(card.effectTextPlain ? { effectTextPlain: card.effectTextPlain } : {}),
      ...(card.flavorText ? { flavorText: card.flavorText } : {}),
    })),
  };
}

export function formatRiftboundTranslationsJson(translations: RiftboundTranslationCatalog): string {
  return `${JSON.stringify(translations, null, 2)}\n`;
}

export function formatRiftboundTranslationsModule(
  jsonFilename = "riftbound-translations.json",
): string {
  return [
    'import type { RiftboundTranslationCatalog } from "@tcg/riftbound-types";',
    `import translationsJson from "./${jsonFilename}" with { type: "json" };`,
    "",
    "export const riftboundTranslations = translationsJson as RiftboundTranslationCatalog;",
    "",
  ].join("\n");
}

export async function generateRiftboundCatalogFiles(options: {
  snapshotPath: string;
  outputDirectory: string;
  production?: boolean;
}): Promise<PopulatedRiftboundCatalog> {
  const snapshot = JSON.parse(await readFile(options.snapshotPath, "utf8")) as unknown;
  const catalog = catalogFromSnapshot(snapshot);
  if (options.production) assertProductionEligibleRiftboundCatalog(catalog);
  const cardsPackageGeneratedDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/cards/src/generated",
  );
  if (
    path.resolve(options.outputDirectory) === cardsPackageGeneratedDirectory &&
    !options.production
  ) {
    throw new RiftboundCatalogError(
      "Installing a bundled Riftbound catalog requires --production and authenticated Riot API provenance.",
    );
  }
  const jsonFilename = "riftbound-catalog.json";
  const moduleFilename = "riftbound-catalog.ts";
  const translationsJsonFilename = "riftbound-translations.json";
  const translationsModuleFilename = "riftbound-translations.ts";
  const translations = extractRiftboundTranslations(catalog);
  await mkdir(options.outputDirectory, { recursive: true });
  for (const [filename, contents] of [
    [jsonFilename, formatRiftboundCatalogJson(catalog)],
    [moduleFilename, formatRiftboundCatalogModule(jsonFilename)],
    [translationsJsonFilename, formatRiftboundTranslationsJson(translations)],
    [translationsModuleFilename, formatRiftboundTranslationsModule(translationsJsonFilename)],
  ] as const) {
    const target = path.join(options.outputDirectory, filename);
    const temporary = `${target}.tmp`;
    await writeFile(temporary, contents, "utf8");
    await rename(temporary, target);
  }
  return catalog;
}
