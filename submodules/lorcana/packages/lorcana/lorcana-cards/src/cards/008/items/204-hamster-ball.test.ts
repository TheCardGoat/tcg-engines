import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hamsterBall } from "./204-hamster-ball";

const healthyTarget = createMockCharacter({
  id: "hamster-ball-healthy-target",
  name: "Healthy Target",
  cost: 2,
});

const damagedTarget = createMockCharacter({
  id: "hamster-ball-damaged-target",
  name: "Damaged Target",
  cost: 2,
});

describe("Hamster Ball", () => {
  it("gives an undamaged character Resist +2 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [hamsterBall, healthyTarget],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(hamsterBall, {
        ability: "ROLL WITH THE PUNCHES",
        targets: [healthyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(healthyTarget, "Resist")).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(healthyTarget, "Resist")).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(healthyTarget, "Resist")).toBeNull();
  });

  it("does not let you target a damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [hamsterBall, damagedTarget],
    });

    testEngine.asServer().manualSetDamage(damagedTarget, 1);

    const result = testEngine.asPlayerOne().activateAbility(hamsterBall, {
      ability: "ROLL WITH THE PUNCHES",
      targets: [damagedTarget],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getKeywordValue(damagedTarget, "Resist")).toBeNull();
  });
});
