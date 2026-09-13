#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import { canonicalBaseSlug, classifyDirectory } from "./canonical-card-model.mjs";
import { buildExpectedCanonicalManifest } from "./generate-canonical-card-manifest.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");
const CARDS_ROOT = path.join(SRC_ROOT, "cards");

function addIssue(issues, code, message, context = {}) {
  issues.push({ code, message, ...context });
}

function exportedNames(file) {
  const source = readFileSync(file, "utf8");
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const names = new Set();

  const addBinding = (binding) => {
    if (ts.isIdentifier(binding)) {
      names.add(binding.text);
      return;
    }
    for (const element of binding.elements) {
      if (!ts.isOmittedExpression(element)) addBinding(element.name);
    }
  };

  for (const statement of parsed.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause) {
      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) names.add(element.name.text);
      }
      continue;
    }
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!isExported) continue;
    for (const declaration of statement.declarationList.declarations) addBinding(declaration.name);
  }
  return names;
}

function expectedModule(card) {
  const directory = classifyDirectory(card.types, card.slug);
  if (!directory) return undefined;
  return `cards/${directory}/${canonicalBaseSlug(card)}.ts`;
}

export function auditCardCatalogSync({
  catalog,
  manifest,
  cardsRoot,
  runtimeRegistry,
  resolvePrinting,
}) {
  const layers = {
    modules: { issues: [], expectedUnits: 0, presentUnits: 0 },
    exports: { issues: [], expectedCards: catalog.cards.length, availableCards: 0 },
    printings: {
      issues: [],
      expectedPrintings: catalog.cards.reduce((total, card) => total + card.printings.length, 0),
      availablePrintings: 0,
    },
  };

  const expectedModuleByCanonicalId = new Map();
  const expectedModules = new Set();
  for (const card of catalog.cards) {
    const module = expectedModule(card);
    if (!module) {
      addIssue(
        layers.modules.issues,
        "unclassified-card",
        `Cannot classify ${card.slug} from types: ${card.types.join(", ")}`,
        { canonicalId: card.canonicalId, slug: card.slug },
      );
      continue;
    }
    expectedModuleByCanonicalId.set(card.canonicalId, module);
    expectedModules.add(module);
  }

  layers.modules.expectedUnits = expectedModules.size;
  for (const module of expectedModules) {
    const file = path.join(path.dirname(cardsRoot), module);
    if (existsSync(file)) {
      layers.modules.presentUnits += 1;
    } else {
      addIssue(
        layers.modules.issues,
        "missing-module",
        `Missing canonical authored module ${module}`,
        {
          module,
        },
      );
    }
  }

  const catalogByCanonicalId = new Map(catalog.cards.map((card) => [card.canonicalId, card]));
  const manifestByCanonicalId = new Map();
  for (const entry of manifest) {
    if (manifestByCanonicalId.has(entry.canonicalId)) {
      addIssue(
        layers.exports.issues,
        "duplicate-manifest-id",
        `Duplicate manifest canonical id ${entry.canonicalId}`,
        { canonicalId: entry.canonicalId },
      );
    }
    manifestByCanonicalId.set(entry.canonicalId, entry);
    if (!catalogByCanonicalId.has(entry.canonicalId)) {
      addIssue(
        layers.exports.issues,
        "orphan-manifest-id",
        `Manifest canonical id ${entry.canonicalId} is absent from the catalog`,
        { canonicalId: entry.canonicalId, module: entry.module },
      );
    }
  }

  const exportsByModule = new Map();
  const runtimeAvailableCanonicalIds = new Set();
  for (const card of catalog.cards) {
    const entry = manifestByCanonicalId.get(card.canonicalId);
    const wantedModule = expectedModuleByCanonicalId.get(card.canonicalId);
    if (!entry) {
      addIssue(
        layers.exports.issues,
        "missing-manifest-export",
        `Catalog card ${card.slug} has no canonical manifest export`,
        { canonicalId: card.canonicalId, slug: card.slug, expectedModule: wantedModule },
      );
      continue;
    }
    if (entry.module !== wantedModule) {
      addIssue(
        layers.exports.issues,
        "wrong-export-module",
        `${card.slug} is exported from ${entry.module}; expected ${wantedModule}`,
        {
          canonicalId: card.canonicalId,
          slug: card.slug,
          module: entry.module,
          expectedModule: wantedModule,
        },
      );
    }

    const moduleFile = path.join(path.dirname(cardsRoot), entry.module);
    if (existsSync(moduleFile)) {
      let names = exportsByModule.get(entry.module);
      if (!names) {
        names = exportedNames(moduleFile);
        exportsByModule.set(entry.module, names);
      }
      if (!names.has(entry.exportName)) {
        addIssue(
          layers.exports.issues,
          "missing-named-export",
          `${entry.module} does not export ${entry.exportName}`,
          {
            canonicalId: card.canonicalId,
            slug: card.slug,
            module: entry.module,
            exportName: entry.exportName,
          },
        );
      }
    }

    const runtimeCard = runtimeRegistry.get(card.canonicalId);
    if (!runtimeCard) {
      addIssue(
        layers.exports.issues,
        "missing-runtime-card",
        `Runtime registry has no card for ${card.slug}`,
        { canonicalId: card.canonicalId, slug: card.slug, exportName: entry.exportName },
      );
      continue;
    }
    if (runtimeCard.canonicalId !== card.canonicalId) {
      addIssue(
        layers.exports.issues,
        "runtime-id-mismatch",
        `Runtime export ${entry.exportName} resolves to ${runtimeCard.canonicalId}, not ${card.canonicalId}`,
        { canonicalId: card.canonicalId, actualCanonicalId: runtimeCard.canonicalId },
      );
      continue;
    }
    runtimeAvailableCanonicalIds.add(card.canonicalId);
    layers.exports.availableCards += 1;
  }

  const printingOwners = new Map();
  for (const card of catalog.cards) {
    for (const printing of card.printings) {
      const previousOwner = printingOwners.get(printing.id);
      if (previousOwner) {
        addIssue(
          layers.printings.issues,
          "duplicate-printing-id",
          `Printing ${printing.id} belongs to both ${previousOwner} and ${card.canonicalId}`,
          {
            printingId: printing.id,
            canonicalId: card.canonicalId,
            previousCanonicalId: previousOwner,
          },
        );
        continue;
      }
      printingOwners.set(printing.id, card.canonicalId);
      if (!printing.setCode || !printing.collectorNumber) {
        addIssue(
          layers.printings.issues,
          "incomplete-printing",
          `Printing ${printing.id} is missing setCode or collectorNumber`,
          { printingId: printing.id, canonicalId: card.canonicalId },
        );
        continue;
      }
      const resolvedCatalogCard = resolvePrinting(printing.id);
      if (!resolvedCatalogCard) {
        addIssue(
          layers.printings.issues,
          "unavailable-printing-id",
          `Public catalog lookup cannot resolve printing ${printing.setCode}:${printing.collectorNumber}`,
          { printingId: printing.id, canonicalId: card.canonicalId, slug: card.slug },
        );
        continue;
      }
      if (resolvedCatalogCard.canonicalId !== card.canonicalId) {
        addIssue(
          layers.printings.issues,
          "printing-owner-mismatch",
          `Printing ${printing.id} resolves to ${resolvedCatalogCard.canonicalId}, not ${card.canonicalId}`,
          {
            printingId: printing.id,
            canonicalId: card.canonicalId,
            actualCanonicalId: resolvedCatalogCard.canonicalId,
          },
        );
        continue;
      }
      if (!runtimeAvailableCanonicalIds.has(card.canonicalId)) {
        addIssue(
          layers.printings.issues,
          "printing-without-runtime-card",
          `Printing ${printing.setCode}:${printing.collectorNumber} has no runtime card`,
          { printingId: printing.id, canonicalId: card.canonicalId, slug: card.slug },
        );
        continue;
      }
      layers.printings.availablePrintings += 1;
    }
  }

  const ok = Object.values(layers).every((layer) => layer.issues.length === 0);
  return { ok, layers };
}

