import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-104-shanks", () => {
  test.each(["self", "opponent"])(
    "ten field DON on %s protects selected Character from bottom-deck effect",
    (owner) => {
      const e = OnePieceTestEngine.create(
        {
          character: ["P-104"],
          activeDon: owner === "self" ? 9 : 0,
          restedDon: owner === "self" ? 1 : 0,
        },
        { hand: ["OP04-056"], activeDon: owner === "opponent" ? 10 : 6 },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const id = e.findCardInZone("south", "character", "P-104");
      e.asNorth().play("OP04-056");
      e.asNorth().chooseTargets(id);
      expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
      expect(e.getView("south").players.south.trash).toHaveLength(0);
    },
  );
  test("nine DON does not protect", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-104"], activeDon: 9 },
      { hand: ["OP04-056"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("OP04-056");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "P-104"));
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
  test("battle KO remains possible with ten DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-104", rested: true }], activeDon: 10 },
      { character: [{ cardId: "P-041", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack("P-041", e.findCardInZone("south", "character", "P-104"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-104");
  });
});
