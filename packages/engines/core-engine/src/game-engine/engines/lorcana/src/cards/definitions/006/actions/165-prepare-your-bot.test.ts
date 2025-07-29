import { describe, expect, it } from "bun:test";
import { prepareYourBot } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prepare Your Bot", () => {
  it.skip("Choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: prepareYourBot.cost,
      play: [prepareYourBot],
      hand: [prepareYourBot],
    });

    await testEngine.playCard(prepareYourBot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* Ready chosen item.", async () => {
    const testEngine = new TestEngine({
      inkwell: prepareYourBot.cost,
      play: [prepareYourBot],
      hand: [prepareYourBot],
    });

    await testEngine.playCard(prepareYourBot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* Ready chosen Robot character. They can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: prepareYourBot.cost,
      play: [prepareYourBot],
      hand: [prepareYourBot],
    });

    await testEngine.playCard(prepareYourBot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
