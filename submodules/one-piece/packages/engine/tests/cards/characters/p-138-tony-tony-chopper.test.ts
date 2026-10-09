import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-138 Tony Tony.Chopper", () => {
  test("survives a 5000 attack with opponent-turn power and loses the bonus on its turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-138", rested: true }] },
      { character: [{ cardId: "ST02-002", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const chopper = e.findCardInZone("south", "character", "P-138");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-002"), chopper);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(chopper);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("cannot defeat a 5000 Character on its own turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-138", playedOnTurn: 0 }] },
      { character: [{ cardId: "ST02-002", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    e.asSouth().attack(e.findCardInZone("south", "character", "P-138"), target);
    expect(e.getView("south").players.north.characters[0]?.instanceId).toBe(target);
    expect(e.getView("south").players.north.trash).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
});
