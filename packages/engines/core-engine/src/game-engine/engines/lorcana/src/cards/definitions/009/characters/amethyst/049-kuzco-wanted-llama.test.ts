/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { kuzcoWantedLlama } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kuzco - Wanted Llama", () => {
  it.skip("**OK, WHERE AM I?** When this character is banished, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: kuzcoWantedLlama.cost,
      play: [kuzcoWantedLlama],
      hand: [kuzcoWantedLlama],
    });

    await testEngine.playCard(kuzcoWantedLlama);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
