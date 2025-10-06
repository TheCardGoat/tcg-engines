/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { bellwetherAssistantMayor } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bellwether - Assistant Mayor", () => {
  it.skip("FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine({
      inkwell: bellwetherAssistantMayor.cost,
      play: [bellwetherAssistantMayor],
      hand: [bellwetherAssistantMayor],
    });

    await testEngine.playCard(bellwetherAssistantMayor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
