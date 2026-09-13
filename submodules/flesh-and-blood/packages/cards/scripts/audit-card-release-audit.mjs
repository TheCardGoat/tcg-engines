#!/usr/bin/env node
/**
 * Release-readiness audit for authored cards: definitions, tests, and i18n.
 *
 * Dimensions per authored unit (`cards/<kind>/<slug>.ts`):
 *  - definition: module present, classified into the catalog, clean under
 *    `audit-canonical-authoring`.
 *  - i18n: `.i18n.ts` twin present; authored `en` name/typeText exactly match
 *    the catalog (the printed-metadata source of truth); `en.text` present
 *    whenever the catalog carries functional text.
 *  - locales: locale keys authored beyond `en` (release target: `en` complete
 *    today, additional locales tracked as they are sourced).
 *  - assets: catalog printings for the unit's cards carry `imageUrl` and
 *    `boardImageUrl` for their printing locale (asset URLs must be sourced
 *    from the catalog, never hand-authored).
 *  - tests: `.test.ts` twin present, or covered by a documented exemption.
 *
 * With `--write-docs` the script regenerates `docs/card-release-audit.md`
 * from content-addressed human review evidence.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";
import ts from "typescript";

import { auditCanonicalAuthoring } from "./audit-canonical-authoring.mjs";
import { canonicalBaseSlug, classifyDirectory } from "./canonical-card-model.mjs";
import { loadReleaseEvidence } from "./release-audit-evidence.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_PACKAGE_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const _DOCS_RELATIVE_PATH = "docs/card-release-audit.md";
/** The submodule-root docs/ directory (alongside pitch-family-migration.md). */
const DOCS_RELATIVE_FROM_PACKAGE = "../../docs/card-release-audit.md";
const GAPS_RELATIVE_PATH = "scripts/card-coverage/gaps.json";

/** Kinds whose units are exercised by engine-level suites, not per-card files. */
const TEST_EXEMPT_KINDS = new Map([
  ["macros", "macro objects are engine-level definitions without standalone printed behavior"],
  ["placeholders", "infrastructure marker cards retained for catalog completeness"],
  ["shared", "shared authoring helpers, not cards"],
  ["conditions", "condition objects are asserted via the scenarios that create them"],
  [
    "events",
    "Smash Palace Events have no 1v1 play/resolution primitive; printed Event-deck flip is out of product scope (family out-of-scope/event-in-1v1)",
  ],
]);

function walkFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? walkFiles(file) : [file];
  });
}

function isDefinitionModule(relativeFile) {
  return (
    relativeFile.startsWith("src/cards/") &&
    relativeFile.endsWith(".ts") &&
    !relativeFile.endsWith(".test.ts") &&
    !relativeFile.endsWith(".i18n.ts") &&
    relativeFile !== "src/cards/index.ts" &&
    !relativeFile.includes("/shared/")
  );
}

