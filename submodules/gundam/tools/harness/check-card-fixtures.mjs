#!/usr/bin/env node
// tools/harness/check-card-fixtures.mjs
//
// Behavioral sensor for card implementations. Every card definition file
// (packages/cards/src/cards/**/*.ts, excluding tests + index.ts) must have:
//
//   1. A sibling *.test.ts file.
//   2. At least one `it(` / `test(` block in that test file.
//
// Rationale: cards are data, but their behavior is defined by their `effects`
// array. The test is the executable specification — without it, we have no
// way to know the card actually does what its `effect` text says. This is the
// "approved fixtures" pattern from Böckeler's behavior-harness essay,
// adapted to cards: every card ships with at least one fixture that pins down
// its behavior.
//
// Exit code:
//   0 — every card has a meaningful test sibling
//   1 — at least one card is missing a test (or its test is empty)

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const CARDS_DIR = join(ROOT, "packages", "cards", "src", "cards");
const ALLOWLIST_PATH = join(ROOT, "tools", "harness", "card-fixture-allowlist.txt");

let allowlist;
try {
  const raw = await readFile(ALLOWLIST_PATH, "utf8");
  allowlist = new Set(
    raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#")),
  );
} catch {
  allowlist = new Set();
}

const missing = [];
const empty = [];
const structural = [];
const skipped = [];
const shortcuts = [];
const fixtureless = [];
const behaviorlessTests = [];
const laterStateFixtures = [];
const precommittedHappyPaths = [];
let inspected = 0;

const STRICT_BEHAVIOR_SETS = new Set(["gd01", "gd03", "gd04"]);
// Sets audited end-to-end for pre-reveal hidden-zone identity reads. Add a set
// only when its full card fixture suite is migrated to the behavior contract.
const SHIELD_IDENTITY_SAFE_SETS = new Set(["gd01", "gd03"]);
// Sets whose individual test cases have been audited to require both a
// deterministic fixture and at least one public player move. This closes the
// loophole where one behavioral test could mask structural siblings in the
// same file.
const PER_TEST_BEHAVIOR_SETS = new Set(["gd01"]);

const PUBLIC_PLAYER_MOVE_METHODS = new Set([
  "chooseFirstPlayer",
  "alterHand",
  "deployUnit",
  "deployBase",
  "assignPilot",
  "playCommand",
  "playCommandAsPilot",
  "activateAbility",
  "enterBattle",
  "declareBlock",
  "useSupport",
  "resolveEffect",
  "discardToHandLimit",
  "passPhase",
  "passBlock",
  "passBattleAction",
  "passActionStep",
  "passTurn",
  "concede",
  // Shared card-test helpers whose implementations are composed exclusively
  // from the public moves above. Imported helpers cannot be followed by this
  // file-local AST walk, so keep this allowlist deliberately small.
  "restUnitsByAttackingDirectly",
  "passTurnThroughPublicMoves",
  "resolveUnitBattle",
]);

