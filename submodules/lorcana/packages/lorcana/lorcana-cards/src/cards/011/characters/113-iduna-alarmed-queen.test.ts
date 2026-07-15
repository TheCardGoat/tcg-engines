import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { idunaAlarmedQueen } from "./113-iduna-alarmed-queen";

describe("Iduna - Alarmed Queen", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [idunaAlarmedQueen],
    });

    const cardUnderTest = testEngine.getCardModel(idunaAlarmedQueen);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
