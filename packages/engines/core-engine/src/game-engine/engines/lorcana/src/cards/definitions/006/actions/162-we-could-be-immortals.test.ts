import { describe, expect, it } from "bun:test";

const donaldDuckStruttingHisStuff = {
  id: "donaldDuckStruttingHisStuff",
} as any;

import { weCouldBeImmortals } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("We Could Be Immortals", () => {
  it("_(A character with cost 4 or more can {E} to sing this song for free.)_Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: weCouldBeImmortals.cost,
      hand: [weCouldBeImmortals],
      play: [donaldDuckStruttingHisStuff],
    });

    const cardUnderTest = testEngine.getCardModel(weCouldBeImmortals);
    const inventor = testEngine.getCardModel(donaldDuckStruttingHisStuff);

    await testEngine.playCard(cardUnderTest);

    expect(inventor.hasResist).toBe(true);
    expect(cardUnderTest.zone).toBe("inkwell");
  });
});
