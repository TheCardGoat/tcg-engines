/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { annaMysticalMajesty } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import {
  mufasaAmongTheStars,
  teKaElementalTerror,
  thomasOmalleyFelineCharmer,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Te Kā - Elemental Terror", () => {
  it("Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Te Kā.)", async () => {
    const testEngine = new TestEngine({
      inkwell: teKaElementalTerror.cost,
      play: [teKaTheBurningOne],
      hand: [teKaElementalTerror],
    });

    const cardUnderTest = testEngine.getCardModel(teKaElementalTerror);
    expect(cardUnderTest.hasShift).toBe(true);

    await testEngine.shiftCard({
      shifted: teKaTheBurningOne,
      shifter: teKaElementalTerror,
    });

    expect(testEngine.getCardZone(teKaElementalTerror)).toBe("play");
  });

  it("ANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: annaMysticalMajesty.cost,
        hand: [annaMysticalMajesty],
        play: [teKaElementalTerror],
      },
      {
        play: [mufasaAmongTheStars, thomasOmalleyFelineCharmer],
      },
    );

    // Anna exerts all opposing characters
    await testEngine.playCard(annaMysticalMajesty);

    expect(testEngine.getCardZone(mufasaAmongTheStars)).toBe("discard");
    expect(testEngine.getCardZone(thomasOmalleyFelineCharmer)).toBe("discard");
  });
});
