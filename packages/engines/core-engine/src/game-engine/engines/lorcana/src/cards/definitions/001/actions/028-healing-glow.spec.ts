import { describe, expect, it } from "bun:test";
import { healingGlow } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { magicBroomBucketBrigade } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("HealingGlow", () => {
  it("healing 2 damage", () => {
    const testStore = new TestStore({
      inkwell: healingGlow.cost,
      hand: [healingGlow],
      play: [magicBroomBucketBrigade],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
    const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
    target.updateCardMeta({ damage: 2 });
    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 2 }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));
  });

  it("healing 1 damage", () => {
    const testStore = new TestStore({
      inkwell: healingGlow.cost,
      hand: [healingGlow],
      play: [magicBroomBucketBrigade],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
    const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
    target.updateCardMeta({ damage: 1 });
    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 1 }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));
  });

  it("healing 0 damage", () => {
    const testStore = new TestStore({
      inkwell: healingGlow.cost,
      hand: [healingGlow],
      play: [magicBroomBucketBrigade],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", healingGlow.id);
    const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
    target.updateCardMeta({ damage: 0 });
    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
    ).toEqual(expect.objectContaining({ damage: 0 }));
  });
});