function unitKey(relativeFile) {
  return relativeFile.replace(/^src\/cards\//, "").replace(/\.ts$/, "");
}

function unitKind(relativeFile) {
  return relativeFile.split("/")[2];
}

/** Statically read the authored `en` locale block of an i18n module. */
export function readI18nModule(file) {
  const source = readFileSync(file, "utf8");
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const result = { records: [], canonicalIds: new Set() };
  const consumedLocaleContainers = new Set();

  const stringOrFunction = (initializer) => {
    if (ts.isStringLiteralLike(initializer)) return { kind: "string", value: initializer.text };
    if (
      ts.isArrowFunction(initializer) ||
      ts.isFunctionExpression(initializer) ||
      ts.isParenthesizedExpression(initializer)
    ) {
      return { kind: "function" };
    }
    return { kind: "dynamic" };
  };

  const localeFields = (localeObject) => {
    const fields = new Map();
    for (const field of localeObject.properties) {
      if (!ts.isPropertyAssignment(field)) continue;
      const fieldName =
        ts.isIdentifier(field.name) || ts.isStringLiteral(field.name) ? field.name.text : undefined;
      if (fieldName === "name" || fieldName === "typeText" || fieldName === "text") {
        fields.set(fieldName, stringOrFunction(field.initializer));
      }
    }
    return fields;
  };

  const looksLikeLocaleBlock = (objectLiteral) => {
    for (const property of objectLiteral.properties) {
      if (
        ts.isPropertyAssignment(property) &&
        ts.isObjectLiteralExpression(property.initializer) &&
        property.initializer.properties.some(
          (field) =>
            ts.isPropertyAssignment(field) &&
            (ts.isIdentifier(field.name) || ts.isStringLiteral(field.name)) &&
            field.name.text === "name",
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const visitObjectLiteral = (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;
    const properties = new Map();
    for (const property of node.properties) {
      if (
        ts.isPropertyAssignment(property) &&
        (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
      ) {
        properties.set(property.name.text, property.initializer);
      }
    }
    const canonicalId = properties.get("canonicalId");
    const canonicalIdText =
      canonicalId && ts.isStringLiteralLike(canonicalId) ? canonicalId.text : undefined;
    if (canonicalIdText) result.canonicalIds.add(canonicalIdText);

    const collectLocales = (localesObject) => {
      const locales = new Map();
      for (const localeProperty of localesObject.properties) {
        if (
          !ts.isPropertyAssignment(localeProperty) ||
          !(ts.isIdentifier(localeProperty.name) || ts.isStringLiteral(localeProperty.name))
        ) {
          continue;
        }
        if (!ts.isObjectLiteralExpression(localeProperty.initializer)) continue;
        locales.set(localeProperty.name.text, localeFields(localeProperty.initializer));
      }
      return locales;
    };

    const localesProperty = properties.get("locales");
    if (localesProperty && ts.isObjectLiteralExpression(localesProperty)) {
      consumedLocaleContainers.add(localesProperty);
      result.records.push({
        canonicalId: canonicalIdText,
        locales: collectLocales(localesProperty),
      });
    } else if (properties.has("en") && looksLikeLocaleBlock(node)) {
      // `defineFamilyI18n(family, { en: {...}, ... })` family-level locales.
      result.records.push({ canonicalId: canonicalIdText, locales: collectLocales(node) });
    }
    ts.forEachChild(node, visitObjectLiteral);
  };

  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node) && !consumedLocaleContainers.has(node)) {
      visitObjectLiteral(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return result;
}

/**
 * Per-locale translation coverage from the generated per-locale files
 * (empty when the pipeline has not been run for a language yet).
 */
function loadLocalizedCoverage(sourceRoot) {
  const generated = path.join(sourceRoot, "generated");
  const coverage = [];
  for (const file of existsSync(generated)
    ? readdirSync(generated).filter((name) =>
        /^flesh-and-blood-translations-[a-z]{2}-[A-Z]{2}\.json$/.test(name),
      )
    : []) {
    try {
      const parsed = JSON.parse(readFileSync(path.join(generated, file), "utf8"));
      coverage.push({ locale: parsed.locale, cards: parsed.cards?.length ?? 0 });
    } catch {
      coverage.push({ locale: file, cards: "unreadable" });
    }
  }
  return coverage.sort((left, right) => left.locale.localeCompare(right.locale));
}

function loadCatalog(sourceRoot) {
  const cardData = JSON.parse(
    readFileSync(path.join(sourceRoot, "generated", "flesh-and-blood-card-data.json"), "utf8"),
  );
  const printingsPath = path.join(sourceRoot, "generated", "flesh-and-blood-printings.json");
  const printingsByCanonicalId = existsSync(printingsPath)
    ? (JSON.parse(readFileSync(printingsPath, "utf8")).printingsByCanonicalId ?? {})
    : {};
  return {
    cards: cardData.cards.map((card) => ({
      ...card,
      printings: printingsByCanonicalId[card.canonicalId] ?? [],
    })),
    provenance: cardData.provenance,
  };
}

export function auditCardReleaseAudit({ packageRoot = DEFAULT_PACKAGE_ROOT, catalog } = {}) {
  const sourceRoot = path.join(packageRoot, "src");
  const cardsRoot = path.join(sourceRoot, "cards");
  const catalogData = catalog ?? loadCatalog(sourceRoot);

  // Group catalog cards by their expected authored unit.
  const cardsByUnit = new Map();
  const unclassified = [];
  for (const card of catalogData.cards) {
    const directory = classifyDirectory(card.types, card.slug);
    const unit = directory ? `${directory}/${canonicalBaseSlug(card)}` : undefined;
    if (!unit) {
      unclassified.push(card.slug);
      continue;
    }
    if (!cardsByUnit.has(unit)) cardsByUnit.set(unit, []);
    cardsByUnit.get(unit).push(card);
  }

  const authoring = auditCanonicalAuthoring({ packageRoot });
  const authoringIssuesByUnit = new Map();
  for (const category of Object.values(authoring.issues ?? {})) {
    for (const issue of category.items ?? []) {
      const file = typeof issue.file === "string" ? issue.file : undefined;
      if (!file || !isDefinitionModule(file)) continue;
      const unit = unitKey(file);
      if (!authoringIssuesByUnit.has(unit)) authoringIssuesByUnit.set(unit, []);
      authoringIssuesByUnit.get(unit).push(issue);
    }
  }

  const units = [];
  const definitionFiles = walkFiles(cardsRoot)
    .map((file) => path.relative(packageRoot, file).replaceAll(path.sep, "/"))
    .filter(isDefinitionModule)
    .sort((a, b) => String(a).localeCompare(String(b)));

  for (const file of definitionFiles) {
    const unit = unitKey(file);
    const kind = unitKind(file);
    const cards = cardsByUnit.get(unit) ?? [];
    const issues = [];

    if (cards.length === 0) {
      issues.push({ dimension: "definition", code: "unit-absent-from-catalog" });
    } else if (unclassified.length > 0) {
      // Informational only; unclassified cards surface in the report summary.
    }

    const definition = {
      present: existsSync(path.join(packageRoot, file)),
      classified: cards.length > 0,
      authoringIssues: authoringIssuesByUnit.get(unit) ?? [],
    };

    const i18nFile = file.replace(/\.ts$/, ".i18n.ts");
    const i18n = {
      present: existsSync(path.join(packageRoot, i18nFile)),
      nameSync: "absent",
      typeTextSync: "absent",
      textPresent: "absent",
      catalogHasText: cards.some((card) => card.functionalTextPlain),
      locales: [],
    };
    if (i18n.present) {
      const parsed = readI18nModule(path.join(packageRoot, i18nFile));
      const localeNames = new Set();
      for (const record of parsed.records) {
        for (const localeName of record.locales.keys()) localeNames.add(localeName);
      }
      i18n.locales = [...localeNames].sort((a, b) => String(a).localeCompare(String(b)));
      const records = parsed.records.filter((record) => record.locales.size > 0);
      const cardById = new Map(cards.map((card) => [card.canonicalId, card]));
      const perCardRecords = records.filter((record) => record.canonicalId);
      const _familyRecords = records.filter((record) => !record.canonicalId);
      const _scopedCards =
        perCardRecords.length > 0
          ? perCardRecords.map((record) => cardById.get(record.canonicalId))
          : [cards];
      const _en =
        records.length > 0
          ? [...records[0].locales.entries()].filter(([locale]) => locale === "en")
          : [];
      const evaluated = [];
      for (const record of records) {
        const scope =
          record.canonicalId === undefined
            ? cards
            : [cardById.get(record.canonicalId)].filter(Boolean);
        evaluated.push({ record, scope });
      }
      if (evaluated.length === 0) {
        i18n.nameSync = "missing-en";
        i18n.typeTextSync = "missing-en";
        i18n.textPresent = "missing-en";
        issues.push({ dimension: "i18n", code: "missing-en-locale" });
      } else {
        const rollup = { name: new Set(), typeText: new Set(), text: new Set() };
        for (const { record, scope } of evaluated) {
          const enFields = record.locales.get("en");
          if (!enFields) continue;
          const resolve = (field) =>
            enFields.get(field) === undefined
              ? undefined
              : enFields.get(field).kind === "string"
                ? enFields.get(field).value
                : enFields.get(field).kind;
          const nameValue = resolve("name");
          const typeTextValue = resolve("typeText");
          const textValue = resolve("text");
          const catalogNames = new Set(scope.map((card) => card.name));
          const catalogTypeTexts = new Set(
            scope.filter((card) => card.typeText).map((card) => card.typeText),
          );
          rollup.name.add(
            nameValue === "function" || nameValue === "dynamic"
              ? nameValue
              : catalogNames.size > 1
                ? "ambiguous"
                : catalogNames.has(nameValue)
                  ? "sync"
                  : "drift",
          );
          rollup.typeText.add(
            typeTextValue === "function" || typeTextValue === "dynamic"
              ? typeTextValue
              : catalogTypeTexts.has(typeTextValue) ||
                  (catalogTypeTexts.size === 0 && typeTextValue === "")
                ? "sync"
                : "drift",
          );
          rollup.text.add(
            textValue === undefined
              ? "missing"
              : typeof textValue === "string"
                ? "present"
                : textValue,
          );
          if (catalogNames.size > 1 && typeof nameValue === "string") {
            issues.push({
              dimension: "i18n",
              code: "name-ambiguous-in-family",
              authored: nameValue,
              catalogNames: [...catalogNames],
            });
          }
          if (
            catalogNames.size === 1 &&
            typeof nameValue === "string" &&
            !catalogNames.has(nameValue)
          ) {
            issues.push({ dimension: "i18n", code: "name-drift", authored: nameValue });
          }
          if (
            typeof typeTextValue === "string" &&
            !catalogTypeTexts.has(typeTextValue) &&
            !(catalogTypeTexts.size === 0 && typeTextValue === "")
          ) {
            issues.push({ dimension: "i18n", code: "type-text-drift", authored: typeTextValue });
          }
          if (
            scope.some((card) => card.functionalTextPlain) &&
            (textValue === undefined ||
              (typeof textValue !== "string" &&
                textValue !== "function" &&
                textValue !== "dynamic"))
          ) {
            issues.push({ dimension: "i18n", code: "missing-functional-text" });
          }
        }
        const pick = (set) =>
          set.has("drift")
            ? "drift"
            : set.has("ambiguous")
              ? "ambiguous"
              : ([...set][0] ?? "absent");
        i18n.nameSync = pick(rollup.name);
        i18n.typeTextSync = pick(rollup.typeText);
        i18n.textPresent = pick(rollup.text);
      }
      if (parsed.canonicalIds.size > 0) {
        for (const id of parsed.canonicalIds) {
          if (!cards.some((card) => card.canonicalId === id)) {
            issues.push({ dimension: "i18n", code: "unknown-canonical-id", canonicalId: id });
          }
        }
      }
    } else {
      issues.push({ dimension: "i18n", code: "missing-i18n-module" });
    }

    const locales = {
      authored: i18n.locales,
      enOnly: i18n.locales.length === 1 && i18n.locales[0] === "en",
    };

    const printingSummary = { total: 0, withImageUrl: 0, withBoardImageUrl: 0, locales: new Set() };
    for (const card of cards) {
      for (const printing of card.printings ?? []) {
        printingSummary.total += 1;
        if (printing.imageUrl) printingSummary.withImageUrl += 1;
        if (printing.boardImageUrl) printingSummary.withBoardImageUrl += 1;
        printingSummary.locales.add(printing.locale ?? "unknown");
      }
    }
    const assets = {
      printings: printingSummary.total,
      missingImageUrl: printingSummary.total - printingSummary.withImageUrl,
      missingBoardImageUrl: printingSummary.total - printingSummary.withBoardImageUrl,
      printingLocales: [...printingSummary.locales].sort((a, b) =>
        String(a).localeCompare(String(b)),
      ),
    };
    if (assets.missingImageUrl > 0 || assets.missingBoardImageUrl > 0) {
      issues.push({
        dimension: "assets",
        code: "missing-catalog-asset-urls",
        missingImageUrl: assets.missingImageUrl,
        missingBoardImageUrl: assets.missingBoardImageUrl,
      });
    }

    const testFile = file.replace(/\.ts$/, ".test.ts");
    const exemptReason = TEST_EXEMPT_KINDS.get(kind);
    const tests = {
      present: existsSync(path.join(packageRoot, testFile)),
      exempt: exemptReason ? true : undefined,
      exemption: exemptReason,
    };
    if (!tests.present && !tests.exempt) {
      issues.push({ dimension: "tests", code: "missing-test-module" });
    }

    units.push({
      unit,
      kind,
      file,
      cards: cards.map((card) => card.canonicalId),
      issues,
      definition,
      i18n,
      locales,
      assets,
      tests,
    });
  }

  const orphanCatalogUnits = [...cardsByUnit.keys()]
    .filter((unit) => !definitionFiles.includes(`src/cards/${unit}.ts`))
    .sort((a, b) => String(a).localeCompare(String(b)));

  const openGapFamiliesByUnit = new Map();
  const unitByCanonicalId = new Map(
    units.flatMap((unit) => unit.cards.map((canonicalId) => [canonicalId, unit.unit])),
  );
  const unitByCardSlug = new Map(
    [...cardsByUnit.entries()].flatMap(([unit, unitCards]) =>
      unitCards.map((card) => [card.slug, unit]),
    ),
  );
  const gapsPath = path.join(packageRoot, GAPS_RELATIVE_PATH);
  if (existsSync(gapsPath)) {
    const gaps = JSON.parse(readFileSync(gapsPath, "utf8"));
    for (const family of gaps.families ?? []) {
      if (family.status === "resolved") continue;
      for (const member of family.members ?? []) {
        const unit =
          (member.canonicalId ? unitByCanonicalId.get(member.canonicalId) : undefined) ??
          unitByCardSlug.get(member.slug);
        if (!unit) continue;
        const families = openGapFamiliesByUnit.get(unit) ?? new Set();
        families.add(family.family);
        openGapFamiliesByUnit.set(unit, families);
      }
    }
  }
  for (const unit of units) {
    unit.openGapFamilies = [...(openGapFamiliesByUnit.get(unit.unit) ?? [])].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
  }

  const openUnits = units.filter((unit) => unit.issues.length > 0);
  const issuesByDimension = {};
  for (const unit of openUnits) {
    for (const issue of unit.issues) {
      issuesByDimension[issue.dimension] ??= {};
      issuesByDimension[issue.dimension][issue.code] =
        (issuesByDimension[issue.dimension][issue.code] ?? 0) + 1;
    }
  }

  const authoredIssueDimensions = Object.keys(issuesByDimension).filter(
    (dimension) => dimension !== "assets",
  );
  const authoredSideOk =
    authoredIssueDimensions.length === 0 && orphanCatalogUnits.length === 0 && authoring.ok;

  return {
    ok: openUnits.length === 0 && orphanCatalogUnits.length === 0 && authoring.ok,
    authoredSideOk,
    packageRoot,
    localizedTranslationCoverage: loadLocalizedCoverage(sourceRoot),
    catalog: {
      cards: catalogData.cards.length,
      printings: catalogData.cards.reduce(
        (total, card) => total + (card.printings?.length ?? 0),
        0,
      ),
      printingLocales: [
        ...new Set(
          catalogData.cards.flatMap((card) =>
            (card.printings ?? []).map((p) => p.locale ?? "unknown"),
          ),
        ),
      ].sort((a, b) => String(a).localeCompare(String(b))),
    },
    authoringAudit: { ok: authoring.ok, totalIssues: authoring.totalIssues },
    units: {
      total: units.length,
      open: openUnits.length,
      withTests: units.filter((unit) => unit.tests.present).length,
      testExempt: units.filter((unit) => unit.tests.exempt).length,
      missingTests: units.filter((unit) => !unit.tests.present && !unit.tests.exempt).length,
      localesBeyondEn: units.filter((unit) => !unit.locales.enOnly).length,
    },
    issuesByDimension,
    orphanCatalogUnits,
    openUnits,
    unitsAll: units,
  };
}

/** ---- docs/card-release-audit.md generation from reviewed evidence ---- */

/** Dated root-cause log; hand-edit this list as systemic findings are closed. */
const SYSTEMIC_FINDINGS = [
  {
    date: "2026-08-31",
    finding:
      "FAB Cube reports all three Comet Collision pitch variants as `Lightning Wizard Instant`, contradicting the printed `Lightning Wizard Action` type line. A generated-catalog-only correction would be reverted by the next catalog refresh.",
    resolution:
      "Added canonical-ID metadata overrides to the catalog normalization pipeline for OMN109/OMN110/OMN111, with a regression covering the incorrect upstream payload. The generated catalog and authored action modules now remain stable across refreshes while upstream issue the-fab-cube/flesh-and-blood-cards#516 is open.",
  },
  {
    date: "2026-08-29",
    finding:
      'Authored i18n name/typeText drifted from the catalog (the printed-metadata source of truth) on 66 cards: 3 names (Tiger Form Incantation carried an unprinted colon), 63 typeTexts (dropped Draconic/Mystic talents, dropped the Disease metatype, missing " / " between hybrid classes, spurious "- Attack" on non-attack Actions).',
    resolution:
      "Fixed at the root: 23 authored .i18n.ts files synced to the catalog; the audit now fails on any future i18n/name-drift or i18n/type-text-drift instead of trusting hand-copied strings.",
  },
  {
    date: "2026-08-29",
    finding:
      "Asset URLs are structurally absent from the i18n layer: catalog printings carry imageUrl/boardImageUrl per printing locale, but FleshAndBloodCardLocaleText/FleshAndBloodCardI18n expose no asset fields, so localized surfaces cannot resolve card art through i18n.",
    resolution:
      "Implemented 2026-08-29: FleshAndBloodCardLocaleText/FleshAndBloodCardTranslation gained optional imageUrl/boardImageUrl; authoring/locale-assets.ts derives per-locale URLs from printings (default printing per locale, language fallback) and defaultTranslationsFromCatalog wires them into the translation catalog. Authored files stay URL-free; hand-authoring URLs across 3,226 files would re-create the drift this audit exists to prevent. Localized sources beyond en-US remain a source-data decision (finding below).",
  },
  {
    date: "2026-08-29",
    finding:
      "317 units (353 printings across 20 sets: MPW 111, FAB 75, IAR 32, TNP 30, AOL 26, LGS 28, HER 19, JDG 19, ...) have empty imageUrl/boardImageUrl in the source catalog.",
    resolution:
      "Data backlog owned by the art-asset pipeline (upstream fetch + CDN R2 sync), not card authoring; tracked here until ops fills the URLs, audit guards the tail.",
  },
  {
    date: "2026-08-29",
    finding:
      "38 catalog cards carry no functionalTextPlain upstream (authored i18n consistently omits text for exactly those cards).",
    resolution:
      "Verify those 38 against physical prints during review; the audit holds authored side in sync with the catalog either way.",
  },
  {
    date: "2026-08-29",
    finding:
      "323 authored units lack a per-card .test.ts module (equipment 183, actions 47, weapons 22, tokens 16, events 9, blocks/attack-reactions 10 each, rest single digits).",
    resolution:
      "Close via /fab-tests batches (real AAA scenarios per .agents/skills/fab-test-generation), lowest-value exemptions documented in TEST_EXEMPT_KINDS; never ship stringify/presence-only guards to shrink this number.",
  },
  {
    date: "2026-08-29",
    finding:
      'The only sourced catalog locale is en-US (tools/scraper hardcodes it), so "translations across languages" cannot be produced from current upstream data; the translation-catalog and i18n shapes already support additional locales.',
    resolution:
      "Localization of additional languages is a source-data decision; when a localized source lands, this audit extends to per-locale sync the same way it guards en.",
  },
  {
    date: "2026-08-30",
    finding:
      'Authored i18n `text` vs catalog `functionalTextPlain`: the catalog string is a lossy machine normalization of the physical card ("Destroy this", contractions, "get go again", "2 Silver you control"); ~116 of 396 equipment texts differ from it cosmetically, including the model card achilles-accelerator.',
    resolution:
      'Adjudication rule: authored i18n text matching the real printed card is the convention; mechanical guards enforce name/typeText drift only. Correct authored text ONLY when it contradicts both the catalog AND the authored ability AST / the real printed card (fixed: boots-to-the-boards missing "you may", barkbone-strapping "Roll a 6 die" typo, spoiled-skull "chose", viziertronic-model-i name). Normalization-only deltas are not defects.',
  },
  {
    date: "2026-08-30",
    finding:
      'Test closure (equipment/actions waves) fixed authored definition defects at the root: vigilant-dodgers activation gate lacked a player scope (defender could never satisfy "a weapon has attacked this turn"; fixed with player:"any") and embrace-sin used the unmigrated rule-modification allow-play shape the banished-zone legality gate rejects (re-authored to the migrated play-card permission, CR 1.8.5e).',
    resolution:
      "Both fixed in the authored files with end-to-end suites; sweep sibling gates during review waves: any count-based activation gate without explicit player scope, and any remaining rule-modification allow-play clause, is suspect.",
  },
  {
    date: "2026-08-30",
    finding:
      'Engine testing token-registry omitted bladeDance, so every create-token: blade-dance failed with "created object token:blade-dance is absent from match program" (broke Jive/Gutshot/Off-Beat suites).',
    resolution:
      "Registered the real Blade Dance token module in packages/engine/src/testing/token-registry.ts; created instances carry its printed destroy-on-weapon-attack + go-again behavior.",
  },
  {
    date: "2026-08-30",
    finding:
      "Test closure surfaced ~18 engine-primitive families that make specific printed legs unprovable end-to-end (recorded in card-coverage/gaps.json): play-card effect unmigrated (spoiled-skull, eternal-inferno), different-names filter ignoring printed names, sharpened control-object filter shadowing, second-activation ordinal discount, banish-observed power filter, optional play-card grants, wagered-state timing, nested optional never surfacing, bond grants dropped, sharpen destroyed-count, reorder-deck empty crash, no-zombie-attack-card, Blasmophet name filter, arena-ally-aura attack proxy, transcend without authored source, bare look without assertion surface, event-equipment may-equip inert (bloodied-boots/helm).",
    resolution:
      "All recorded via the sanctioned --record-gap (never by weakening suites); rows whose headline clause is entirely unprovable stay unmarked until the family closes. Close via /fab-close-gaps.",
  },
  {
    date: "2026-08-30",
    finding:
      'Catalog pipeline outliers: Battle Prep cardKeywords says "Opt 1" while the authored keyword is opt(2) and the printed text says "Opt 2" (all pitch variants); the asset-URL backlog is larger than first recorded (544 printings across 20 sets on 317 units — earlier figure 353); 38 catalog cards carry no functionalTextPlain.',
    resolution:
      "Battle Prep flagged for the catalog owner (authored side left as-is; AST and i18n agree). Ops reports compiled for the art-asset pipeline (upstream fetch + R2 sync; locale-assets.ts owns derivation). The 38 textless cards web-verified as a genuine textless class (vanilla attacks, Proto base equipment, resources; Lightning Flow suspect disproven via official release notes) — document the class and tripwire new no-text cards outside it.",
  },
  {
    date: "2026-08-30",
    finding:
      "Nine Smash Palace Event units still lacked .test.ts twins (arena-medic, benefactor-of-bloodworth-goldmane, big-hits-big-applause, didn-t-see-that-coming, dominate-the-competition, ez-sqeez-bookie-syndicate, hit-the-jackpot, rally-the-underdog, visit-the-winner-takes-all). 1v1 has no Event play/resolution primitive (begin-play rejects the card type); seated-in-arena idle/stringify twins would be filler.",
    resolution:
      "Recorded family out-of-scope/event-in-1v1; added events to TEST_EXEMPT_KINDS. Do not invent Event-deck play in 1v1. Triggered Events that already have real play suites (e.g. Ire of the Crowd) keep them.",
  },
  {
    date: "2026-08-30",
    finding:
      "Edge Laden Plate activation closure briefly authored the engine storage marker hasStatus: sharpened-this-turn. The authoring mandate correctly rejects derived this-turn markers in card modules; authored conditions must name the semantic object status instead.",
    resolution:
      "Root-cause: the authored condition filters Sword + hasStatus sharpened; the evaluator maps that semantic status to the CR 8.5.58 sharpen marker. The gameplay suite proves Instant destroy-for-{r} after a legal Hala sharpen and rejection without one; the full authoring mandate is green.",
  },
  {
    date: "2026-08-30",
    finding:
      "--strict treated catalog-only missing imageUrl/boardImageUrl as an authored failure (exit 1 with 317 asset units), blocking the release gate even when definition/i18n/tests were clean.",
    resolution:
      "authoredSideOk ignores the assets dimension; --strict exits 0 when the only remaining family is missing-catalog-asset-urls. Full report.ok stays false until ops fills the URLs.",
  },
  {
    date: "2026-08-30",
    finding:
      "Twelve units stayed unmarked after review: Thick Hide Hunter was an AST contract; Overturn the Results pinned a clash-lose replacement that never registers; ten Event suites were seating/toMatchObject only.",
    resolution:
      "Thick Hide Hunter rewritten to AAA attack-discard + defend-discard play. Unprovable units stay unmarked through the canonical open families in card-coverage/gaps.json, which the generator renders as recorded-gap notes rather than filler twins.",
  },
  {
    date: "2026-08-30",
    finding:
      "Legacy [x] marks were path-only assertions: a definition or AAA test could change after review while the generated ledger still appeared complete, and units newly assigned to an open gap could retain a misleading audited mark.",
    resolution:
      "Release evidence is now content-addressed per unit (definition/i18n/test SHA-256 plus canonical-card coverage and review provenance). The consistency gate rejects stale hashes, malformed or ambiguous gap members, and evidence on open-gap units; reviewed refreshes are explicit named-unit mutations and open-gap reconciliation prunes whole authored families before docs regenerate.",
  },
  {
    date: "2026-08-30",
    finding:
      "Play-static authoring conflated restrictions with permissions. Conditions such as 'only if' and 'can only be played from arsenal' were compiled as allow rules, while play-card effects and alternate-timing permissions omitted their physical origin and could select an unintended source zone.",
    resolution:
      "Restriction statics use role:condition and are enforced directly by the legality quote; play effects and genuine permissions declare exact fromZones. Hash-scattered review ran the affected AAA suites. The remaining Teklovossen case, where independent banished-origin and instant-timing permissions must compose, is retained as recorded gap engine/play-permission-composition.",
  },
  {
    date: "2026-08-30",
    finding:
      "Canonical unless effects with a discard escape assigned the decision to the ability controller and treated an empty opponent hand as an available escape. Cheap Shot's target could therefore answer the wrong prompt, and declining the escape had only been covered by a prohibited pin.",
    resolution:
      "The layer decision walker now resolves discard availability from the declared target pool and assigns the optional to that target player. Cheap Shot AAA proves the target's discard branch, the no-boo/no-action-point boundary, and the boo-enabled instant line dealing 2 when the target declines.",
  },
  {
    date: "2026-08-30",
    finding:
      "Danse Macabre scoped its next grant to attacksOf the entered ally and also required the ally card to have subtype Attack. Ally attack sources do not acquire the Attack subtype, so the first attack never received go again even though the delayed end-phase destruction could stage.",
    resolution:
      "Removed the redundant Attack-subtype filter and retained the exact attacksOf binding/count. Its real Dragon ally line now proves payment and tap, first-attack go again, end-phase destruction, and the declined-payment boundary; the former optional-pay gap is resolved.",
  },
  {
    date: "2026-08-30",
    finding:
      'An independent verification sweep of the marked rows exposed 19 red card tests across 18 files at the audited tip (A/B-proven committed, not WIP-induced). Mark of Lightning failed on a harness idiom: closeCombat({ optionals: "accept" }) invoked directly after defendWith never faces the equipment optional, which surfaces only after both players pass the defend step, so the accept was a no-op and destroy never ran — the engine was proven correct by scratch-definition variants isolating the origin filter, the attack binding-match, and the optional wrapper. The traps, Rune Gate from-banished, and tail suites flaked on the same mid-drain decision surfacing answered too late by the layer-resolution lookup.',
    resolution:
      "Mark of Lightning fixed by draining both defend priorities before closeCombat (commit 7b6f1e285c); the layer-resolution side was fixed at the engine root in find-decision.ts (commit d793a4a408), after which all 18 files re-ran green (59/59) and the full cards suite passed. Lesson: when a printed clause is an optional fired on a combat event, drain the event's priority window before closing combat — optionals flags on untilIdle/closeCombat answer only decisions actually surfaced.",
  },
];

function statusCell(status, exemptReason) {
  if (exemptReason) return "—";
  return status ? "✅" : "❌";
}

export function renderReleaseAuditDoc(report, { evidence, generatedAt } = {}) {
  const audited = new Set(Object.keys(evidence?.units ?? {}));
  const lines = [];
  lines.push("# Card Release Audit");
  lines.push("");
  lines.push(
    "Living TODO ledger for auditing every authored card unit ahead of release. A unit is one",
    "authored triple under `packages/cards/src/cards/<kind>/<slug>.{ts,.i18n.ts,.test.ts}` (pitch",
    "families author all variants in one triple).",
  );
  lines.push("");
  lines.push("## How to work this ledger");
  lines.push("");
  lines.push("- Regenerate the status columns with:");
  lines.push("  `node packages/cards/scripts/audit-card-release-audit.mjs --write-docs`.");
  lines.push("  Human `audited` marks come from content-addressed release evidence.");
  lines.push("- Mark a unit `[x]` only after reviewing its definition, test (or documented");
  lines.push("  exemption), and i18n row — not because the script is green: the script is the");
  lines.push("  floor, the review is the audit.");
  lines.push("- Fix issues at the root cause (shared primitive, generator, or pipeline) before");
  lines.push("  marking units audited; never hand-patch a symptom across many rows.");
  lines.push("");
  lines.push(
    `Generated: \`${generatedAt ?? "manual"}\` · Script: \`packages/cards/scripts/audit-card-release-audit.mjs\``,
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(
    `- Catalog: ${report.catalog.cards} cards, ${report.catalog.printings} printings, locales: ${report.catalog.printingLocales.join(", ")}`,
  );
  lines.push(
    `- Authored units: ${report.units.total} · failing: ${report.units.open} · with tests: ${report.units.withTests} · test-exempt: ${report.units.testExempt} · missing tests: ${report.units.missingTests} · i18n beyond en: ${report.units.localesBeyondEn}`,
  );
  lines.push(
    `- Definitions authoring audit: ${report.authoringAudit.ok ? "green" : `RED (${report.authoringAudit.totalIssues} issues)`}`,
  );
  const coverage = report.localizedTranslationCoverage ?? [];
  lines.push(
    `- Localized translations (fab-cube per-language trees): ${
      coverage.length === 0
        ? "none generated yet"
        : coverage.map((entry) => `${entry.locale}: ${entry.cards} cards`).join(" · ")
    } (baseline: the ${report.catalog.cards}-card en-US catalog)`,
  );
  lines.push("");
  lines.push("## Systemic findings & root-cause log");
  lines.push("");
  lines.push(
    "Issues are fixed globally (shared primitive, generator, or pipeline) before units are",
    "marked audited. Each entry records the systemic finding and its root-cause resolution.",
  );
  lines.push("");
  for (const entry of SYSTEMIC_FINDINGS) {
    lines.push(`### ${entry.date}`);
    lines.push("");
    lines.push(`- **Finding:** ${entry.finding}`);
    lines.push(`- **Resolution:** ${entry.resolution}`);
    lines.push("");
  }
  const dimensionEntries = Object.entries(report.issuesByDimension);
  lines.push("## Open issue families");
  lines.push("");
  if (dimensionEntries.length > 0) {
    for (const [dimension, codes] of dimensionEntries) {
      for (const [code, count] of Object.entries(codes)) {
        lines.push(`- \`${dimension}/${code}\`: ${count}`);
      }
    }
    lines.push("");
  } else {
    lines.push("None. Every unit passes every scripted dimension.");
    lines.push("");
  }
  if (report.orphanCatalogUnits.length > 0) {
    lines.push("## Catalog units without authored modules");
    lines.push("");
    for (const unit of report.orphanCatalogUnits) lines.push(`- \`${unit}\``);
    lines.push("");
  }

  const byKind = new Map();
  for (const unit of report.unitsAll ?? []) {
    if (!byKind.has(unit.kind)) byKind.set(unit.kind, []);
    byKind.get(unit.kind).push(unit);
  }
  for (const kind of [...byKind.keys()].sort((a, b) => String(a).localeCompare(String(b)))) {
    lines.push(`## ${kind}`);
    lines.push("");
    lines.push("| audited | unit | definition | i18n en sync | locales | assets | tests |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const unit of byKind.get(kind)) {
      const mark = audited.has(unit.unit) ? "[x]" : "[ ]";
      const nameOk = unit.i18n.nameSync === "sync" || unit.i18n.nameSync === "function";
      const typeOk = unit.i18n.typeTextSync === "sync" || unit.i18n.typeTextSync === "function";
      const textOk =
        unit.i18n.textPresent === "present" ||
        unit.i18n.textPresent === "function" ||
        unit.i18n.textPresent === "dynamic" ||
        (!unit.i18n.catalogHasText && unit.i18n.textPresent === "missing");
      const definitionOk =
        unit.definition.present &&
        unit.definition.classified &&
        unit.definition.authoringIssues.length === 0;
      const assetsOk = unit.assets.missingImageUrl === 0 && unit.assets.missingBoardImageUrl === 0;
      const testsOk = unit.tests.present || unit.tests.exempt;
      const locales = unit.locales.authored.join(", ") || "—";
      const gapNote = unit.openGapFamilies?.length
        ? unit.openGapFamilies.map((family) => `recorded-gap \`${family}\``).join("<br>")
        : null;
      const unitCell = gapNote ? `\`${unit.unit}\` — ${gapNote}` : `\`${unit.unit}\``;
      lines.push(
        `| ${mark} | ${unitCell} | ${statusCell(definitionOk)} | ${
          nameOk && typeOk ? "✅" : "❌"
        }${textOk ? "" : " (text)"} | ${locales} | ${statusCell(assetsOk)} | ${statusCell(testsOk, unit.tests.exemption)} |`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export function parseArguments(argv) {
  const writeDocs = argv.includes("--write-docs");
  const strict = argv.includes("--strict");
  const packageRootIndex = argv.indexOf("--package-root");
  const packageRoot =
    packageRootIndex >= 0 && argv[packageRootIndex + 1]
      ? path.resolve(argv[packageRootIndex + 1])
      : DEFAULT_PACKAGE_ROOT;
  const docsOverrideIndex = argv.indexOf("--docs");
  const docsPath =
    docsOverrideIndex >= 0 && argv[docsOverrideIndex + 1]
      ? path.resolve(argv[docsOverrideIndex + 1])
      : path.resolve(packageRoot, DOCS_RELATIVE_FROM_PACKAGE);
  return { writeDocs, strict, packageRoot, docsPath };
}

export async function run(argv = process.argv.slice(2)) {
  const { writeDocs, strict, packageRoot, docsPath } = parseArguments(argv);
  const report = auditCardReleaseAudit({ packageRoot });
  if (writeDocs) {
    const evidence = loadReleaseEvidence(packageRoot, { required: true });
    const doc = renderReleaseAuditDoc(report, {
      evidence,
      generatedAt: evidence.generatedAt,
    });
    const { writeFileSync, mkdirSync } = await import("node:fs");
    mkdirSync(path.dirname(docsPath), { recursive: true });
    writeFileSync(docsPath, doc);
  }
  process.stdout.write(
    `${JSON.stringify(
      {
        ok: report.ok,
        units: report.units,
        catalog: report.catalog,
        authoringAudit: report.authoringAudit,
        localizedTranslationCoverage: report.localizedTranslationCoverage,
        issuesByDimension: report.issuesByDimension,
        authoredSideOk: report.authoredSideOk,
        orphanCatalogUnits: report.orphanCatalogUnits,
        docsPath: writeDocs ? path.relative(packageRoot, docsPath) : undefined,
      },
      null,
      2,
    )}\n`,
  );
  // Catalog-only asset URL gaps are ops backlog, not authored defects.
  return strict && !report.authoredSideOk ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  process.exitCode = await run();
}
