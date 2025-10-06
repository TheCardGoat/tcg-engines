/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kuzcoWantedLlama } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
