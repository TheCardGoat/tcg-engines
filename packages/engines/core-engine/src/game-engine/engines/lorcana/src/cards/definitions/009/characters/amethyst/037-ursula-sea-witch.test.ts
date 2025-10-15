import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { ursulaSeaWitch } from "./037-ursula-sea-witch";

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
