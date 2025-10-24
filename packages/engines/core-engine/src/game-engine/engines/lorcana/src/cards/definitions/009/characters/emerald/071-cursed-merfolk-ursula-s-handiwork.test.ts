import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { cursedMerfolkUrsulasHandiwork } from "./071-cursed-merfolk-ursula-s-handiwork";

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
