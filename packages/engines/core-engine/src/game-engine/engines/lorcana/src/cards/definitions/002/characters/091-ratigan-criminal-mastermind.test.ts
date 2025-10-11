import { describe, expect, it } from "bun:test";
import { ratiganCriminalMastermind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ratigan - Criminal Mastermind", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ratiganCriminalMastermind.cost,
      play: [ratiganCriminalMastermind],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ratiganCriminalMastermind.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});

    expect(false).toBe(true);
  });
});
