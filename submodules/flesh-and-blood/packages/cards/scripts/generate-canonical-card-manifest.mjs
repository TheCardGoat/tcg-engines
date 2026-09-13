#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "oxfmt";

import cardDataJson from "../src/generated/flesh-and-blood-card-data.json" with { type: "json" };
import { canonicalBaseSlug, classifyDirectory } from "./canonical-card-model.mjs";

const PACKAGE_ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_ROOT = path.join(PACKAGE_ROOT, "src");
const CARDS_INDEX_PATH = path.join(SOURCE_ROOT, "cards", "index.ts");
const REGISTRY_PATH = path.join(SOURCE_ROOT, "generated", "card-registry.generated.ts");
const IMPLEMENTATION_GAP_MARKER = "IMPLEMENTATION GAP";

function cardExports(module, canonicalId) {
  return Object.entries(module)
    .filter(
      ([, value]) =>
        value !== null &&
        typeof value === "object" &&
        value.canonicalId === canonicalId &&
        value.base !== null &&
        typeof value.base === "object" &&
        value.base.typeBox !== null &&
        typeof value.base.typeBox === "object",
    )
    .map(([name]) => name)
    .sort((a, b) => String(a).localeCompare(String(b)));
}

function i18nExports(module, canonicalId) {
  return Object.entries(module)
    .filter(
      ([, value]) =>
        value !== null &&
        typeof value === "object" &&
        value.canonicalId === canonicalId &&
        value.locales !== null &&
        typeof value.locales === "object",
    )
    .map(([name]) => name)
    .sort((a, b) => String(a).localeCompare(String(b)));
}

