import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-105", () => {
  test("pays a Trigger card then bounces only an opposing Trigger Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-105", "OP17-107"], activeDon: 5 },
      { character: ["OP17-107", "EB01-005"] },
    );
    const payment = e.findCardInZone("south", "hand", "OP17-107");
    const target = e.findCardInZone("north", "character", "OP17-107");
    e.asSouth().play("OP17-105");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([payment]);
    expect(e.getView("south").players.south.handCount).toBe(0);
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected bounce");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(target);
  });

  test("declines optional Trigger-card payment with an eligible opposing target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-105", "OP17-107"], activeDon: 5 },
      { character: ["OP17-107"] },
    );
    const hand = e.findCardInZone("south", "hand", "OP17-107"),
      target = e.findCardInZone("north", "character", "OP17-107");
    e.playCard("OP17-105");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([hand]);
    expect(e.getView("south").players.north.characters[0]?.instanceId).toBe(target);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("cannot pay with a hand card without Trigger", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-105", "EB01-005"], activeDon: 5 },
      { character: ["OP17-107"] },
    );
    e.playCard("OP17-105");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["EB01-005"]);
    expect(e.getView("south").players.north.characters[0]?.cardId).toBe("OP17-107");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
