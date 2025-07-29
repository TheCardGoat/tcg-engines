import { describe, expect, it } from "bun:test";
import { thisIsMyFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("This Is My Family", () => {
  it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: thisIsMyFamily.cost,
      play: [thisIsMyFamily],
      hand: [thisIsMyFamily],
    });

    await testEngine.playCard(thisIsMyFamily);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Gain 1 lore. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: thisIsMyFamily.cost,
      play: [thisIsMyFamily],
      hand: [thisIsMyFamily],
    });

    await testEngine.playCard(thisIsMyFamily);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
