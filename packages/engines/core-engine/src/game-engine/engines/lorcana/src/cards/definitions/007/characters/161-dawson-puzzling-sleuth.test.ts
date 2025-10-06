/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { dawsonPuzzlingSleuth } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dawson - Puzzling Sleuth", () => {
  it.skip("BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: dawsonPuzzlingSleuth.cost,
      play: [dawsonPuzzlingSleuth],
      hand: [dawsonPuzzlingSleuth],
    });

    await testEngine.playCard(dawsonPuzzlingSleuth);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
