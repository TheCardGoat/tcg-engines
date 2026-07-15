import { describe, expect, it } from "bun:test";
import {
  PLAYER_ONE,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theSwordOfShanyu } from "./152-the-sword-of-shan-yu";

const exertedCostCharacter = createMockCharacter({
  id: "shan-yu-cost-character",
  name: "Cost Character",
  cost: 2,
});

const readyTarget = createMockCharacter({
  id: "shan-yu-ready-target",
  name: "Ready Target",
  cost: 2,
});

const exhaustedCostCharacter = createMockCharacter({
  id: "shan-yu-exhausted-cost",
  name: "Exhausted Cost Character",
  cost: 2,
});

const dryingCostCharacter = createMockCharacter({
  id: "shan-yu-drying-cost",
  name: "Drying Cost Character",
  cost: 2,
});

describe("The Sword of Shan-Yu", () => {
  it("exerts one of your characters as a cost, then readies the chosen character and stops them from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theSwordOfShanyu,
        { card: exertedCostCharacter, isDrying: false },
        { card: readyTarget, exerted: true, isDrying: false },
      ],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theSwordOfShanyu, {
        ability: "WORTHY WEAPON",
        costs: {
          exertCharacters: [exertedCostCharacter],
        },
        targets: [readyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(theSwordOfShanyu)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(exertedCostCharacter)).toBe(true);
    expect(testEngine.asPlayerOne()).toBeReady(readyTarget);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: readyTarget,
      restriction: "cant-quest",
    });

    const questResult = testEngine.asPlayerOne().quest(readyTarget);
    expect(questResult.success).toBe(false);
  });

  it("rejects an exhausted character as the additional exert cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theSwordOfShanyu,
        { card: exhaustedCostCharacter, exerted: true, isDrying: false },
        { card: readyTarget, exerted: true, isDrying: false },
      ],
    });

    const exhaustedCostId = testEngine.findCardInstanceId(
      exhaustedCostCharacter,
      "play",
      PLAYER_ONE,
    );
    expect(testEngine.asServer().getCard(exhaustedCostId)?.exerted).toBe(true);

    const result = testEngine.asPlayerOne().activateAbility(theSwordOfShanyu, {
      ability: "WORTHY WEAPON",
      costs: {
        exertCharacters: [exhaustedCostCharacter],
      },
      targets: [readyTarget],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(theSwordOfShanyu)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(readyTarget)).toBe(true);
  });

  it("rejects a drying character as the additional exert cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theSwordOfShanyu,
        { card: dryingCostCharacter, isDrying: true },
        { card: readyTarget, exerted: true, isDrying: false },
      ],
    });

    const result = testEngine.asPlayerOne().activateAbility(theSwordOfShanyu, {
      ability: "WORTHY WEAPON",
      costs: {
        exertCharacters: [dryingCostCharacter],
      },
      targets: [readyTarget],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(theSwordOfShanyu)).toBe(false);
  });
});
