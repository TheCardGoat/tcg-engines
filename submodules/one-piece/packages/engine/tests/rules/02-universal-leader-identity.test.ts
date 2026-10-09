import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";
import { matchesTargetFilter } from "../../src/effects/targeting.ts";
import { evaluateConditions } from "../../src/effects/conditions.ts";

// Focused matcher contract complements the real-card public action proofs.
test("event Leader has every rules identity, with exclusions applied after matching", () => {
  const e = OnePieceTestEngine.create({ leaderCardId: "EVENT-LEADER-MONKEY-D-LUFFY" }, {});
  const state = e.getState();
  const id = e.leader("south");
  expect(matchesTargetFilter(state, id, id, { filter: "name", value: "Merry Go" }).matches).toBe(
    true,
  );
  expect(
    matchesTargetFilter(state, id, id, { filter: "excludeName", value: "Merry Go" }).matches,
  ).toBe(false);
  expect(
    matchesTargetFilter(state, id, id, { filter: "trait", value: "Navy", match: "exact" }).matches,
  ).toBe(true);
  expect(
    matchesTargetFilter(state, id, id, {
      filter: "trait",
      value: "Whitebeard",
      match: "includes",
      negate: true,
    }).matches,
  ).toBe(false);
  for (const attribute of ["strike", "slash", "ranged", "wisdom", "special", "?"] as const) {
    expect(
      matchesTargetFilter(state, id, id, { filter: "attribute", value: attribute }).matches,
    ).toBe(true);
    expect(
      matchesTargetFilter(state, id, id, { filter: "attribute", value: attribute, negate: true })
        .matches,
    ).toBe(false);
    expect(
      evaluateConditions(state, "south", id, [{ condition: "leaderAttribute", attribute }]).matches,
    ).toBe(true);
  }
  expect(
    evaluateConditions(state, "south", id, [
      { condition: "leaderName", name: "Edward", match: "includes" },
      { condition: "leaderTrait", trait: "Navy", match: "exact" },
    ]).matches,
  ).toBe(true);
});

test("ordinary Leader identity does not acquire universal matches", () => {
  const e = OnePieceTestEngine.create({ leaderCardId: "ST01-001" }, {});
  const state = e.getState();
  const id = e.leader("south");
  expect(matchesTargetFilter(state, id, id, { filter: "name", value: "Merry Go" }).matches).toBe(
    false,
  );
  expect(
    matchesTargetFilter(state, id, id, { filter: "excludeName", value: "Merry Go" }).matches,
  ).toBe(true);
  expect(
    matchesTargetFilter(state, id, id, { filter: "trait", value: "Navy", match: "exact" }).matches,
  ).toBe(false);
  expect(
    matchesTargetFilter(state, id, id, { filter: "attribute", value: "slash", negate: true })
      .matches,
  ).toBe(true);
});

test("universal names share an identity instead of adding a distinct-name slot", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "EVENT-LEADER-MONKEY-D-LUFFY" },
    { leaderCardId: "OP01-001" },
  );
  expect(
    evaluateConditions(e.getState(), "south", e.leader("south"), [
      {
        condition: "zoneCount",
        player: "any",
        zone: "leader",
        distinctNames: true,
        comparison: "eq",
        value: 1,
      },
    ]).matches,
  ).toBe(true);
  const ordinary = OnePieceTestEngine.create(
    { leaderCardId: "ST01-001" },
    { leaderCardId: "OP01-001" },
  );
  expect(
    evaluateConditions(ordinary.getState(), "south", ordinary.leader("south"), [
      {
        condition: "zoneCount",
        player: "any",
        zone: "leader",
        distinctNames: true,
        comparison: "eq",
        value: 2,
      },
    ]).matches,
  ).toBe(true);
});
