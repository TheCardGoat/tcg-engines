/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  herculesTrueHero,
  lefouInstigator,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Lefou Instigator", () => {
  it("FAN THE FLAMES effect- Ready chosen character they can't quest", () => {
    const testStore = new TestStore({
      inkwell: lefouInstigator.cost,
      play: [herculesTrueHero],
      hand: [lefouInstigator],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", lefouInstigator.id);
    const target = testStore.getByZoneAndId("play", herculesTrueHero.id);
    target.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(testStore.getByZoneAndId("play", herculesTrueHero.id).meta).toEqual(
      expect.objectContaining({ exerted: false }),
    );
  });
});
