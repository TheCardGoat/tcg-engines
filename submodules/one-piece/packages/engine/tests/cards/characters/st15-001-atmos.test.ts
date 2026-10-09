import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST15-001 Atmos", () => {
  test("Newgate attack restriction prevents own effects and costs adding Life to hand", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP02-001",
        character: [{ cardId: "ST15-001", playedOnTurn: 0 }],
        hand: ["ST15-004", "ST08-014"],
        life: 3,
        activeDon: 3,
      },
      { character: ["ST12-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST15-001"), e.leader("north"));
    e.playCard("ST15-004");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-004"));
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.playCard("ST08-014");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.endTurn("south");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    e.endTurn("north");
    e.endTurn("south");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
  test("other Whitebeard Leader still adds Life through Thatch", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP03-001",
        character: [{ cardId: "ST15-001", playedOnTurn: 0 }],
        hand: ["ST15-004"],
        life: 2,
        activeDon: 1,
      },
      { character: ["ST12-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST15-001"), e.leader("north"));
    e.playCard("ST15-004");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
});
