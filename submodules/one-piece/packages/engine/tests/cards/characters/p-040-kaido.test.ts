import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-040 Kaido", () => {
  test.each([9, 10])("battle KO protection checks opposing field DON %s", (don) => {
    const e = OnePieceTestEngine.create(
      { character: ["ST04-003"], activeDon: don },
      { character: [{ cardId: "P-040", rested: true }], restedDon: 10 },
    );
    const id = e.findCardInZone("north", "character", "P-040");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST04-003"), id);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      don === 10,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === id)).toBe(don === 9);
  });
  test.each([9, 10])("effect KO checks opposite field DON %s", (don) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-117", "OP04-038"], activeDon: don },
      { character: ["P-040"], restedDon: 10 },
    );
    const id = e.findCardInZone("north", "character", "P-040");
    e.asSouth().play("OP02-117");
    e.asSouth().chooseTargets(id);
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets(id);
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      don === 10,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === id)).toBe(don === 9);
  });
  test("KO protection does not prevent bottom-deck removal", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 10 },
      { character: ["P-040"], restedDon: 10 },
    );
    const id = e.findCardInZone("north", "character", "P-040");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(id);
    expect(e.findCardInZone("north", "deck", "P-040")).toBe(id);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
