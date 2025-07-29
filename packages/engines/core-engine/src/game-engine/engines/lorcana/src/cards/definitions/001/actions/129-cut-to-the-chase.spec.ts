/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import { cutToTheChase } from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Cut to the Chase", () => {
  it("Chosen character gains **Rush** this turn.", () => {
    const testStore = new TestStore({
      inkwell: cutToTheChase.cost,
      hand: [cutToTheChase],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", cutToTheChase.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasRush).toEqual(true);
  });
});
