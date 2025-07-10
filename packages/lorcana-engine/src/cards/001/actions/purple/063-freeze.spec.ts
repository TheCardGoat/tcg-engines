/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { freeze } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
