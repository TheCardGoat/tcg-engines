/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { chiefBogoGazelleFan } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Chief Bogo - Gazelle Fan", () => {
  it.skip("YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      inkwell: chiefBogoGazelleFan.cost,
      play: [chiefBogoGazelleFan],
      hand: [chiefBogoGazelleFan],
    });

    await testEngine.playCard(chiefBogoGazelleFan);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
