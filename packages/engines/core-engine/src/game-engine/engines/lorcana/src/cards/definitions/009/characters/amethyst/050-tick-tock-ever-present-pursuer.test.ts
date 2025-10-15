import { describe, expect, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { ticktockEverpresentPursuer } from "./050-tick-tock-ever-present-pursuer";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
    const testEngine = new TestEngine({
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
