import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { devilsEyeDiamond } from "./152-devils-eye-diamond";

const damagedAlly = createMockCharacter({
  id: "devils-eye-diamond-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingDefender = createMockCharacter({
  id: "devils-eye-diamond-opposing-defender",
  name: "Opposing Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Devil's Eye Diamond", () => {
  it("gains 1 lore if one of your characters was damaged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [devilsEyeDiamond, { card: damagedAlly, isDrying: false }],
      },
      {
        play: [{ card: opposingDefender, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(damagedAlly, opposingDefender),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(devilsEyeDiamond, {
        ability: "THE PRICE OF POWER",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not gain lore if none of your characters were damaged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [devilsEyeDiamond],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(devilsEyeDiamond, {
        ability: "THE PRICE OF POWER",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("regression: does not gain lore when a character has pre-existing damage but was not damaged THIS TURN", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [devilsEyeDiamond, damagedAlly],
    });

    // Manually set damage (this simulates pre-existing damage, not damage taken this turn)
    testEngine.asServer().manualSetDamage(damagedAlly, 2);

    // Activate the ability - the condition checks if a character was damaged THIS TURN
    expect(
      testEngine.asPlayerOne().activateAbility(devilsEyeDiamond, {
        ability: "THE PRICE OF POWER",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
