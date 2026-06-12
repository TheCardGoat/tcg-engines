import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hiddenTrap } from "./170-hidden-trap";
import { containmentUnit } from "./203-containment-unit";

const containedCharacter = createMockCharacter({
  id: "containment-unit-contained-character",
  name: "Contained Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const otherCharacter = createMockCharacter({
  id: "containment-unit-other-character",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const playerCharacter = createMockCharacter({
  id: "containment-unit-player-character",
  name: "Player Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const otherPlayerCharacter = createMockCharacter({
  id: "containment-unit-other-player-character",
  name: "Other Player Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const powerCard = createMockCharacter({
  id: "containment-unit-power-card",
  name: "Power Card",
  cost: 1,
});

describe("Containment Unit", () => {
  describe("GOT YOU NOW - When you play this item, choose a character. They can't challenge or quest while this item is in play.", () => {
    it("chosen character can't challenge while the item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          play: [{ card: playerCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
          play: [containedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [containedCharacter] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(containedCharacter, playerCharacter).success).toBe(
        false,
      );
    });

    it("chosen character can't quest while the item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          deck: 2,
        },
        {
          deck: 2,
          play: [containedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [containedCharacter] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().quest(containedCharacter).success).toBe(false);
    });

    it("restrictions are removed when the item leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hiddenTrap],
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          deck: 2,
        },
        {
          deck: 2,
          play: [containedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [containedCharacter] }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().activateAbility(hiddenTrap, {
          choiceIndex: 0,
          targets: [containmentUnit],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(containmentUnit)).toBe("discard");
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().quest(containedCharacter).success).toBe(true);
    });

    it("only the chosen character is restricted, not all characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          deck: 2,
        },
        {
          deck: 2,
          play: [containedCharacter, otherCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [containedCharacter] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().quest(containedCharacter).success).toBe(false);
      expect(testEngine.asPlayerTwo().quest(otherCharacter).success).toBe(true);
    });

    it("player's own characters can still challenge after playing Containment Unit", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          play: [playerCharacter],
          deck: 2,
        },
        {
          deck: 2,
          play: [containedCharacter, { card: otherCharacter, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [containedCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canChallenge(playerCharacter, otherCharacter)).toBe(true);
    });

    it("when targeting your own character, only that character is restricted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [containmentUnit],
          inkwell: containmentUnit.cost,
          play: [playerCharacter, otherPlayerCharacter],
          deck: 2,
        },
        {
          deck: 2,
          play: [{ card: otherCharacter, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(containmentUnit)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [playerCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().challenge(playerCharacter, otherCharacter).success).toBe(
        false,
      );
      expect(testEngine.asPlayerOne().canChallenge(otherPlayerCharacter, otherCharacter)).toBe(
        true,
      );
    });
  });

  describe("POWER SUPPLY - At the start of your turn, choose and discard a card or banish this item.", () => {
    it("choosing to discard a card keeps the item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [powerCard],
          deck: 2,
          play: [containmentUnit],
        },
        {
          deck: 2,
        },
      );
      const discardId = testEngine.findCardInstanceId(powerCard, "hand", "p1");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(powerCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(containmentUnit)).toBe("play");
    });

    it("choosing to banish the item banishes it", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [powerCard],
          deck: 2,
          play: [containmentUnit],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1 });

      expect(testEngine.asPlayerOne().getCardZone(containmentUnit)).toBe("discard");
    });

    it("when you have no cards in hand and choose discard, the item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [containmentUnit],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

      expect(testEngine.asPlayerOne().getCardZone(containmentUnit)).toBe("discard");
    });

    it("when you have no cards in hand, banishes automatically without prompting for a choice", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [containmentUnit],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // With empty hand, only banish is legal — engine should auto-force without suspension
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(containmentUnit),
      ).toBeSuccessfulCommand();

      // No pending choice-selection prompt should remain
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      // Item is banished immediately
      expect(testEngine.asPlayerOne().getCardZone(containmentUnit)).toBe("discard");
    });
  });
});
