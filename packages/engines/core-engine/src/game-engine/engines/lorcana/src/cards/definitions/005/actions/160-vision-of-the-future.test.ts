/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  maleficentMonstrousDragon,
  mauiHeroToAll,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { iceBlock } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { visionOfTheFuture } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
          hiramFlavershamToymaker,
          pawpsicle,
          iceBlock,
          sisuEmpoweredSibling,
        ],
        hand: [mauiHeroToAll],
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
