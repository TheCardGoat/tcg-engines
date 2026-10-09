import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-013-gordon", () => {
  test("pays physical Gordon to bottom, returns attached DON and reduces opposing Character this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-013", attachedDon: 1 }] },
      { character: ["P-012"] },
    );
    const id = e.findCardInZone("south", "character", "P-013");
    e.activateEffect(id, "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-012"));
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    // Hidden deck identity/order is not projected to either player.
    expect(e.getState().players.south.deck.at(-1)).toBe(id);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(2000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
  test("declines optional self return and keeps source and opponent unchanged", () => {
    const e = OnePieceTestEngine.create({ character: ["P-013"] }, { character: ["P-012"] });
    e.activateEffect(e.findCardInZone("south", "character", "P-013"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("P-013");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
});
