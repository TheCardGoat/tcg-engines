// One-off import: generate card definitions for catalog ids that are missing
// from the checked-in catalog but present in an optcgapi.com snapshot.
//
//   node --experimental-strip-types scripts/import-missing-cards.ts [--write]
//
// Without --write the script only prints the import plan. Snapshot layout and
// caveats: ../snapshots/2026-09-18/README.md.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { OPCard, OPCardType, OPRarity } from "@tcg/op-types";
import { buildCardEffects } from "../src/effect-parser/index.ts";
import { normalize } from "../src/normalizer.ts";
import { joinPrintedAbilityText } from "../src/printed-text.ts";
import type { RawOPCard } from "../src/types/scraper.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");
const SNAPSHOT_DIR = join(__dirname, "../snapshots/2026-09-18");
const WRITE = process.argv.includes("--write");

const TYPE_DIRS: Record<Exclude<OPCardType, "don">, string> = {
  leader: "leaders",
  character: "characters",
  event: "events",
  stage: "stages",
};

// Snapshot file name (without .json) -> card-id prefixes it is the primary
// product for. Entries for an id are only taken from primary products so
// bundled reprints in other products cannot create phantom printings.
const PRODUCT_PREFIXES: Record<string, string[]> = {};
const REPORT_FILES = new Set(["missing-vs-catalog.json", "import-report.json"]);
for (const name of readdirSync(SNAPSHOT_DIR)) {
  if (!name.endsWith(".json") || REPORT_FILES.has(name)) continue;
  const product = name.replace(/\.json$/, "");
  PRODUCT_PREFIXES[product] = [product.replace(/-/g, "")];
}
PRODUCT_PREFIXES["OP14-EB04"] = ["OP14", "EB04"];
PRODUCT_PREFIXES["OP15-EB04"] = ["OP15", "EB04"];

const ART_MARKER_TEST = /\((?:alternate art|parallel|sp|manga|pandaman art|dash pack)\)/i;
const ART_MARKER_STRIP = /\s*\((?:alternate art|parallel|sp|manga|pandaman art|dash pack)\)\s*/gi;
// Trailing id-ish parentheticals: (OP15-001), (EB04-007), (P-105), (001), (118).
const ID_TAIL_PAREN = /\s*\((?:[A-Z]+\d*(?:-\d+)?|\d{2,4})\)\s*$/i;
// Trailing " - OP14-001" style id suffixes.
const ID_TAIL_DASH = /\s+-\s+[A-Z]+\d+-\d+\s*$/i;

const RARITY_MAP: Record<string, OPRarity> = {
  C: "C",
  UC: "UC",
  R: "R",
  SR: "SR",
  SEC: "SEC",
  SP: "SP",
  L: "L",
  DON: "DON",
  MR: "MR",
  TR: "TR",
  P: "P",
  PR: "P",
};

// Upstream rows for these ids shift the cost/power value into a neighboring
// column (the trait text sits in card_cost / card_power). Values below are
// verified against the official card data and replace the corrupt fields.
const OVERRIDES: Record<string, Partial<RawOPCard>> = {
  "OP12-016": { card_cost: "0", sub_types: "Former Roger Pirates" },
  "OP12-017": { card_cost: "0", sub_types: "Former Roger Pirates" },
  "OP12-018": { card_cost: "0", sub_types: "Former Roger Pirates" },
  "OP12-019": { card_cost: "0", sub_types: "Former Roger Pirates" },
  "OP17-099": {
    card_power: "5000",
    attribute: "Special",
    sub_types: "The Four Emperors Big Mom Pirates",
  },
};

interface Report {
  imported: number;
  perCategory: Record<string, number>;
  perProduct: Record<string, number>;
  printingsAdded: number;
  unparsedEffects: string[];
  errors: string[];
}

