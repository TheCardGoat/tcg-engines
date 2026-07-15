import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { duckburgFunsosFunzone } from "../../010/locations/034-duckburg-funsos-funzone";
import { rakshaFearlessMother } from "./107-raksha-fearless-mother";

describe("Raksha - Fearless Mother", () => {
  it("ON PATROL: may pay 1 less to move this character to a location", () => {
    // duckburgFunsosFunzone has moveCost: 2, so with 1 ink (moveCost - 1), Raksha can move
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rakshaFearlessMother, duckburgFunsosFunzone],
      inkwell: duckburgFunsosFunzone.moveCost - 1,
    });

    const result = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(rakshaFearlessMother, duckburgFunsosFunzone);

    expect(result.success).toBe(true);
  });

  it("ON PATROL: the discount applies only to Raksha, not other characters", () => {
    const otherCharacter = createMockCharacter({
      id: "other-character",
      name: "Other Character",
      cost: 2,
      strength: 2,
      willpower: 2,
    });

    // With moveCost - 1 ink, another character (without the discount) should NOT be able to move
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rakshaFearlessMother, otherCharacter, duckburgFunsosFunzone],
      inkwell: duckburgFunsosFunzone.moveCost - 1,
    });

    const result = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(otherCharacter, duckburgFunsosFunzone);

    expect(result.success).toBe(false);
  });
});
