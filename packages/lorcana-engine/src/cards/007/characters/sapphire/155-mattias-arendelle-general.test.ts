/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mattiasArendelleGeneral } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mattias - Arendelle General", () => {
  it.skip("PROUD TO SERVE Your Queen characters gain Ward. (Opponents can't choose them except to challenge.)", async () => {
    const testEngine = new TestEngine({
      inkwell: mattiasArendelleGeneral.cost,
      play: [mattiasArendelleGeneral],
      hand: [mattiasArendelleGeneral],
    });

    await testEngine.playCard(mattiasArendelleGeneral);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
