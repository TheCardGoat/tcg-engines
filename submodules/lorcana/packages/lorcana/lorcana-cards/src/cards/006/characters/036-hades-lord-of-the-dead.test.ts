import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { hadesLordOfTheDead } from "./036-hades-lord-of-the-dead";

const doomedAlly = createMockCharacter({
  id: "hades-test-doomed-ally",
  name: "Doomed Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Hades - Lord of the Dead", () => {
  describe("SOUL COLLECTOR - Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.", () => {
    it("gains 2 lore when another one of your characters is banished during an opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [hadesLordOfTheDead, doomedAlly],
          lore: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [doomedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(1);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(hadesLordOfTheDead),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not trigger when Hades himself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [hadesLordOfTheDead],
          lore: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [hadesLordOfTheDead],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    });

    it("does not trigger during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        play: [hadesLordOfTheDead, doomedAlly],
        lore: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [doomedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });
  });
});
