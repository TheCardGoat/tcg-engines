import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { auditCardReleaseAudit, renderReleaseAuditDoc, run } from "./audit-card-release-audit.mjs";

function fixturePackage({ catalogCards, printings, files }) {
  const root = path.join(
    tmpdir(),
    `fab-release-audit-${process.pid}-${Math.random().toString(36).slice(2)}`,
  );
  for (const [relative, contents] of Object.entries(files)) {
    const file = path.join(root, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, contents);
  }
  mkdirSync(path.join(root, "src", "generated"), { recursive: true });
  writeFileSync(
    path.join(root, "src", "generated", "flesh-and-blood-card-data.json"),
    `${JSON.stringify({ cards: catalogCards })}\n`,
  );
  writeFileSync(
    path.join(root, "src", "generated", "flesh-and-blood-printings.json"),
    `${JSON.stringify({ printingsByCanonicalId: printings })}\n`,
  );
  return root;
}

const redVariant = {
  canonicalId: "aaaaaaaa1",
  slug: "test-strike-red",
  name: "Test Strike",
  color: "red",
  pitch: "1",
  types: ["Warrior", "Action", "Attack"],
  typeText: "Warrior Action - Attack",
  functionalTextPlain: "Deal 2 damage.",
};

test("flags ambiguous family names, missing tests, and missing asset URLs", () => {
  const root = fixturePackage({
    catalogCards: [
      redVariant,
      {
        ...redVariant,
        canonicalId: "cccccccc3",
        slug: "test-strike-blue",
        name: "Test Strike Renamed",
        color: "blue",
        pitch: "3",
      },
    ],
    printings: {
      aaaaaaaa1: [
        {
          id: "p1",
          locale: "en-US",
          imageUrl: "https://x/1.webp",
          boardImageUrl: "https://x/1b.webp",
        },
      ],
      cccccccc3: [{ id: "p2", locale: "en-US", imageUrl: "", boardImageUrl: "" }],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const testStrikeI18n = {
  locales: {
    en: { name: "Test Strike", typeText: "Warrior Action - Attack", text: "Deal 2 damage." },
  },
};\n`,
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  assert.equal(report.units.total, 1);
  assert.equal(report.ok, false);
  const codes = report.openUnits[0].issues.map((issue) => issue.code);
  assert.ok(
    codes.includes("name-ambiguous-in-family"),
    "a static family name cannot cover distinct printed names",
  );
  assert.ok(codes.includes("missing-catalog-asset-urls"), "empty printing URLs must surface");
  assert.ok(codes.includes("missing-test-module"), "missing test twin must surface");
});

test("flags per-canonical name drift against the matching catalog card", () => {
  const root = fixturePackage({
    catalogCards: [redVariant],
    printings: {
      aaaaaaaa1: [
        {
          id: "p1",
          locale: "en-US",
          imageUrl: "https://x/1.webp",
          boardImageUrl: "https://x/1b.webp",
        },
      ],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const testStrikeI18n = {
  canonicalId: "aaaaaaaa1",
  locales: {
    en: { name: "Wrong Name", typeText: "Warrior Action - Attack" },
  },
};\n`,
      "src/cards/actions/test-strike.test.ts":
        'import test from "node:test";\ntest("b", () => {});\n',
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  const codes = report.openUnits[0].issues.map((issue) => issue.code);
  assert.ok(codes.includes("name-drift"));
  assert.ok(codes.includes("missing-functional-text"), "catalog text requires authored text");
  assert.ok(!codes.includes("missing-catalog-asset-urls"));
});

test("accepts synced units and honors test exemptions", () => {
  const root = fixturePackage({
    catalogCards: [
      redVariant,
      {
        canonicalId: "bbbbbbbb2",
        slug: "test-aura",
        name: "Test Aura",
        types: ["Token"],
        typeText: "",
        functionalTextPlain: "",
      },
      {
        canonicalId: "dddddddd4",
        slug: "test-macro",
        name: "Test Macro",
        types: ["Macro"],
        typeText: "Macro",
      },
    ],
    printings: {
      aaaaaaaa1: [
        {
          id: "p1",
          locale: "en-US",
          imageUrl: "https://x/1.webp",
          boardImageUrl: "https://x/1b.webp",
        },
      ],
      bbbbbbbb2: [],
      dddddddd4: [],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const testStrikeI18n = {
  locales: {
    en: { name: "Test Strike", typeText: "Warrior Action - Attack", text: "Deal 2 damage." },
  },
};\n`,
      "src/cards/actions/test-strike.test.ts":
        'import test from "node:test";\ntest("behavior", () => {});\n',
      "src/cards/tokens/test-aura.ts": "export const testAura = {};\n",
      "src/cards/tokens/test-aura.i18n.ts": `export const testAuraI18n = {
  locales: { en: { name: "Test Aura", typeText: "" } },
};\n`,
      "src/cards/tokens/test-aura.test.ts":
        'import test from "node:test";\ntest("aura", () => {});\n',
      "src/cards/macros/test-macro.ts": "export const testMacro = {};\n",
      "src/cards/macros/test-macro.i18n.ts": `export const testMacroI18n = {
  locales: { en: { name: "Test Macro", typeText: "Macro" } },
};\n`,
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  assert.equal(
    report.ok,
    true,
    JSON.stringify(report.openUnits.map((unit) => [unit.unit, unit.issues])),
  );
  assert.equal(report.units.total, 3);
  assert.equal(report.units.testExempt, 1, "macro kind is test-exempt");
  const actionUnit = report.unitsAll.find((unit) => unit.unit === "actions/test-strike");
  assert.equal(actionUnit.i18n.nameSync, "sync");
  assert.equal(actionUnit.i18n.typeTextSync, "sync");
  assert.equal(actionUnit.i18n.textPresent, "present");
});

test("per-canonical i18n records each sync against their own catalog card", () => {
  const root = fixturePackage({
    catalogCards: [
      redVariant,
      {
        ...redVariant,
        canonicalId: "cccccccc3",
        slug: "test-strike-blue",
        name: "Test Strike: Blue",
        color: "blue",
        pitch: "3",
      },
    ],
    printings: {
      aaaaaaaa1: [
        {
          id: "p1",
          locale: "en-US",
          imageUrl: "https://x/1.webp",
          boardImageUrl: "https://x/1b.webp",
        },
      ],
      cccccccc3: [
        {
          id: "p2",
          locale: "en-US",
          imageUrl: "https://x/2.webp",
          boardImageUrl: "https://x/2b.webp",
        },
      ],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const redI18n = {
  canonicalId: "aaaaaaaa1",
  locales: { en: { name: "Test Strike", typeText: "Warrior Action - Attack", text: "Deal 2 damage." } },
};
export const blueI18n = {
  canonicalId: "cccccccc3",
  locales: { en: { name: "Test Strike: Blue", typeText: "Warrior Action - Attack", text: "Deal 2 damage." } },
};\n`,
      "src/cards/actions/test-strike.test.ts":
        'import test from "node:test";\ntest("b", () => {});\n',
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  assert.equal(
    report.ok,
    true,
    JSON.stringify(report.openUnits.map((unit) => [unit.unit, unit.issues])),
  );
});

test("strict exits 0 when the only issue family is catalog missing asset URLs", async () => {
  const root = fixturePackage({
    catalogCards: [redVariant],
    printings: {
      aaaaaaaa1: [{ id: "p1", locale: "en-US", imageUrl: "", boardImageUrl: "" }],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const testStrikeI18n = {
  locales: {
    en: { name: "Test Strike", typeText: "Warrior Action - Attack", text: "Deal 2 damage." },
  },
};\n`,
      "src/cards/actions/test-strike.test.ts":
        'import test from "node:test";\ntest("behavior", () => {});\n',
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  assert.equal(report.ok, false, "full ok still fails while catalog art is missing");
  assert.equal(report.authoredSideOk, true);
  assert.deepEqual(Object.keys(report.issuesByDimension), ["assets"]);
  const code = await run(["--package-root", root, "--strict"]);
  assert.equal(code, 0);
});

test("strict still exits 1 on authored-side gaps", async () => {
  const root = fixturePackage({
    catalogCards: [redVariant],
    printings: {
      aaaaaaaa1: [
        {
          id: "p1",
          locale: "en-US",
          imageUrl: "https://x/1.webp",
          boardImageUrl: "https://x/1b.webp",
        },
      ],
    },
    files: {
      "src/cards/actions/test-strike.ts": "export const testStrike = {};\n",
      "src/cards/actions/test-strike.i18n.ts": `export const testStrikeI18n = {
  locales: {
    en: { name: "Test Strike", typeText: "Warrior Action - Attack", text: "Deal 2 damage." },
  },
};\n`,
    },
  });

  const report = auditCardReleaseAudit({ packageRoot: root });
  assert.equal(report.authoredSideOk, false);
  const code = await run(["--package-root", root, "--strict"]);
  assert.equal(code, 1);
});

test("renderReleaseAuditDoc derives audited marks only from release evidence", () => {
  const report = auditCardReleaseAudit({
    packageRoot: fixturePackage({
      catalogCards: [],
      printings: {},
      files: { "src/cards/tokens/keeper.ts": "export const keeper = {};\n" },
    }),
  });
  const generated = renderReleaseAuditDoc(report, {
    evidence: {
      version: 1,
      units: {
        "tokens/keeper": {
          definitionSha256: "0".repeat(64),
          i18nSha256: "1".repeat(64),
          testSha256: null,
          coveredCanonicalIds: [],
          reviewedAt: "2026-08-30",
          reviewedBy: "test",
        },
      },
    },
    generatedAt: "2026-08-30",
  });
  assert.match(generated, /\| \[x\] \| `tokens\/keeper` \|/);
  assert.match(generated, /Generated: `2026-08-30`/);
});
