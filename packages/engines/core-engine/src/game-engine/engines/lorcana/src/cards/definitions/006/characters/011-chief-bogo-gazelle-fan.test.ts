import { describe, it } from "bun:test";
import { chiefBogoGazelleFan } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
