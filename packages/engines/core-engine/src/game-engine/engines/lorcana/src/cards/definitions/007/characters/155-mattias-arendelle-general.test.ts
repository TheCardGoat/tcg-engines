/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mattiasArendelleGeneral } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
