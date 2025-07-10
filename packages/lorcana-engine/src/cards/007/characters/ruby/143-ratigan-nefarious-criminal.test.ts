/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ratiganNefariousCriminal } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Ratigan - Nefarious Criminal", () => {
  it.skip("A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: ratiganNefariousCriminal.cost,
      play: [ratiganNefariousCriminal],
      hand: [ratiganNefariousCriminal],
    });

    await testEngine.playCard(ratiganNefariousCriminal);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