function cleanName(raw: string): string {
  let out = raw;
  for (let i = 0; i < 5; i += 1) {
    const next = out
      .replace(ART_MARKER_STRIP, " ")
      .replace(ID_TAIL_PAREN, " ")
      .replace(ID_TAIL_DASH, " ");
    if (next === out) break;
    out = next;
  }
  return out.replace(/\s+/g, " ").trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Upstream sometimes joins multiple attributes with spaces ("Slash Special")
 * or padded slashes ("Slash / Special"), prints "?" for hidden attributes, and
 * leaves text columns null. Repair the known shapes before normalizing. */
function sanitizeRaw(raw: RawOPCard): RawOPCard {
  const knownAttributes = ["Strike", "Slash", "Ranged", "Wisdom", "Special"];
  let attribute = raw.attribute ?? null;
  if (attribute !== null) {
    const cleaned = attribute.trim();
    const tokens = cleaned.split(/[\s/]+/).filter(Boolean);
    attribute =
      tokens.length > 0 && tokens.every((token) => knownAttributes.includes(token))
        ? tokens.join("/")
        : cleaned;
    if (attribute === "?" || attribute === "") attribute = null;
  }
  return {
    ...raw,
    card_text: raw.card_text ?? "",
    sub_types: raw.sub_types ?? "",
    attribute,
  };
}

function camelWords(name: string): string {
  return name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join("");
}

/** Stable per-id prefix used for export names, e.g. OP15-001 -> "op15". */
function idPrefix(id: string): string {
  return id.split("-")[0]!;
}

function localIds(): Set<string> {
  const ids = new Set<string>();
  for (const typeDir of [...Object.values(TYPE_DIRS), "don"]) {
    const dir = join(CARDS_DIR, typeDir);
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".ts") || entry === "index.ts") continue;
      const text = readFileSync(join(dir, entry), "utf8");
      for (const match of text.matchAll(/^\s*id:\s*"([^"]+)"/gm)) {
        ids.add(match[1]!);
      }
    }
  }
  const legacy = readFileSync(
    join(CARDS_DIR, "../legacy-printing-id-aliases.generated.ts"),
    "utf8",
  );
  for (const match of legacy.matchAll(/"([^"]+)":\s*"/g)) {
    ids.add(match[1]!);
  }
  return ids;
}

interface SnapshotEntry {
  product: string;
  raw: RawOPCard;
}

function loadSnapshot(): Map<string, SnapshotEntry[]> {
  const byId = new Map<string, SnapshotEntry[]>();
  for (const name of readdirSync(SNAPSHOT_DIR)) {
    if (!name.endsWith(".json") || REPORT_FILES.has(name)) continue;
    const product = name.replace(/\.json$/, "");
    const raws = JSON.parse(readFileSync(join(SNAPSHOT_DIR, name), "utf8")) as RawOPCard[];
    for (const raw of raws) {
      const existing = byId.get(raw.card_set_id) ?? [];
      const duplicate = existing.some(
        (candidate) =>
          candidate.raw.card_name === raw.card_name && candidate.raw.card_image === raw.card_image,
      );
      if (!duplicate) existing.push({ product, raw });
      byId.set(raw.card_set_id, existing);
    }
  }
  return byId;
}

function pickEntries(id: string, entries: SnapshotEntry[]): SnapshotEntry[] {
  const prefix = idPrefix(id);
  const primary = entries.filter((entry) => PRODUCT_PREFIXES[entry.product]?.includes(prefix));
  const pool = primary.length > 0 ? primary : entries;
  return [...pool].sort((a, b) => {
    const markerA = ART_MARKER_TEST.test(a.raw.card_name) ? 1 : 0;
    const markerB = ART_MARKER_TEST.test(b.raw.card_name) ? 1 : 0;
    if (markerA !== markerB) return markerA - markerB;
    return a.raw.card_name.length - b.raw.card_name.length;
  });
}

function typeName(card: OPCard): string {
  switch (card.cardType) {
    case "leader":
      return "LeaderCard";
    case "character":
      return "CharacterCard";
    case "event":
      return "EventCard";
    case "stage":
      return "StageCard";
    case "don":
      return "DonCard";
  }
}

/** Short values render inline; long strings break key/value across lines like
 * the hand-authored definitions; objects/arrays indent one level. */
function renderValue(key: string, value: unknown, indent: string): string {
  if (Array.isArray(value)) {
    return `${indent}${key}: ${JSON.stringify(value)},`;
  }
  const json = JSON.stringify(value);
  if (typeof value !== "object") {
    if (json.length > 60) {
      return `${indent}${key}:\n${indent}  ${json},`;
    }
    return `${indent}${key}: ${json},`;
  }
  // Object blocks (effects): shift the pretty-printed JSON under the key.
  const block = JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:");
  const lines = block.split("\n").map((line) => `${indent}${line}`);
  lines[0] = `${indent}${key}: ${block.slice(0, block.indexOf("\n"))}`;
  return `${lines.join("\n")},`;
}

