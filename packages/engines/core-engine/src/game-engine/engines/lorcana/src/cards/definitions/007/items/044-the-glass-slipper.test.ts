import { describe, expect, it } from "bun:test";
import {
  beastFrustratedDesigner,
  mulanImperialGeneral,
  theGlassSlipper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Glass Slipper", () => {
  it("SEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.", async () => {
    const testEngine = new TestEngine({
      deck: [mulanImperialGeneral],
      play: [theGlassSlipper, beastFrustratedDesigner],
    });

    await testEngine.activateCard(theGlassSlipper, {
      costs: [beastFrustratedDesigner],
    });
    expect(testEngine.getCardModel(theGlassSlipper).zone).toEqual("discard");
    expect(testEngine.getCardModel(beastFrustratedDesigner).exerted).toEqual(
      true,
    );

    await testEngine.resolveTopOfStack({ targets: [mulanImperialGeneral] });
    expect(testEngine.getCardModel(mulanImperialGeneral).zone).toEqual("hand");
  });
});
