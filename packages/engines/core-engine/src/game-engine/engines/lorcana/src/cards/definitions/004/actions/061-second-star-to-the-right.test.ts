import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { secondStarToTheRight } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";

describe("Second Star To The Right", () => {
  it("**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: secondStarToTheRight.cost,
      hand: [secondStarToTheRight],
    });

    expect(testEngine.getCardModel(secondStarToTheRight).hasSingTogether).toBe(
      true,
    );
  });

  describe("Chosen player draws 5 cards.", () => {
    it("Opponent draws 5", async () => {
      const testEngine = new TestEngine(
        {
          deck: 10,
          inkwell: secondStarToTheRight.cost,
          hand: [secondStarToTheRight],
        },
        {
          deck: 10,
        },
      );

      await testEngine.playCard(secondStarToTheRight, {
        targetPlayer: "player_two",
      });

      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 10,
        }),
      );
      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          hand: 5,
          deck: 5,
        }),
      );
    });

    it("Active player draws 5", async () => {
      const testEngine = new TestEngine(
        {
          deck: 10,
          inkwell: secondStarToTheRight.cost,
          hand: [secondStarToTheRight],
        },
        {
          deck: 10,
        },
      );

      await testEngine.playCard(secondStarToTheRight, {
        targetPlayer: "player_one",
      });

      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 10,
        }),
      );
      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          hand: 5,
          deck: 5,
        }),
      );
    });
  });
});
