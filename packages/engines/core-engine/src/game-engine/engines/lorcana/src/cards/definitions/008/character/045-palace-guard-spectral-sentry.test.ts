/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { palaceGuardSpectralSentry } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

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
