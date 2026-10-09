import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-039-bellamy", () => {
  test("Banish trashes actual Trigger Life without activation independent of Life/DON bonus", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-039", playedOnTurn: 0 }], life: 1 },
      { life: ["P-042", "P-012", "P-015", "P-016"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-039", e.leader("north"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("P-042");
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("zero Life and twoDON enable permanent bonus including opponent turn", () => {
    const e = OnePieceTestEngine.create({ character: ["P-039"], life: 0, activeDon: 2 });
    const b = e.findCardInZone("south", "character", "P-039");
    e.attachDon(b, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.attachDon(b, 1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(10000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
  });
  test("oneLife prevents power bonus despite twoDON", () => {
    const e = OnePieceTestEngine.create({ character: ["P-039"], life: 1, activeDon: 2 });
    e.attachDon(e.findCardInZone("south", "character", "P-039"), 2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });
});
