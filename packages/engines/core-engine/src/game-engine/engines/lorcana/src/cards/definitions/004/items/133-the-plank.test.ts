import { describe, expect, it } from "bun:test";
import { tamatoaSoShiny } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { robinHoodChampionOfSherwood } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { thePlank } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
