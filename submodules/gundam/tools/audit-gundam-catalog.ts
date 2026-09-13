#!/usr/bin/env node

/**
 * Audits the three catalog representations that must agree:
 *
 *   official scraped printing -> parser output -> checked-in card definition
 *
 * The report accepts behavioral proof only when a test drives public
 * test-engine actions and is either part of the strict harness inventory or
 * explicitly declares `@behavioral-proof complete`. The declaration keeps
 * newly added, clause-complete tests auditable without inferring completeness
 * merely from a test file's existence.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { parseEffect } from "../tools/gundam-card-parser/scripts/parseEffect.ts";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CARDS_ROOT = join(ROOT, "packages/cards/src/cards");
const SCRAPED_ROOT = join(ROOT, "tools/gundam-card-parser/data/scraped");
const INVENTORY_PATH = join(ROOT, "docs/card-audit/inventory-state.json");
const REMEDIATION_BASELINE_PATH = join(ROOT, "docs/card-audit/remediation-baseline.json");
const REMEDIATION_LEDGER_PATH = join(ROOT, "docs/card-audit/remediation-ledger.json");
const JSON_OUT = join(ROOT, "docs/card-audit/gundam-catalog-audit.json");
const MARKDOWN_OUT = join(ROOT, "docs/card-audit/gundam-catalog-audit.md");

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

interface RuntimeCard {
  cardNumber: string;
  canonicalId: string;
  name: string;
  type: string;
  set: string;
  path: string;
  testPath: string;
  effect: string;
  effects: JsonValue;
  printings: Array<{ id?: string; cardNumber?: string }>;
}

interface OfficialPrinting {
  id: string;
  code?: string;
  effect?: string;
  name?: string;
}

type FidelityDisposition =
  | "parser_bug"
  | "runtime_bug"
  | "audit_normalization"
  | "needs_rules_engine_decision";

type BehavioralProofStatus = "public_test_added" | "public_test_reverified";

interface RemediationLedgerEntry {
  cardNumber: string;
  status: "open" | "closed";
  fidelityDisposition?: FidelityDisposition;
  behavioralProof?: BehavioralProofStatus;
  evidence: string[];
}

interface RemediationBaseline {
  generatedAt: string;
  parserRuntimeMismatchCardNumbers: string[];
  behavioralReviewCardNumbers: string[];
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function normalizePrintingId(id: string): string {
  return id
    .trim()
    .toUpperCase()
    .replace(/_P(\d+)$/i, "-P$1");
}

function normalizeText(value: string | undefined): string {
  return (value ?? "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/[\u00a0\u200b]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function stable(value: JsonValue, parentKey?: string): JsonValue {
  if (Array.isArray(value)) {
    const normalized = value.map((entry) => {
      const stableEntry = stable(entry);
      return parentKey === "traits" && typeof stableEntry === "string"
        ? stableEntry.toLowerCase()
        : stableEntry;
    });
    // Attribute predicates are an AND set; parser/runtime declaration order
    // does not affect behavior and must not create a false fidelity mismatch.
    return parentKey === "attributeFilters"
      ? [...normalized].sort((left, right) =>
          JSON.stringify(left).localeCompare(JSON.stringify(right)),
        )
      : normalized;
  }
  if (value && typeof value === "object") {
    const normalized = Object.fromEntries(
      Object.keys(value)
        // Source text is retained in the per-clause report for auditability,
        // but it is not executable effect structure. Comparing it here turns
        // harmless reminder-text/sentence-boundary normalization into a false
        // parser/runtime mismatch.
        .filter(
          (key) =>
            // Source text is reported separately and token printing IDs are
            // runtime identity metadata. Neither is an executable effect
            // constraint that can be derived from the official effect text.
            key !== "sourceText" && key !== "printedCardNumber",
        )
        .sort()
        .map((key) => [key, stable(value[key]!, key)]),
    );
    const attribute = normalized.attribute;
    if (
      typeof attribute === "string" &&
      ["name", "pairedPilotTrait", "trait"].includes(attribute) &&
      typeof normalized.value === "string"
    ) {
      normalized.value = normalized.value.toLowerCase();
    }
    if (typeof normalized.trait === "string") {
      normalized.trait = normalized.trait.toLowerCase();
    }
    // Unit targets without an explicit zone resolve against deployed Units.
    // `battleArea` is therefore redundant executable structure, unlike
    // hand/trash/shield/resource zone qualifiers which change legality.
    if (normalized.cardType === "unit" && normalized.zone === "battleArea") {
      delete normalized.zone;
    }
    // A self target identifies the source card, so restating its card type
    // does not change executable legality. Zone remains significant.
    if (normalized.owner === "self") {
      delete normalized.cardType;
      if (normalized.count === 1) delete normalized.count;
    }
    // Battle damage is dealt by attacking Units.  The parser's compact
    // `source: enemy` and a runtime `unitFilter` for an opponent Unit encode
    // the same eligible damage source, so compare them canonically.
    if (
      normalized.action === "preventDamage" &&
      normalized.damageType === "battle" &&
      normalized.source === "enemy"
    ) {
      delete normalized.source;
      normalized.unitFilter = { cardType: "unit", owner: "opponent" };
    }
    // Damage prevention without a printed expiry is permanent; older card
    // data relies on that engine default while the parser spells it out.
    if (normalized.action === "preventDamage" && normalized.duration === "permanent") {
      delete normalized.duration;
    }
    // `dealDamageAll` always resolves against every matching target. Older
    // runtime entries rely on that action default while parser output retains
    // the printed "all" explicitly; the count does not alter eligibility.
    if (
      normalized.action === "dealDamageAll" &&
      normalized.target &&
      typeof normalized.target === "object" &&
      !Array.isArray(normalized.target) &&
      normalized.target.count === "all"
    ) {
      delete normalized.target.count;
    }
    // Setting a card active is only behaviorally meaningful for a rested
    // card; an explicit `state: rested` on that action is redundant.
    if (
      normalized.action === "setActive" &&
      normalized.target &&
      typeof normalized.target === "object" &&
      !Array.isArray(normalized.target) &&
      normalized.target.state === "rested"
    ) {
      delete normalized.target.state;
    }
    // An unfiltered discard resolves by choosing the required number of
    // friendly hand cards. discardChosen encodes that same public prompt
    // explicitly; normalize only the exact default hand-target shape, never
    // a filtered discard or one with additional behavior.
    if (
      normalized.action === "discardChosen" &&
      normalized.target &&
      typeof normalized.target === "object" &&
      !Array.isArray(normalized.target)
    ) {
      const target = normalized.target as Record<string, JsonValue>;
      const targetKeys = Object.keys(target).sort();
      if (
        target.owner === "friendly" &&
        target.zone === "hand" &&
        typeof target.count === "number" &&
        targetKeys.join(",") === "count,owner,zone"
      ) {
        normalized.action = "discard";
        normalized.count = target.count;
        delete normalized.target;
      }
    }
    // Some older runtime definitions carry levelAtMost twice: once as the
    // action shorthand and again as the target's explicit Lv. filter. The
    // latter is what resolves the public target choice, so normalize only an
    // identical duplicate; a broader/narrower target remains distinct.
    if (
      normalized.action === "deployFromTrash" &&
      typeof normalized.levelAtMost === "number" &&
      normalized.target &&
      typeof normalized.target === "object" &&
      !Array.isArray(normalized.target)
    ) {
      const target = normalized.target as Record<string, JsonValue>;
      const filters = target.attributeFilters;
      if (
        Array.isArray(filters) &&
        filters.some(
          (filter) =>
            filter &&
            typeof filter === "object" &&
            !Array.isArray(filter) &&
            filter.attribute === "level" &&
            filter.comparison === "lte" &&
            filter.value === normalized.levelAtMost,
        )
      ) {
        delete normalized.levelAtMost;
      }
    }
    return normalized;
  }
  return value;
}

function stableJson(value: JsonValue): string {
  return JSON.stringify(stable(value));
}

function propertyName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name))
    return name.text;
  return undefined;
}

function unwrap(node: ts.Expression): ts.Expression {
  while (
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    node = node.expression;
  }
  return node;
}

function evaluate(node: ts.Expression, sourceFile: ts.SourceFile): JsonValue {
  const value = unwrap(node);
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return value.text;
  if (ts.isNumericLiteral(value)) return Number(value.text);
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (value.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(value) && ts.isNumericLiteral(value.operand)) {
    return value.operator === ts.SyntaxKind.MinusToken
      ? -Number(value.operand.text)
      : Number(value.operand.text);
  }
  if (ts.isArrayLiteralExpression(value))
    return value.elements.map((element) => evaluate(element, sourceFile));
  if (ts.isObjectLiteralExpression(value)) {
    const result: Record<string, JsonValue> = {};
    for (const property of value.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = propertyName(property.name);
        if (key) result[key] = evaluate(property.initializer, sourceFile);
        continue;
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        result[property.name.text] = { __unsupported: property.getText(sourceFile) };
        continue;
      }
      result.__unsupported = property.getText(sourceFile);
    }
    return result;
  }
  return { __unsupported: value.getText(sourceFile) };
}

function getProperty(object: ts.ObjectLiteralExpression, key: string): ts.Expression | undefined {
  return object.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && propertyName(property.name) === key,
  )?.initializer;
}

function findCardObject(source: string, fileName: string): ts.ObjectLiteralExpression | undefined {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  let card: ts.ObjectLiteralExpression | undefined;
  const visit = (node: ts.Node): void => {
    if (card || !ts.isObjectLiteralExpression(node)) return ts.forEachChild(node, visit);
    if (getProperty(node, "cardNumber")) card = node;
    else ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return card;
}

function stringProperty(
  card: ts.ObjectLiteralExpression,
  key: string,
  sourceFile: ts.SourceFile,
): string {
  const value = getProperty(card, key);
  const evaluated = value ? evaluate(value, sourceFile) : undefined;
  return typeof evaluated === "string" ? evaluated : "";
}

function isKeywordOnly(effect: string): boolean {
  const lines = normalizeText(effect)
    .split("\n")
    .map((line) => line.replace(/^(?:【[^】]+】)+/, "").trim())
    .filter(Boolean);
  return (
    lines.length > 0 &&
    lines.every((line) => /^<[A-Za-z][\w\s-]*?(?:\s+\d+)?>\s*\(.*\)$/.test(line))
  );
}

function isMeaningful(effect: string): boolean {
  const normalized = normalizeText(effect);
  return Boolean(
    normalized &&
    normalized !== "-" &&
    !isKeywordOnly(normalized) &&
    !/^\(Rest a Resource when paying a cost\.\)$/i.test(normalized) &&
    !/^\(At the start of the game, place 1 active EX Base\b/i.test(normalized) &&
    !/^\(At the start of the game, the second-turn player places 1\b/i.test(normalized),
  );
}

function readRuntimeCards(): RuntimeCard[] {
  return walk(CARDS_ROOT)
    .filter(
      (path) =>
        path.endsWith(".ts") && !path.endsWith(".test.ts") && !path.endsWith(`${sep}index.ts`),
    )
    .flatMap((path) => {
      const source = readFileSync(path, "utf8");
      const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
      const card = findCardObject(source, path);
      if (!card) return [];
      const printingsValue = getProperty(card, "printings");
      const printings = printingsValue ? evaluate(printingsValue, sourceFile) : [];
      return [
        {
          cardNumber: stringProperty(card, "cardNumber", sourceFile),
          canonicalId: stringProperty(card, "canonicalId", sourceFile),
          name: stringProperty(card, "name", sourceFile),
          type: stringProperty(card, "type", sourceFile),
          set: relative(CARDS_ROOT, path).split(sep)[0] ?? "unknown",
          path: relative(ROOT, path),
          testPath: relative(ROOT, path.replace(/\.ts$/, ".test.ts")),
          effect: stringProperty(card, "effect", sourceFile),
          effects: getProperty(card, "effects")
            ? evaluate(getProperty(card, "effects")!, sourceFile)
            : [],
          printings: Array.isArray(printings)
            ? (printings as Array<{ id?: string; cardNumber?: string }>)
            : [],
        },
      ];
    })
    .filter((card) => card.cardNumber);
}

function canonicalOwner(cards: RuntimeCard[]): RuntimeCard {
  return [...cards].sort((left, right) => {
    if (left.set === "beta" && right.set !== "beta") return 1;
    if (left.set !== "beta" && right.set === "beta") return -1;
    return left.path.localeCompare(right.path);
  })[0]!;
}

function readOfficialPrintings(): OfficialPrinting[] {
  return walk(SCRAPED_ROOT)
    .filter((path) => path.endsWith(".json") && !path.endsWith("manifest.json"))
    .flatMap((path) => {
      const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
      if (Array.isArray(parsed)) return parsed;
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { cards?: unknown[] }).cards)
      ) {
        return (parsed as { cards: unknown[] }).cards;
      }
      return [];
    })
    .filter((card): card is OfficialPrinting =>
      Boolean(
        card && typeof card === "object" && typeof (card as { id?: unknown }).id === "string",
      ),
    );
}

function publicBehaviorEvidence(testPath: string): {
  exists: boolean;
  public: boolean;
  declaredComplete: boolean;
  reason?: string;
} {
  const absolute = join(ROOT, testPath);
  if (!existsSync(absolute))
    return { exists: false, public: false, declaredComplete: false, reason: "no test file" };
  const source = readFileSync(absolute, "utf8");
  const helperSources = [...source.matchAll(/from\s+["']([^"']*test-helpers\/[^"']+)["']/g)]
    .map((match) => {
      const requested = join(dirname(absolute), match[1]!);
      const resolved = requested.endsWith(".ts") ? requested : `${requested}.ts`;
      return existsSync(resolved) ? readFileSync(resolved, "utf8") : "";
    })
    .filter(Boolean);
  const proofSource = [source, ...helperSources].join("\n");
  const usesEngine = proofSource.includes("GundamTestEngine");
  const usesPlayer = proofSource.includes(".asPlayer(");
  const usesAction =
    /\.(?:deployUnit|deployBase|playCommand|assignPilot|activateAbility|activateBaseAbility|useSupport|enterBattle|declareBlock|resolveEffect|passPhase|passActionStep|passBlock|passBattleAction)\(/.test(
      proofSource,
    );
  const privateState = /\.(?:getG|getState|getRuntime)\(/.test(proofSource);
  if (!usesEngine || !usesPlayer || !usesAction || privateState) {
    return {
      exists: true,
      public: false,
      declaredComplete: false,
      reason: "fixture lacks a public behavioral action",
    };
  }
  return {
    exists: true,
    public: true,
    declaredComplete: /@behavioral-proof\s+complete\b/.test(source),
  };
}

const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8")) as {
  verifiedCardIds: string[];
  verifiedSets?: unknown;
};
if ("verifiedSets" in inventory) {
  throw new Error(
    "inventory-state.json must not certify a whole set; use explicit verifiedCardIds only.",
  );
}
const remediationBaseline = JSON.parse(
  readFileSync(REMEDIATION_BASELINE_PATH, "utf8"),
) as RemediationBaseline;
const remediationLedger = JSON.parse(readFileSync(REMEDIATION_LEDGER_PATH, "utf8")) as {
  entries: RemediationLedgerEntry[];
};
const duplicateLedgerCardNumbers = remediationLedger.entries
  .map((entry) => normalizePrintingId(entry.cardNumber))
  .filter((cardNumber, index, entries) => entries.indexOf(cardNumber) !== index);
if (duplicateLedgerCardNumbers.length) {
  throw new Error(
    `Remediation ledger must contain exactly one record per card: ${[
      ...new Set(duplicateLedgerCardNumbers),
    ].join(", ")}`,
  );
}
const remediationEntries = new Map(
  remediationLedger.entries.map((entry) => [normalizePrintingId(entry.cardNumber), entry]),
);
const baselineFidelityIds = new Set(
  remediationBaseline.parserRuntimeMismatchCardNumbers.map(normalizePrintingId),
);
const baselineBehavioralIds = new Set(
  remediationBaseline.behavioralReviewCardNumbers.map(normalizePrintingId),
);
if (baselineFidelityIds.size !== 144 || baselineBehavioralIds.size !== 272) {
  throw new Error(
    "Remediation baseline must freeze exactly 144 parser/runtime mismatches and 272 behavioral reviews.",
  );
}
const verifiedIds = new Set(inventory.verifiedCardIds.map(normalizePrintingId));
const runtime = readRuntimeCards();
const runtimeByCanonicalId = Map.groupBy(runtime, (card) => card.canonicalId || card.cardNumber);
const canonicals = [...runtimeByCanonicalId.values()]
  .map(canonicalOwner)
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));
const official = readOfficialPrintings();
const officialById = new Map(official.map((card) => [normalizePrintingId(card.id), card]));
const runtimePrintingOwners = new Map<string, Set<string>>();
for (const card of runtime) {
  for (const printing of card.printings) {
    if (!printing.id) continue;
    const id = normalizePrintingId(printing.id);
    const owners = runtimePrintingOwners.get(id) ?? new Set<string>();
    owners.add(card.canonicalId || card.cardNumber);
    runtimePrintingOwners.set(id, owners);
  }
}

const officialIds = new Set(officialById.keys());
const runtimeIds = new Set(runtimePrintingOwners.keys());
const missingOfficialPrintings = [...officialIds].filter((id) => !runtimeIds.has(id)).sort();
const extraRuntimePrintings = [...runtimeIds].filter((id) => !officialIds.has(id)).sort();

const cards = canonicals.map((card) => {
  const officialRecord =
    card.printings
      .map((printing) =>
        printing.id ? officialById.get(normalizePrintingId(printing.id)) : undefined,
      )
      .find((record): record is OfficialPrinting => record !== undefined) ??
    officialById.get(normalizePrintingId(card.cardNumber));
  const parserOutput = parseEffect(card.effect, card.type as never) as unknown as JsonValue;
  const parserJson = stableJson(parserOutput);
  const runtimeJson = stableJson(card.effects);
  const textMatchesOfficial = officialRecord
    ? normalizeText(officialRecord.effect) === normalizeText(card.effect)
    : false;
  const parserEmpty = !Array.isArray(parserOutput) || parserOutput.length === 0;
  const parserHasFallback = parserJson.includes('"unparsedText"');
  const structureMatchesParser = parserJson === runtimeJson;
  const meaningful = isMeaningful(card.effect);
  const evidence = publicBehaviorEvidence(card.testPath);
  const harnessVerified = verifiedIds.has(normalizePrintingId(card.cardNumber));
  const ledgerBehaviorVerified =
    remediationEntries.get(normalizePrintingId(card.cardNumber))?.behavioralProof !== undefined;
  const clauses = Array.from(
    {
      length: Math.max(
        Array.isArray(parserOutput) ? parserOutput.length : 0,
        Array.isArray(card.effects) ? card.effects.length : 0,
      ),
    },
    (_, index) => ({
      index,
      printedClause: (() => {
        const parsedClause = Array.isArray(parserOutput) ? parserOutput[index] : undefined;
        const sourceText =
          parsedClause && typeof parsedClause === "object" && !Array.isArray(parsedClause)
            ? parsedClause.sourceText
            : undefined;
        return typeof sourceText === "string" ? sourceText : card.effect;
      })(),
      parsedClause: Array.isArray(parserOutput) ? (parserOutput[index] ?? null) : null,
      runtimeClause: Array.isArray(card.effects) ? (card.effects[index] ?? null) : null,
    }),
  );
  const fidelityStatus = !textMatchesOfficial
    ? "printed_text_mismatch"
    : !meaningful
      ? "no_behavior_required"
      : parserEmpty
        ? "parser_unparsed"
        : parserHasFallback
          ? "parser_fallback"
          : !structureMatchesParser
            ? "parser_runtime_mismatch"
            : "structure_matches";
  const behavioralCoverage = !meaningful
    ? "no_behavior_required"
    : !evidence.exists || !evidence.public
      ? "behavioral_test_missing"
      : // Per-card ledger certification is accepted only after the test has
        // already passed the public-action evidence check above. This replaces
        // broad set certification without treating a test file's existence as
        // proof on its own.
        (harnessVerified || evidence.declaredComplete || ledgerBehaviorVerified) &&
          fidelityStatus === "structure_matches"
        ? "behavioral_test_present"
        : "partial_behavioral_coverage";
  const behavioralBlocker = JSON.stringify(card.effects).includes('"type":"enemyPlayerCount"')
    ? {
        kind: "harness",
        reason:
          "GundamTestEngine fixture creation currently seeds two players; this card requires two or more enemy players for its executable branch.",
        evidencePath: "packages/engine/src/gundam/testing/test-engine.ts",
      }
    : undefined;
  const risk =
    fidelityStatus === "parser_unparsed"
      ? 100
      : fidelityStatus === "parser_fallback"
        ? 95
        : fidelityStatus === "printed_text_mismatch"
          ? 90
          : fidelityStatus === "parser_runtime_mismatch"
            ? 85
            : behavioralCoverage === "behavioral_test_missing"
              ? 70
              : behavioralCoverage === "partial_behavioral_coverage"
                ? 45
                : 0;
  return {
    cardNumber: card.cardNumber,
    name: card.name,
    type: card.type,
    sourcePath: card.path,
    testPath: evidence.exists ? card.testPath : null,
    officialPrintingIds: card.printings.map((printing) => printing.id).filter(Boolean),
    officialEffect: officialRecord?.effect ?? null,
    runtimeEffect: card.effect,
    parserOutput,
    runtimeEffects: card.effects,
    clauses,
    fidelityStatus,
    behavioralCoverage,
    behavioralEvidence: { ...evidence, harnessVerified },
    ...(behavioralBlocker ? { behavioralBlocker } : {}),
    risk,
  };
});

const fidelityExceptions = cards.filter(
  (card) => !["no_behavior_required", "structure_matches"].includes(card.fidelityStatus),
);
const parserRuntimeMismatches = cards.filter(
  (card) => card.fidelityStatus === "parser_runtime_mismatch",
);
const printedTextMismatches = cards.filter(
  (card) => card.fidelityStatus === "printed_text_mismatch",
);
const behavioralReviewQueue = cards
  .filter(
    (card) =>
      !["no_behavior_required", "behavioral_test_present"].includes(card.behavioralCoverage),
  )
  .sort((left, right) => right.risk - left.risk || left.cardNumber.localeCompare(right.cardNumber));
const missingTestFiles = behavioralReviewQueue.filter((card) => !card.behavioralEvidence.exists);
const runtimeFallbackCards = cards.filter((card) =>
  JSON.stringify(card.runtimeEffects).includes('"action":"unparsedText"'),
);
const meaningfulRuntimeFallbackCards = runtimeFallbackCards.filter((card) =>
  isMeaningful(card.runtimeEffect),
);
const untestedRuntimeFallbackCards = meaningfulRuntimeFallbackCards.filter(
  (card) => !card.behavioralEvidence.exists,
);
const currentFidelityIds = new Set(
  parserRuntimeMismatches.map((card) => normalizePrintingId(card.cardNumber)),
);
const currentBehavioralIds = new Set(
  behavioralReviewQueue.map((card) => normalizePrintingId(card.cardNumber)),
);

function closureIsDocumented(cardNumber: string, kind: "fidelity" | "behavioral"): boolean {
  const entry = remediationEntries.get(normalizePrintingId(cardNumber));
  return Boolean(
    entry &&
    entry.status === "closed" &&
    entry.evidence.length > 0 &&
    (kind === "fidelity" ? entry.fidelityDisposition : entry.behavioralProof),
  );
}

const undocumentedFidelityClosures = [...baselineFidelityIds].filter(
  (cardNumber) =>
    !currentFidelityIds.has(cardNumber) && !closureIsDocumented(cardNumber, "fidelity"),
);
const undocumentedBehavioralClosures = [...baselineBehavioralIds].filter(
  (cardNumber) =>
    !currentBehavioralIds.has(cardNumber) && !closureIsDocumented(cardNumber, "behavioral"),
);
const undocumentedFidelityAdditions = [...currentFidelityIds].filter(
  (cardNumber) => !baselineFidelityIds.has(cardNumber) && !remediationEntries.has(cardNumber),
);
const undocumentedBehavioralAdditions = [...currentBehavioralIds].filter(
  (cardNumber) => !baselineBehavioralIds.has(cardNumber) && !remediationEntries.has(cardNumber),
);
if (
  undocumentedFidelityClosures.length ||
  undocumentedBehavioralClosures.length ||
  undocumentedFidelityAdditions.length ||
  undocumentedBehavioralAdditions.length
) {
  throw new Error(
    [
      "Remediation worklists changed without an explicit per-card ledger entry.",
      undocumentedFidelityClosures.length
        ? `Undocumented fidelity closures: ${undocumentedFidelityClosures.join(", ")}`
        : "",
      undocumentedBehavioralClosures.length
        ? `Undocumented behavioral closures: ${undocumentedBehavioralClosures.join(", ")}`
        : "",
      undocumentedFidelityAdditions.length
        ? `Undocumented fidelity additions: ${undocumentedFidelityAdditions.join(", ")}`
        : "",
      undocumentedBehavioralAdditions.length
        ? `Undocumented behavioral additions: ${undocumentedBehavioralAdditions.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}
const duplicateOwners = [...runtimeByCanonicalId.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([cardNumber, entries]) => ({
    cardNumber,
    canonicalOwner: canonicalOwner(entries).path,
    aliases: entries.map((entry) => entry.path).sort(),
  }));

const cardMatrix = cards.map((card) => ({
  cardNumber: card.cardNumber,
  name: card.name,
  type: card.type,
  sourcePath: card.sourcePath,
  testPath: card.testPath,
  officialPrintingIds: card.officialPrintingIds,
  fidelityStatus: card.fidelityStatus,
  behavioralCoverage: card.behavioralCoverage,
  behavioralEvidence: card.behavioralEvidence,
  remediation: {
    fidelityDisposition: baselineFidelityIds.has(normalizePrintingId(card.cardNumber))
      ? (remediationEntries.get(normalizePrintingId(card.cardNumber))?.fidelityDisposition ??
        "pending")
      : "not_required",
    behavioralProof: baselineBehavioralIds.has(normalizePrintingId(card.cardNumber))
      ? (remediationEntries.get(normalizePrintingId(card.cardNumber))?.behavioralProof ?? "pending")
      : "not_required",
  },
  ...(card.behavioralBlocker ? { behavioralBlocker: card.behavioralBlocker } : {}),
  risk: card.risk,
}));
const fidelityExceptionRecords = fidelityExceptions.map((card) => ({
  cardNumber: card.cardNumber,
  name: card.name,
  type: card.type,
  sourcePath: card.sourcePath,
  testPath: card.testPath,
  fidelityStatus: card.fidelityStatus,
  officialEffect: card.officialEffect,
  runtimeEffect: card.runtimeEffect,
  clauses: card.clauses,
}));
const parserRuntimeMismatchRecords = fidelityExceptionRecords.filter(
  (card) => card.fidelityStatus === "parser_runtime_mismatch",
);
const printedTextMismatchRecords = fidelityExceptionRecords.filter(
  (card) => card.fidelityStatus === "printed_text_mismatch",
);
const behavioralReviewQueueRecords = behavioralReviewQueue.map((card) => ({
  cardNumber: card.cardNumber,
  name: card.name,
  type: card.type,
  sourcePath: card.sourcePath,
  testPath: card.testPath,
  fidelityStatus: card.fidelityStatus,
  behavioralCoverage: card.behavioralCoverage,
  behavioralEvidence: card.behavioralEvidence,
  ...(card.behavioralBlocker ? { behavioralBlocker: card.behavioralBlocker } : {}),
  risk: card.risk,
}));
const missingTestFileRecords = behavioralReviewQueueRecords.filter(
  (card) => !card.behavioralEvidence.exists,
);
const runtimeFallbackRecords = runtimeFallbackCards.map((card) => ({
  cardNumber: card.cardNumber,
  name: card.name,
  type: card.type,
  sourcePath: card.sourcePath,
  testPath: card.testPath,
  fidelityStatus: card.fidelityStatus,
  behavioralCoverage: card.behavioralCoverage,
}));
const meaningfulRuntimeFallbackRecords = runtimeFallbackRecords.filter(
  (card) => card.behavioralCoverage !== "no_behavior_required",
);
const untestedRuntimeFallbackRecords = meaningfulRuntimeFallbackRecords.filter(
  (card) => card.testPath === null,
);

function countBy<T>(items: readonly T[], getKey: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

const report = {
  generatedAt: process.env.AUDIT_GENERATED_AT ?? new Date().toISOString(),
  printingParity: {
    officialUniquePrintings: officialIds.size,
    runtimeUniquePrintings: runtimeIds.size,
    missingOfficialPrintings,
    extraRuntimePrintings,
    duplicateRuntimePrintingOwners: [...runtimePrintingOwners.entries()]
      .filter(([, owners]) => owners.size > 1)
      .map(([printingId, owners]) => ({ printingId, canonicalCardNumbers: [...owners].sort() })),
  },
  duplicateReprintHandling: duplicateOwners,
  summary: {
    runtimeDefinitions: runtime.length,
    canonicalCards: cards.length,
    fidelity: countBy(cards, (card) => card.fidelityStatus),
    behavioralCoverage: countBy(cards, (card) => card.behavioralCoverage),
    fidelityExceptions: fidelityExceptions.length,
    parserRuntimeMismatches: parserRuntimeMismatches.length,
    printedTextMismatches: printedTextMismatches.length,
    behavioralReviewQueue: behavioralReviewQueue.length,
    missingTestFiles: missingTestFiles.length,
    runtimeFallbackCards: runtimeFallbackCards.length,
    meaningfulRuntimeFallbackCards: meaningfulRuntimeFallbackCards.length,
    untestedRuntimeFallbackCards: untestedRuntimeFallbackCards.length,
    frozenRemediationBaseline: {
      parserRuntimeMismatches: baselineFidelityIds.size,
      behavioralReviewQueue: baselineBehavioralIds.size,
      explicitHarnessCertifications: verifiedIds.size,
    },
  },
  cards: cardMatrix,
  fidelityExceptions: fidelityExceptionRecords,
  parserRuntimeMismatches: parserRuntimeMismatchRecords,
  printedTextMismatches: printedTextMismatchRecords,
  behavioralReviewQueue: behavioralReviewQueueRecords,
  missingTestFiles: missingTestFileRecords,
  runtimeFallbackCards: runtimeFallbackRecords,
  meaningfulRuntimeFallbackCards: meaningfulRuntimeFallbackRecords,
  untestedRuntimeFallbackCards: untestedRuntimeFallbackRecords,
  verifiedHarnessBlockers: cards
    .filter((card) => card.behavioralBlocker)
    .map((card) => ({
      cardNumber: card.cardNumber,
      name: card.name,
      sourcePath: card.sourcePath,
      behavioralBlocker: card.behavioralBlocker,
    })),
};

function count(group: Partial<Record<string, number>> | undefined, key: string): number {
  return group?.[key] ?? 0;
}

const markdown = [
  "# Gundam Catalog Fidelity and Behavioral Coverage Audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  "## Printing parity",
  "",
  `- Official unique printings: ${officialIds.size}`,
  `- Runtime unique printings: ${runtimeIds.size}`,
  `- Missing official printings: ${missingOfficialPrintings.length}`,
  `- Extra runtime printings: ${extraRuntimePrintings.length}`,
  `- Canonical cards: ${cards.length} (${runtime.length} authored definitions; ${duplicateOwners.length} duplicate-owner groups).`,
  "",
  "## Effect fidelity",
  "",
  `- Total fidelity exceptions: ${fidelityExceptions.length}`,
  `- Structure matches parser: ${count(report.summary.fidelity, "structure_matches")}`,
  `- No behavior required: ${count(report.summary.fidelity, "no_behavior_required")}`,
  `- Printed-text mismatches: ${count(report.summary.fidelity, "printed_text_mismatch")}`,
  `- Parser-unparsed: ${count(report.summary.fidelity, "parser_unparsed")}`,
  `- Parser fallbacks: ${count(report.summary.fidelity, "parser_fallback")}`,
  `- Parser/runtime mismatches: ${count(report.summary.fidelity, "parser_runtime_mismatch")}`,
  "",
  "## Behavioral coverage",
  "",
  `- Behavioral review queue: ${behavioralReviewQueue.length}`,
  `- Behavioral proof present: ${count(report.summary.behavioralCoverage, "behavioral_test_present")}`,
  `- Partial behavioral coverage: ${count(report.summary.behavioralCoverage, "partial_behavioral_coverage")}`,
  `- Behavioral test missing: ${count(report.summary.behavioralCoverage, "behavioral_test_missing")}`,
  `- Missing test files: ${missingTestFiles.length}`,
  `- Runtime fallback/unparsed cards: ${runtimeFallbackCards.length}`,
  `- Meaningful runtime fallback/unparsed cards: ${meaningfulRuntimeFallbackCards.length}`,
  `- Untested meaningful runtime fallback cards: ${untestedRuntimeFallbackCards.length}`,
  `- No behavior required: ${count(report.summary.behavioralCoverage, "no_behavior_required")}`,
  `- Verified harness blockers: ${report.verifiedHarnessBlockers.length}`,
  "",
  "## Verified harness blockers",
  "",
  ...report.verifiedHarnessBlockers.map(
    (card) => `- ${card.cardNumber} ${card.name}: ${card.behavioralBlocker!.reason}`,
  ),
  "",
  "## Fidelity mismatches",
  "",
  "| Card | Status | Source | Printed clause | Parsed clause | Runtime clause |",
  "| --- | --- | --- | --- | --- | --- |",
  ...fidelityExceptions.flatMap((card) =>
    card.clauses.length
      ? card.clauses.map((clause) =>
          [
            `| ${card.cardNumber} ${card.name}`,
            card.fidelityStatus,
            `\`${card.sourcePath}\``,
            `\`${String(clause.printedClause).replace(/`/g, "'").replace(/\n/g, " ").slice(0, 180)}\``,
            `\`${JSON.stringify(clause.parsedClause).replace(/`/g, "'").slice(0, 180)}\``,
            `\`${JSON.stringify(clause.runtimeClause).replace(/`/g, "'").slice(0, 180)}\` |`,
          ].join(" |"),
        )
      : [
          `| ${card.cardNumber} ${card.name} | ${card.fidelityStatus} | \`${card.sourcePath}\` | \`${card.runtimeEffect.slice(0, 180)}\` | \`[]\` | \`${JSON.stringify(card.runtimeEffects).slice(0, 180)}\` |`,
        ],
  ),
  "",
  "## Behavioral review queue (risk ordered)",
  "",
  "| Card | Risk | Fidelity | Coverage | Source | Test |",
  "| --- | ---: | --- | --- | --- | --- |",
  ...behavioralReviewQueue.map(
    (card) =>
      `| ${card.cardNumber} ${card.name} | ${card.risk} | ${card.fidelityStatus} | ${card.behavioralCoverage} | \`${card.sourcePath}\` | ${card.testPath ? `\`${card.testPath}\`` : "missing"} |`,
  ),
  "",
  "The JSON companion contains full, untruncated printed, parsed, and runtime clauses for every canonical card. A fixture is only marked `behavioral_test_present` when it is in the strict harness inventory and still contains a public `GundamTestEngine` action; ordinary test-file presence is reported as partial coverage.",
  "",
].join("\n");

writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(MARKDOWN_OUT, markdown);
execFileSync("vp", ["fmt", "--write", relative(ROOT, JSON_OUT), relative(ROOT, MARKDOWN_OUT)], {
  cwd: ROOT,
  stdio: "inherit",
});
console.log(
  JSON.stringify(
    {
      report: relative(ROOT, JSON_OUT),
      markdown: relative(ROOT, MARKDOWN_OUT),
      printingParity: report.printingParity,
      summary: {
        canonicalCards: cards.length,
        fidelityExceptions: fidelityExceptions.length,
        parserRuntimeMismatches: parserRuntimeMismatches.length,
        printedTextMismatches: printedTextMismatches.length,
        behavioralReviewQueue: behavioralReviewQueue.length,
        missingTestFiles: missingTestFiles.length,
        runtimeFallbackCards: runtimeFallbackCards.length,
        meaningfulRuntimeFallbackCards: meaningfulRuntimeFallbackCards.length,
        untestedRuntimeFallbackCards: untestedRuntimeFallbackCards.length,
      },
    },
    null,
    2,
  ),
);
