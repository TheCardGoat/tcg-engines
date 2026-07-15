import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gosalynMallardTheQuiverwingQuack } from "./001-gosalyn-mallard-the-quiverwing-quack";

const cheapExertedAlly = createMockCharacter({
  id: "gosalyn-test-cheap-ally",
  name: "Cheap Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const expensiveExertedAlly = createMockCharacter({
  id: "gosalyn-test-expensive-ally",
  name: "Expensive Ally",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
});

describe("Gosalyn Mallard - The Quiverwing Quack", () => {
  describe("Heroic Intervention — When you play this character, you may ready chosen character with cost 2 or less. If you do, they can't quest or challenge for the rest of this turn.", () => {
    it("readies a chosen character with cost 2 or less and applies cant-quest-or-challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gosalynMallardTheQuiverwingQuack],
        inkwell: gosalynMallardTheQuiverwingQuack.cost,
        play: [{ card: cheapExertedAlly, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().isExerted(cheapExertedAlly)).toBe(true);

      expect(
        testEngine.asPlayerOne().playCard(gosalynMallardTheQuiverwingQuack),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gosalynMallardTheQuiverwingQuack, {
          resolveOptional: true,
          targets: [cheapExertedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(cheapExertedAlly)).toBe(false);
      expect(testEngine.hasRestriction(cheapExertedAlly, "cant-quest-or-challenge")).toBe(true);
    });

    it("does not ready or apply restriction when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gosalynMallardTheQuiverwingQuack],
        inkwell: gosalynMallardTheQuiverwingQuack.cost,
        play: [{ card: cheapExertedAlly, exerted: true }],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(gosalynMallardTheQuiverwingQuack),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gosalynMallardTheQuiverwingQuack, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(cheapExertedAlly)).toBe(true);
      expect(testEngine.hasRestriction(cheapExertedAlly, "cant-quest-or-challenge")).toBe(false);
    });

    it("cannot target a character with cost greater than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gosalynMallardTheQuiverwingQuack],
        inkwell: gosalynMallardTheQuiverwingQuack.cost,
        play: [{ card: expensiveExertedAlly, exerted: true }],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(gosalynMallardTheQuiverwingQuack),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gosalynMallardTheQuiverwingQuack, {
          resolveOptional: true,
          targets: [expensiveExertedAlly],
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(expensiveExertedAlly)).toBe(true);
    });

    it("cant-quest-or-challenge restriction expires after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gosalynMallardTheQuiverwingQuack],
        inkwell: gosalynMallardTheQuiverwingQuack.cost,
        play: [{ card: cheapExertedAlly, exerted: true }],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(gosalynMallardTheQuiverwingQuack),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gosalynMallardTheQuiverwingQuack, {
          resolveOptional: true,
          targets: [cheapExertedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(cheapExertedAlly, "cant-quest-or-challenge")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(cheapExertedAlly, "cant-quest-or-challenge")).toBe(false);
    });
  });
});
