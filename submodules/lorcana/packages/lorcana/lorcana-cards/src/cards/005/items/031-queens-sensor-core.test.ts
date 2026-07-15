import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { queensSensorCore } from "./031-queens-sensor-core";

const royalHeir = createMockCharacter({
  id: "queens-sensor-core-royal-heir",
  name: "Royal Heir",
  cost: 2,
  classifications: ["Storyborn", "Princess"],
});

const queenCharacter = createMockCharacter({
  id: "queens-sensor-core-queen",
  name: "Queen Character",
  cost: 3,
  classifications: ["Storyborn", "Queen"],
});

describe("Queen's Sensor Core", () => {
  it("does not let you put a non-Princess/non-Queen character card into your hand", () => {
    const commoner = createMockCharacter({
      id: "queens-sensor-core-commoner",
      name: "Commoner",
      cost: 2,
      classifications: ["Storyborn", "Ally"],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [commoner],
      inkwell: 2,
      play: [queensSensorCore],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(queensSensorCore, {
        ability: "ROYAL SEARCH",
      }),
    ).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().resolvePendingEffect(queensSensorCore, {
      destinations: [
        {
          zone: "hand",
          cards: [commoner],
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(commoner)).not.toBe("hand");
  });

  it("reveals the top card and lets you put a Princess or Queen character card into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [royalHeir],
      inkwell: 2,
      play: [queensSensorCore],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(queensSensorCore, {
        ability: "ROYAL SEARCH",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(queensSensorCore, {
        destinations: [
          {
            zone: "hand",
            cards: [royalHeir],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(royalHeir)).toBe("hand");
  });

  describe("SYMBOL OF NOBILITY — At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.", () => {
    it("gains 1 lore at the start of your turn when you have a Princess character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queensSensorCore, royalHeir],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queensSensorCore),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("gains 1 lore at the start of your turn when you have a Queen character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queensSensorCore, queenCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queensSensorCore),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore at the start of your turn when you have no Princess or Queen character in play", () => {
      const nonRoyalCharacter = createMockCharacter({
        id: "queens-sensor-core-non-royal",
        name: "Non Royal Character",
        cost: 2,
        classifications: ["Storyborn", "Hero"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queensSensorCore, nonRoyalCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Trigger-level condition prevents phantom prompts when no Princess or Queen is present.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
