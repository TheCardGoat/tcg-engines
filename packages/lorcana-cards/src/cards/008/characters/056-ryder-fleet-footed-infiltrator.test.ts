import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ryderFleetfootedInfiltrator } from "./056-ryder-fleet-footed-infiltrator";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ryderFleetfootedInfiltrator],
    });
    const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
