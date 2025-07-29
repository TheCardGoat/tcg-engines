import { describe, expect, it } from "bun:test";
import { freeze } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Freeze", () => {
  it("Exert chosen opponent character.", () => {
    const testStore = new TestStore(
      {
        inkwell: freeze.cost,
        hand: [freeze],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", freeze.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", moanaOfMotunui.id, "player_two").meta,
    ).toEqual(expect.objectContaining({ exerted: true }));
  });

  it("Exert chosen opponent character already exerted.", () => {
    const testStore = new TestStore(
      {
        inkwell: freeze.cost,
        hand: [freeze],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", freeze.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    target.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(
      testStore.getByZoneAndId("play", moanaOfMotunui.id, "player_two").meta,
    ).toEqual(expect.objectContaining({ exerted: true }));
  });
});
