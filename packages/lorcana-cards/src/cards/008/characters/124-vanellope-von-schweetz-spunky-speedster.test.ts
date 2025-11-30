import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { vanellopeVonSchweetzSpunkySpeedster } from "./124-vanellope-von-schweetz-spunky-speedster";

describe("Vanellope Von Schweetz - Spunky Speedster", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [vanellopeVonSchweetzSpunkySpeedster],
    });
    const cardUnderTest = testEngine.getCardModel(
      vanellopeVonSchweetzSpunkySpeedster,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
