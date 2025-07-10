/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { tinkerBellVeryCleverFairy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Tinker Bell - Very Clever Fairy", () => {
  it("**I CAN USE THAT** Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: benjaGuardianOfTheDragonGem.cost,
      play: [tinkerBellVeryCleverFairy, dingleHopper],
      hand: [benjaGuardianOfTheDragonGem],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      benjaGuardianOfTheDragonGem.id,
    );

    const target = testStore.getByZoneAndId("play", dingleHopper.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack(
      {
        targets: [target],
      },
      true,
    );

    expect(target.zone).toEqual("discard");

    testStore.resolveOptionalAbility();

    expect(target.zone).toEqual("inkwell");
    expect(testStore.getZonesCardCount().inkwell).toEqual(
      benjaGuardianOfTheDragonGem.cost + 1,
    );
  });
});
