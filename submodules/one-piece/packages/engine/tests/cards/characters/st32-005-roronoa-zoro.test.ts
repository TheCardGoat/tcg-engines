import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST32-005 roronoa-zoro", () => {
  test.each(["OP01-002", "ST01-001"])("Rush Character with Leader %s", (leader) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, hand: ["ST32-005"], activeDon: 1 },
      { character: [{ cardId: "ST02-002", rested: true }], hand: ["EB01-005"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST32-005");
    const c = e.findCardInZone("south", "character", "ST32-005"),
      target = e.findCardInZone("north", "character", "ST02-002");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: c,
        targetId: e.leader("north"),
      }).accepted,
    ).toBe(false);
    {
      e.asSouth().attack(c, target);
      expect(e.getView("south").battle?.targetId).toBe(target);
    }
  });
  test.each([0, 1])("rests up to the printed count, selecting %i", (amount) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-002", hand: ["ST32-005"], activeDon: 1 },
      { character: ["ST02-012", "ST01-011", "ST02-002"] },
    );
    const ids = [
      e.findCardInZone("north", "character", "ST02-012"),
      e.findCardInZone("north", "character", "ST01-011"),
    ];
    e.asSouth().play("ST32-005");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("targets");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(ids);
    e.asSouth().chooseTargets(...ids.slice(0, amount));
    expect(e.getView("north").players.north.characters.filter((c) => c?.rested)).toHaveLength(
      amount,
    );
  });
  test("Rush does not bypass the first-turn attack ban", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["ST32-005"], activeDon: 1 },
      { character: [{ cardId: "ST02-002", rested: true }] },
      { firstPlayer: "south", activeSeat: "south", turnNumber: 1 },
    );
    e.asSouth().play("ST32-005");
    const zoro = e.findCardInZone("south", "character", "ST32-005"),
      target = e.findCardInZone("north", "character", "ST02-002");
    expect(
      e.expectFailure({ type: "declareAttack", seat: "south", attackerId: zoro, targetId: target })
        .accepted,
    ).toBe(false);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
  test("non-Slash Leader does not rest an opposing Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["ST32-005"], activeDon: 1 },
      { character: ["ST02-012"] },
    );
    e.asSouth().play("ST32-005");
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
