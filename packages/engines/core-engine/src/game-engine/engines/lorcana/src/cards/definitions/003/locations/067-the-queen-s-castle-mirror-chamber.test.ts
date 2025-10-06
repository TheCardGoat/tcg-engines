/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  mamaOdieVoiceOfWisdom,
  nalaFierceFriend,
  robinHoodBelovedOutlaw,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { theQueensCastleMirrorChamber } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";

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
