/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { wreckitRalphHamHands } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

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
