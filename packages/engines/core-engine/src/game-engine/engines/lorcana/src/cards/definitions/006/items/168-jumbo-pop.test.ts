/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { jumboPop } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jumbo Pop", () => {
  it.skip("HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: jumboPop.cost,
      play: [jumboPop],
      hand: [jumboPop],
    });

    await testEngine.playCard(jumboPop);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
