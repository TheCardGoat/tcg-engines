/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tukTukDisarminglyCute } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Tuk Tuk - Disarmingly Cute", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it.skip("Resist +2 (Damage dealt to this character is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
