import { describe, expect, it } from "bun:test";
import { teKaTheBurningOne } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { annaMysticalMajesty } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  mufasaAmongTheStars,
  teKaElementalTerror,
  thomasOmalleyFelineCharmer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
    testEngine.changeActivePlayer("player_two");
    await testEngine.acceptOptionalLayer();

    expect(testEngine.getCardZone(mufasaAmongTheStars)).toBe("discard");
    expect(testEngine.getCardZone(thomasOmalleyFelineCharmer)).toBe("discard");
  });
});
