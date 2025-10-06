/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { cursedMerfolkUrsulasHandiwork } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Cursed Merfolk - Ursula's Handiwork", () => {
  it.skip("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: cursedMerfolkUrsulasHandiwork.cost,
      play: [cursedMerfolkUrsulasHandiwork],
      hand: [cursedMerfolkUrsulasHandiwork],
    });

    await testEngine.playCard(cursedMerfolkUrsulasHandiwork);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