function publicExportName(slug) {
  const parts = slug.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const identifier = parts
    .map((part, index) => (index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`))
    .join("");
  return /^\d/.test(identifier) ? `card${identifier}` : identifier;
}

function selectExport(names, expectedName, label) {
  if (names.includes(expectedName)) return expectedName;
  throw new Error(
    names.length === 0
      ? `Missing ${label}; expected ${expectedName}`
      : `Missing deterministic ${label} ${expectedName}; available: ${names.join(", ")}`,
  );
}

function primaryType(card, directory) {
  return (
    card.types.find((type) => classifyDirectory([type], card.slug) === directory) ??
    card.types[0] ??
    "Unknown"
  );
}

export function buildExpectedCanonicalManifest({ catalog, sourceRoot }) {
  const cardsByModule = Map.groupBy(catalog.cards, (card) => {
    const directory = classifyDirectory(card.types, card.slug);
    if (!directory) throw new Error(`Cannot classify ${card.slug}: ${card.types.join(", ")}`);
    return `cards/${directory}/${canonicalBaseSlug(card)}.ts`;
  });
  const manifest = [];
  const implementationGaps = [];

  for (const [modulePath, cards] of cardsByModule) {
    const absoluteModulePath = path.join(sourceRoot, modulePath);
    if (!existsSync(absoluteModulePath)) {
      throw new Error(`Missing canonical authored module ${modulePath}`);
    }
    const source = readFileSync(absoluteModulePath, "utf8");
    if (source.includes(IMPLEMENTATION_GAP_MARKER)) {
      implementationGaps.push({
        module: modulePath,
        canonicalIds: cards.map((card) => card.canonicalId),
      });
      continue;
    }

    const i18nModulePath = modulePath.replace(/\.ts$/, ".i18n.ts");
    const absoluteI18nPath = path.join(sourceRoot, i18nModulePath);
    if (!existsSync(absoluteI18nPath)) throw new Error(`Missing i18n module ${i18nModulePath}`);
    const directory = path.basename(path.dirname(modulePath));

    for (const card of cards) {
      const expectedExportName = publicExportName(card.slug);
      const stableFamilyKey = canonicalBaseSlug(card);
      manifest.push({
        canonicalId: card.canonicalId,
        exportName: expectedExportName,
        i18nExportName: `${expectedExportName}I18n`,
        module: modulePath,
        i18nModule: i18nModulePath,
        primaryType: primaryType(card, directory),
        stableFamilyKey,
      });
    }
  }

  manifest.sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));
  const canonicalIds = new Set();
  const exportNames = new Set();
  for (const entry of manifest) {
    if (canonicalIds.has(entry.canonicalId)) {
      throw new Error(`Duplicate canonical id ${entry.canonicalId}`);
    }
    if (exportNames.has(entry.exportName)) {
      throw new Error(`Duplicate public export ${entry.exportName}`);
    }
    canonicalIds.add(entry.canonicalId);
    exportNames.add(entry.exportName);
  }
  return { manifest, implementationGaps };
}

export async function buildCanonicalManifest({ catalog, sourceRoot }) {
  const expected = buildExpectedCanonicalManifest({ catalog, sourceRoot });
  for (const [modulePath, entries] of Map.groupBy(expected.manifest, (entry) => entry.module)) {
    const i18nModulePath = entries[0].i18nModule;
    const [cardModule, i18nModule] = await Promise.all([
      import(pathToFileURL(path.join(sourceRoot, modulePath)).href),
      import(pathToFileURL(path.join(sourceRoot, i18nModulePath)).href),
    ]);
    for (const entry of entries) {
      selectExport(
        cardExports(cardModule, entry.canonicalId),
        entry.exportName,
        `card export for ${entry.canonicalId} in ${modulePath}`,
      );
      selectExport(
        i18nExports(i18nModule, entry.canonicalId),
        entry.i18nExportName,
        `i18n export for ${entry.canonicalId} in ${i18nModulePath}`,
      );
    }
  }
  return expected;
}

export function renderCardsIndex(manifest) {
  const modules = [...new Set(manifest.map((entry) => entry.module))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
  return `// Generated by scripts/generate-canonical-card-manifest.mjs. Do not edit.\nimport { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "../runtime-registry.ts";\n\n${modules
    .map((module) => `export * from "./${module.replace(/^cards\//, "")}";`)
    .join(
      "\n",
    )}\n\n/** Physical structured cards after reviewed double-faced layout assembly. */\nexport const fleshAndBloodStructuredCardsByCanonicalId = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID;\n`;
}

export function renderStaticRegistry(manifest) {
  const byModule = Map.groupBy(manifest, (entry) => entry.module);
  const byI18nModule = Map.groupBy(manifest, (entry) => entry.i18nModule);
  const imports = [];
  for (const [module, entries] of [...byModule].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const names = [...new Set(entries.map((entry) => entry.exportName))].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
    const flatImport = `import { ${names.join(", ")} } from "../${module}";`;
    imports.push(
      names.length === 1 || flatImport.length <= 100
        ? flatImport
        : `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "../${module}";`,
    );
  }
  for (const [module, entries] of [...byI18nModule].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const names = [...new Set(entries.map((entry) => entry.i18nExportName))].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
    const flatImport = `import { ${names.join(", ")} } from "../${module}";`;
    imports.push(
      names.length === 1 || flatImport.length <= 100
        ? flatImport
        : `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "../${module}";`,
    );
  }
  const pairs = manifest.map(
    (entry) => `  { card: ${entry.exportName}, i18n: ${entry.i18nExportName} },`,
  );
  return `// Generated by scripts/generate-canonical-card-manifest.mjs. Do not edit.\nimport type { FleshAndBloodCard, FleshAndBloodCardI18n } from "@tcg/flesh-and-blood-types";\nimport { localizeFleshAndBloodCard } from "../localization.ts";\n${imports.join("\n")}\n\nconst authoredCards: readonly { readonly card: FleshAndBloodCard; readonly i18n: FleshAndBloodCardI18n }[] = [\n${pairs.join("\n")}\n];\n\nexport const CARD_I18N_BY_CANONICAL_ID: ReadonlyMap<string, FleshAndBloodCardI18n> = (() => {\n  const entries = new Map<string, FleshAndBloodCardI18n>();\n  for (const { card, i18n } of authoredCards) {\n    if (i18n.canonicalId !== card.canonicalId)\n      throw new Error(\`FAB card localization \${i18n.canonicalId} does not match \${card.canonicalId}\`);\n    if (entries.has(card.canonicalId))\n      throw new Error(\`Duplicate FAB card localization canonical id: \${card.canonicalId}\`);\n    entries.set(card.canonicalId, i18n);\n  }\n  return entries;\n})();\n\nexport const STRUCTURED_CARDS_BY_CANONICAL_ID: ReadonlyMap<string, FleshAndBloodCard> = (() => {\n  const cards = new Map<string, FleshAndBloodCard>();\n  for (const { card, i18n } of authoredCards) {\n    const localized = localizeFleshAndBloodCard(card, i18n);\n    if (cards.has(localized.canonicalId))\n      throw new Error(\`Duplicate structured FAB card canonical id: \${localized.canonicalId}\`);\n    cards.set(localized.canonicalId, localized);\n  }\n  return cards;\n})();\n`;
}

async function main() {
  const catalog = cardDataJson;
  const { manifest, implementationGaps } = await buildCanonicalManifest({
    catalog,
    sourceRoot: SOURCE_ROOT,
  });
  const outputs = new Map([
    [CARDS_INDEX_PATH, renderCardsIndex(manifest)],
    [REGISTRY_PATH, renderStaticRegistry(manifest)],
  ]);
  for (const [file, output] of outputs) {
    const relativeFile = path.relative(PACKAGE_ROOT, file);
    const formatted = await format(relativeFile, output);
    if (formatted.errors.length > 0) {
      throw new Error(
        `Failed to format canonical card artifact ${relativeFile}: ${formatted.errors
          .map((error) => error.message)
          .join(", ")}`,
      );
    }
    outputs.set(file, formatted.code);
  }
  const stale = [...outputs].filter(
    ([file, output]) => !existsSync(file) || readFileSync(file, "utf8") !== output,
  );
  if (process.argv.includes("--check")) {
    if (stale.length > 0) {
      throw new Error(
        `Canonical card artifacts are stale: ${stale
          .map(([file]) => path.relative(PACKAGE_ROOT, file))
          .join(", ")}`,
      );
    }
  } else {
    for (const [file, output] of outputs) writeFileSync(file, output);
  }
  process.stdout.write(
    `${JSON.stringify(
      {
        canonicalCards: manifest.length,
        canonicalUnits: new Set(manifest.map((entry) => entry.module)).size,
        implementationGapCards: implementationGaps.reduce(
          (total, gap) => total + gap.canonicalIds.length,
          0,
        ),
        implementationGapUnits: implementationGaps.length,
        stale: stale.map(([file]) => path.relative(PACKAGE_ROOT, file)),
      },
      null,
      2,
    )}\n`,
  );
}

const isMain =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename);
if (isMain) await main();
