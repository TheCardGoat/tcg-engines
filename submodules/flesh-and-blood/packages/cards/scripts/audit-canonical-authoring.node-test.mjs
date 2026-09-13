import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";

import { auditCanonicalAuthoring, parseArguments } from "./audit-canonical-authoring.mjs";

const temporaryRoots = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(files) {
  const root = mkdtempSync(path.join(tmpdir(), "fab-canonical-authoring-audit-"));
  temporaryRoots.push(root);
  for (const [relative, contents] of Object.entries(files)) {
    const file = path.join(root, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, contents);
  }
  return root;
}

test("rejects forbidden source authoring", () => {
  const root = fixture({
    "src/cards/actions/legacy.ts": `
      import { definePitchPrinting } from "../shared/pitch-cycle.ts";
      export const legacyRed = definePitchPrinting({
        canonicalId: "legacy-id",
        slug: "legacy-red",
        set: "TST",
        collectorNumber: "TST001",
        color: "Red",
        types: ["Action"],
        abilities: [{ id: "TST001-a1", kind: "resolution", text: "Draw a card.", effect: { type: "draw", amount: 1 } }],
      });
    `,
    "src/cards/equipment/direct.ts": `
      import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";
      export const direct = defineFleshAndBloodCard({
        canonicalId: "direct-id",
        slug: "direct",
        types: ["Equipment"],
        abilities: [{ id: "TST002-a1", kind: "activated", text: "Destroy this.", effect: { type: "destroy" } }],
      });
    `,
    "src/cards/actions/faced.ts": `
      export const faced = { layout: { kind: "split", faces: [{ faceId: "front", text: "Face display text." }] } };
    `,
    "src/cards/actions/nested.ts": `
      export const nested = { effect: { type: "grant-property", property: { kind: "ability", ability: { id: "", kind: "resolution", text: "", effect: { type: "draw", count: 1 } } } } };
    `,
    "src/cards/shared/pitch-cycle.ts": `
      export function definePitchPrinting(value) { return value; }
    `,
    "src/cards/WTR/actions/WTR001-old.ts": "export const old = true;",
    "scripts/migrate-canonical-card-layout.mjs": "export {};",
  });

  const report = auditCanonicalAuthoring({ packageRoot: root });

  assert.equal(report.ok, false);
  assert.equal(report.counts.definePitchPrinting, 1);
  assert.equal(report.counts.directDefineFleshAndBloodCard, 1);
  assert.equal(report.counts.executablePrintingMetadata, 2);
  assert.equal(report.counts.nonemptyAbilityText, 3);
  assert.equal(report.counts.collectorDerivedAbilityIds, 2);
  assert.equal(report.counts.blankNestedAbilityIds, 1);
  assert.equal(report.counts.positionalAbilityCollections, 2);
  assert.equal(report.counts.placeholderSemanticKeys, 0);
  assert.equal(report.counts.legacyCardPaths, 1);
  assert.equal(report.counts.legacyFactoryDefinitions, 1);
  assert.equal(report.counts.legacyArtifacts, 2);
});

test("clean canonical source produces a zero-debt report", () => {
  const root = fixture({
    "src/cards/actions/clean.ts": `
      import { definePitchFamily } from "../../authoring/pitch-family.ts";
      export const clean = definePitchFamily(identity, {
        abilities: () => ({ drawOnHit: { type: "draw", amount: 1 } }),
      });
    `,
  });

  const report = auditCanonicalAuthoring({ packageRoot: root });

  assert.equal(report.ok, true);
  assert.equal(report.totalIssues, 0);
  assert.deepEqual(
    Object.values(report.counts),
    Object.values(report.counts).map(() => 0),
  );
});

test("reports positional family abilities and placeholder semantic keys", () => {
  const root = fixture({
    "src/cards/actions/positional.ts": `
      import { definePitchFamily } from "../../authoring/pitch-family.ts";
      export const positional = definePitchFamily(identity, {
        abilities: () => ({
          main: [{ type: "draw", count: 1 }],
          ability1: { kind: "modal", text: "", id: "", modal: { choose: 1 }, modes: [] },
          resolutionThisKeyIsAnIntentionallyLongAbstractSyntaxTreeDumpForAuditCoverage: { type: "draw", count: 1 },
          crush: crushAbility({ id: "", text: "", effect: { type: "draw", count: 1 } }),
        }),
      });
    `,
  });

  const report = auditCanonicalAuthoring({ packageRoot: root });

  assert.equal(report.counts.positionalAbilityCollections, 2);
  assert.equal(report.counts.placeholderSemanticKeys, 2);
  assert.equal(report.counts.astDumpSemanticKeys, 1);
  assert.equal(report.counts.redundantAbilityAuthoringFields, 4);
});

test("rejects localization overrides outside the typed family helper", () => {
  const root = fixture({
    "src/cards/actions/untyped.i18n.ts": `
      const abilities = { draw: { text: "Shorthand." } };
      const shared = { locales: {} };
      export const untyped = {
        locales: { en: { name: "Untyped", typeText: "Action", abilities: { draw: { text: "Draw." } } } },
      };
      export const shorthand = { abilities };
      export const spread = { ...shared };
    `,
    "src/cards/actions/typed.i18n.ts": `
      import { defineFamilyI18n as localize } from "../../authoring/family-i18n.ts";
      export const typed = localize(family, {
        en: { name: "Typed", typeText: "Action", abilities: { draw: { text: "Draw." } } },
      });
      export const bypass = { abilities: { draw: { text: "Bypass." } } };
    `,
  });

  const report = auditCanonicalAuthoring({ packageRoot: root });

  assert.equal(report.counts.untypedLocalizationOverrides, 4);
  assert.deepEqual(
    report.issues.untypedLocalizationOverrides.items.map(({ file }) => file).sort(),
    [
      "src/cards/actions/typed.i18n.ts",
      "src/cards/actions/untyped.i18n.ts",
      "src/cards/actions/untyped.i18n.ts",
      "src/cards/actions/untyped.i18n.ts",
    ],
  );
});

test("rejects aliased factories and printing-only properties", () => {
  const root = fixture({
    "src/cards/actions/aliased.ts": `
      import * as fab from "@tcg/flesh-and-blood-types";
      import { defineFleshAndBloodCard as construct } from "@tcg/flesh-and-blood-types";
      export const one = construct({ canonicalId: "one", slug: "one", types: ["Action"], rarity: "M" });
      export const two = fab.defineFleshAndBloodCardUnchecked({ canonicalId: "two", slug: "two", types: ["Action"], artist: "Artist" });
    `,
  });

  const report = auditCanonicalAuthoring({ packageRoot: root });

  assert.equal(report.counts.directDefineFleshAndBloodCard, 2);
  assert.equal(report.counts.executablePrintingMetadata, 2);
});

test("strict and package-root arguments are explicit", () => {
  const parsed = parseArguments(["--strict", "--package-root", "./fixture"]);
  assert.equal(parsed.strict, true);
  assert.equal(parsed.packageRoot, path.resolve("./fixture"));
});
