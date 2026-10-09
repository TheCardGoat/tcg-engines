import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-015 Great Eruption", () => {
  test("draws before choosing a cost reduction and it expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST06-015"], deck: ["ST02-002", "ST02-006"], activeDon: 1 },
      { character: ["ST02-006"] },
    );
    e.playCard("ST06-015", "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST02-002");
    const id = e.findCardInZone("north", "character", "ST02-006");
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === id)?.cost,
    ).toBe(2);
    e.endTurn("south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === id)?.cost,
    ).toBe(4);
  });
  test("Trigger makes the opponent choose its own discarded card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }], hand: ["ST02-002", "ST02-006"] },
      { life: ["ST06-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "hand", "ST02-002");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("Trigger with an empty opponent hand resolves without a choice", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST06-015"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
