import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { ryderFleetfootedInfiltrator } from "./056-ryder-fleet-footed-infiltrator";

describe("Ryder - Fleet-Footed Infiltrator", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ryderFleetfootedInfiltrator],
    });

    const cardUnderTest = testEngine.getCardModel(ryderFleetfootedInfiltrator);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
