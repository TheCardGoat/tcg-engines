/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { freeze } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  elsaSnowQueen,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
