import { describe, expect, it } from "bun:test";
import { puaProtectivePig } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pua - Protective Pig", () => {
  it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [puaProtectivePig],
    });

    const cardUnderTest = testEngine.getCardModel(puaProtectivePig);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("FREE FRUIT When this character is banished, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      play: [puaProtectivePig],
    });

    const cardToTest = testEngine.getCardModel(puaProtectivePig);

    cardToTest.banish();

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardsByZone("hand").length).toBe(1);
    // await testEngine.resolveTopOfStack({});
  });
});
