/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hotPotato } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Hot Potato", () => {
  it.skip("Choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: hotPotato.cost,
      play: [hotPotato],
      hand: [hotPotato],
    });

    await testEngine.playCard(hotPotato);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("· Deal 2 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: hotPotato.cost,
      play: [hotPotato],
      hand: [hotPotato],
    });

    await testEngine.playCard(hotPotato);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("· Banish chosen item.", async () => {
    const testEngine = new TestEngine({
      inkwell: hotPotato.cost,
      play: [hotPotato],
      hand: [hotPotato],
    });

    await testEngine.playCard(hotPotato);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
