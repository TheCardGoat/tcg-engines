import { describe, expect, it } from "bun:test";
import {
  maleficentMonstrousDragon,
  mauiHeroToAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { sisuEmpoweredSibling } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { iceBlock } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";
import { visionOfTheFuture } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { mauiHalfshark } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vision of the Future", () => {
  it("Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order. - Take one card", async () => {
    const testEngine = new TestEngine({
      inkwell: visionOfTheFuture.cost,
      hand: [visionOfTheFuture],
      deck: [
        maleficentMonstrousDragon,
        mauiHalfshark,
        hiramFlavershamToymaker,
        pawpsicle,
        iceBlock,
        sisuEmpoweredSibling,
        mauiHeroToAll,
      ],
    });

    await testEngine.playCard(visionOfTheFuture);

    await testEngine.resolveTopOfStack({
      scry: {
        bottom: [
          hiramFlavershamToymaker.id,
          pawpsicle.id,
          iceBlock.id,
          sisuEmpoweredSibling.id,
        ],
        hand: [mauiHeroToAll.id],
      },
    });

    expect(testEngine.getCardZone(mauiHeroToAll)).toEqual("hand");

    const bottomCard = testEngine.testStore.getZonesCards().deck[0];
    const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
    const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
    const fourthBottomCard = testEngine.testStore.getZonesCards().deck[3];

    expect(bottomCard?.lorcanitoCard?.name).toEqual(
      hiramFlavershamToymaker.name,
    );
    expect(secondBottomCard?.lorcanitoCard?.name).toEqual(pawpsicle.name);
    expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(iceBlock.name);
    expect(fourthBottomCard?.lorcanitoCard?.name).toEqual(
      sisuEmpoweredSibling.name,
    );
  });
});
