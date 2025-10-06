/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ursulaVanessa } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Ursula - Vanessa", () => {
  it.skip("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", async () => {
    const testEngine = new TestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
