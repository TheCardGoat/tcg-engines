import { describe, expect, it } from "bun:test";
import { princePhillipGallantDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Phillip - Gallant Defender", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_ **BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      play: [princePhillipGallantDefender],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princePhillipGallantDefender.id,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
