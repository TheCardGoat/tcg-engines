import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { theQueenDeviousDisguise } from "./090-the-queen-devious-disguise";

describe("The Queen - Devious Disguise", () => {
  describe("EVIL SCHEME - When you play this character, you may draw a card. If you do, each opponent gains 2 lore.", () => {
    it("draws a card and gives each opponent 2 lore when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theQueenDeviousDisguise],
          inkwell: theQueenDeviousDisguise.cost,
          deck: 3,
        },
        {
          lore: 0,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(testEngine.asPlayerOne().playCard(theQueenDeviousDisguise)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenDeviousDisguise, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Played 1 from hand, drew 1 back → net same
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handBefore);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not give opponents lore when the controller declines", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theQueenDeviousDisguise],
          inkwell: theQueenDeviousDisguise.cost,
          deck: 3,
        },
        {
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().playCard(theQueenDeviousDisguise)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenDeviousDisguise, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
    });
  });

  describe("JEALOUS HEART - While an opponent has more lore than you, this character gets +2 {L}.", () => {
    it("quests for base lore when the opponent does not have more lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenDeviousDisguise],
          lore: 5,
        },
        {
          lore: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(theQueenDeviousDisguise)).toBeSuccessfulCommand();
      // base lore 1
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(5 + 1);
    });

    it("quests for +2 lore while an opponent has more lore than the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenDeviousDisguise],
          lore: 1,
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(theQueenDeviousDisguise)).toBeSuccessfulCommand();
      // base 1 + 2 from Jealous Heart = 3
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1 + 3);
    });
  });
});
