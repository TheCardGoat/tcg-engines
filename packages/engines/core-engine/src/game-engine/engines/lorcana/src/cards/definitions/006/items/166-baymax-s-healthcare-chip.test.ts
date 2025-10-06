/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { baymaxsHealthcareChip } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Baymax's Healthcare Chip", () => {
  it.skip("10,000 MEDICAL PROCEDURES {E} - Choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: baymaxsHealthcareChip.cost,
      play: [baymaxsHealthcareChip],
      hand: [baymaxsHealthcareChip],
    });

    await testEngine.playCard(baymaxsHealthcareChip);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* Remove up to 1 damage from chosen character. ", async () => {
    const testEngine = new TestEngine({
      inkwell: baymaxsHealthcareChip.cost,
      play: [baymaxsHealthcareChip],
      hand: [baymaxsHealthcareChip],
    });

    await testEngine.playCard(baymaxsHealthcareChip);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* If you have a Robot character in play, remove up to 3 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: baymaxsHealthcareChip.cost,
      play: [baymaxsHealthcareChip],
      hand: [baymaxsHealthcareChip],
    });

    await testEngine.playCard(baymaxsHealthcareChip);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
