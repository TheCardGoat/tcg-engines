import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { roseLantern } from "./067-rose-lantern";

const damagedAlly = createMockCharacter({
  id: "rose-lantern-ally",
  name: "Rose Lantern Ally",
  cost: 2,
});

const opposingTarget = createMockCharacter({
  id: "rose-lantern-opponent",
  name: "Rose Lantern Opponent",
  cost: 2,
});

describe("Rose Lantern", () => {
  it("moves 1 damage from the chosen character to the chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [roseLantern, damagedAlly],
      },
      {
        play: [opposingTarget],
      },
    );

    testEngine.asServer().manualSetDamage(damagedAlly, 2);

    expect(
      testEngine.asPlayerOne().activateAbility(roseLantern, {
        targets: [damagedAlly, opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(roseLantern)).toBe(true);
  });
});
