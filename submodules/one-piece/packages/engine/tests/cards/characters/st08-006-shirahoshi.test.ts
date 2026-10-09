import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-006 Shirahoshi", () => {
  test("On Play reduces opposing cost and expires at turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-006"], activeDon: 4 },
      { character: ["ST08-010"] },
    );
    e.playCard("ST08-006");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST08-010"));
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5 - 4);
    e.endTurn("south");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5);
  });
  test("On Play may choose no reduction target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-006"], activeDon: 4 },
      { character: ["ST08-010"] },
    );
    e.playCard("ST08-006");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST08-006");
  });

  test("Blocker redirects a Leader attack to Shirahoshi", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST08-006"] },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "ST08-006");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST08-010"), e.leader("south"));
    e.asSouth().chooseBlocker(id);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
});
