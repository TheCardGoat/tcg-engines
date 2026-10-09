import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-001 Monkey.D.Luffy", () => {
  test("DON grants only field costs and live seven-to-eight threshold gives Leader power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST14-001",
      character: ["ST09-005"],
      hand: ["ST14-005"],
      trash: ["ST14-005"],
      activeDon: 1,
    });
    e.attachDon(e.leader("south"), 1);
    const v = e.getView("south").players.south;
    expect(v.characters[0]?.cost).toBe(8);
    expect(v.hand[0]?.cost).toBe(4);
    expect(v.trash[0]?.cost).toBe(4);
    expect(v.leader.power).toBe(7000);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(8);
  });
  test("FAQ opponent removal drops continuous Leader power immediately", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST14-001", character: ["ST09-005"], activeDon: 1 },
      { leaderCardId: "OP01-091", hand: ["OP01-094"], activeDon: 8 },
    );
    e.attachDon(e.leader("south"), 1);
    e.endTurn("south");
    e.playCard("OP01-094", "north");
    e.asNorth().acceptOptional();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
  test("without DON no field cost or threshold power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST14-001",
      character: ["ST09-005"],
      activeDon: 4,
      hand: ["ST14-005"],
    });
    e.playCard("ST14-005");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(7);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
