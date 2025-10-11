import { describe, it } from "bun:test";
import { elsaStormChaser } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
