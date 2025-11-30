import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { inspectorTezukaResoluteOfficer } from "./177-inspector-tezuka-resolute-officer";

describe("Inspector Tezuka - Resolute Officer", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [inspectorTezukaResoluteOfficer],
    });
    const cardUnderTest = testEngine.getCardModel(
      inspectorTezukaResoluteOfficer,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
