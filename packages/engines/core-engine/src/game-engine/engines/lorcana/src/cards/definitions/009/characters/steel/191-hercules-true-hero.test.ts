import { describe, expect, it } from "bun:test";
import { herculesTrueHero } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hercules - True Hero", () => {
  it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
    const testEngine = new TestEngine({
      play: [herculesTrueHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesTrueHero);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
