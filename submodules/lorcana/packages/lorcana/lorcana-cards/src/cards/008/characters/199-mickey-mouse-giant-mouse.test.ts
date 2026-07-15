import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseGiantMouse } from "./199-mickey-mouse-giant-mouse";

const banishAction = createMockAction({
  id: "giant-mouse-banish-action",
  name: "Banish Action",
  cost: 12,
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

const opponentCharacter1 = createMockCharacter({
  id: "giant-mouse-opp-1",
  name: "Opposing Character 1",
  cost: 5,
  strength: 5,
  willpower: 10,
});

const opponentCharacter2 = createMockCharacter({
  id: "giant-mouse-opp-2",
  name: "Opposing Character 2",
  cost: 3,
  strength: 3,
  willpower: 6,
});

const friendlyCharacter = createMockCharacter({
  id: "giant-mouse-friendly-1",
  name: "Friendly Character",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Mickey Mouse - Giant Mouse", () => {
  describe("THE BIGGEST STAR EVER", () => {
    it("deals 5 damage to each opposing character when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opponentCharacter1, opponentCharacter2],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mickeyMouseGiantMouse],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mickeyMouseGiantMouse] }),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        for (const bagEffect of bagEffects) {
          testEngine.asPlayerTwo().resolvePendingByCard(mickeyMouseGiantMouse);
        }
      }

      expect(testEngine.asPlayerOne().getDamage(opponentCharacter1)).toBe(5);
      expect(testEngine.asPlayerOne().getDamage(opponentCharacter2)).toBe(5);
    });

    it("does not damage friendly characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opponentCharacter1],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mickeyMouseGiantMouse, friendlyCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mickeyMouseGiantMouse] }),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        for (const bagEffect of bagEffects) {
          testEngine.asPlayerTwo().resolvePendingByCard(mickeyMouseGiantMouse);
        }
      }

      expect(testEngine.asPlayerOne().getDamage(opponentCharacter1)).toBe(5);
      expect(testEngine.asPlayerTwo().getDamage(friendlyCharacter)).toBe(0);
    });
  });

  it("regression: THE BIGGEST STAR EVER should only damage opposing characters, not all characters", () => {
    // Bug: Mickey Mouse was dealing damage to ALL characters instead of only opposing when banished.
    // The ability says "each opposing character" - friendly characters should not be damaged.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [opponentCharacter1],
        hand: [banishAction],
        inkwell: banishAction.cost,
        deck: 2,
      },
      {
        play: [mickeyMouseGiantMouse, friendlyCharacter],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(banishAction, { targets: [mickeyMouseGiantMouse] }),
    ).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerTwo().getBagEffects();
    if (bagEffects.length > 0) {
      for (const bagEffect of bagEffects) {
        testEngine.asPlayerTwo().resolvePendingByCard(mickeyMouseGiantMouse);
      }
    }

    // Player one's character (opposing to Mickey) should take 5 damage
    expect(testEngine.asPlayerOne().getDamage(opponentCharacter1)).toBe(5);

    // Player two's friendly character should NOT take damage
    expect(testEngine.asPlayerTwo().getDamage(friendlyCharacter)).toBe(0);
  });
});
