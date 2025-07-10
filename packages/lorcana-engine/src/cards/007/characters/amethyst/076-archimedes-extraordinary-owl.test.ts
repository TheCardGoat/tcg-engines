/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { archimedesExtraordinaryOwl } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Archimedes - Extraordinary Owl", () => {
  it.skip("LEARN MORE Every time this character is targeted by an action or ability of an opposing person, you may draw 1 card.", async () => {
    const testEngine = new TestEngine({
      inkwell: archimedesExtraordinaryOwl.cost,
      play: [archimedesExtraordinaryOwl],
      hand: [archimedesExtraordinaryOwl],
    });

    await testEngine.playCard(archimedesExtraordinaryOwl);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
