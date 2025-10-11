import { describe, expect, it } from "bun:test";
import { princeJohnGreediestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { rollyHungryPup } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { thunderboltWonderDog } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)", () => {
  it("should shift in a Puppy character", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [rollyHungryPup],
      hand: [thunderboltWonderDog],
    });

    const shiftedCard = testEngine.getCardModel(rollyHungryPup);
    const shiftCard = testEngine.getCardModel(thunderboltWonderDog);

    expect(shiftCard.canShiftInto(shiftedCard)).toBe(true);

    shiftCard.shift(shiftedCard);

    expect(shiftCard.zone).toBe("play");
    expect(shiftedCard.zone).toBe("play");
    expect(shiftedCard.meta?.shifter).toBe(shiftCard.instanceId);
    expect(shiftCard.meta?.shifted).toBe(shiftedCard.instanceId);
  });
  it("should not shift in a non-Puppy character", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [princeJohnGreediestOfAll],
      hand: [thunderboltWonderDog],
    });

    const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
    const shiftCard = testEngine.getCardModel(thunderboltWonderDog);

    expect(shiftCard.canShiftInto(shiftedCard)).toBe(false);

    shiftCard.shift(shiftedCard);

    expect(shiftCard.zone).toBe("hand");
    expect(shiftedCard.zone).toBe("play");
  });
});
