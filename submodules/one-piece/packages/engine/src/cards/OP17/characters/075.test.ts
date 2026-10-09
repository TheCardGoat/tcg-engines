import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-075 X.Drake", () => {
  test("pays two DON and lets its controller choose an unseen opposing hand card", () => {
    let e = OnePieceTestEngine.create(
      { hand: ["OP17-075"], activeDon: 2 },
      { hand: ["ST02-002", "EB01-005"] },
    );
    const discarded = e.findCardInZone("north", "hand", "EB01-005");
    const before = e.getView("south").players.south.donDeckCount;
    e.playCard("OP17-075");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected private opposing hand selection");
    expect(step.candidates).toHaveLength(2);
    expect(step.candidates.every((c) => !c.publicInfo?.cardId)).toBe(true);
    const selected = step.candidates[1]!.ref.id;
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selected] }, "south");
    expect(e.getView("south").players.south.donDeckCount).toBe(before + 2);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual([discarded]);
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declining a payable DON return preserves the opposing hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-075"], activeDon: 2 },
      { hand: ["ST02-002"] },
    );
    e.playCard("OP17-075");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
