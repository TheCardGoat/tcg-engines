/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { auntCassBiggestFan } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Aunt Cass - Biggest Fan", () => {
  it.skip("HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: auntCassBiggestFan.cost,
      play: [auntCassBiggestFan],
      hand: [auntCassBiggestFan],
    });

    await testEngine.playCard(auntCassBiggestFan);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
