import { describe, expect, it } from "bun:test";
import { smash } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { aladdinHeroicOutlaw } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Smash", () => {
  it("Deal 3 damage to chosen character", () => {
    const testStore = new TestStore({
      inkwell: smash.cost,
      hand: [smash],
      play: [aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", smash.id);
    const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
    target.updateCardMeta({ damage: 0 });
    expect(
      testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
    ).toEqual(expect.objectContaining({ damage: 3 }));
  });
});
