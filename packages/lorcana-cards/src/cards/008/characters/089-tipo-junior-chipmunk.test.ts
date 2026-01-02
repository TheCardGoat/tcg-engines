import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { tipoJuniorChipmunk } from "./089-tipo-junior-chipmunk";

describe("Tipo - Junior Chipmunk", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tipoJuniorChipmunk],
    });

    const cardUnderTest = testEngine.getCardModel(tipoJuniorChipmunk);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
