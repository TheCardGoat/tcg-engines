import { describe, expect, it } from "bun:test";
import { unfortunateSituation } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Unfortunate Situation", () => {
  it.skip("Each opponent chooses one of their characters and deals 4 damage to them.", async () => {
    const testEngine = new TestEngine({
      inkwell: unfortunateSituation.cost,
      play: [unfortunateSituation],
      hand: [unfortunateSituation],
    });

    await testEngine.playCard(unfortunateSituation);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
