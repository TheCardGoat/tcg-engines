import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { letItGo } from "../../001/actions/163-let-it-go";
import { grammaTalaSpiritOfTheOcean } from "./143-gramma-tala-spirit-of-the-ocean";

const inkableCard = createMockCharacter({
  id: "gramma-tala-inkable-card",
  name: "Inkable Card",
  cost: 1,
  inkable: true,
});

describe("Gramma Tala - Spirit of the Ocean", () => {
  describe("DO YOU KNOW WHO YOU ARE? - Whenever a card is put into your inkwell, gain 1 lore.", () => {
    it("gains 1 lore when you ink a card from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [grammaTalaSpiritOfTheOcean],
        hand: [inkableCard],
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");
    });

    it("gains 1 lore when an opponent puts one of your cards into your inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [grammaTalaSpiritOfTheOcean, inkableCard],
          lore: 0,
          deck: 1,
        },
        {
          hand: [letItGo],
          inkwell: letItGo.cost,
          deck: 1,
        },
      );

      const inkTargetId = testEngine.findCardInstanceId(inkableCard, "play", "p1");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(letItGo, {
          targets: [inkTargetId],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(grammaTalaSpiritOfTheOcean),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(inkTargetId)).toBe("inkwell");
    });

    it("does not gain lore when Gramma Tala herself is put into your inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [grammaTalaSpiritOfTheOcean],
          lore: 0,
          deck: 1,
        },
        {
          hand: [letItGo],
          inkwell: letItGo.cost,
          deck: 1,
        },
      );

      const grammaId = testEngine.findCardInstanceId(grammaTalaSpiritOfTheOcean, "play", "p1");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(letItGo, {
          targets: [grammaId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(grammaId)).toBe("inkwell");
    });
  });
});
