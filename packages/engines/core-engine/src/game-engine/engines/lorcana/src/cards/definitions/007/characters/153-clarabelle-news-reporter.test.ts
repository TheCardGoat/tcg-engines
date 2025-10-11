import { describe, it } from "bun:test";
import { clarabelleNewsReporter } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Clarabelle - Journalist", () => {
  it.skip("SUPPORT (When this character is sent on an adventure, you can add its {S} to that of another character of your choice for the rest of this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: clarabelleNewsReporter.cost,
      play: [clarabelleNewsReporter],
      hand: [clarabelleNewsReporter],
    });

    await testEngine.playCard(clarabelleNewsReporter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("SCOOP Your other characters with Support gain +1 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: clarabelleNewsReporter.cost,
      play: [clarabelleNewsReporter],
      hand: [clarabelleNewsReporter],
    });

    await testEngine.playCard(clarabelleNewsReporter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
