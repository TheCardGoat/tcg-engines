import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { olafHelpingHand } from "./057-olaf-helping-hand";

const banishAction = createMockAction({
  id: "olaf-test-banish-action",
  name: "Test Banish Action",
  cost: 1,
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

const allyCharacterA = createMockCharacter({
  id: "olaf-test-ally-a",
  name: "Ally Character A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const allyCharacterB = createMockCharacter({
  id: "olaf-test-ally-b",
  name: "Ally Character B",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Olaf - Helping Hand", () => {
  describe("SECOND CHANCE - When this character leaves play, you may return chosen character of yours to your hand.", () => {
    it("should trigger when Olaf is banished and return chosen character to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [olafHelpingHand, allyCharacterA],
        hand: [banishAction],
        deck: 5,
      });

      // Banish Olaf with the action
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [olafHelpingHand] }),
      ).toBeSuccessfulCommand();

      // Olaf should be in discard
      expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");

      // SECOND CHANCE ability should trigger in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability and choose allyCharacterA to return to hand
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(olafHelpingHand, {
          resolveOptional: true,
          targets: [allyCharacterA],
        }),
      ).toBeSuccessfulCommand();

      // allyCharacterA should be in hand
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("hand");
    });

    it("should be optional - declining leaves characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [olafHelpingHand, allyCharacterA],
        hand: [banishAction],
        deck: 5,
      });

      // Banish Olaf
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [olafHelpingHand] }),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(olafHelpingHand, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // allyCharacterA should remain in play
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");
    });

    it("should trigger only once when banished in a challenge (not double from banish + banish-in-challenge)", () => {
      const opponentAttacker = createMockCharacter({
        id: "olaf-test-opponent-attacker",
        name: "Opponent Attacker",
        cost: 2,
        strength: 6,
        willpower: 6,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: olafHelpingHand, exerted: true }, allyCharacterA],
          deck: 5,
        },
        {
          play: [opponentAttacker],
          deck: 5,
        },
      );

      // Pass turn to opponent so they can challenge exerted Olaf
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Olaf (strength 6 vs willpower 4, Olaf dies)
      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, olafHelpingHand),
      ).toBeSuccessfulCommand();

      // Olaf should be banished
      expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");

      // SECOND CHANCE should trigger exactly ONCE (not twice)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      // Resolve the trigger
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(olafHelpingHand, {
          resolveOptional: true,
          targets: [allyCharacterA],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("hand");
    });

    it("should allow choosing which character to return when multiple are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [olafHelpingHand, allyCharacterA, allyCharacterB],
        hand: [banishAction],
        deck: 5,
      });

      // Banish Olaf
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [olafHelpingHand] }),
      ).toBeSuccessfulCommand();

      // Accept and choose allyCharacterB to return to hand
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(olafHelpingHand, {
          resolveOptional: true,
          targets: [allyCharacterB],
        }),
      ).toBeSuccessfulCommand();

      // allyCharacterB should be in hand, allyCharacterA still in play
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterB)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(olafHelpingHand)).toBe("discard");
    });
  });
});
