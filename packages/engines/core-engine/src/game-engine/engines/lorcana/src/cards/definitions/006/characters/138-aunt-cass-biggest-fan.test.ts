import { describe, it } from "bun:test";
import { auntCassBiggestFan } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
