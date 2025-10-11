import { describe, expect, it } from "bun:test";
import { donaldDuckMusketeer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { snowWhiteLostInTheForest } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
