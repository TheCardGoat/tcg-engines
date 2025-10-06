/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { iagoReappearingParrot } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iago - Reappearing Parrot", () => {
  it.skip("GUESS WHO When this character is banished in a challenge, return this card to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: iagoReappearingParrot.cost,
      play: [iagoReappearingParrot],
      hand: [iagoReappearingParrot],
    });

    await testEngine.playCard(iagoReappearingParrot);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
