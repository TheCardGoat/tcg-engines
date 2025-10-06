/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mattiasArendelleGeneral } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
