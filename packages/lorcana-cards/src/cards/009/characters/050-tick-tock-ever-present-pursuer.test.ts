import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ticktockEverpresentPursuer } from "./050-tick-tock-ever-present-pursuer";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
