import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fixitFelixJrPintsizedHero } from "./022-fix-it-felix-jr-pint-sized-hero";

const racerInDiscard = createMockCharacter({
  id: "felix-test-racer-in-discard",
  name: "Racer In Discard",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Racer"],
});

const racerInPlay = createMockCharacter({
  id: "felix-test-racer-in-play",
  name: "Racer In Play",
  cost: 3,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Ally", "Racer"],
});

const nonRacerInDiscard = createMockCharacter({
  id: "felix-test-non-racer-in-discard",
  name: "Non Racer In Discard",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const opponentDefender = createMockCharacter({
  id: "felix-test-opponent-defender",
  name: "Opponent Defender",
  cost: 3,
  strength: 2,
  willpower: 3,
});

// A mock of Calhoun's "return from discard" ability — on player_one's side
const calhounLikeAttacker = createMockCharacter({
  id: "felix-test-calhoun-like-attacker",
  name: "Calhoun-Like Attacker",
  cost: 6,
  strength: 5,
  willpower: 5,
  classifications: ["Floodborn", "Hero", "Racer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "test-calhoun-like-ability",
      name: "BACK TO START POSITIONS!",
      text: "Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
});

describe("Fix-It Felix Jr. - Pint-Sized Hero", () => {
  describe("LET'S GET TO WORK - Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.", () => {
    it("triggers and may ready a Racer character when a Racer is returned from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            fixitFelixJrPintsizedHero,
            calhounLikeAttacker,
            { card: racerInPlay, exerted: true },
          ],
          discard: [{ card: racerInDiscard }],
          deck: 5,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 5,
        },
      );

      const racerInPlayId = testEngine.findCardInstanceId(racerInPlay, "play");
      const racerInDiscardId = testEngine.findCardInstanceId(racerInDiscard, "discard");

      // Verify the racer in play is exerted
      expect(testEngine.asPlayerOne().isExerted(racerInPlayId)).toBe(true);

      // Challenge using the calhoun-like attacker (has "return from discard" when challenging)
      expect(
        testEngine.asPlayerOne().challenge(calhounLikeAttacker, opponentDefender),
      ).toBeSuccessfulCommand();

      // Calhoun-like's trigger should appear in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounLikeAttacker, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose to return the Racer from discard
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [racerInDiscardId] }),
        ).toBeSuccessfulCommand();
      }

      // The Racer card should now be in hand
      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("hand");

      // Felix's LET'S GET TO WORK should trigger from the return-from-discard event
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(fixitFelixJrPintsizedHero, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the exerted Racer in play to ready
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [racerInPlayId] }),
      ).toBeSuccessfulCommand();

      // The Racer in play should now be ready
      expect(testEngine.asPlayerOne().isExerted(racerInPlayId)).toBe(false);

      // The Racer in play should have a cant-quest restriction for the rest of this turn
      expect(testEngine.hasRestriction(racerInPlay, "cant-quest")).toBe(true);
    });

    it("can decline the optional ability when a Racer is returned from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            fixitFelixJrPintsizedHero,
            calhounLikeAttacker,
            { card: racerInPlay, exerted: true },
          ],
          discard: [{ card: racerInDiscard }],
          deck: 5,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 5,
        },
      );

      const racerInPlayId = testEngine.findCardInstanceId(racerInPlay, "play");
      const racerInDiscardId = testEngine.findCardInstanceId(racerInDiscard, "discard");

      expect(
        testEngine.asPlayerOne().challenge(calhounLikeAttacker, opponentDefender),
      ).toBeSuccessfulCommand();

      // Resolve Calhoun-like's bag - return the Racer from discard
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounLikeAttacker, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [racerInDiscardId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(racerInDiscard)).toBe("hand");

      // Felix's LET'S GET TO WORK should trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(fixitFelixJrPintsizedHero, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The Racer in play should remain exerted
      expect(testEngine.asPlayerOne().isExerted(racerInPlayId)).toBe(true);

      // No restriction should have been applied
      expect(testEngine.hasRestriction(racerInPlay, "cant-quest")).toBe(false);
    });

    it("does not trigger when a non-Racer card is returned from discard to hand", () => {
      // Use a mock attacker with "return any character from discard" ability (no Racer filter)
      const attackerWithNonRacerReturn = createMockCharacter({
        id: "felix-test-non-racer-attacker",
        name: "Non-Racer Return Attacker",
        cost: 4,
        strength: 3,
        willpower: 3,
        abilities: [
          {
            effect: {
              chooser: "CONTROLLER",
              effect: {
                target: "CONTROLLER",
                type: "return-from-discard",
                cardType: "character",
              },
              type: "optional",
            },
            id: "test-non-racer-return-ability",
            name: "RETURN NON-RACER",
            text: "Whenever this character challenges, you may return a character card from your discard to your hand.",
            trigger: {
              event: "challenge",
              on: "SELF",
              timing: "whenever",
            },
            type: "triggered",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fixitFelixJrPintsizedHero, attackerWithNonRacerReturn],
          discard: [{ card: nonRacerInDiscard }],
          deck: 5,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 5,
        },
      );

      const nonRacerInDiscardId = testEngine.findCardInstanceId(nonRacerInDiscard, "discard");

      expect(
        testEngine.asPlayerOne().challenge(attackerWithNonRacerReturn, opponentDefender),
      ).toBeSuccessfulCommand();

      // Resolve the attacker's bag - return the non-Racer from discard
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(attackerWithNonRacerReturn, { resolveOptional: true }),
        ).toBeSuccessfulCommand();

        const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
        if (pendingChoice) {
          expect(
            testEngine.asPlayerOne().resolveNextPending({ targets: [nonRacerInDiscardId] }),
          ).toBeSuccessfulCommand();
        }

        // Non-Racer should be in hand now
        expect(testEngine.asPlayerOne().getCardZone(nonRacerInDiscard)).toBe("hand");
      }

      // Felix's LET'S GET TO WORK should NOT trigger since the returned card is not a Racer
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("restriction expires after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            fixitFelixJrPintsizedHero,
            calhounLikeAttacker,
            { card: racerInPlay, exerted: true },
          ],
          discard: [{ card: racerInDiscard }],
          deck: 5,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 5,
        },
      );

      const racerInPlayId = testEngine.findCardInstanceId(racerInPlay, "play");
      const racerInDiscardId = testEngine.findCardInstanceId(racerInDiscard, "discard");

      expect(
        testEngine.asPlayerOne().challenge(calhounLikeAttacker, opponentDefender),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(calhounLikeAttacker, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [racerInDiscardId] }),
        ).toBeSuccessfulCommand();
      }

      // Resolve Felix's trigger - ready the racer
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(fixitFelixJrPintsizedHero, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [racerInPlayId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(racerInPlay, "cant-quest")).toBe(true);

      // Pass both turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Restriction should have expired
      expect(testEngine.hasRestriction(racerInPlay, "cant-quest")).toBe(false);
    });
  });
});
