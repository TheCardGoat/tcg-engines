/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { edLaughingHyena } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ed - Laughing Hyena", () => {
  it.skip("**CAUSE A PANIC** When you play this character, you may deal 2 damage to chosen damaged character.", () => {
    const testStore = new TestStore({
      inkwell: edLaughingHyena.cost,
      hand: [edLaughingHyena],
    });

    const cardUnderTest = testStore.getCard(edLaughingHyena);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
