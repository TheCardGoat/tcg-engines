import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-033-monkey-d-luffy", () => {
  test("self bottom cost returns attached DON and draws next physical card", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "P-033", attachedDon: 1 }],
      deck: ["P-012", "P-015", "P-016", "P-041", "P-012"],
    });
    const id = e.findCardInZone("south", "character", "P-033");
    e.activateEffect(id, "activateMain");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("P-012");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    // Hidden deck order is not exposed by the player view.
    expect(e.getState().players.south.deck.at(-1)).toBe(id);
  });
  test("declines optional bottom payment and draw", () => {
    const e = OnePieceTestEngine.create({ character: ["P-033"] });
    e.activateEffect(e.findCardInZone("south", "character", "P-033"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("P-033");
  });
});
