import { describe, expect, it } from "bun:test";
import { hotPotato } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
