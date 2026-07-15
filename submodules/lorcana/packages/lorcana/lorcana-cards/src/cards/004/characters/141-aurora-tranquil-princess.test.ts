import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraTranquilPrincess } from "./141-aurora-tranquil-princess";

describe("Aurora - Tranquil Princess (Set 4, Card 141)", () => {
  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [auroraTranquilPrincess],
    });
    expect(testEngine.hasKeyword(auroraTranquilPrincess, "Ward")).toBe(true);
  });
});
