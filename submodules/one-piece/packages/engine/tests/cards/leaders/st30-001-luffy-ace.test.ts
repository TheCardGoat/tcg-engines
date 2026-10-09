import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("leaders/st30-001-luffy-ace", () => {
  test("base7000 threshold weakens Leader while current7000 alone does not", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST30-001",
        character: [{ cardId: "ST30-005", attachedDon: 1 }],
        hand: ["ST28-004"],
        activeDon: 6,
      },
      {},
    );
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.playCard("ST28-004");
    expect(e.getView("south").players.south.leader.power).toBe(4000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(4000);
  });
  test("opponent-turn exact-name buff excludes combined-name Leader and unrelated Characters", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST30-001", character: ["ST30-007", "ST30-012", "ST30-005"] },
      {},
    );
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(
      e
        .getView("south")
        .players.south.characters.map((c) => c?.power)
        .slice(0, 3),
    ).toEqual([9000, 9000, 6000]);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
  });
});
