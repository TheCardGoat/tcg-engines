import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

import { auditCardCatalogSync, catalogSyncReport } from "./audit-card-catalog-sync.mjs";

const canonicalIds = {
  red: "head-jab-red-id",
  yellow: "head-jab-yellow-id",
  blue: "head-jab-blue-id",
};

function fixture() {
  const root = path.join(tmpdir(), `fab-catalog-audit-${process.pid}-${Math.random()}`);
  const cardsRoot = path.join(root, "cards");
  mkdirSync(path.join(cardsRoot, "actions"), { recursive: true });
  writeFileSync(
    path.join(cardsRoot, "actions", "head-jab.ts"),
    [
      "export const { red: headJabRed, yellow: headJabYellow, blue: headJabBlue } = family.cards;",
      "export { headJabRed as alternateHeadJabRed };",
      "",
    ].join("\n"),
  );
  const cards = Object.entries(canonicalIds).map(([color, canonicalId]) => ({
    canonicalId,
    slug: `head-jab-${color}`,
    types: ["Ninja", "Action", "Attack"],
    color: color[0].toUpperCase() + color.slice(1),
    pitch: String({ red: 1, yellow: 2, blue: 3 }[color]),
    printings: [{ id: `printing-${color}`, setCode: "WTR", collectorNumber: `00${color.length}` }],
  }));
  const manifest = cards.map((card) => ({
    canonicalId: card.canonicalId,
    exportName: `headJab${card.slug.endsWith("red") ? "Red" : card.slug.endsWith("yellow") ? "Yellow" : "Blue"}`,
    module: "cards/actions/head-jab.ts",
  }));
  const runtimeRegistry = new Map(cards.map((card) => [card.canonicalId, card]));
  const cardsByPrintingId = new Map(
    cards.flatMap((card) => card.printings.map((printing) => [printing.id, card])),
  );
  return {
    root,
    cardsRoot,
    catalog: { cards },
    manifest,
    runtimeRegistry,
    resolvePrinting: (printingId) => cardsByPrintingId.get(printingId),
  };
}

test("passes all layers for one complete RGB family and its printings", () => {
  const input = fixture();
  const result = auditCardCatalogSync(input);
  assert.equal(result.ok, true);
  assert.deepEqual(
    {
      modules: [result.layers.modules.presentUnits, result.layers.modules.expectedUnits],
      exports: [result.layers.exports.availableCards, result.layers.exports.expectedCards],
      printings: [
        result.layers.printings.availablePrintings,
        result.layers.printings.expectedPrintings,
      ],
    },
    { modules: [1, 1], exports: [3, 3], printings: [3, 3] },
  );
});

test("keeps module, export, and printing failures in separate layers", () => {
  const input = fixture();
  input.manifest = input.manifest.filter((entry) => entry.canonicalId !== canonicalIds.yellow);
  input.runtimeRegistry.delete(canonicalIds.yellow);
  const result = auditCardCatalogSync(input);
  assert.equal(result.layers.modules.issues.length, 0);
  assert.equal(
    result.layers.exports.issues.some((issue) => issue.code === "missing-manifest-export"),
    true,
  );
  assert.equal(
    result.layers.printings.issues.some((issue) => issue.code === "printing-without-runtime-card"),
    true,
  );
});

test("recognizes an aliased named export declared by the canonical manifest", () => {
  const input = fixture();
  input.manifest.find((entry) => entry.canonicalId === canonicalIds.red).exportName =
    "alternateHeadJabRed";
  const result = auditCardCatalogSync(input);
  assert.equal(result.layers.exports.issues.length, 0);
});

test("fails printing coverage when the public catalog cannot resolve a printing id", () => {
  const input = fixture();
  input.resolvePrinting = () => undefined;
  const result = auditCardCatalogSync(input);
  assert.equal(
    result.layers.printings.issues.every((issue) => issue.code === "unavailable-printing-id"),
    true,
  );
  assert.equal(result.layers.printings.availablePrintings, 0);
});

test("reports every issue by default and caps only explicit summary output", () => {
  const input = fixture();
  input.catalog.cards[0].printings = Array.from({ length: 25 }, (_, index) => ({
    id: `missing-printing-${index}`,
    setCode: "WTR",
    collectorNumber: String(index),
  }));
  input.resolvePrinting = () => undefined;
  const result = auditCardCatalogSync(input);
  const full = catalogSyncReport(result);
  const compact = catalogSyncReport(result, { summaryOnly: true });
  assert.equal(full.issues.printings.length, 27);
  assert.equal("issueSamples" in full, false);
  assert.equal(compact.issueSamples.printings.length, 20);
  assert.equal("issues" in compact, false);
});
