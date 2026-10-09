import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-101", () => {
  test("pays the top Life card to reduce a Character's power for this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-101"], life: ["ST02-002", "ST02-006"] },
      { character: ["EB01-018"] },
    );
    e.asSouth().activateMain("OP17-101");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "EB01-018")] },
      "south",
    );
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
    const failed = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "OP17-101"),
      trigger: "activateMain",
    });
    expect(failed.reason).toBe("This effect has already been used this turn.");
    expect(
      OnePieceTestEngine.fromState(failed.state).getView("south").players.south.lifeCount,
    ).toBe(1);
    e.endTurn("south");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(7000);
  });

  test("declines optional Life payment with Life available", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-101"], life: ["ST02-002", "ST02-006"] },
      { character: ["EB01-018"] },
    );
    const top = e.findCardInZone("south", "life", "ST02-002");
    e.asSouth().activateMain("OP17-101");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getState().players.south.life[0]).toBe(top);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(7000);
  });
  test.each([true, false])(
    "Life Trigger optional discard payment and cost5 KO boundary: pay=%s",
    (pay) => {
      const e = OnePieceTestEngine.create(
        { life: ["OP17-101", "ST02-002"], hand: ["OP17-005"] },
        { character: ["OP17-101", "OP17-008"] },
        { activeSeat: "north" },
      );
      const payment = e.findCardInZone("south", "hand", "OP17-005"),
        target = e.findCardInZone("north", "character", "OP17-101");
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
      e.resolveDecision("effectOptional", { optionId: pay ? "yes" : "no" }, "south");
      if (pay) {
        const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
        if (step.kind !== "selectEntity") throw new Error("Expected KO");
        expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
        e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      }
      expect(
        e
          .getView("south")
          .players.north.trash.map((c) => c.instanceId)
          .includes(target),
      ).toBe(pay);
      expect(
        e
          .getView("south")
          .players.south.trash.map((c) => c.instanceId)
          .includes(payment),
      ).toBe(pay);
      expect(
        e
          .getView("south")
          .players.south.hand.map((c) => c.instanceId)
          .includes(payment),
      ).toBe(!pay);
    },
  );
});
