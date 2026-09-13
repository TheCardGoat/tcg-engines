import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  GrandArchiveCardDefinition,
  GrandArchiveDefinitionKind,
  GrandArchiveRelatedFaceDefinition,
  GrandArchiveRulesType,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { grandArchiveCatalog } from "../src/generated/grand-archive-catalog.ts";
import { compileGrandArchiveAbilities } from "./compile-card-abilities.ts";
import { assertGrandArchiveAbilityOverrideKeys } from "./ability-overrides.ts";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedCardsRoot = path.join(packageRoot, "src/cards");
const cardsIndexPath = path.join(packageRoot, "src/cards/index.ts");
const registryPath = path.join(packageRoot, "src/generated/grand-archive-card-registry.ts");
const CHUNK_SIZE = 100;

const RULES_COUNTER_NAMES = new Set([
  "buff",
  "bulwark",
  "damage",
  "debuff",
  "durability",
  "enlighten",
  "level",
  "omen",
  "preparation",
  "static",
  "wither",
]);

const SET_FAMILIES = ["ALC", "AMB", "DOA", "DTR", "HVN", "MRC", "PRD", "PTM", "RDO"] as const;

const TYPE_DIRECTORIES = {
  ACTION: "actions",
  ALLY: "allies",
  ATTACK: "attacks",
  CHAMPION: "champions",
  DOMAIN: "domains",
  "GREATER BOON": "boons",
  ITEM: "items",
  "LESSER BOON": "boons",
  MASTERY: "masteries",
  PHANTASIA: "phantasias",
  STATUS: "statuses",
  WEAPON: "weapons",
} as const satisfies Readonly<Record<GrandArchiveRulesType, string>>;

type CatalogFace = GrandArchiveCardDefinition | GrandArchiveRelatedFaceDefinition;

interface GeneratedModule {
  readonly canonicalId: string;
  readonly exportName: string;
  readonly set: string;
  readonly relativePath: string;
  readonly source: string;
}

interface PreservedTestModule {
  readonly relativePath: string;
  readonly source: string;
}

