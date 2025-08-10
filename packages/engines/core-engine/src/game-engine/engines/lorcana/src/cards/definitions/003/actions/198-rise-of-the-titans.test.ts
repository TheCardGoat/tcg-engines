import { describe, expect, it } from "bun:test";
import { riseOfTheTitans } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { cleansingRainwater } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import { agrabahMarketplace } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rise of the Titans", () => {
  it("Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: riseOfTheTitans.cost,
      hand: [riseOfTheTitans],
      play: [cleansingRainwater],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
    const target = testStore.getByZoneAndId("play", cleansingRainwater.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });

  it("Banish chosen location.", () => {
    const testStore = new TestStore({
      inkwell: riseOfTheTitans.cost,
      hand: [riseOfTheTitans],
      play: [agrabahMarketplace],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", riseOfTheTitans.id);
    const target = testStore.getByZoneAndId("play", agrabahMarketplace.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
