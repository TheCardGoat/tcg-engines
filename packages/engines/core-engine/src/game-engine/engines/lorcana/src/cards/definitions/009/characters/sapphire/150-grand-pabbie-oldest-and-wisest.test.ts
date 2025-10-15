import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { grandPabbieOldestAndWisest } from "./150-grand-pabbie-oldest-and-wisest";

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
