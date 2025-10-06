/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pigletPoohPirateCaptain } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { daisyDuckDonaldsDate } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { ladyMissParkAvenue } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lady - Miss Park Avenue", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)", async () => {
    const testEngine = new TestEngine({
      play: [ladyMissParkAvenue],
    });

    const cardUnderTest = testEngine.getCardModel(ladyMissParkAvenue);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: ladyMissParkAvenue.cost,
      hand: [ladyMissParkAvenue],
      discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
    });

    await testEngine.playCard(ladyMissParkAvenue);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
    });
    expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
    expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe("hand");
  });

  it("SOMETHING WONDERFUL - Allows 1 character", async () => {
    const testEngine = new TestEngine({
      inkwell: ladyMissParkAvenue.cost,
      hand: [ladyMissParkAvenue],
      discard: [daisyDuckDonaldsDate, pigletPoohPirateCaptain],
    });

    await testEngine.playCard(ladyMissParkAvenue);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [daisyDuckDonaldsDate] });
    expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("hand");
    expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe(
      "discard",
    );
  });
});
