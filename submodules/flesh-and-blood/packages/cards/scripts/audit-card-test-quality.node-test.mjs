import assert from "node:assert/strict";
import test from "node:test";

import { auditCardTestSource } from "./audit-card-test-quality.mjs";

test("rejects synthetic cards, serialized IR, and direct ability assertions", () => {
  const issues = auditCardTestSource(`
    const fake = defineFleshAndBloodCard({ id: trainerId("fake") });
    expect(JSON.stringify(fake)).toContain("power");
    expect(realCard.abilities?.[0]).toMatchObject({ kind: "static" });
  `);
  assert.deepEqual(
    new Set(issues.map((issue) => issue.code)),
    new Set(["synthetic-card", "serialized-ir", "ability-shape-assertion"]),
  );
});

test("accepts public gameplay assertions", () => {
  assert.deepEqual(
    auditCardTestSource(`
      Bravo.must.playAttack(snatchRed);
      expectCombat(game).toHaveAttackPower(4);
      expectFabCard(Bravo, snatchRed).toBeIn("combatChain");
    `),
    [],
  );
});
