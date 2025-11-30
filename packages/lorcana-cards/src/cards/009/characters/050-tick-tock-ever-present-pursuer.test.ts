import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ticktockEverpresentPursuer } from "./050-tick-tock-ever-present-pursuer";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ticktockEverpresentPursuer],
    });
    const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
