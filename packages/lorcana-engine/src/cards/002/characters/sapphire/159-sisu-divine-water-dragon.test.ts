/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  mauiDemiGod,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  goofyKnightForADay,
  sisuDivineWaterDragon,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sisu - Divine Water Dragon", () => {
  it("**I TRUST YOU** Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      play: [sisuDivineWaterDragon],
      deck: [liloGalacticHero, goofyKnightForADay, mauiDemiGod],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sisuDivineWaterDragon.id,
    );
    const top = testStore.getByZoneAndId("deck", mauiDemiGod.id);
    const middle = testStore.getByZoneAndId("deck", goofyKnightForADay.id);
    const bottom = testStore.getByZoneAndId("deck", liloGalacticHero.id);

    cardUnderTest.quest();

    testStore.resolveTopOfStack({ scry: { hand: [middle], bottom: [top] } });

    expect(middle.zone).toBe("hand");
    expect(top.zone).toBe("deck");
  });
});
