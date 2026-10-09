import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST16-001 Uta", () => {
  test.each(["leader", "character"])(
    "FILM payment gives rested DON to %s and spends once-per-turn",
    (recipient) => {
      const e = OnePieceTestEngine.create({
        character: ["ST16-001"],
        hand: ["ST11-003", "ST11-004", "ST12-009"],
        restedDon: 2,
      });
      const id = e.findCardInZone("south", "character", "ST16-001"),
        paid = e.findCardInZone("south", "hand", "ST11-003");
      e.activateEffect(id, "activateMain");
      e.asSouth().acceptOptional();
      const cost = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
      if (cost?.kind !== "payCost") throw Error("FILM cost");
      expect(cost.candidates.map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("south", "hand", "ST12-009"),
      );
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      e.asSouth().chooseTargets(recipient === "leader" ? e.leader("south") : id);
      expect(
        recipient === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
        "ST11-004",
        "ST12-009",
      ]);
      expect(
        e.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: id,
          trigger: "activateMain",
        }).reason,
      ).toBe("This effect has already been used this turn.");
    },
  );
  test("declines optional FILM discard and preserves DON", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST16-001"],
      hand: ["ST11-003"],
      restedDon: 1,
    });
    e.activateEffect(e.findCardInZone("south", "character", "ST16-001"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
  test("Blocker saves Leader against equal-power attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST16-001"], life: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST16-001"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST16-001");
  });
});
