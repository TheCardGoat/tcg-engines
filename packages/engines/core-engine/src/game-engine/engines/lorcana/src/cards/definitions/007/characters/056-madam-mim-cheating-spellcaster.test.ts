import { describe, it } from "bun:test";
import { madamMimCheatingSpellcaster } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Cheating Spellcaster", () => {
  it.skip("PLAY ROUGH Whenever this character quests, exert chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimCheatingSpellcaster.cost,
      play: [madamMimCheatingSpellcaster],
      hand: [madamMimCheatingSpellcaster],
    });

    await testEngine.playCard(madamMimCheatingSpellcaster);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
