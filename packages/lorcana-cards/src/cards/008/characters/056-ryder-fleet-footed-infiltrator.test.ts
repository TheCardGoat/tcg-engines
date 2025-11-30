import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ryderFleetfootedInfiltrator } from "./056-ryder-fleet-footed-infiltrator";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ryderFleetfootedInfiltrator],
    });

    const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
