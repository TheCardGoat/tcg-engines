import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { pterodactylJanieDollSidsToy } from "./128-pterodactyl-janie-doll-sids-toy";

describe("Pterodactyl Janie Doll - Sid's Toy", () => {
  describe("DOUBLE TRANSPLANT — During your turn, when this character is banished, each opponent loses 1 lore and you gain 1 lore.", () => {
    it("swings 1 lore from the opponent to the controller when banished during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pterodactylJanieDollSidsToy],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 3,
          },
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [pterodactylJanieDollSidsToy] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(pterodactylJanieDollSidsToy)).toBe("discard");

      // DOUBLE TRANSPLANT swings 1 lore on banish during your turn
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("does NOT trigger when banished during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pterodactylJanieDollSidsToy],
          deck: 5,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          startingLore: {
            player_one: 0,
            player_two: 3,
          },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [pterodactylJanieDollSidsToy] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(pterodactylJanieDollSidsToy)).toBe("discard");

      // Trigger is restricted to your own turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });
  });
});
