/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { developYourBrain } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Develop Your Brain", () => {
  it.skip("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: developYourBrain.cost,
      play: [developYourBrain],
      hand: [developYourBrain],
    });

    await testEngine.playCard(developYourBrain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
