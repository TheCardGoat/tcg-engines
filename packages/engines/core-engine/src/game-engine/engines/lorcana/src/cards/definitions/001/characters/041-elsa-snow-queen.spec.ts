/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  elsaSnowQueen,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Elsa - Snow Queen", () => {
  it("**Freeze** {E} - Exert chosen opposing character.", () => {
    const testStore = new TestStore(
      {
        play: [elsaSnowQueen],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", elsaSnowQueen.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );

    expect(target.ready).toEqual(true);

    cardUnderTest.activate();

    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.ready).toEqual(false);
  });
});
