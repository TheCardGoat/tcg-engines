/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { auroraTranquilPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/141-aurora-tranquil-princess";
import { beastGraciousPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
