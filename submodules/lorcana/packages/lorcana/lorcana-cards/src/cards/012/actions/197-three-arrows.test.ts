import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { threeArrows } from "./197-three-arrows";

const target1 = createMockCharacter({
  id: "three-arrows-target1",
  name: "Target One",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const target2 = createMockCharacter({
  id: "three-arrows-target2",
  name: "Target Two",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Three Arrows", () => {
  it("deals 2 damage to first target and optionally 1 to another", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [target1, target2],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, { targets: [target1] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(threeArrows, {
        resolveOptional: true,
        targets: [target2],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target2)).toBe(1);
  });

  it("rejects targeting the same character for the optional second step", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [target1],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, { targets: [target1] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(threeArrows, {
        resolveOptional: true,
        targets: [target1],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(2);
  });

  it("does not deal additional damage when the optional is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrows],
        inkwell: threeArrows.cost,
      },
      {
        play: [target1, target2],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrows, { targets: [target1] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(threeArrows, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target2)).toBe(0);
  });
});
