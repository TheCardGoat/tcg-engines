import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "@tcg/lorcana-cards/cards/001";
import { powerlineMusicalSuperstar } from "./117-powerline-musical-superstar";

describe("Powerline - Musical Superstar", () => {
  describe("ELECTRIC MOVE - If you've played a song this turn, this character gains Rush this turn.", () => {
    it("does not have Rush before a song is played", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [powerlineMusicalSuperstar],
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: 3,
      });

      expect(engine.asPlayerOne().hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(false);
    });

    it("gains Rush after a song is played this turn", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [powerlineMusicalSuperstar],
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: 3,
      });

      expect(engine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(true);
    });

    it("loses Rush at the start of the next turn", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [powerlineMusicalSuperstar],
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
          deck: 3,
        },
        { deck: 3 },
      );

      expect(engine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(true);

      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(engine.asPlayerOne().hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(false);
    });
  });
});
