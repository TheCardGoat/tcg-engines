import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { iagoPrettyPolly } from "./040-iago-pretty-polly";

describe("Iago - Pretty Polly", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [iagoPrettyPolly],
    });
    const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
