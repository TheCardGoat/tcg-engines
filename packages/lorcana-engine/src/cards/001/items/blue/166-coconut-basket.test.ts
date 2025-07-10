/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mauiHeroToAll,
  mickeyBraveLittleTailor,
  peterPanNeverLanding,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { coconutbasket } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
