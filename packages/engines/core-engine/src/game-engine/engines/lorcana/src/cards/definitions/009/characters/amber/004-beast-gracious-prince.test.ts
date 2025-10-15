import { describe, expect, it } from "bun:test";
import { auroraTranquilPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/141-aurora-tranquil-princess";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { beastGraciousPrince } from "./004-beast-gracious-prince";

describe("Beast - Gracious Prince", () => {
  it("FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.", async () => {
    const testEngine = new TestEngine({
      inkwell: beastGraciousPrince.cost,
      play: [beastGraciousPrince, auroraTranquilPrincess],
    });

    const target = testEngine.getCardModel(auroraTranquilPrincess);

    expect(target.willpower).toBe(auroraTranquilPrincess.willpower + 1);
    expect(target.strength).toBe(auroraTranquilPrincess.strength + 1);
  });
});
