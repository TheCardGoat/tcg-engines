import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { iagoPrettyPolly } from "./040-iago-pretty-polly";

describe("Iago - Pretty Polly", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [iagoPrettyPolly],
    });

    const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
