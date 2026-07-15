import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { annaIceBreaker } from "./072-anna-ice-breaker";

const opposingCharacter = createMockCharacter({
  id: "anna-opposing-character",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const allyCharacter = createMockCharacter({
  id: "anna-ally-character",
  name: "Ally Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Anna - Ice Breaker", () => {
  describe("Support keyword", () => {
    it("has the Support keyword", () => {
      const abilities = annaIceBreaker.abilities ?? [];
      const supportAbility = abilities.find(
        (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Support",
      );
      expect(supportAbility).toBeDefined();
    });
  });

  describe("WINTER AMBUSH - chosen opposing character can't ready at the start of their next turn", () => {
    it("applies cant-ready to chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaIceBreaker],
          inkwell: annaIceBreaker.cost,
        },
        {
          play: [{ card: opposingCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(annaIceBreaker, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolvePendingByCard(annaIceBreaker)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
    });

    it("restriction expires after the opposing player's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaIceBreaker],
          inkwell: annaIceBreaker.cost,
        },
        {
          play: [{ card: opposingCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(annaIceBreaker, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolvePendingByCard(annaIceBreaker)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(annaIceBreaker)).toBe(false);
    });

    it("only affects the chosen character, not other opposing characters", () => {
      const otherOpposing = createMockCharacter({
        id: "anna-other-opposing",
        name: "Other Opposing Character",
        cost: 2,
        strength: 2,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaIceBreaker],
          inkwell: annaIceBreaker.cost,
        },
        {
          play: [
            { card: opposingCharacter, exerted: true },
            { card: otherOpposing, exerted: true },
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(annaIceBreaker, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolvePendingByCard(annaIceBreaker)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(otherOpposing)).toBe(false);
    });
  });
});
