/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { hadesLordOfTheUnderworld } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - Lord of the Underworld", () => {
  it.skip("SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: hadesLordOfTheUnderworld.cost,
      play: [hadesLordOfTheUnderworld],
      hand: [hadesLordOfTheUnderworld],
    });

    await testEngine.playCard(hadesLordOfTheUnderworld);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
