import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tipoJuniorChipmunk } from "./089-tipo-junior-chipmunk";

describe("Tipo - Junior Chipmunk", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [tipoJuniorChipmunk],
    });
    const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
