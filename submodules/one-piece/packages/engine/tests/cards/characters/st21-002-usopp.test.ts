import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-002 Usopp", () => {
  test.each([1, 2])("opponent battle defense uses DON threshold %s", (don) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-002", rested: true, attachedDon: don }] },
      { character: [{ cardId: "ST21-005", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST21-002");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(don === 2 ? 5000 : 3000);
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-005"), id);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === id)).toBe(
      don === 2,
    );
    expect(e.getView("south").players.south.trash.length).toBe(don === 2 ? 0 : 1);
  });
  test("own turn gets attached DON power but no opponent-turn bonus", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-002", attachedDon: 2, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-002"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
