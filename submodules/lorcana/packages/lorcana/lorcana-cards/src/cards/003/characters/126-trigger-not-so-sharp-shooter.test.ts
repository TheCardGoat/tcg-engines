import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { triggerNotsosharpShooter } from "./126-trigger-not-so-sharp-shooter";
import { nutsyVultureHenchman } from "./118-nutsy-vulture-henchman";

describe("Trigger - Not-So-Sharp Shooter", () => {
  describe("OLD BETSY", () => {
    it("gives +1 lore to your characters named Nutsy", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [triggerNotsosharpShooter, nutsyVultureHenchman],
      });

      const nutsy = testEngine.asPlayerOne().getCard(nutsyVultureHenchman);
      // Nutsy's printed lore is 1, OLD BETSY adds +1 = 2
      expect(nutsy.lore).toBe(2);
    });

    it("does not boost characters with a different name", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [triggerNotsosharpShooter],
      });

      const trigger = testEngine.asPlayerOne().getCard(triggerNotsosharpShooter);
      // Trigger's printed lore is 1, OLD BETSY only targets Nutsy, not Trigger
      expect(trigger.lore).toBe(1);
    });

    it("does not boost opponent's characters named Nutsy", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [triggerNotsosharpShooter] },
        { play: [nutsyVultureHenchman] },
      );

      const opponentNutsy = testEngine.asPlayerTwo().getCard(nutsyVultureHenchman);
      // Opponent's Nutsy should not get the buff
      expect(opponentNutsy.lore).toBe(1);
    });
  });
});
