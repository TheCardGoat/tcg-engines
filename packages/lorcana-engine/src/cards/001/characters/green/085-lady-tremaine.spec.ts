/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { doItAgain } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import {
  ladyTremaine,
  scarShamelessFirebrand,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
