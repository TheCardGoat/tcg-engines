/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { elsaStormChaser } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Elsa - Storm Chaser", () => {
  it.skip("**TEMPEST** {E}− Chosen character gains **Challenger** +2 and **Rush** this turn. _(They get +2 {S} while challenging. They can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      inkwell: elsaStormChaser.cost,
      play: [elsaStormChaser],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", elsaStormChaser.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
