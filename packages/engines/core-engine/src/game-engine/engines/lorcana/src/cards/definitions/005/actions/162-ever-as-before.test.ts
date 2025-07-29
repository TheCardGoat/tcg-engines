/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { everAsBefore } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Ever as Before", () => {
  it.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.", () => {
    const testStore = new TestStore({
      inkwell: everAsBefore.cost,
      hand: [everAsBefore],
    });

    const cardUnderTest = testStore.getCard(everAsBefore);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
