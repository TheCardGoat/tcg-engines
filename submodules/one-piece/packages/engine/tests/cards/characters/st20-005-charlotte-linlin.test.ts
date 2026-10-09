import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST20-005 Linlin", () => {
  test("opponent owns branch and exact two hand discards after snapshot resume", () => {
    let e = OnePieceTestEngine.create(
      { hand: ["ST20-005", "ST02-002"], activeDon: 6 },
      { hand: ["ST02-002", "ST02-006", "ST02-012"], life: 2 },
    );
    const a = e.findCardInZone("north", "hand", "ST02-002"),
      b = e.findCardInZone("north", "hand", "ST02-012");
    e.asSouth().play("ST20-005");
    e.asSouth().acceptOptional();
    expect(e.pendingDecision("effectActionChoice", "north").actorId).toBe("north");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [a, b] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual([a, b]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
  test.each([0, 2])("opponent may choose Life trash with %s Life", (life) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST20-005", "ST02-002"], activeDon: 6 },
      { life, hand: ["ST02-006", "ST02-012"] },
    );
    e.asSouth().play("ST20-005");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(Math.max(0, life - 1));
    expect(e.getView("north").players.north.handCount).toBe(2);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional discard without opponent choice", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST20-005", "ST02-002"], activeDon: 6 },
      { life: 2, hand: 3 },
    );
    e.asSouth().play("ST20-005");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(3);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
