/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goGoTomagoDartingDynamo } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { goGoTomagoCuttingEdge } from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Go Go Tomago - Cutting Edge", () => {
  it("Shift 4)", async () => {
    const testEngine = new TestEngine({
      play: [goGoTomagoCuttingEdge],
    });

    const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [goGoTomagoCuttingEdge],
    });

    const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
    console.log(JSON.stringify(cardUnderTest.nativeAbilities()));
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("ZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: goGoTomagoCuttingEdge.cost,
      hand: [goGoTomagoCuttingEdge],
      play: [goGoTomagoDartingDynamo],
    });

    await testEngine.shiftCard({
      shifter: goGoTomagoCuttingEdge,
      shifted: goGoTomagoDartingDynamo,
    });
    const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
    console.log(JSON.stringify(cardUnderTest.nativeAbilities()));

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [goGoTomagoCuttingEdge] });

    expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
      goGoTomagoCuttingEdge.cost + 2,
    );
    expect(testEngine.getCardModel(goGoTomagoDartingDynamo).zone).toBe(
      "inkwell",
    );

    expect(testEngine.getCardModel(goGoTomagoCuttingEdge).zone).toBe("inkwell");

    expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(0);
  });
});
