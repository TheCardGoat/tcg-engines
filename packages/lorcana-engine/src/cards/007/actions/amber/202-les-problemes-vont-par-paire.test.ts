/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { doubleTrouble } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Les Problemes Vont Par Paire", () => {
  it.skip("Choose up to 2 characters and deal 1 damage to each.", async () => {
    const testEngine = new TestEngine({
      inkwell: doubleTrouble.cost,
      play: [doubleTrouble],
      hand: [doubleTrouble],
    });

    await testEngine.playCard(doubleTrouble);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
