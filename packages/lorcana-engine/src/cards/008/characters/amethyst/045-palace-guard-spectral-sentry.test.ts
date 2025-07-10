/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { palaceGuardSpectralSentry } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Palace Guard - Spectral Sentry", () => {
  it.skip("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: palaceGuardSpectralSentry.cost,
      play: [palaceGuardSpectralSentry],
      hand: [palaceGuardSpectralSentry],
    });

    await testEngine.playCard(palaceGuardSpectralSentry);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
