import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { devilsEyeDiamondEnchanted } from "./218-devils-eye-diamond-enchanted";

const yourDamagedCharacter = createMockCharacter({
  id: "devils-eye-diamond-enchanted-damaged-character",
  name: "Damaged Character",
  cost: 2,
  strength: 3,
  willpower: 5,
});

const opposingChallenger = createMockCharacter({
  id: "devils-eye-diamond-enchanted-opposing-challenger",
  name: "Opposing Challenger",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Devil's Eye Diamond Enchanted", () => {
  it("gains 1 lore if one of your characters was damaged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [devilsEyeDiamondEnchanted, { card: yourDamagedCharacter, isDrying: false }],
      },
      {
        play: [{ card: opposingChallenger, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(yourDamagedCharacter, opposingChallenger),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(devilsEyeDiamondEnchanted, {
        ability: "THE PRICE OF POWER",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not gain lore if none of your characters were damaged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [devilsEyeDiamondEnchanted],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(devilsEyeDiamondEnchanted, {
        ability: "THE PRICE OF POWER",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
