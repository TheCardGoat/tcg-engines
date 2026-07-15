import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeEricExpertHelmsman } from "./121-prince-eric-expert-helmsman";
import { dragonFire } from "../../001";

const targetCharacter = createMockCharacter({
  id: "eric-helmsman-target",
  name: "Target Character",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const strongAttacker = createMockCharacter({
  id: "eric-helmsman-attacker",
  name: "Strong Attacker",
  cost: 4,
  strength: 10,
  willpower: 5,
});

describe("Prince Eric - Expert Helmsman", () => {
  describe("SURPRISE MANEUVER — When this character is banished, you may banish chosen character.", () => {
    it("triggers an optional ability when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princeEricExpertHelmsman, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker, targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, princeEricExpertHelmsman),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princeEricExpertHelmsman)).toBe("discard");

      // SURPRISE MANEUVER is optional, so it should place an entry in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("banishes chosen character when optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princeEricExpertHelmsman, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker, targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, princeEricExpertHelmsman),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princeEricExpertHelmsman)).toBe("discard");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeEricExpertHelmsman, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The chosen character should now be banished
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("does not banish any character when optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princeEricExpertHelmsman, exerted: true }],
          deck: 1,
        },
        {
          play: [strongAttacker, targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, princeEricExpertHelmsman),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princeEricExpertHelmsman)).toBe("discard");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeEricExpertHelmsman, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The target character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("triggers when banished by an action card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeEricExpertHelmsman],
          deck: 1,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [princeEricExpertHelmsman] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princeEricExpertHelmsman)).toBe("discard");

      // SURPRISE MANEUVER should trigger even when banished by an action
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeEricExpertHelmsman, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("can target any character in play including your own", () => {
      const ownCharacter = createMockCharacter({
        id: "eric-helmsman-own-char",
        name: "Own Character",
        cost: 2,
        strength: 2,
        willpower: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: princeEricExpertHelmsman, exerted: true }, ownCharacter],
          deck: 1,
        },
        {
          play: [strongAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, princeEricExpertHelmsman),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(princeEricExpertHelmsman)).toBe("discard");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(princeEricExpertHelmsman, {
          resolveOptional: true,
          targets: [ownCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The player's own character should be banished
      expect(testEngine.asPlayerOne().getCardZone(ownCharacter)).toBe("discard");
    });
  });
});
