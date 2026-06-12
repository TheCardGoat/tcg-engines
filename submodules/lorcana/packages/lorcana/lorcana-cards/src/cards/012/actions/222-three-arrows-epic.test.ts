import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { threeArrowsEpic } from "./222-three-arrows-epic";

const target1 = createMockCharacter({
  id: "three-arrows-epic-target1",
  name: "Target One",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const target2 = createMockCharacter({
  id: "three-arrows-epic-target2",
  name: "Target Two",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Three Arrows (Epic)", () => {
  it("deals 2 damage to first target and optionally 1 to another", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [threeArrowsEpic],
        inkwell: threeArrowsEpic.cost,
      },
      {
        play: [target1, target2],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(threeArrowsEpic, { targets: [target1] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target1)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(threeArrowsEpic, {
        resolveOptional: true,
        targets: [target2],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(target2)).toBe(1);
  });
});
