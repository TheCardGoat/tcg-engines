import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dashParrVioletParrSuperSiblings } from "./133-dash-parr-violet-parr-super-siblings";

const dashBase = createMockCharacter({
  id: "dash-violet-super-siblings-dash-base",
  name: "Dash Parr",
  cost: 2,
});

const violetBase = createMockCharacter({
  id: "dash-violet-super-siblings-violet-base",
  name: "Violet Parr",
  cost: 2,
});

describe("Dash Parr & Violet Parr - Super Siblings", () => {
  it("inherits drying and exerted state from either Combo Shift target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dashParrVioletParrSuperSiblings],
      play: [
        { card: dashBase, isDrying: false },
        { card: violetBase, isDrying: true, exerted: true },
      ],
      inkwell: 6,
    });
    const dashTarget = testEngine.findCardInstanceId(dashBase, "play", PLAYER_ONE);
    const violetTarget = testEngine.findCardInstanceId(violetBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(dashParrVioletParrSuperSiblings, {
        cost: {
          cost: "shift",
          shiftTarget: dashTarget,
          additionalShiftTargets: [violetTarget],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(dashParrVioletParrSuperSiblings)).toBe(true);
    expect(testEngine.asPlayerOne().quest(dashParrVioletParrSuperSiblings).success).toBe(false);
  });
});
