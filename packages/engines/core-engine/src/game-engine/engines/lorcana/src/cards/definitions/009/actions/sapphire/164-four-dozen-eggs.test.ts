import { describe, it } from "bun:test";
import { fourDozenEggs } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Four Dozen Eggs", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this", async () => {
    const testEngine = new TestEngine({
      inkwell: fourDozenEggs.cost,
      play: [fourDozenEggs],
      hand: [fourDozenEggs],
    });

    await testEngine.playCard(fourDozenEggs);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: fourDozenEggs.cost,
      play: [fourDozenEggs],
      hand: [fourDozenEggs],
    });

    await testEngine.playCard(fourDozenEggs);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: fourDozenEggs.cost,
      play: [fourDozenEggs],
      hand: [fourDozenEggs],
    });

    await testEngine.playCard(fourDozenEggs);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
