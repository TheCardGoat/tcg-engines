/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  gastonArrogantHunter,
  liloMakingAWish,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/027-hakuna-matata";
import { recordPlayer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

describe("Record Player", () => {
  it("**LOOK AT THIS!** Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: hakunaMatata.cost,
      hand: [hakunaMatata],
      play: [recordPlayer, gastonArrogantHunter],
    });

    const target = testStore.getCard(gastonArrogantHunter);
    const trigger = testStore.getCard(hakunaMatata);

    trigger.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(gastonArrogantHunter.strength - 2);
  });

  it("**HIT PARADE** Your characters named Stitch count as having +1 cost to sing songs.", () => {
    const testStore = new TestStore({
      inkwell: recordPlayer.cost,
      play: [recordPlayer, stichtNewDog, liloMakingAWish],
    });

    const cardUnderTest = testStore.getCard(stichtNewDog);
    const anotherCard = testStore.getCard(liloMakingAWish);

    expect(cardUnderTest.singerCost).toEqual(stichtNewDog.cost + 1);
    expect(cardUnderTest.cost).toEqual(stichtNewDog.cost);
    expect(anotherCard.singerCost).toEqual(liloMakingAWish.cost);
  });
});
