import { describe, expect, it } from "bun:test";
import { headsHeldHigh } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heads Held High", () => {
  it.skip("Sing Together 6 (Any number of your or your teammates' characters with total cost 6 or more may {E} sing this song for free.) ", async () => {
    const testEngine = new TestEngine({
      inkwell: headsHeldHigh.cost,
      play: [headsHeldHigh],
      hand: [headsHeldHigh],
    });

    await testEngine.playCard(headsHeldHigh);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: headsHeldHigh.cost,
      play: [headsHeldHigh],
      hand: [headsHeldHigh],
    });

    await testEngine.playCard(headsHeldHigh);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
