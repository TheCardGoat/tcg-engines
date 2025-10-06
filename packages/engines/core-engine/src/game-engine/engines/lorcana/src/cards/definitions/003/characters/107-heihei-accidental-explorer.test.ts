/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { heiheiAccidentalExplorer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("HeiHei - Accidental Explorer", () => {
  it.skip("**MINDLESS WANDERING** Once per turn, when this character moves to a location, each opponent loses 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: heiheiAccidentalExplorer.cost,
      play: [heiheiAccidentalExplorer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      heiheiAccidentalExplorer.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
