/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { tangle } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { fourDozenEggs } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { minnieMouseWideEyedDiver } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Minnie Mouse - Wide-Eyed Diver", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [minnieMouseWideEyedDiver],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseWideEyedDiver.id,
    );

    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive", () => {
    const testStore = new TestStore({
      play: [minnieMouseWideEyedDiver],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseWideEyedDiver.id,
    );

    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("**UNDERSEA ADVENTURE** Whenever you play a second action in a turn, this character gets +2 {L} this turn.", () => {
    const testStore = new TestStore({
      inkwell: grabYourSword.cost + fourDozenEggs.cost + tangle.cost,
      hand: [grabYourSword, fourDozenEggs, tangle],
      play: [minnieMouseWideEyedDiver],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseWideEyedDiver.id,
    );
    const actionOne = testStore.getByZoneAndId("hand", grabYourSword.id);
    const actionTwo = testStore.getByZoneAndId("hand", fourDozenEggs.id);
    const actionThree = testStore.getByZoneAndId("hand", tangle.id);

    actionOne.playFromHand();
    expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore);

    actionTwo.playFromHand();
    expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);

    actionThree.playFromHand();
    expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);
  });
});
