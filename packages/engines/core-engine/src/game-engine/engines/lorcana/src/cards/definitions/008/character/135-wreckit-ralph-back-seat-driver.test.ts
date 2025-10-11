import { describe, expect, it } from "bun:test";
import {
  vanellopeVonSchweetzSpunkySpeedster,
  wreckitRalphBackSeatDriver,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Wreck-it Ralph - Back Seat Driver", () => {
  it("CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphBackSeatDriver.cost,
      hand: [wreckitRalphBackSeatDriver],
      play: [vanellopeVonSchweetzSpunkySpeedster],
    });

    const cardUnderTest = testEngine.getCardModel(wreckitRalphBackSeatDriver);
    const targetCard = testEngine.getCardModel(
      vanellopeVonSchweetzSpunkySpeedster,
    );

    await testEngine.playCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.strength).toEqual(
      vanellopeVonSchweetzSpunkySpeedster?.strength + 4,
    );
  });
});
