import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { iagoPrettyPolly } from "./040-iago-pretty-polly";

describe("Iago - Pretty Polly", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoPrettyPolly],
    });

    const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
