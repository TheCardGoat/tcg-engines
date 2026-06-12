import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { faZhouHonorableWarrior } from "./110-fa-zhou-honorable-warrior";

describe("Fa Zhou - Honorable Warrior", () => {
  it("BATTLE WOUND - enters play with 2 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [faZhouHonorableWarrior],
      inkwell: faZhouHonorableWarrior.cost,
    });

    expect(testEngine.asPlayerOne().playCard(faZhouHonorableWarrior)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(faZhouHonorableWarrior)?.damage).toBe(2);
  });

  it("remains in play after entering with 2 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [faZhouHonorableWarrior],
      inkwell: faZhouHonorableWarrior.cost,
    });

    expect(testEngine.asPlayerOne().playCard(faZhouHonorableWarrior)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(faZhouHonorableWarrior)).toBe("play");
  });
});
