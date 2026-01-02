import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { inspectorTezukaResoluteOfficer } from "./177-inspector-tezuka-resolute-officer";

describe("Inspector Tezuka - Resolute Officer", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [inspectorTezukaResoluteOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(
      inspectorTezukaResoluteOfficer,
    );
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
