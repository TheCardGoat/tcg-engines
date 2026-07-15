import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { herculesBabyDemigod } from "./086-hercules-baby-demigod";

const damagedTarget = createMockCharacter({
  id: "hercules-damaged-target",
  name: "Damaged Target",
  cost: 2,
  willpower: 4,
});

const undamagedTarget = createMockCharacter({
  id: "hercules-undamaged-target",
  name: "Undamaged Target",
  cost: 2,
  willpower: 4,
});

describe("Hercules - Baby Demigod", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [herculesBabyDemigod],
    });

    expect(testEngine.hasKeyword(herculesBabyDemigod, "Ward")).toBe(true);
  });

  it("deals 1 damage to a chosen damaged character for 3 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: herculesBabyDemigod.cost,
        play: [{ card: herculesBabyDemigod, isDrying: false }],
      },
      {
        play: [{ card: damagedTarget, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(herculesBabyDemigod, {
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: damagedTarget, value: 2 });
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("cannot target an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: herculesBabyDemigod.cost,
        play: [{ card: herculesBabyDemigod, isDrying: false }],
      },
      {
        play: [undamagedTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(herculesBabyDemigod, {
        targets: [undamagedTarget],
      }).success,
    ).toBe(false);
  });
});
