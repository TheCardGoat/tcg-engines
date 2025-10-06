/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { benjaGuardianOfTheDragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { tinkerBellVeryCleverFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
