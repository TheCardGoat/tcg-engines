/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { chiefBogoGazelleFan } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

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
