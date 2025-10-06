/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { bobbyPurplePigeon } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Bobby - Purple Pigeon", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [bobbyPurplePigeon],
    });

    const cardUnderTest = testEngine.getCardModel(bobbyPurplePigeon);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
