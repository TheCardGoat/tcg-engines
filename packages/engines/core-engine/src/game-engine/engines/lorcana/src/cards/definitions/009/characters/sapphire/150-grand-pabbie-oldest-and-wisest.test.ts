/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { grandPabbieOldestAndWisest } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
