/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { wreckitRalphHamHands } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Wreck-it Ralph - Ham Hands", () => {
  it.skip("I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphHamHands.cost,
      play: [wreckitRalphHamHands],
      hand: [wreckitRalphHamHands],
    });

    await testEngine.playCard(wreckitRalphHamHands);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
