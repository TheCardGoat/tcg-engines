import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { doloresMadrigalEasyListener } from "./051-dolores-madrigal-easy-listener";

describe("Dolores Madrigal - Easy Listener", () => {
  it.skip("**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: doloresMadrigalEasyListener.cost,
      hand: [doloresMadrigalEasyListener],
    });

    await testEngine.playCard(doloresMadrigalEasyListener);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
