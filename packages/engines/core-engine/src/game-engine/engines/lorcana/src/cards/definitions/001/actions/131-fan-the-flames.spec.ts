import { describe, expect, it } from "bun:test";
import { fanTheFlames } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fan The Flames", () => {
  it("Ready chosen character. They can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: fanTheFlames.cost,
      hand: [fanTheFlames],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", fanTheFlames.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    target.updateCardMeta({ exerted: true });
    expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
    expect(target.hasQuestRestriction).toBe(true);
  });
});
