import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { finnickTinyTerror } from "./074-finnick-tiny-terror";

const weakOpposingCharacter = createMockCharacter({
  id: "finnick-test-weak-opponent",
  name: "Weak Opponent",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const exactlyTwoStrengthCharacter = createMockCharacter({
  id: "finnick-test-two-strength-opponent",
  name: "Two Strength Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const strongOpposingCharacter = createMockCharacter({
  id: "finnick-test-strong-opponent",
  name: "Strong Opponent",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Finnick - Tiny Terror", () => {
  describe("YOU BETTER RUN — When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.", () => {
    it("triggers a bag effect when played and there are valid opposing targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [weakOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("returns chosen opposing character with 1 strength to their player's hand when paying 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [weakOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getCardZone(weakOpposingCharacter)).toBe("play");

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(finnickTinyTerror, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const opponentId = testEngine.findCardInstanceId(weakOpposingCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakOpposingCharacter)).toBe("hand");
    });

    it("returns chosen opposing character with exactly 2 strength to their player's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [exactlyTwoStrengthCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(finnickTinyTerror, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const opponentId = testEngine.findCardInstanceId(
        exactlyTwoStrengthCharacter,
        "play",
        "player_two",
      );
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(exactlyTwoStrengthCharacter)).toBe("hand");
    });

    it("ability is optional — can be declined and opponent's character stays in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [weakOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(finnickTinyTerror, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakOpposingCharacter)).toBe("play");
    });

    it("strength filter excludes characters with 3 or more strength — they cannot be returned", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [strongOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      // No <=2 strength opponents means the optional bag entry auto-drains as a no-op.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Strong character should remain in play — strength filter prevents returning it
      expect(testEngine.asPlayerTwo().getCardZone(strongOpposingCharacter)).toBe("play");
    });

    it("costs 2 ink — reduces available ink by 2 when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          inkwell: finnickTinyTerror.cost + 2,
          deck: 2,
        },
        {
          play: [weakOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      // After playing Finnick (cost 1), available ink = 3 - 1 = 2
      const inkAfterPlay = testEngine.asPlayerOne().getAvailableInk("player_one");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(finnickTinyTerror, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const opponentId = testEngine.findCardInstanceId(weakOpposingCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentId],
        }),
      ).toBeSuccessfulCommand();

      // After paying 2 ink for the ability, available ink = 2 - 2 = 0
      const inkAfterAbility = testEngine.asPlayerOne().getAvailableInk("player_one");
      expect(inkAfterAbility).toBe(inkAfterPlay - 2);
    });

    it("does not return character if controller cannot pay 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [finnickTinyTerror],
          // Only enough to play Finnick, not to pay the ability cost
          inkwell: finnickTinyTerror.cost,
          deck: 2,
        },
        {
          play: [weakOpposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(finnickTinyTerror)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);

      // Cannot pay 2 ink, so no character is returned
      expect(testEngine.asPlayerTwo().getCardZone(weakOpposingCharacter)).toBe("play");
      // Ink should not be charged (0 available after playing Finnick)
      expect(testEngine.asPlayerOne().getAvailableInk("player_one")).toBe(0);
    });
  });
});
