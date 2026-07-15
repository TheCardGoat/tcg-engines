import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { mchornIcecoldOfficer } from "./181-mchorn-ice-cold-officer";

describe("McHorn - Ice-Cold Officer", () => {
  it("should have bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mchornIcecoldOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(mchornIcecoldOfficer);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
