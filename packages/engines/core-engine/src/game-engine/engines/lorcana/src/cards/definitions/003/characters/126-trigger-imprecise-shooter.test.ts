/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { triggerImpreciseShooter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Trigger - Imprecise Shooter", () => {
  it.skip("**MY OL' BETSY** Your characters named Nutsy gain +1 {L}.", () => {
    const testStore = new TestStore({
      inkwell: triggerImpreciseShooter.cost,
      play: [triggerImpreciseShooter],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      triggerImpreciseShooter.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
