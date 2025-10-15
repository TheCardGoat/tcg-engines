import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { naniProtectiveSister } from "./017-nani-protective-sister";

describe("Nani - Protective Sister", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
    const testEngine = new TestEngine({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
