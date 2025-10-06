/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { lingImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Ling - Imperial Soldier", () => {
  it.skip("**FULL OF SPIRIT** Your Hero characters get +1 {S}.", () => {
    const testStore = new TestStore({
      inkwell: lingImperialSoldier.cost,
      play: [lingImperialSoldier],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      lingImperialSoldier.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
