/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mauisFishHook } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import { fredMajorScienceEnthusiast } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fred - Major Science Enthusiast", () => {
  it("SPITTING FIRE! When you play this character, you may banish chosen item.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: fredMajorScienceEnthusiast.cost,
        hand: [fredMajorScienceEnthusiast],
      },
      {
        play: [mauisFishHook],
      },
    );

    const target = testEngine.getCardModel(mauisFishHook);

    await testEngine.playCard(fredMajorScienceEnthusiast);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
