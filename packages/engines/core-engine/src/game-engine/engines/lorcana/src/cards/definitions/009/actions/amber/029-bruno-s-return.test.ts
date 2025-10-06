/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { brunosReturn } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bruno's Return", () => {
  it.skip("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: brunosReturn.cost,
      play: [brunosReturn],
      hand: [brunosReturn],
    });

    await testEngine.playCard(brunosReturn);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
