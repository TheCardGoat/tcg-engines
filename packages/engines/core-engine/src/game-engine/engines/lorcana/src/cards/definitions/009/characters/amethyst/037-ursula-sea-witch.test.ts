/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ursulaSeaWitch } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
