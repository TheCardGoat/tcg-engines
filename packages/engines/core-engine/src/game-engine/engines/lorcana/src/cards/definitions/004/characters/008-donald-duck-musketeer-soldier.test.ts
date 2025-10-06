/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { donaldDuckMusketeerSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
