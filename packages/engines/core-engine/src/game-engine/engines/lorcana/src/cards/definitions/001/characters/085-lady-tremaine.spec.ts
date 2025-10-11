/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { doItAgain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  ladyTremaine,
  scarShamelessFirebrand,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lady Tremaine", () => {
  it("DO IT AGAIN effect - returning own item", () => {
    const testStore = new TestStore({
      inkwell: ladyTremaine.cost,
      hand: [ladyTremaine],
      discard: [doItAgain],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ladyTremaine.id);
    const target = testStore.getByZoneAndId("discard", doItAgain.id);
    expect(target.zone).toEqual("discard");

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("hand");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
    );
  });

  it("DO IT AGAIN effect - no valid target", () => {
    const testStore = new TestStore({
      inkwell: ladyTremaine.cost,
      hand: [ladyTremaine],
      discard: [scarShamelessFirebrand],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ladyTremaine.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    testStore.resolveTopOfStack();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, deck: 0, discard: 1, play: 1 }),
    );
  });
});
