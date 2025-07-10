/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  mrSmeeBumblingMate,
  pigletPoohPirateCaptain,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { underTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { naveensUkulele } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Naveen's Ukulele", () => {
  it("MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: naveensUkulele.cost + 1,
        play: [arielSpectacularSinger],
        hand: [naveensUkulele, underTheSea],
      },
      {
        play: [
          daisyDuckDonaldsDate,
          pigletPoohPirateCaptain,
          mrSmeeBumblingMate,
        ],
      },
    );

    await testEngine.playCard(naveensUkulele);
    await testEngine.activateCard(naveensUkulele);
    await testEngine.resolveTopOfStack({ targets: [arielSpectacularSinger] });

    expect(testEngine.getCardModel(arielSpectacularSinger).singerCost).toBe(8);

    await testEngine.singSong({
      singer: arielSpectacularSinger,
      song: underTheSea,
    });

    expect(testEngine.getCardModel(daisyDuckDonaldsDate).zone).toBe("deck");
    expect(testEngine.getCardModel(pigletPoohPirateCaptain).zone).toBe("deck");
    expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("play");
  });
});
