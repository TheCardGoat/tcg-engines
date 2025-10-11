import { describe, it } from "bun:test";
import { grandPabbieOldestAndWisest } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Grand Pabbie - Oldest and Wisest", () => {
  it.skip("**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: grandPabbieOldestAndWisest.cost,
      play: [grandPabbieOldestAndWisest],
      hand: [grandPabbieOldestAndWisest],
    });

    await testEngine.playCard(grandPabbieOldestAndWisest);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
