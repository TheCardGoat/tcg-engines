/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { baymaxsHealthcareChip } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
