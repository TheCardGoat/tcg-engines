import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST32-004 silvers-rayleigh", () => {
  test.each(["OP01-002", "ST01-001"])("Rush Character with Leader %s", (leader) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, hand: ["ST32-004"], activeDon: 4 },
      { character: [{ cardId: "ST02-002", rested: true }], hand: ["EB01-005"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST32-004");
    const c = e.findCardInZone("south", "character", "ST32-004"),
      target = e.findCardInZone("north", "character", "ST02-002");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: c,
        targetId: e.leader("north"),
      }).accepted,
    ).toBe(false);
    if (leader === "ST01-001")
      expect(
        e.expectFailure({ type: "declareAttack", seat: "south", attackerId: c, targetId: target })
          .accepted,
      ).toBe(false);
    else {
      e.asSouth().attack(c, target);
      expect(e.getView("south").battle?.targetId).toBe(target);
    }
  });
  test.each([0, 1, 2])("rests up to the printed count, selecting %i", (amount) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-002", hand: ["ST32-004"], activeDon: 4 },
      { character: ["ST02-012", "ST01-011", "ST02-002"] },
    );
    const ids = [
      e.findCardInZone("north", "character", "ST02-012"),
      e.findCardInZone("north", "character", "ST01-011"),
    ];
    e.asSouth().play("ST32-004");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("targets");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(ids);
    e.asSouth().chooseTargets(...ids.slice(0, amount));
    expect(e.getView("north").players.north.characters.filter((c) => c?.rested)).toHaveLength(
      amount,
    );
  });
});
