/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { headsHeldHigh } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