function renderPrintings(
  id: string,
  setCode: string,
  collectorNumber: string,
  entries: SnapshotEntry[],
  clean: string,
): string {
  const lines = ["  printings: ["];
  entries.forEach((entry, index) => {
    const suffix = index === 0 ? "" : `_p${index}`;
    const printingId = `${id}${suffix}`;
    const artId = entry.raw.card_image_id ?? printingId;
    const rarity = RARITY_MAP[entry.raw.rarity.trim().toUpperCase()] ?? "P";
    const label = entry.raw.card_name === clean ? undefined : entry.raw.card_name;
    lines.push("    {");
    lines.push(`      id: ${JSON.stringify(printingId)},`);
    lines.push(`      artId: ${JSON.stringify(artId)},`);
    lines.push(`      setCode: ${JSON.stringify(setCode)},`);
    lines.push(`      collectorNumber: ${JSON.stringify(collectorNumber)},`);
    lines.push(`      rarity: ${JSON.stringify(rarity)},`);
    lines.push(`      imageUrl: ${JSON.stringify(entry.raw.card_image ?? "")},`);
    if (label !== undefined) lines.push(`      label: ${JSON.stringify(label)},`);
    lines.push("    },");
  });
  lines.push("  ],");
  return lines.join("\n");
}

/** Numeric stat fields in the authored definition order for each card type. */
function numericFields(card: OPCard): Array<[string, number | undefined]> {
  switch (card.cardType) {
    case "leader":
      return [
        ["power", card.power],
        ["life", card.life],
        ["counter", card.counter],
      ];
    case "character":
      return [
        ["cost", card.cost],
        ["power", card.power],
        ["counter", card.counter],
      ];
    case "event":
      return [["cost", card.cost]];
    case "stage":
      return [["cost", card.cost]];
    case "don":
      return [];
  }
}

