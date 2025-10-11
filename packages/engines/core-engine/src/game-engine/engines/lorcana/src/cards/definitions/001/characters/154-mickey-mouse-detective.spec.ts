/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mauriceWorldFamousInventor,
  mickeyMouseDetective,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Detective", () => {
  it("**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: mickeyMouseDetective.cost,
      deck: [mauriceWorldFamousInventor],
      hand: [mickeyMouseDetective],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      mickeyMouseDetective.id,
    );

    const topDeckCard = testStore.getByZoneAndId(
      "deck",
      mauriceWorldFamousInventor.id,
    );

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [topDeckCard] });

    expect(topDeckCard.zone).toEqual("inkwell");
    expect(topDeckCard.ready).toEqual(false);
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
