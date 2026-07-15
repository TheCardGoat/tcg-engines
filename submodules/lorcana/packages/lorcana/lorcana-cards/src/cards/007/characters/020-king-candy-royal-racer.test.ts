import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kingCandyRoyalRacer } from "./020-king-candy-royal-racer";
import { candleheadDedicatedRacer } from "./017-candlehead-dedicated-racer";

const banishAction = createMockAction({
  id: "king-candy-banish-action",
  name: "Banish Action",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

const opponentCharacter = createMockCharacter({
  id: "king-candy-opp-char-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "king-candy-opp-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const nonRacerAlly = createMockCharacter({
  id: "king-candy-non-racer",
  name: "Non-Racer Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally"],
});

describe("King Candy - Royal Racer", () => {
  describe("SWEET REVENGE - Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.", () => {
    it("triggers when a Racer character is banished and opponent must banish one of their characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingCandyRoyalRacer, candleheadDedicatedRacer],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter, opponentCharacter2],
          deck: 2,
        },
      );

      // Banish the Racer character (Candlehead) to trigger Sweet Revenge
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [candleheadDedicatedRacer] }),
      ).toBeSuccessfulCommand();

      // Candlehead should be banished
      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");

      // Sweet Revenge should have triggered a bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the SWEET REVENGE bag effect (Candlehead's own optional trigger may also be in bag)
      // Resolve King Candy's trigger by finding it via abilityName in payload
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      const sweetRevengeBag = bagEffects.find(
        (b) => (b.payload as { abilityName?: string }).abilityName === "SWEET REVENGE",
      );
      expect(sweetRevengeBag).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kingCandyRoyalRacer, {}),
      ).toBeSuccessfulCommand();

      // Opponent (player two) should now have a pending effect to choose and banish one of their characters
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The chosen opponent character should be banished
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      // The other opponent character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
    });

    it("does NOT trigger when a non-Racer character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingCandyRoyalRacer, nonRacerAlly],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      // Banish the non-Racer ally
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [nonRacerAlly] }),
      ).toBeSuccessfulCommand();

      // Non-Racer character should be banished
      expect(testEngine.asPlayerOne().getCardZone(nonRacerAlly)).toBe("discard");

      // Sweet Revenge should NOT have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Opponent character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
    });

    it("does NOT trigger when King Candy himself is banished (only triggers for OTHER Racer characters)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingCandyRoyalRacer],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      // Banish King Candy himself
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [kingCandyRoyalRacer] }),
      ).toBeSuccessfulCommand();

      // King Candy should be banished
      expect(testEngine.asPlayerOne().getCardZone(kingCandyRoyalRacer)).toBe("discard");

      // Sweet Revenge should NOT trigger for self
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
