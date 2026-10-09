import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-008-marco", () => {
  test("Blocker dies and exact6000 hand payment replays same physical Marco rested", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST30-008"], hand: ["ST30-005", "ST30-013", "ST21-006"] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const m = e.findCardInZone("south", "character", "ST30-008");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), e.leader("south"));
    e.asSouth().chooseBlocker(m);
    e.asSouth().chooseCounter();
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST30-005")] },
      "south",
    );
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(m);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.lifeCount).toBe(4);
  });
  test("declines optional revival payment after battle KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST30-008", rested: true }], hand: ["ST30-005"] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST15-002"),
      e.findCardInZone("south", "character", "ST30-008"),
    );
    e.asSouth().chooseCounter();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
});
