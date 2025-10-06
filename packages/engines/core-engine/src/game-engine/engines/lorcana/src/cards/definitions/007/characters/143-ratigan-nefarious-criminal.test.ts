/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ratiganNefariousCriminal } from "~/game-engine/engines/lorcana/src/cards/definitions/007";

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
