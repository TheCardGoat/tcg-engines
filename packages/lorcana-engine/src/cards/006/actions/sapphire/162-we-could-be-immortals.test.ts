/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donaldDuckStruttingHisStuff } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { weCouldBeImmortals } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
