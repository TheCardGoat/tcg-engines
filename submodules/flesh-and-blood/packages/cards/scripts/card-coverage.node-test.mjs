import assert from "node:assert/strict";
import test from "node:test";

import { normalizeGapMembers } from "./card-coverage.ts";

const family = {
  family: "engine/example",
  kind: "engine-primitive",
  primitive: null,
  status: "resolved",
  repro: "legacy repro",
  resolvedBy: "focused test",
};

const row = {
  canonicalId: "canonical-1",
  set: "TST",
  typeDir: "actions",
  collectorNumber: "TST001",
  slug: "exact-card-red",
  path: "actions/exact-card.ts",
  tested: true,
  signature: ["a:resolution:draw"],
  cluster: "actions|a:resolution:draw",
};

function registry(member) {
  return { version: 2, families: [{ ...family, members: [member] }] };
}

const legacyMember = {
  set: "OLD",
  typeDir: "action",
  collectorNumber: "TST001",
  slug: "exact-card-red",
  cluster: "legacy",
  reason: "legacy reason",
  triedAt: "2026-08-30T00:00:00.000Z",
};

test("resolves a missing canonicalId only from one exact slug and collector match", () => {
  const normalized = normalizeGapMembers(registry({ ...legacyMember, canonicalId: null }), [row]);
  assert.deepEqual(normalized.families[0].members[0], {
    ...legacyMember,
    canonicalId: "canonical-1",
    set: "TST",
    typeDir: "actions",
    cluster: "actions|a:resolution:draw",
  });
});

test("rejects ambiguous exact matches before returning normalized output", () => {
  assert.throws(
    () =>
      normalizeGapMembers(registry(legacyMember), [row, { ...row, canonicalId: "canonical-2" }]),
    /cannot resolve exact-card-red \(TST001\) to exactly one canonicalId; found 2/,
  );
});

test("does not fall back to a slug-only match", () => {
  assert.throws(
    () => normalizeGapMembers(registry({ ...legacyMember, collectorNumber: "TST999" }), [row]),
    /cannot resolve exact-card-red \(TST999\) to exactly one canonicalId; found 0/,
  );
});
