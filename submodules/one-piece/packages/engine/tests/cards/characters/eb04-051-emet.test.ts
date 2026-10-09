import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-051 Emet", () => {
  test("a synthetic 12000-base-power Leader does not satisfy the Character requirement", () => {
    const leader = getCard("OP01-001");
    if (leader.cardType !== "leader") throw new Error("Expected Leader fixture.");
    const originalPower = leader.power;
    try {
      leader.power = 12000;
      const engine = OnePieceTestEngine.create({
        leaderCardId: "OP01-001",
        character: ["EB04-051"],
      });
      const emet = engine.findCardInZone("south", "character", "EB04-051");
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: emet,
        targetId: engine.leader("north"),
      });
    } finally {
      leader.power = originalPower;
    }
  });

  test.each([1, 2])(
    "Life Trigger lowers all opposing Characters, and plays Emet only at zero Life (%i starting Life)",
    (life) => {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: "OP01-001", life: life === 1 ? ["EB04-051"] : ["EB04-051", "EB01-005"] },
        { leaderCardId: "OP01-001", activeDon: 2, character: ["EB01-005", "EB01-025"] },
        { activeSeat: "north" },
      );
      engine.asNorth().attachDon(engine.asNorth().leader(), 2);
      engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
      engine.asSouth().activateLifeTrigger();
      const south = engine.asSouth().view().players.south;
      expect(
        engine
          .asSouth()
          .view()
          .players.north.characters.flatMap((card) => (card ? [card.power] : [])),
      ).toEqual([1000, 3000]);
      expect(south.characters.some((card) => card?.cardId === "EB04-051")).toBe(life === 1);
      expect(south.trash.some((card) => card.cardId === "EB04-051")).toBe(life === 2);
      expect(south.handCount).toBe(0);
    },
  );
});
