import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { tinkerBellTinyTactician } from "./189-tinker-bell-tiny-tactician";

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
