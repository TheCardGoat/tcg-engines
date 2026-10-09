import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-016 Take That Back", () => {
  test.each(["leader", "character"])(
    "matching reveal protects %s in this battle and expires",
    (kind) => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["ST22-016"],
          activeDon: 1,
          character: [{ cardId: "ST02-006", rested: true }],
          deck: ["OP01-033", "ST02-002"],
        },
        { character: [{ cardId: "ST02-013", playedOnTurn: 0 }] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const target =
        kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST02-006");
      const top = e.findCardInZone("south", "deck", "OP01-033");
      e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), target);
      e.asSouth().chooseCounter("ST22-016");
      e.asSouth().chooseTargets(target);
      expect(e.getView("south").players.south.lifeCount).toBe(4);
      expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
      expect(e.getView("south").players.south.leader.power).toBe(5000);
      expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(top);
    },
  );
  test.each(["mismatch", "zero"])("%s grants no power", (mode) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST22-016"],
        activeDon: 1,
        life: 2,
        deck: [mode === "mismatch" ? "ST02-002" : "OP01-033", "ST02-012"],
      },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseCounter("ST22-016");
    if (mode === "zero") e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("Life Trigger draws one without requiring Whitebeard top", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST22-016"], deck: ["ST02-002", "ST02-012"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
