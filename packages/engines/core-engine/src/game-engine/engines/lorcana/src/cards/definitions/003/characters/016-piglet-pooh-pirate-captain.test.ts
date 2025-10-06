/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  eeyoreOverstuffedDonkey,
  pigletPoohPirateCaptain,
  wendyDarlingAuthorityOnPeterPan,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Piglet - Pooh Pirate Captain", () => {
  it("**AND I'M THE CAPTAIN!** While you have 2 or more other characters in play, this characters gets +2 {L}.", () => {
    const testStore = new TestStore({
      inkwell: eeyoreOverstuffedDonkey.cost,
      hand: [eeyoreOverstuffedDonkey],
      play: [pigletPoohPirateCaptain, wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      pigletPoohPirateCaptain.id,
    );
    const secondChar = testStore.getByZoneAndId(
      "hand",
      eeyoreOverstuffedDonkey.id,
    );
    const thirdChar = testStore.getCard(wendyDarlingAuthorityOnPeterPan);

    expect(cardUnderTest.lore).toEqual(pigletPoohPirateCaptain.lore);
    secondChar.playFromHand();
    expect(cardUnderTest.lore).toEqual(pigletPoohPirateCaptain.lore + 2);

    expect(secondChar.lore).toEqual(eeyoreOverstuffedDonkey.lore);
    expect(thirdChar.lore).toEqual(wendyDarlingAuthorityOnPeterPan.lore);
  });
});
