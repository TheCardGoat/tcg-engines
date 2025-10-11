import { describe, expect, it } from "bun:test";
import { tianaDiligentWaitress } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { mouseArmor } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mouse Armor", () => {
  it("**PROTECTION** {E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      play: [mouseArmor, tianaDiligentWaitress],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", mouseArmor.id);
    const target = testStore.getByZoneAndId("play", tianaDiligentWaitress.id);

    expect(target.hasResist).toBeFalsy();

    cardUnderTest.activate();
    expect(testStore.stackLayers).toHaveLength(1);

    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.meta.exerted).toBeTruthy();

    expect(target.hasResist).toBeTruthy();
    expect(target.damageReduction()).toEqual(1);
  });
});
