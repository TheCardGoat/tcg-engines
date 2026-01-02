import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { clawhauserFrontDeskOfficer } from "./035-clawhauser-front-desk-officer";

describe("Clawhauser - Front Desk Officer", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [clawhauserFrontDeskOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [clawhauserFrontDeskOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
