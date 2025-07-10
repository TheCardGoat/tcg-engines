/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  beastWolfbane,
  elsaSnowQueen,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Beast - Wolfbane", () => {
  it("**ROAR** When you play this character, exert all opposing damaged characters.", () => {
    const testStore = new TestStore(
      {
        hand: [beastWolfbane],
        inkwell: beastWolfbane.cost,
      },
      {
        play: [moanaOfMotunui, elsaSnowQueen],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", beastWolfbane.id);
    const target = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );
    target.updateCardMeta({ damage: 1 });
    const shouldNotBeTarget = testStore.getByZoneAndId(
      "play",
      elsaSnowQueen.id,
      "player_two",
    );
    shouldNotBeTarget.updateCardMeta({ damage: 0 });

    expect(target.ready).toEqual(true);
    expect(shouldNotBeTarget.ready).toEqual(true);

    cardUnderTest.playFromHand();

    expect(target.ready).toEqual(false);
    expect(shouldNotBeTarget.ready).toEqual(true);
  });
});
