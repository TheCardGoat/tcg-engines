import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-017 Queen Mama Chanter", () => {
  test("pays rest and bottom Life before adding an exact-cost3 field Character face up", () => {
    const e = OnePieceTestEngine.create({
      stage: "ST07-017",
      character: ["ST07-014", "ST07-006", "ST07-012"],
      hand: ["ST07-009"],
      life: ["ST07-002", "ST07-008"],
    });
    const paid = e.findCardInZone("south", "life", "ST07-008");
    const target = e.findCardInZone("south", "character", "ST07-014");
    e.asSouth().activateMain(e.findCardInZone("south", "stage", "ST07-017"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("field cost3");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: target,
      cardId: "ST07-014",
      hidden: false,
    });
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
  test("may choose zero Characters after paying both costs", () => {
    const e = OnePieceTestEngine.create({ stage: "ST07-017", character: ["ST07-014"], life: 2 });
    e.asSouth().activateMain(e.findCardInZone("south", "stage", "ST07-017"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test("declines costs without resting or changing Life", () => {
    const e = OnePieceTestEngine.create({ stage: "ST07-017", character: ["ST07-014"], life: 2 });
    e.asSouth().activateMain(e.findCardInZone("south", "stage", "ST07-017"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
  });
});