async function preservedTestModules(
  root: string,
  relativeRoot = "",
): Promise<PreservedTestModule[]> {
  let entries;
  try {
    entries = await readdir(path.join(root, relativeRoot), { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const preserved: PreservedTestModule[] = [];
  for (const entry of entries) {
    const relativePath = path.join(relativeRoot, entry.name);
    if (entry.isDirectory()) {
      preserved.push(...(await preservedTestModules(root, relativePath)));
    } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
      preserved.push({
        relativePath,
        source: await readFile(path.join(root, relativePath), "utf8"),
      });
    }
  }
  return preserved;
}

function definitionKind(card: GrandArchiveCardDefinition): GrandArchiveDefinitionKind {
  if (card.types.includes("TOKEN")) return "token-representation";
  if (card.types.includes("MASTERY")) return "mastery-representation";
  if (card.types.includes("STATUS")) return "status-representation";
  return "card";
}

function exportName(slug: string): string {
  const parts = slug.split(/[^a-zA-Z0-9]+/u).filter(Boolean);
  const name = parts
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join("");
  if (!/^[$A-Z_a-z][$\w]*$/u.test(name))
    throw new Error(`Card slug ${slug} does not produce a valid camelCase export name.`);
  return name;
}

function originSet(card: GrandArchiveCardDefinition): string {
  const printing = card.printings.reduce((earliest, candidate) =>
    candidate.set.releaseDate < earliest.set.releaseDate ? candidate : earliest,
  );
  return SET_FAMILIES.find((family) => printing.setCode.startsWith(family)) ?? printing.setCode;
}

function typeDirectory(card: GrandArchiveCardDefinition): string {
  const kind = definitionKind(card);
  if (kind === "token-representation") return "tokens";
  const primaryType = normalizedTypes(card, kind)[0];
  if (!primaryType) throw new Error(`${card.name} has no primary rules-facing type.`);
  return TYPE_DIRECTORIES[primaryType];
}

/**
 * The Index exposes the Radiant Origins Pantheon tag through its format limits:
 * tagged cards are unavailable in both Standard and Draft while remaining legal
 * in Pantheon. Dynamic one-format restrictions do not become printed rules data.
 */
function printedFormatRestriction(card: GrandArchiveCardDefinition): object | undefined {
  return card.legality?.STANDARD?.limit === 0 &&
    card.legality.DRAFT?.limit === 0 &&
    card.legality.PANTHEON?.limit !== 0
    ? { kind: "pantheon-only", source: "printed-border-tag" }
    : undefined;
}

function printedCost(cost: CatalogFace["cost"]): object {
  if (cost.type === "none") return { kind: "none" };
  if (cost.value === "X") return { kind: cost.type, amount: { kind: "variable", symbol: "X" } };
  const amount = Number(cost.value);
  if (!Number.isSafeInteger(amount) || amount < 0)
    throw new Error(`Unsupported printed cost ${cost.value}.`);
  return { kind: cost.type, amount };
}

function normalizedTypes(
  face: CatalogFace,
  kind: GrandArchiveDefinitionKind,
): readonly GrandArchiveRulesType[] {
  const types = face.types.filter(
    (type): type is GrandArchiveRulesType =>
      type !== "UNIQUE" && type !== "REGALIA" && type !== "TOKEN",
  );
  if (types.length === 0) throw new Error(`${face.name} has no rules-facing type.`);
  if (kind === "mastery-representation" && types.some((type) => type !== "MASTERY"))
    throw new Error(`${face.name} mixes Mastery with an unsupported type.`);
  if (kind === "status-representation" && types.some((type) => type !== "STATUS"))
    throw new Error(`${face.name} mixes Status with an unsupported type.`);
  return types;
}

let executableParagraphs = 0;
let unparsedParagraphs = 0;

function faceObject(
  physicalCanonicalId: string,
  face: CatalogFace,
  side: "default" | "flip",
  kind: GrandArchiveDefinitionKind,
): object {
  if (face.classes.length === 0) throw new Error(`${face.name} has no class.`);
  if (kind !== "mastery-representation" && face.elements.length === 0)
    throw new Error(`${face.name} has no element.`);
  const supertypes = face.types.filter(
    (type): type is GrandArchiveSupertype => type === "UNIQUE" || type === "REGALIA",
  );
  const stats = {
    ...(face.level === null ? {} : { level: face.level }),
    ...(face.power === null ? {} : { power: face.power }),
    ...(face.life === null ? {} : { life: face.life }),
    ...(face.durability === null ? {} : { durability: face.durability }),
  };
  const rulesText = face.effectRaw ?? "";
  const compilation = compileGrandArchiveAbilities({
    canonicalId: face.canonicalId,
    name: face.name,
    rulesText,
    types: face.types,
  });
  const unparsed = compilation.abilities.find((ability) => ability.kind === "unparsed");
  if (unparsed)
    throw new Error(
      `Card ${face.canonicalId} (${face.name}) paragraph ${unparsed.id} is not executable: ${unparsed.text}`,
    );
  executableParagraphs += compilation.executableParagraphs;
  unparsedParagraphs += compilation.unparsedParagraphs;
  const championNameSeparator = face.types.includes("CHAMPION") ? face.name.indexOf(",") : -1;
  return {
    id: `${physicalCanonicalId}:face:${side}`,
    catalogId: face.canonicalId,
    name: face.name,
    ...(championNameSeparator < 0
      ? {}
      : { lineageName: face.name.slice(0, championNameSeparator).trim() }),
    cost: printedCost(face.cost),
    typeLine: {
      supertypes,
      types: normalizedTypes(face, kind),
      classes: face.classes,
      subtypes: face.subtypes,
    },
    elements: face.elements,
    ...(face.speed === null ? {} : { speed: face.speed }),
    stats,
    rulesText,
    abilities: compilation.abilities,
  };
}

function cardObject(card: GrandArchiveCardDefinition): object {
  const kind = definitionKind(card);
  if (card.relatedFaces.length > 1)
    throw new Error(`${card.name} has more than one opposite face in the Index catalog.`);
  const defaultFace = faceObject(card.canonicalId, card, "default", kind);
  const relatedFace = card.relatedFaces[0];
  const formatRestriction = printedFormatRestriction(card);
  return {
    canonicalId: card.canonicalId,
    slug: card.slug,
    definitionKind: kind,
    ...(formatRestriction ? { formatRestriction } : {}),
    layout: relatedFace
      ? {
          kind: "double-faced",
          defaultFace,
          flipFace: faceObject(card.canonicalId, relatedFace, "flip", kind),
        }
      : { kind: "single-faced", face: defaultFace },
  };
}

function renderCardModule(card: GrandArchiveCardDefinition): GeneratedModule {
  const kind = definitionKind(card);
  const name = exportName(card.slug);
  const set = originSet(card);
  const relativePath = `${set}/${typeDirectory(card)}/${card.slug}.ts`;
  const source = `import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";\n\nexport const ${name}: GrandArchiveCard<GrandArchiveAbilityDefinition, ${JSON.stringify(kind)}> = ${JSON.stringify(cardObject(card), normalizeRulesCounter, 2)};\n\nexport default ${name};\n`;
  return { canonicalId: card.canonicalId, exportName: name, set, relativePath, source };
}

function normalizeRulesCounter(key: string, value: unknown): unknown {
  if (
    key === "counter" &&
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    "named" in value &&
    typeof value.named === "string" &&
    RULES_COUNTER_NAMES.has(value.named)
  ) {
    return value.named;
  }
  return value;
}

function renderSetIndex(set: string, modules: readonly GeneratedModule[]): string {
  return `${modules.map((module) => `export { ${module.exportName} } from "./${module.relativePath.slice(set.length + 1)}";`).join("\n")}\n`;
}

function renderCardsIndex(sets: readonly string[]): string {
  return `${sets.map((set) => `export * from "./${set}/index.ts";`).join("\n")}\n`;
}

function renderRegistry(modules: readonly GeneratedModule[]): string {
  const imports = modules
    .map((module) => `import { ${module.exportName} } from "../cards/${module.relativePath}";`)
    .join("\n");
  const chunks = Array.from({ length: Math.ceil(modules.length / CHUNK_SIZE) }, (_, index) =>
    modules.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
  );
  const declarations = chunks
    .map(
      (chunk, index) =>
        `const grandArchiveCardChunk${index}: readonly GeneratedGrandArchiveCard[] = [\n${chunk.map((module) => `  ${module.exportName},`).join("\n")}\n];`,
    )
    .join("\n\n");
  const spreads = chunks.map((_, index) => `  ...grandArchiveCardChunk${index},`).join("\n");
  return `import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";\n${imports}\n\ntype GeneratedGrandArchiveCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;\n\n${declarations}\n\nexport const grandArchiveCards: readonly GeneratedGrandArchiveCard[] = [\n${spreads}\n];\n\nexport const grandArchiveCardsByCanonicalId: ReadonlyMap<string, GeneratedGrandArchiveCard> = new Map(\n  grandArchiveCards.map((card) => [card.canonicalId, card] as const),\n);\n\nif (grandArchiveCardsByCanonicalId.size !== grandArchiveCards.length)\n  throw new Error("Generated Grand Archive card objects contain duplicate canonical IDs.");\n`;
}

assertGrandArchiveAbilityOverrideKeys(
  new Set(
    grandArchiveCatalog.cards.flatMap((card) => [
      card.canonicalId,
      ...card.relatedFaces.map((face) => face.canonicalId),
    ]),
  ),
);
const modules = grandArchiveCatalog.cards.map(renderCardModule);
const tests = await preservedTestModules(generatedCardsRoot);
const exportNames = new Set<string>();
for (const module of modules) {
  if (exportNames.has(module.exportName))
    throw new Error(`Duplicate generated card export ${module.exportName}.`);
  exportNames.add(module.exportName);
}
await rm(generatedCardsRoot, { recursive: true, force: true });
for (const module of modules) {
  const target = path.join(packageRoot, "src/cards", module.relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, module.source);
}
const modulesBySet = Map.groupBy(modules, (module) => module.set);
const sets = [...modulesBySet.keys()].sort((left, right) => left.localeCompare(right));
for (const set of sets) {
  const setModules = modulesBySet.get(set);
  if (!setModules) throw new Error(`Missing generated module group for ${set}.`);
  await writeFile(
    path.join(packageRoot, "src/cards", set, "index.ts"),
    renderSetIndex(set, setModules),
  );
}
for (const test of tests) {
  const target = path.join(generatedCardsRoot, test.relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, test.source);
}
await mkdir(path.dirname(cardsIndexPath), { recursive: true });
await writeFile(cardsIndexPath, renderCardsIndex(sets));
await writeFile(registryPath, renderRegistry(modules));
console.log(`Generated ${modules.length} unique Grand Archive card objects.`);
console.log(
  `Compiled ${executableParagraphs} executable ability paragraphs; ${unparsedParagraphs} remain.`,
);
