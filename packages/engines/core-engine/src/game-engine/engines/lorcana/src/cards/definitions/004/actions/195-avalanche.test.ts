/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  belleBookworm,
  belleHiddenArcher,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { avalanche } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { theLibraryAGiftForBelle } from "@lorcanito/lorcana-engine/cards/005/locations/locations.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Avalanche", () => {
  it("Deal 1 damage to each opposing character. You may banish chosen location.", () => {
    const testStore = new TestStore(
      {
        inkwell: avalanche.cost,
        hand: [avalanche],
      },
      {
        play: [theLibraryAGiftForBelle, belleBookworm, belleHiddenArcher],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", avalanche.id);

    const target = testStore.getCard(theLibraryAGiftForBelle);
    const charOne = testStore.getCard(belleBookworm);
    const charTwo = testStore.getCard(belleHiddenArcher);

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    expect(charOne.damage).toEqual(1);
    expect(charTwo.damage).toEqual(1);
  });
});
