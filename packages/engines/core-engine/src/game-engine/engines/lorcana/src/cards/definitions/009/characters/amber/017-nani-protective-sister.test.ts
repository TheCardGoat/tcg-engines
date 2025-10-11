import { describe, expect, it } from "bun:test";
import { naniProtectiveSister } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nani - Protective Sister", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
    const testEngine = new TestEngine({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
