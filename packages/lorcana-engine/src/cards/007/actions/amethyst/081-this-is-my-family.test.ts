/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
