import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { annaTruehearted } from "./137-anna-true-hearted";

describe("Anna - True-Hearted", () => {
  it.skip("**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: annaTruehearted.cost,
      play: [annaTruehearted],
      hand: [annaTruehearted],
    });

    await testEngine.playCard(annaTruehearted);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
