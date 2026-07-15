import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kronkJuniorChipmunk } from "./185-kronk-junior-chipmunk";

const weakDefender = createMockCharacter({
  id: "kronk-jc-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const targetCharacter = createMockCharacter({
  id: "kronk-jc-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Kronk - Junior Chipmunk", () => {
  it("has Resist +1", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kronkJuniorChipmunk],
    });

    const cardModel = testEngine.getCardModel(kronkJuniorChipmunk);
    expect(cardModel.hasResist).toBe(true);
    expect(cardModel.damageReduction).toBe(1);
  });

  describe("SCOUT LEADER - During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.", () => {
    it("triggers optional ability when Kronk banishes a character in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kronkJuniorChipmunk, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }, targetCharacter],
          deck: 1,
        },
      );

      // Kronk challenges the weak defender (strength 4 vs willpower 1 — defender dies)
      expect(
        testEngine.asPlayerOne().challenge(kronkJuniorChipmunk, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Triggered optional ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and deal 2 damage to target
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kronkJuniorChipmunk, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: targetCharacter, value: 2 });
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger during opponent's turn when Kronk is challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kronkJuniorChipmunk, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, isDrying: false }],
          deck: 1,
        },
      );

      // Switch to player two's turn
      testEngine.asPlayerOne().passTurn();

      // Player two challenges Kronk with weakDefender
      // weakDefender (str 1) vs Kronk (wp 5) — Kronk lives, weakDefender takes 4 damage and dies
      expect(
        testEngine.asPlayerTwo().challenge(weakDefender, kronkJuniorChipmunk),
      ).toBeSuccessfulCommand();

      // Kronk's SCOUT LEADER ability should NOT trigger because it's not Kronk's controller's turn
      // and Kronk did not do the banishing
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("declining the optional ability does nothing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kronkJuniorChipmunk, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }, targetCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(kronkJuniorChipmunk, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kronkJuniorChipmunk, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: targetCharacter, value: 0 });
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
