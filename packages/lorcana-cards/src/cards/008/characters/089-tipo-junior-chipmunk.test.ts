import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { tipoJuniorChipmunk } from "./089-tipo-junior-chipmunk";

describe("Tipo - Junior Chipmunk", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [tipoJuniorChipmunk],
    });

    const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
