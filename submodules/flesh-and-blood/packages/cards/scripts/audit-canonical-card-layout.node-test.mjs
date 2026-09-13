import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  auditCanonicalCardLayout,
  auditReviewedPhysicalLayouts,
} from "./audit-canonical-card-layout.mjs";

test("accepts canonical type-owned card directories", () => {
  const root = path.join(tmpdir(), `fab-canonical-layout-${process.pid}`);
  mkdirSync(path.join(root, "cards/actions"), { recursive: true });
  writeFileSync(path.join(root, "cards/actions/snatch.ts"), "export const snatch = {};\n");
  assert.deepEqual(auditCanonicalCardLayout({ sourceRoot: root }), {
    setDirectories: [],
    collectorImports: [],
    familiesDirectory: false,
    scaffolds: [],
  });
});

test("rejects invalid reviewed physical layouts", () => {
  const cards = new Map([
    ["front", { canonicalId: "front", layout: { kind: "single" } }],
    ["back", { canonicalId: "back", layout: { kind: "single" } }],
  ]);
  assert.deepEqual(
    auditReviewedPhysicalLayouts({
      specs: [
        { kind: "flip", family: "construct", frontCanonicalId: "front", backCanonicalId: "back" },
      ],
      catalogCards: [...cards.values()],
      authoredCards: cards,
      physicalCards: cards,
    }),
    {
      missingCatalogIds: [],
      missingAuthoredIds: [],
      identicalFaceIds: [],
      mismatchedPhysicalKinds: [{ frontCanonicalId: "front", expected: "flip", actual: "single" }],
    },
  );
});
