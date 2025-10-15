import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { judyHoppsOptimisticOfficer } from "./157-judy-hopps-optimistic-officer";

describe("Judy Hopps - Optimistic Officer", () => {
  it.skip("**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: judyHoppsOptimisticOfficer.cost,
      hand: [judyHoppsOptimisticOfficer],
    });

    await testEngine.playCard(judyHoppsOptimisticOfficer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
