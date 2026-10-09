import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-014 X.Drake", () => {
  test("buffs each matching type once only while rested on its controller's turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        character: [
          { cardId: "ST02-014", attachedDon: 1, playedOnTurn: 0 },
          "ST02-006",
          "ST02-011",
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-014");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.declareAttack(id, e.leader("north"), "south");
    let p = e.getView("south").players.south;
    expect(p.leader.power).toBe(6000);
    expect(p.characters.find((c) => c?.instanceId === id)?.power).toBe(7000);
    expect(p.characters.find((c) => c?.cardId === "ST02-006")?.power).toBe(7000);
    expect(p.characters.find((c) => c?.cardId === "ST02-011")?.power).toBe(4000);
    e.endTurn("south");
    p = e.getView("south").players.south;
    expect(p.leader.power).toBe(5000);
    expect(p.characters.find((c) => c?.cardId === "ST02-006")?.power).toBe(6000);
  });
});
