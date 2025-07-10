/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { bobbyPurplePigeon } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Bobby - Purple Pigeon", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [bobbyPurplePigeon],
    });

    const cardUnderTest = testEngine.getCardModel(bobbyPurplePigeon);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
