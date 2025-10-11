import { describe, it } from "bun:test";
import { tinkerBellTinyTactician } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tinker Bell - Tiny Tactician", () => {
  it.skip("**Battle plans** {E} - Draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: tinkerBellTinyTactician.cost,
      play: [tinkerBellTinyTactician],
      hand: [tinkerBellTinyTactician],
    });

    await testEngine.playCard(tinkerBellTinyTactician);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
