import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { belleInventiveEngineer } from "./156-belle-inventive-engineer";
import { medallionWeights } from "../items/134-medallion-weights";
import { auroraHoldingCourt } from "./006-aurora-holding-court";

describe("Belle - Inventive Engineer", () => {
  it("TINKER - reduces cost for next item played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: medallionWeights.cost - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [medallionWeights],
    });

    // Before questing, cannot play item (not enough ink)
    expect(testEngine.asPlayerOne().canPlayCard(medallionWeights)).toBe(false);

    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();

    // After questing, item should cost 1 less
    expect(testEngine.asPlayerOne().canPlayCard(medallionWeights)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(medallionWeights)).toBeSuccessfulCommand();
  });

  it("TINKER - does not reduce cost for characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: auroraHoldingCourt.cost - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [auroraHoldingCourt],
    });

    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();

    // Character should NOT get the item cost reduction
    expect(testEngine.asPlayerOne().canPlayCard(auroraHoldingCourt)).toBe(false);
  });

  it("TINKER - only reduces cost for the NEXT item, not subsequent ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: medallionWeights.cost * 2 - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [medallionWeights, medallionWeights],
    });

    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(medallionWeights)).toBeSuccessfulCommand();
    // Second item should NOT get the reduction
    expect(testEngine.asPlayerOne().canPlayCard(medallionWeights)).toBe(false);
  });

  it("TINKER - double Belle questing grants -2 reduction on next item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: medallionWeights.cost - 2, // 0 ink needed for a cost-2 item with -2 reduction
      play: [{ card: belleInventiveEngineer }, { card: belleInventiveEngineer }],
      hand: [medallionWeights],
    });

    const belleInstances = testEngine
      .getCardInstanceIdsInZone("play", "player_one")
      .filter((id) => testEngine.getCardDefinition(id)?.id === belleInventiveEngineer.id);

    expect(testEngine.asPlayerOne().quest(belleInstances[0])).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(belleInstances[1])).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(medallionWeights)).toBeSuccessfulCommand();
  });
});
