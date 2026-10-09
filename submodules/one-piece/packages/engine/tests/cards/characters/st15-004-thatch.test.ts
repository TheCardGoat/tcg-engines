import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST15-004 Thatch", () => {
  test("Whitebeard gate reduces opposing power then adds top Life; power expires", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP02-001",
        hand: ["ST15-004"],
        life: ["ST12-009", "ST12-015"],
        activeDon: 1,
      },
      { character: ["ST12-004"] },
    );
    const life = e.findCardInZone("south", "life", "ST12-009");
    e.playCard("ST15-004");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-004"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(life);
    e.endTurn("south");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
  test("FAQ declines optional debuff but mandatory Life addition still occurs", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-001", hand: ["ST15-004"], life: 2, activeDon: 1 },
      { character: ["ST12-004"] },
    );
    e.playCard("ST15-004");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("FAQ no Life still permits the debuff", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-001", hand: ["ST15-004"], life: 0, activeDon: 1 },
      { character: ["ST12-004"] },
    );
    e.playCard("ST15-004");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-004"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test("wrong Leader prevents both results", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST15-004"], life: 2, activeDon: 1 },
      { character: ["ST12-004"] },
    );
    e.playCard("ST15-004");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
});
