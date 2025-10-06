/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  bernardOverprepared,
  jimDearBelovedHusband,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Bernard - Over-Prepared", () => {
  it("GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: bernardOverprepared.cost + jimDearBelovedHusband.cost,
      hand: [bernardOverprepared],
      play: [jimDearBelovedHusband],
      deck: 1,
    });

    const initialHandCount = testEngine.getZonesCardCount().hand;
    expect(initialHandCount).toBe(1);

    await testEngine.playCard(bernardOverprepared);
    expect(testEngine.getZonesCardCount().hand).toBe(0);

    await testEngine.acceptOptionalLayer();

    expect(testEngine.getZonesCardCount().hand).toBe(1);
    expect(testEngine.getZonesCardCount().deck).toBe(0);
  });
});
