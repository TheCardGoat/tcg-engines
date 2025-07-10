/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donaldDuckMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { snowWhiteLostInTheForest } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Snow White - Lost in the Forest", () => {
  it("**I WON'T HURT YOU** When you play this character, you may remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: snowWhiteLostInTheForest.cost,
      hand: [snowWhiteLostInTheForest],
      play: [donaldDuckMusketeer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      snowWhiteLostInTheForest.id,
    );
    const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);

    target.updateCardMeta({ damage: 3 });

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.zone).toEqual("play");
    expect(target.meta.damage).toEqual(1);
  });
});
