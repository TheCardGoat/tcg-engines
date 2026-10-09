import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-002 Uta", () => {
  test.each(["leader", "character"] as const)(
    "battle protection distinguishes %s attackers",
    (kind) => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "ST08-002", rested: true }] },
        { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const uta = e.findCardInZone("south", "character", "ST08-002");
      e.asNorth().attack(
        kind === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "ST08-010"),
        uta,
      );
      expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === uta)).toBe(
        kind === "leader",
      );
    },
  );
  test("rests itself to reduce opposing cost by two until turn end", () => {
    const e = OnePieceTestEngine.create({ character: ["ST08-002"] }, { character: ["ST08-011"] });
    e.asSouth().activateMain("ST08-002");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST08-011"));
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.north.characters[0]?.cost).toBe(1);
    e.endTurn("south");
    expect(e.getView("south").players.north.characters[0]?.cost).toBe(3);
  });
  test("declines activation without resting or reducing cost", () => {
    const e = OnePieceTestEngine.create({ character: ["ST08-002"] }, { character: ["ST08-011"] });
    e.asSouth().activateMain("ST08-002");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.north.characters[0]?.cost).toBe(3);
  });
  test("does not protect from effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-015"], activeDon: 3 },
      { character: ["ST08-002"] },
    );
    e.playCard("ST08-015");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST08-002"));
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST08-002");
  });
});
