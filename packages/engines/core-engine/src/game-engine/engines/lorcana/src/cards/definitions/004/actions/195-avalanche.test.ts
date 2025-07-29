import { describe, expect, it } from "bun:test";
import {
  belleBookworm,
  belleHiddenArcher,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { avalanche } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { theLibraryAGiftForBelle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
