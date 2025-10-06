/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { madamMimCheatingSpellcaster } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
