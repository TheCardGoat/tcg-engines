import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sidPhillipsToySurgeon } from "./126-sid-phillips-toy-surgeon";

const ownCharacter = createMockCharacter({
  id: "sid-own-char",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const ownCharacter2 = createMockCharacter({
  id: "sid-own-char-2",
  name: "Own Character 2",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "sid-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const toyCharacter = createMockCharacter({
  id: "sid-toy-char",
  name: "Toy Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "sid-non-toy-char",
  name: "Non-Toy Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Villain"],
});

describe("Sid Phillips - Toy Surgeon", () => {
  describe("PLAYTIME'S OVER", () => {
    it("banish own character, opponent must banish theirs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [ownCharacter],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the optional: banish own character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("discard");

      // Opponent (player two) chooses which of their characters to banish
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
    });

    it("BUG-15: opponent must banish their own character, not Sid controller's remaining characters", () => {
      // Player 1 has Sid + 2 own characters; player 2 has 1 character.
      // After banishing ownCharacter, ownCharacter2 should remain safe.
      // The opponent must banish opponentCharacter (their own), not ownCharacter2.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [ownCharacter, ownCharacter2],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();

      // Banish ownCharacter (player 1's sacrificed character)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("discard");

      // Opponent must banish their own character (opponentCharacter), not ownCharacter2
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // opponentCharacter is gone
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      // ownCharacter2 is still in play (was NOT banished by the opponent)
      expect(testEngine.asPlayerOne().getCardZone(ownCharacter2)).toBe("play");
    });

    it("BUG-15: opponent cannot target Sid controller's characters", () => {
      // If BUG-15 exists: opponent is presented with Sid controller's chars to banish.
      // We verify the opponent CANNOT target ownCharacter2 (player 1's remaining character).
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [ownCharacter, ownCharacter2],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Player 2 (opponent) CANNOT target ownCharacter2 (player 1's character)
      // because the effect requires them to choose from THEIR OWN characters.
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [ownCharacter2],
        }),
      ).not.toBeSuccessfulCommand();

      // ownCharacter2 should remain in player 1's play zone (not banished)
      expect(testEngine.asPlayerOne().getCardZone(ownCharacter2)).toBe("play");
    });

    it("opponent cannot skip the mandatory banish when they have a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [ownCharacter],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          play: [toyCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("discard");
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [],
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(toyCharacter)).toBe("play");
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [toyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(toyCharacter)).toBe("discard");
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    });

    it("opponent banish continuation resolves with no effect when they have no character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [ownCharacter],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    });

    it("server-side opponent automation does not auto-resolve the Sid controller's follow-up bag", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sidPhillipsToySurgeon],
          play: [toyCharacter],
          inkwell: sidPhillipsToySurgeon.cost,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sidPhillipsToySurgeon)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sidPhillipsToySurgeon, {
          resolveOptional: true,
          targets: [toyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);

      const automatedOpponentAction = testEngine.asServer().takeAutomatedActionForCurrentActor();

      expect(automatedOpponentAction.finalResult).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(testEngine.asPlayerOne().resolveNextBag()).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });
  });

  describe("DOUBLE PRIZES!", () => {
    it("BUG-14: gains 2 lore when a Toy character is banished during your turn", () => {
      // Sid and a Toy character are already in play.
      // Banish the Toy via lethal damage during player one's turn.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [sidPhillipsToySurgeon, toyCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Apply lethal damage to the Toy character during player one's turn
      expect(
        testEngine.asServer().manualSetDamage(toyCharacter, toyCharacter.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("discard");

      // DOUBLE PRIZES! should have auto-resolved the lore gain (gain-lore has no player input)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("BUG-14: does NOT gain lore when a non-Toy character is banished during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [sidPhillipsToySurgeon, nonToyCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Banish the non-Toy character via lethal damage
      expect(
        testEngine.asServer().manualSetDamage(nonToyCharacter, nonToyCharacter.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonToyCharacter)).toBe("discard");

      // No lore should be gained — DOUBLE PRIZES! should not trigger for non-Toy
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
