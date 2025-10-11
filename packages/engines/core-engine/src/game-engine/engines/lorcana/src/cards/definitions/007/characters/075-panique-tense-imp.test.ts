import { describe, it } from "bun:test";
import { paniqueTenseImp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Panique - Tense Imp", () => {
  it.skip("FRIGHTENED SCREAM When you play this character, you can choose a character and move up to 2 of its damage to an opposing character of your choice.", async () => {
    const testEngine = new TestEngine({
      inkwell: paniqueTenseImp.cost,
      hand: [paniqueTenseImp],
    });

    await testEngine.playCard(paniqueTenseImp);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
