/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { casaMadrigalCasita } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Casa Madrigal - Casita", () => {
  it.skip("**OUR HOME** At the start of your turn, if you have a character here, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: casaMadrigalCasita.cost,
      play: [casaMadrigalCasita],
      hand: [casaMadrigalCasita],
    });

    await testEngine.playCard(casaMadrigalCasita);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
