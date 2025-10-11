import { describe, it } from "bun:test";
import { megabot } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Megabot", () => {
  it.skip("HAPPY FACE This item enters play exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: megabot.cost,
      play: [megabot],
      hand: [megabot],
    });

    await testEngine.playCard(megabot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("DESTROY! {E}, Banish this item - Choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: megabot.cost,
      play: [megabot],
      hand: [megabot],
    });

    await testEngine.playCard(megabot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* Banish chosen item.", async () => {
    const testEngine = new TestEngine({
      inkwell: megabot.cost,
      play: [megabot],
      hand: [megabot],
    });

    await testEngine.playCard(megabot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("* Banish chosen damaged character.", async () => {
    const testEngine = new TestEngine({
      inkwell: megabot.cost,
      play: [megabot],
      hand: [megabot],
    });

    await testEngine.playCard(megabot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
