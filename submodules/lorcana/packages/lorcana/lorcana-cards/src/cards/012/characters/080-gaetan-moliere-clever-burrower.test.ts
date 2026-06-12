import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gaetanMoliereCleverBurrower } from "./080-gaetan-moliere-clever-burrower";

const handCard1 = createMockCharacter({
  id: "gaetan-hand-card-1",
  name: "Hand Card 1",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const handCard2 = createMockCharacter({
  id: "gaetan-hand-card-2",
  name: "Hand Card 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const nonEvasiveAttacker = createMockCharacter({
  id: "gaetan-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Gaetan Moliere - Clever Burrower", () => {
  describe("Evasive", () => {
    it("cannot be challenged by a character without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nonEvasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: gaetanMoliereCleverBurrower, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonEvasiveAttacker, gaetanMoliereCleverBurrower),
      ).not.toBeSuccessfulCommand();
    });
  });

  describe("UNEARTH - Whenever this character quests, you may draw 2 cards, then choose and discard 2 cards.", () => {
    it("draws 2 cards and then discards 2 chosen cards when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: gaetanMoliereCleverBurrower, isDrying: false }],
        hand: [handCard1, handCard2],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(gaetanMoliereCleverBurrower)).toBeSuccessfulCommand();

      // The optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional: draws 2, then suspends for discard choice
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(gaetanMoliereCleverBurrower, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Discard choice pending
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffects).toHaveLength(1);

      const discardCard1Id = testEngine.findCardInstanceId(handCard1, "hand", "player_one");
      const discardCard2Id = testEngine.findCardInstanceId(handCard2, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolveEffect(pendingEffects[0]!.id, {
          targets: [discardCard1Id, discardCard2Id],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handCard1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handCard2)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: gaetanMoliereCleverBurrower, isDrying: false }],
        hand: [handCard1, handCard2],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(gaetanMoliereCleverBurrower)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(gaetanMoliereCleverBurrower, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Nothing should happen
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(handCard1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(handCard2)).toBe("hand");
    });
  });
});
