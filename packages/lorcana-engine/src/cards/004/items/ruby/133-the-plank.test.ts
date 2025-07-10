/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { robinHoodChampionOfSherwood } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { thePlank } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Plank", () => {
  it("**WALK!** 2 {I}, Banish this item: Banish chosen Hero character.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      play: [thePlank, robinHoodChampionOfSherwood],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", thePlank.id);
    const target = testStore.getByZoneAndId(
      "play",
      robinHoodChampionOfSherwood.id,
    );

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ mode: "1" }, true);
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });

  it("**WALK!** 2 {I}, Banish this item: Ready chosen Villain character. They can't quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      play: [thePlank, tamatoaSoShiny],
    });
    const cardUnderTest = testStore.getByZoneAndId("play", thePlank.id);

    const target = testStore.getCard(tamatoaSoShiny);
    target.updateCardMeta({ exerted: true });

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ mode: "2" }, true);
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.meta.exerted).toEqual(false);
  });
});
