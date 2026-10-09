import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-018-bartolomeo", () => {
  test("Blocker redirects a real attack and preserves Leader Life", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-018"], activeDon: 2 });
    e.playCard("P-018");
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker("P-018");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "P-018")).toBe(true);
  });
  test("declines optional Blocker and takes Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-018"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
