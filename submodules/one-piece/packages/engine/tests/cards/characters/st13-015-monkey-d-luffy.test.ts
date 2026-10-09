import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-015-monkey-d-luffy", () => {
  test("gains 2000 once then draws and trashes topLife; buff expires next own turn", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST13-015"],
      life: ["ST02-002", "ST02-012"],
      deck: ["ST02-006", "ST02-013", "ST02-002"],
    });
    const id = e.findCardInZone("south", "character", "ST13-015");
    e.activateEffect(id, "activateMain", "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
  });
  test("zero Life still gains power but neither draws nor trashes Life", () => {
    const e = OnePieceTestEngine.create({ character: ["ST13-015"], life: 0 });
    const id = e.findCardInZone("south", "character", "ST13-015");
    e.activateEffect(id, "activateMain", "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
});
