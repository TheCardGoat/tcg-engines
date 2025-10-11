import { describe, expect, it } from "bun:test";
import { ursulaVanessa } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Vanessa", () => {
  it.skip("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", async () => {
    const testEngine = new TestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
