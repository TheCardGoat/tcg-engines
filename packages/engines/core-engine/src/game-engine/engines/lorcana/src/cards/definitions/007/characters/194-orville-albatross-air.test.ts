/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { bernardBrandNewAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  missBiancaIndefectibleAgent,
  orvilleAlbatrossAir,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Orville - Albatross Air", () => {
  it("Should not have Evasive when no Miss Bianca or Bernard in play", async () => {
    const testEngine = new TestEngine({
      play: [orvilleAlbatrossAir],
    });

    const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
    expect(cardUnderTest.hasEvasive).toBe(false);
  });

  it("Should gain Evasive during your turn when Miss Bianca is in play", async () => {
    const testEngine = new TestEngine({
      play: [orvilleAlbatrossAir, missBiancaIndefectibleAgent],
    });

    const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
    expect(cardUnderTest.hasEvasive).toBe(true);

    // Test that it doesn't have Evasive during opponent's turn
    await testEngine.passTurn();
    expect(cardUnderTest.hasEvasive).toBe(false);

    // Back to player's turn
    await testEngine.passTurn();
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("Should gain Evasive during your turn when Bernard is in play", async () => {
    const testEngine = new TestEngine({
      play: [orvilleAlbatrossAir, bernardBrandNewAgent],
    });

    const cardUnderTest = testEngine.getCardModel(orvilleAlbatrossAir);
    expect(cardUnderTest.hasEvasive).toBe(true);

    // Test that it doesn't have Evasive during opponent's turn
    await testEngine.passTurn();
    expect(cardUnderTest.hasEvasive).toBe(false);

    // Back to player's turn
    await testEngine.passTurn();
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
