/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { ursulaSeaWitch } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Sea Witch", () => {
  it.skip("YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: ursulaSeaWitch.cost,
      play: [ursulaSeaWitch],
      hand: [ursulaSeaWitch],
    });

    await testEngine.playCard(ursulaSeaWitch);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
