/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  liloMakingAWish,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { kingLouieJungleVip } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("King Louie - Jungle VIP", () => {
  it("**LAY IT ON THE LINE** Whenever another character is banished, you may remove up to 2 damage from this character.", () => {
    const testStore = new TestStore(
      {
        play: [kingLouieJungleVip, liloGalacticHero, liloMakingAWish],
      },
      {
        play: [stichtNewDog],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      kingLouieJungleVip.id,
    );
    const targetOne = testStore.getByZoneAndId("play", liloGalacticHero.id);
    const targetTwo = testStore.getByZoneAndId("play", liloMakingAWish.id);
    const targetThree = testStore.getByZoneAndId(
      "play",
      stichtNewDog.id,
      "player_two",
    );

    cardUnderTest.updateCardDamage(5);

    targetOne.banish();
    expect(cardUnderTest.damage).toBe(5 - 2);

    targetTwo.banish();
    expect(cardUnderTest.damage).toBe(5 - 4);

    targetThree.banish();
    expect(cardUnderTest.damage).toBe(0);
  });
});
