/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princeJohnGreediestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { baymaxGiantRobot } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)", () => {
  it("should shift in any character", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [princeJohnGreediestOfAll],
      hand: [baymaxGiantRobot],
    });

    const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
    const shiftCard = testEngine.getCardModel(baymaxGiantRobot);

    expect(shiftCard.canShiftInto(shiftedCard)).toBe(true);

    shiftCard.shift(shiftedCard);

    expect(shiftCard.zone).toBe("play");
    expect(shiftedCard.zone).toBe("play");
    expect(shiftedCard.meta?.shifter).toBe(shiftCard.instanceId);
    expect(shiftCard.meta?.shifted).toBe(shiftedCard.instanceId);
  });
});
describe("FUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.", () => {
  it("", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [princeJohnGreediestOfAll],
      hand: [baymaxGiantRobot],
    });

    const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
    shiftedCard.damage = 1;
    expect(shiftedCard.damage).toEqual(1);
    const shiftCard = testEngine.getCardModel(baymaxGiantRobot);

    shiftCard.shift(shiftedCard);

    expect(shiftCard.damage).toEqual(0);
  });
});
