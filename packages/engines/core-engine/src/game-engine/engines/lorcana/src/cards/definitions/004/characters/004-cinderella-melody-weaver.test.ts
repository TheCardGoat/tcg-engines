/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  rafikiMysterious,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { underTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { cinderellaMelodyWeaver } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Cinderella - Melody Weaver", () => {
  it("**Singer** 9 _(This character counts as cost 9 to sing songs.)_**BEAUTIFUL VOICE** Whenever this character sings a song, your other Princess characters get +1 {L} this turn.", () => {
    const testStore = new TestStore({
      hand: [underTheSea],
      play: [
        cinderellaMelodyWeaver,
        rapunzelGiftedWithHealing,
        cinderellaBallroomSensation,
        rafikiMysterious,
      ],
      deck: [underTheSea, underTheSea, underTheSea],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cinderellaMelodyWeaver.id,
    );

    // Fetch cards in play and song to sing
    const target1 = testStore.getByZoneAndId(
      "play",
      rapunzelGiftedWithHealing.id,
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );
    const target3 = testStore.getByZoneAndId("play", rafikiMysterious.id);
    const target4 = testStore.getByZoneAndId("play", cinderellaMelodyWeaver.id);
    const song = testStore.getByZoneAndId("hand", underTheSea.id);

    // Check if the card has the singer trait
    expect(cardUnderTest.hasSinger).toBe(true);

    // Sing the song
    cardUnderTest.sing(song);

    // Check if the other Princess characters have +1 lore and non-princess characters are unchanged
    expect(target1.lore).toEqual(3);
    expect(target2.lore).toEqual(2);
    expect(target3.lore).toEqual(1);
    expect(target4.lore).toEqual(2);

    // Pass the turn
    const response = testStore.passTurn();
    expect(response.success).toBeTruthy();

    // Check to see if after the turn has passed, the lore of the other Princess characters has decreased
    expect(target1.lore).toEqual(2);
    expect(target2.lore).toEqual(1);
    expect(target3.lore).toEqual(1);
    expect(target4.lore).toEqual(2);
  });
});
