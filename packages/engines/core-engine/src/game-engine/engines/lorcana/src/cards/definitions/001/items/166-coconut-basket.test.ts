/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiHeroToAll,
  mickeyBraveLittleTailor,
  peterPanNeverLanding,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { coconutbasket } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Coconut Basket", () => {
  it("Consider the Coconut - Whenever you play a character, you may remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: peterPanNeverLanding.cost + mickeyBraveLittleTailor.cost,
      hand: [peterPanNeverLanding, mickeyBraveLittleTailor],
      play: [coconutbasket, mauiHeroToAll],
    });

    const mauiu = testStore.getByZoneAndId("play", mauiHeroToAll.id);
    const peter = testStore.getByZoneAndId("hand", peterPanNeverLanding.id);
    const mickey = testStore.getByZoneAndId("hand", mickeyBraveLittleTailor.id);

    mauiu.updateCardMeta({ damage: 4 });

    peter.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targetId: mauiu.instanceId });

    expect(peter.zone).toEqual("play");
    expect(mauiu.meta.damage).toEqual(2);

    mickey.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targetId: mauiu.instanceId });

    expect(mauiu.meta.damage).toEqual(0);
    expect(peter.zone).toEqual("play");
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });

  it("it doesn't trigger when an opponent plays a character", () => {
    const testStore = new TestStore(
      {
        inkwell: peterPanNeverLanding.cost,
        hand: [peterPanNeverLanding],
      },
      {
        play: [coconutbasket, mauiHeroToAll],
      },
    );

    const peter = testStore.getByZoneAndId("hand", peterPanNeverLanding.id);

    peter.playFromHand();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
