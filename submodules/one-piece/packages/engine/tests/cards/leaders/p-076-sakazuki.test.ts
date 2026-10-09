import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-076-sakazuki", () => {
  test("exact Navy hand payment reduces opposing cost once and expires", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-076", hand: ["ST06-008", "ST06-014", "ST02-002"] },
      { leaderCardId: "ST01-001", character: ["ST02-002"] },
    );
    const id = e.leader("south"),
      pay = e.findCardInZone("south", "hand", "ST06-008"),
      target = e.findCardInZone("north", "character", "ST02-002");
    e.asSouth().activateMain(id);
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("cost");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      pay,
      e.findCardInZone("south", "hand", "ST06-014"),
    ]);
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [pay] }, "south");
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(pay);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
  });
  test("decline preserves hand and allows a later paid zero target", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-076", hand: ["ST06-008"] },
      { character: ["ST02-002"] },
    );
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
  });
});
