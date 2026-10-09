import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-011 Franky", () => {
  test("opponent-turn aura uses base power despite Sanji's lasting power increase", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "ST21-011", attachedDon: 2 },
          { cardId: "ST12-011", attachedDon: 1, playedOnTurn: 0 },
          "ST21-008",
          "ST12-003",
        ],
      },
      {},
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-011"), e.leader("north"));
    expect(e.getView("south").players.south.characters[1]?.power).toBe(6000);
    e.asSouth().endTurn();
    const cs = e.getView("south").players.south.characters;
    expect(cs[0]?.power).toBe(5000);
    expect(cs[1]?.power).toBe(6000);
    expect(cs[2]?.power).toBe(6000);
    expect(cs[3]?.power).toBe(4000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[1]?.power).toBe(3000);
  });
  test("one attached DON leaves matching low-base Characters unchanged", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-011", attachedDon: 1 }, "ST21-005"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    expect(e.getView("south").players.south.characters[1]?.power).toBe(4000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("a reduced 6000-base-power Straw Hat stays outside the aura", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-011", attachedDon: 2 }, "ST21-008"] },
      { hand: ["ST21-017"], activeDon: 4 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST21-017", "north");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST21-008"));
    expect(e.getView("south").players.south.characters[1]?.power).toBe(1000);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[1]?.power).toBe(6000);
  });
});
