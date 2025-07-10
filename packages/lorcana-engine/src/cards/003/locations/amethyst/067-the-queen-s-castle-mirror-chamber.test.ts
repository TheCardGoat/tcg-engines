/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  mamaOdieVoiceOfWisdom,
  nalaFierceFriend,
  robinHoodBelovedOutlaw,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { theQueensCastleMirrorChamber } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Queen's Castle - Mirror Chamber", () => {
  it("**USING THE MIRROR** At the start of your turn, for each character you have here, you may draw a card.", () => {
    const testEngine = new TestEngine(
      {},
      {
        inkwell: theQueensCastleMirrorChamber.cost,
        play: [
          theQueensCastleMirrorChamber,
          mamaOdieVoiceOfWisdom,
          robinHoodBelovedOutlaw,
          nalaFierceFriend,
        ],
        deck: 5,
      },
    );

    const cardUnderTest = testEngine.getCardModel(theQueensCastleMirrorChamber);
    const mamaOdie = testEngine.getCardModel(mamaOdieVoiceOfWisdom);
    const robinHood = testEngine.getCardModel(robinHoodBelovedOutlaw);
    const nala = testEngine.getCardModel(nalaFierceFriend);

    [mamaOdie, robinHood, nala].forEach((character) => {
      character.enterLocation(cardUnderTest);
    });

    testEngine.passTurn();

    expect(testEngine.getZonesCardCount("player_two").deck).toBe(5);
    testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount("player_two").deck).toBe(1);
  });
});