export function catalogSyncReport(result, { summaryOnly = false } = {}) {
  const report = {
    ok: result.ok,
    layers: {
      modules: {
        status: result.layers.modules.issues.length === 0 ? "pass" : "fail",
        present: result.layers.modules.presentUnits,
        expected: result.layers.modules.expectedUnits,
        issues: result.layers.modules.issues.length,
      },
      exports: {
        status: result.layers.exports.issues.length === 0 ? "pass" : "fail",
        available: result.layers.exports.availableCards,
        expected: result.layers.exports.expectedCards,
        issues: result.layers.exports.issues.length,
      },
      printings: {
        status: result.layers.printings.issues.length === 0 ? "pass" : "fail",
        available: result.layers.printings.availablePrintings,
        expected: result.layers.printings.expectedPrintings,
        issues: result.layers.printings.issues.length,
      },
    },
  };
  const issues = Object.fromEntries(
    Object.entries(result.layers).map(([name, layer]) => [
      name,
      summaryOnly ? layer.issues.slice(0, 20) : layer.issues,
    ]),
  );
  const withIssues = summaryOnly ? { ...report, issueSamples: issues } : { ...report, issues };
  return withIssues;
}

async function main() {
  const [{ fleshAndBloodCatalog }, { STRUCTURED_CARDS_BY_CANONICAL_ID }, { getFleshAndBloodCard }] =
    await Promise.all([
      import("../src/generated/flesh-and-blood-catalog.ts"),
      import("../src/generated/card-registry.generated.ts"),
      import("../src/catalog.ts"),
    ]);
  const sourceCardData = JSON.parse(
    readFileSync(path.join(SRC_ROOT, "generated", "flesh-and-blood-card-data.json"), "utf8"),
  );
  const sourceByCanonicalId = new Map(sourceCardData.cards.map((card) => [card.canonicalId, card]));
  const catalogSource = {
    ...fleshAndBloodCatalog,
    cards: fleshAndBloodCatalog.cards.map((card) => ({
      ...sourceByCanonicalId.get(card.canonicalId),
      ...card,
    })),
  };
  const { manifest } = buildExpectedCanonicalManifest({
    catalog: catalogSource,
    sourceRoot: SRC_ROOT,
  });
  const result = auditCardCatalogSync({
    catalog: catalogSource,
    manifest,
    cardsRoot: CARDS_ROOT,
    runtimeRegistry: STRUCTURED_CARDS_BY_CANONICAL_ID,
    resolvePrinting: getFleshAndBloodCard,
  });
  const report = catalogSyncReport(result, {
    summaryOnly: process.argv.includes("--summary"),
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

const isMain = process.argv[1] !== undefined && path.resolve(process.argv[1]) === SCRIPT_PATH;
if (isMain) await main();