const STRICT_SET_FORBIDDEN_TEST_PATTERNS = [
  [/\bengine\.(?:getG|getState|getRuntime)\s*\(/, "reads raw engine state/runtime"],
  [/\bengine\.runtime\b/, "reads the raw runtime"],
  [
    /\b(?:runTestMutation|executeCardEffect|enqueueOwnCardTriggers)\s*\(/,
    "injects or executes effects outside a player move",
  ],
  [
    /\bengine\.(?:fireShieldBurst|resolveCombat|endTurn|destroyUnit|tickFlow)\s*\(/,
    "uses a test-only gameplay shortcut",
  ],
  [
    /\bengine\.(?:setPhase|setStep|setTurn|setActivePlayer)\s*\(/,
    "mutates turn state instead of using a player move",
  ],
  [/\bctx\.zones\.private\b|\bcontinuousEffects\b/, "asserts internal state storage"],
  [
    /\b(?:getEffectiveStats|listLegalAttackTargets)\s*\(/,
    "bypasses the player-facing board or move query",
  ],
  [
    /\b(?:findStatModifier|countStatModifiers|hasKeywordGrant|hasContinuousRestriction|hasPreventDamage|hasPreventDamageToZone|hasForceAttackTarget|hasGrantAttackTargetOption|getContinuousEffects|getDamageCounter|markAsLinkUnit|seedShieldsFromDeck|giveShield|seedBaseAsShield)\s*\(/,
    "uses a raw-state assertion or fixture mutation helper",
  ],
  [/\bengine\.markAsToken\s*\(/, "mutates token state after fixture creation"],
  [/while\s*\([^;\n]*(?:pendingChoice|getPendingChoice)/, "blindly drains player choices"],
  [
    /if\s*\([^)]*(?:choice|prompt|pendingChoice|\.kind)[^)]*\)\s*(?:\{\s*)?return\b/,
    "conditionally skips the rest of a player-choice test",
  ],
  [/\.toHaveProperty\s*\(/, "asserts object shape instead of behavior"],
  [
    /getCardsInZone\(\s*["'](?:deck|resourceDeck)["']\s*\)\s*(?:\[|\.at\s*\()/,
    "reads a hidden deck card by position instead of using a visible reveal prompt",
  ],
  [
    /\b(?:const|let)\s+(?:\[[^\]]*\]|[A-Za-z_$][\w$]*)\s*=\s*[^;\n]*getCardsInZone\(\s*["'](?:deck|resourceDeck)["']\s*\)(?!\s*\.length)/,
    "captures hidden deck identities or order instead of using a visible reveal prompt",
  ],
  [
    /getCardsInZone\(\s*["'](?:deck|resourceDeck)["']\s*\)\s*\)\s*(?:\.not)?\.(?:toEqual|toContain)\s*\(/,
    "asserts hidden deck identities or order instead of a visible deck count",
  ],
  [
    /getCardsInZone\(\s*["']shieldArea["']\s*\)\s*\)\s*(?:\.not)?\.(?:toEqual|toContain)\s*\(/,
    "asserts face-down Shield identities instead of a visible Shield count or revealed outcome",
  ],
];

const SHIELD_IDENTITY_FORBIDDEN_TEST_PATTERNS = [
  [
    /getCardsInZone\(\s*["']shieldArea["']\s*\)\s*(?:\[|\.at\s*\(|\.find\s*\()/,
    "reads a face-down Shield identity by position",
  ],
  [
    /\b(?:const|let)\s+(?:\[[^\]]*\]|[A-Za-z_$][\w$]*)\s*=\s*[^;\n]*getCardsInZone\(\s*["']shieldArea["']\s*\)/,
    "captures face-down Shield identities before a player-visible reveal",
  ],
  [
    /getCardZone\([^\n)]*\)\s*\)\.toBe\([^\n]*(?:shieldArea|shield:)/,
    "asserts a known face-down Shield identity before a legal reveal",
  ],
];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function auditIndividualBehaviorTests(content, testRel) {
  const source = ts.createSourceFile(
    testRel,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const helpers = new Map();
  const tests = [];

  function functionEntry(node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.body) {
      return [node.name.text, node.body];
    }
    if (!ts.isVariableStatement(node)) return undefined;
    for (const declaration of node.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        (ts.isArrowFunction(declaration.initializer) ||
          ts.isFunctionExpression(declaration.initializer))
      ) {
        return [declaration.name.text, declaration.initializer.body];
      }
    }
    return undefined;
  }

  function collect(node) {
    const entry = functionEntry(node);
    if (entry) helpers.set(entry[0], entry[1]);
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === "it" || node.expression.text === "test")
    ) {
      const callback = node.arguments[1];
      if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
        tests.push({
          title: node.arguments[0]?.getText(source) ?? "unknown test",
          body: callback.body,
        });
      }
    }
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "expectSuccess"
    ) {
      const moveCall = node.arguments[0];
      if (
        moveCall &&
        ts.isCallExpression(moveCall) &&
        ts.isPropertyAccessExpression(moveCall.expression)
      ) {
        const moveName = moveCall.expression.name.text;
        const options = moveCall.arguments.find(
          (argument) =>
            ts.isObjectLiteralExpression(argument) &&
            argument.properties.some(
              (property) =>
                ts.isPropertyAssignment(property) && property.name.getText(source) === "targets",
            ),
        );
        if (options && ts.isObjectLiteralExpression(options)) {
          const alternateDeploy =
            moveName === "deployUnit" &&
            options.properties.some(
              (property) =>
                ts.isPropertyAssignment(property) &&
                property.name.getText(source) === "mode" &&
                ts.isStringLiteral(property.initializer) &&
                property.initializer.text === "alternate",
            );
          const activatedCost =
            moveName === "activateAbility" && testRel.includes("023-char-s-gelgoog.test.ts");
          if (
            (moveName === "playCommand" ||
              moveName === "deployBase" ||
              moveName === "deployUnit" ||
              moveName === "activateAbility") &&
            !alternateDeploy &&
            !activatedCost
          ) {
            const { line } = source.getLineAndCharacterOfPosition(moveCall.getStart(source));
            precommittedHappyPaths.push(
              `${testRel}:${line + 1} — ${moveName} precommits effect targets instead of resolving the visible staged choice`,
            );
          }
        }
      }
    }
    ts.forEachChild(node, collect);
  }
  collect(source);

  function auditFixtureCall(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(source) === "GundamTestEngine" &&
      node.expression.name.text === "create"
    ) {
      for (const fixture of node.arguments.slice(0, 2)) {
        function inspectFixtureValue(value) {
          if (ts.isPropertyAssignment(value)) {
            const propertyName = value.name.getText(source);
            const laterState =
              propertyName === "damage" ||
              (propertyName === "exhausted" &&
                value.initializer.kind === ts.SyntaxKind.TrueKeyword);
            if (laterState) {
              const { line } = source.getLineAndCharacterOfPosition(value.getStart(source));
              laterStateFixtures.push(
                `${testRel}:${line + 1} — fixture seeds ${propertyName} instead of reaching it through a public move`,
              );
            }
          }
          ts.forEachChild(value, inspectFixtureValue);
        }
        inspectFixtureValue(fixture);
      }
    }
    ts.forEachChild(node, auditFixtureCall);
  }
  auditFixtureCall(source);

  function analyze(node, seenHelpers = new Set()) {
    let hasFixture = false;
    let hasPlayerMove = false;

    function visit(child) {
      if (ts.isCallExpression(child)) {
        let calledName;
        if (ts.isPropertyAccessExpression(child.expression)) {
          calledName = child.expression.name.text;
          if (
            calledName === "create" &&
            child.expression.expression.getText(source) === "GundamTestEngine"
          ) {
            hasFixture = true;
          }
        } else if (ts.isIdentifier(child.expression)) {
          calledName = child.expression.text;
        }

        if (calledName === "expectUnitCanDeploy") {
          hasFixture = true;
          hasPlayerMove = true;
        }
        if (calledName && PUBLIC_PLAYER_MOVE_METHODS.has(calledName)) {
          hasPlayerMove = true;
        }
        if (calledName && helpers.has(calledName) && !seenHelpers.has(calledName)) {
          const nextSeen = new Set(seenHelpers);
          nextSeen.add(calledName);
          const nested = analyze(helpers.get(calledName), nextSeen);
          hasFixture ||= nested.hasFixture;
          hasPlayerMove ||= nested.hasPlayerMove;
        }
      }
      ts.forEachChild(child, visit);
    }
    visit(node);
    return { hasFixture, hasPlayerMove };
  }

  for (const test of tests) {
    const result = analyze(test.body);
    if (!result.hasFixture || !result.hasPlayerMove) {
      behaviorlessTests.push(
        `${testRel} — ${test.title}: fixture=${result.hasFixture}, publicMove=${result.hasPlayerMove}`,
      );
    }
  }
}

try {
  await stat(CARDS_DIR);
} catch {
  console.error(`❌ card fixtures: cards directory missing at ${CARDS_DIR}`);
  process.exit(1);
}

for await (const abs of walk(CARDS_DIR)) {
  const rel = relative(ROOT, abs);
  if (!rel.endsWith(".ts")) continue;
  if (rel.endsWith(".test.ts")) continue;
  if (rel.endsWith(`${sep}index.ts`)) continue;
  // Skip set-level aggregator files that just re-export.
  // Heuristic: files directly under a set directory (no card-type subdir).
  const segments = rel.split(sep);
  // packages/cards/src/cards/<set>/<type>/<file>.ts has 7 segments incl. .ts
  if (segments.length < 7) continue;

  // Skip cards with no behavioral surface (empty effects + empty keywordEffects),
  // except strict behavior sets: their card-by-card quality gate requires
  // proof for vanilla cards too (play legality, cost, and destination are behavior).
  // These are pure stat/system cards (EX Base, EX Resource, vanilla units).
  // A behavioral test would assert nothing useful.
  const cardSrc = await readFile(abs, "utf8");
  // Detect non-empty arrays: an open `[` followed by an object literal OR a
  // string literal. The latter form covers `keywordEffects: ['Blocker']`,
  // which earlier versions of this script missed.
  const hasEffects = /effects\s*:\s*\[\s*(?:\{|['"`])/.test(cardSrc);
  const hasKeywords = /keywordEffects\s*:\s*\[\s*(?:\{|['"`])/.test(cardSrc);
  const cardSet = segments[4];
  const isStrictSet = STRICT_BEHAVIOR_SETS.has(cardSet);
  if (!isStrictSet && !hasEffects && !hasKeywords) continue;
  if (allowlist.has(rel)) continue;

  inspected++;
  const testPath = abs.replace(/\.ts$/, ".test.ts");
  const testRel = rel.replace(/\.ts$/, ".test.ts");
  try {
    const content = await readFile(testPath, "utf8");
    // Look for any test declaration.
    if (!/\b(it|test)\s*\(\s*['"`]/.test(content)) {
      empty.push(testRel);
    }
    if (isStrictSet && /\b(?:it|test)\.(?:skip|todo)\b/.test(content)) {
      skipped.push(testRel);
    }
    if (
      isStrictSet &&
      /\b[A-Za-z_$][\w$]*\.(?:effects|keywordEffects)(?:(?:\?|!)\.)?/.test(content)
    ) {
      structural.push(testRel);
    }
    if (isStrictSet) {
      if (!/\b(?:GundamTestEngine\.create|expectUnitCanDeploy)\b/.test(content)) {
        fixtureless.push(testRel);
      }
      if (PER_TEST_BEHAVIOR_SETS.has(cardSet)) {
        auditIndividualBehaviorTests(content, testRel);
        if (/\brestedResources\s*\(/.test(content)) {
          shortcuts.push(
            `${testRel} — seeds already-rested resources instead of reaching that state through player moves`,
          );
        }
      }
      for (const [pattern, reason] of STRICT_SET_FORBIDDEN_TEST_PATTERNS) {
        if (pattern.test(content)) shortcuts.push(`${testRel} — ${reason}`);
      }
      if (SHIELD_IDENTITY_SAFE_SETS.has(cardSet)) {
        for (const [pattern, reason] of SHIELD_IDENTITY_FORBIDDEN_TEST_PATTERNS) {
          if (pattern.test(content)) shortcuts.push(`${testRel} — ${reason}`);
        }
      }
    }
  } catch {
    missing.push(rel);
  }
}

if (
  missing.length === 0 &&
  empty.length === 0 &&
  structural.length === 0 &&
  skipped.length === 0 &&
  shortcuts.length === 0 &&
  fixtureless.length === 0 &&
  behaviorlessTests.length === 0 &&
  laterStateFixtures.length === 0 &&
  precommittedHappyPaths.length === 0
) {
  console.log(`✅ card fixtures: ok (${inspected} cards, every one has a non-empty test sibling)`);
  process.exit(0);
}

console.error(`❌ card fixtures: ${missing.length + empty.length} card(s) need fixtures`);
console.error(`   See docs/design-docs/card-fixtures.md for the required pattern.\n`);
if (missing.length) {
  console.error("Cards missing a sibling .test.ts:");
  for (const m of missing.slice(0, 30)) console.error(`  - ${m}`);
  if (missing.length > 30) console.error(`  … and ${missing.length - 30} more`);
  console.error("");
}
if (empty.length) {
  console.error("Cards whose .test.ts has no it()/test() block:");
  for (const m of empty.slice(0, 30)) console.error(`  - ${m}`);
  if (empty.length > 30) console.error(`  … and ${empty.length - 30} more`);
  console.error("");
}
if (skipped.length) {
  console.error("Strict-set card tests with skipped or TODO behavior:");
  for (const m of skipped) console.error(`  - ${m}`);
  console.error("");
}
if (structural.length) {
  console.error("Strict-set card tests inspecting effects[] instead of observable behavior:");
  for (const m of structural) console.error(`  - ${m}`);
  console.error("");
}
if (shortcuts.length) {
  console.error("Strict-set card tests bypassing player-visible behavior:");
  for (const m of shortcuts) console.error(`  - ${m}`);
  console.error("");
}
if (fixtureless.length) {
  console.error("Strict-set card tests without a behavioral game fixture:");
  for (const m of fixtureless) console.error(`  - ${m}`);
  console.error("");
}
if (behaviorlessTests.length) {
  console.error("Audited card tests missing a fixture or public player move:");
  for (const m of behaviorlessTests) console.error(`  - ${m}`);
  console.error("");
}
if (laterStateFixtures.length) {
  console.error("Audited card fixtures that seed later gameplay state:");
  for (const m of laterStateFixtures) console.error(`  - ${m}`);
  console.error("");
}
if (precommittedHappyPaths.length) {
  console.error("Audited happy paths bypassing staged player choices:");
  for (const m of precommittedHappyPaths) console.error(`  - ${m}`);
  console.error("");
}
console.error(
  "Fix: read .agents/skills/gundam-cards/SKILL.md, then add a test exercising every entry in the card's effects[] array.",
);
process.exit(1);
