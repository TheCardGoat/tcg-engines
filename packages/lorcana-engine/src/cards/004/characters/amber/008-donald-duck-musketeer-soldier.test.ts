/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { donaldDuckMusketeerSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Donald Duck - Musketeer Soldier", () => {
  it("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**WAIT FOR ME!** When you play this character, chosen character gets +1 {L} this turn.", () => {
    const testStore = new TestStore({
      inkwell: donaldDuckMusketeerSoldier.cost,
      hand: [donaldDuckMusketeerSoldier],
      play: [liloMakingAWish],
    });

    const cardUnderTest = testStore.getCard(donaldDuckMusketeerSoldier);
    const target = testStore.getCard(liloMakingAWish);

    cardUnderTest.playFromHand({ bodyguard: true });

    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.lore).toBe(liloMakingAWish.lore + 1);
  });
});
