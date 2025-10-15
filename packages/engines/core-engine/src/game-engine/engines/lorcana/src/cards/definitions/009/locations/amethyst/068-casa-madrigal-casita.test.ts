import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { casaMadrigalCasita } from "./068-casa-madrigal-casita";

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