function main(): void {
  const known = localIds();
  const upstream = loadSnapshot();
  const missing = [...upstream.keys()]
    .filter((id) => !known.has(id) && !known.has(id.toLowerCase()))
    .sort();

  const report: Report = {
    imported: 0,
    perCategory: {},
    perProduct: {},
    printingsAdded: 0,
    unparsedEffects: [],
    errors: [],
  };
  const indexAppends = new Map<string, string[]>();

  for (const id of missing) {
    const entries = pickEntries(id, upstream.get(id)!);
    const base = entries[0]!;
    const clean = cleanName(base.raw.card_name);
    if (!clean) {
      report.errors.push(
        `${id}: cleaned name is empty (raw ${JSON.stringify(base.raw.card_name)})`,
      );
      continue;
    }

    let card: OPCard;
    try {
      card = normalize({
        ...sanitizeRaw(base.raw),
        card_name: clean,
        ...OVERRIDES[id],
      });
    } catch (error) {
      report.errors.push(`${id}: ${(error as Error).message}`);
      continue;
    }
    // normalize() leaves card.effect unset (text lives in i18n); definitions
    // duplicate it for readability, and the audits require them to be equal.
    if (card.effect === undefined && card.i18n.en.effect !== undefined) {
      card = { ...card, effect: card.i18n.en.effect };
    }

    const idLower = id.toLowerCase();
    const setCode = idPrefix(id);
    const collectorNumber = id.split("-").at(-1) ?? id;
    const slug = `${slugify(clean)}/${idLower}`;
    const exportName = setCode.toLowerCase() + camelWords(clean) + collectorNumber;
    const typeDir = TYPE_DIRS[card.cardType as Exclude<OPCardType, "don">];
    const fileName = `${idLower}-${slugify(clean)}`;

    const printedText = joinPrintedAbilityText({
      effect: card.effect ?? card.i18n.en.effect,
      trigger: "trigger" in card ? card.trigger : undefined,
    });
    let effects = card.effects;
    if (printedText) {
      const generated = buildCardEffects(printedText);
      if (generated) {
        effects = generated;
      } else if (!effects) {
        report.unparsedEffects.push(id);
      }
    }

    const lines: string[] = [];
    lines.push(`import type { ${typeName(card)} } from "@tcg/op-types";`);
    lines.push(`import { ${exportName}I18n } from "./${fileName}.i18n.ts";`);
    lines.push("");
    lines.push(`export const ${exportName}: ${typeName(card)} = {`);
    lines.push(`  id: ${JSON.stringify(card.id)},`);
    lines.push(`  canonicalId: ${JSON.stringify(card.canonicalId)},`);
    lines.push(`  slug: ${JSON.stringify(slug)},`);
    lines.push(`  name: ${JSON.stringify(card.name)},`);
    lines.push(renderPrintings(id, setCode, collectorNumber, entries, clean));
    lines.push(`  cardType: ${JSON.stringify(card.cardType)},`);
    lines.push(renderValue("color", card.color, "  "));
    lines.push(`  rarity: ${JSON.stringify(card.rarity)},`);
    lines.push(`  setId: ${JSON.stringify(setCode)},`);
    for (const [key, value] of numericFields(card)) {
      if (value !== undefined) lines.push(`  ${key}: ${JSON.stringify(value)},`);
    }
    if ("trigger" in card && card.trigger !== undefined) {
      lines.push(renderValue("trigger", card.trigger, "  "));
    }
    if (card.traits !== undefined) lines.push(renderValue("traits", card.traits, "  "));
    if (card.attribute !== undefined) lines.push(renderValue("attribute", card.attribute, "  "));
    if (card.effect !== undefined) lines.push(renderValue("effect", card.effect, "  "));
    if (effects !== undefined) lines.push(renderValue("effects", effects, "  "));
    lines.push(`  i18n: ${exportName}I18n,`);
    lines.push("};");
    lines.push("");

    const i18nLines: string[] = [];
    i18nLines.push('import type { OPCardI18n } from "@tcg/op-types";');
    i18nLines.push("");
    i18nLines.push(`export const ${exportName}I18n: OPCardI18n = {`);
    i18nLines.push("  en: {");
    i18nLines.push(`    name: ${JSON.stringify(card.name)},`);
    if (card.i18n.en.effect !== undefined) {
      i18nLines.push(renderValue("effect", card.i18n.en.effect, "    "));
    }
    if (card.i18n.en.imageUrl !== undefined) {
      i18nLines.push(`    imageUrl: ${JSON.stringify(card.i18n.en.imageUrl)},`);
    }
    i18nLines.push("  },");
    i18nLines.push("};");
    i18nLines.push("");

    report.imported += 1;
    report.perCategory[typeDir] = (report.perCategory[typeDir] ?? 0) + 1;
    report.perProduct[setCode] = (report.perProduct[setCode] ?? 0) + 1;
    report.printingsAdded += entries.length - 1;
    const exportLine = `export { ${exportName} } from "./${fileName}.ts";`;
    indexAppends.set(typeDir, [...(indexAppends.get(typeDir) ?? []), exportLine]);

    if (WRITE) {
      writeFileSync(join(CARDS_DIR, typeDir, `${fileName}.ts`), lines.join("\n"));
      writeFileSync(join(CARDS_DIR, typeDir, `${fileName}.i18n.ts`), i18nLines.join("\n"));
    } else {
      console.log(`plan: ${typeDir}/${fileName}.ts (${id} ${clean})`);
    }
  }

  if (WRITE) {
    for (const [typeDir, exportLines] of indexAppends) {
      const indexPath = join(CARDS_DIR, typeDir, "index.ts");
      const existing = readFileSync(indexPath, "utf8");
      const sorted = [...exportLines].sort();
      const next = existing.endsWith("\n")
        ? existing + sorted.join("\n") + "\n"
        : `${existing}\n${sorted.join("\n")}\n`;
      writeFileSync(indexPath, next);
    }
    writeFileSync(join(SNAPSHOT_DIR, "import-report.json"), JSON.stringify(report, null, 2));
  }

  console.log(`imported: ${report.imported}`);
  console.log(`per category: ${JSON.stringify(report.perCategory)}`);
  console.log(`per product prefix: ${JSON.stringify(report.perProduct)}`);
  console.log(`extra art printings: ${report.printingsAdded}`);
  console.log(`unparsed effect text: ${report.unparsedEffects.length}`);
  if (report.unparsedEffects.length > 0) console.log(report.unparsedEffects.join(" "));
  console.log(`errors: ${report.errors.length}`);
  for (const error of report.errors) console.log(`  - ${error}`);
}

main();
