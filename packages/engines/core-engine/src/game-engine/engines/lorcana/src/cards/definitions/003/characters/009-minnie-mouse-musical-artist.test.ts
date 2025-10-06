/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { minnieMouseMusicalArtist } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  donaldDuckMusketeerSoldier,
  goofyMusketeerSwordsman,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Musical Artist", () => {
  it("**Singer** 3 _(This character counts as cost 3 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      hand: [friendsOnTheOtherSide],
      play: [minnieMouseMusicalArtist],
      deck: [mickeyBraveLittleTailor, mickeyBraveLittleTailor],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseMusicalArtist);
    const song = testEngine.getCardModel(friendsOnTheOtherSide);

    expect(cardUnderTest.hasSinger).toBe(true);

    cardUnderTest.sing(song);

    expect(testEngine.getCardZone(song)).toBe("discard");
  });

  it("**ENTOURAGE** Whenever you play a character with **Bodyguard**, you may remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: goofyMusketeerSwordsman.cost,
      play: [minnieMouseMusicalArtist, mickeyBraveLittleTailor],
      hand: [donaldDuckMusketeerSoldier],
    });

    const target = testEngine.getCardModel(mickeyBraveLittleTailor);

    await testEngine.setCardDamage(target, 3);

    await testEngine.playCard(donaldDuckMusketeerSoldier, { bodyguard: true });
    await testEngine.resolveTopOfStack({ targets: [target] }, true); // resolve donald duck ability
    await testEngine.resolveTopOfStack({ targets: [target] }, true); // resolve minnie mouse ability

    expect(target.damage).toBe(1);
  });
});
