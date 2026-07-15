import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { maleficentMonstrousDragon } from "./108-maleficent-monstrous-dragon";

const targetCharacter = createMockCharacter({
  id: "maleficent-md-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "maleficent-md-another",
  name: "Another Character",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Maleficent - Monstrous Dragon (Set 9)", () => {
  describe("DRAGON FIRE — When you play this character, you may banish chosen character.", () => {
    it("triggers a bag effect when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentMonstrousDragon],
          inkwell: maleficentMonstrousDragon.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("banishes a chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentMonstrousDragon],
          inkwell: maleficentMonstrousDragon.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentMonstrousDragon, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("can banish a friendly character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentMonstrousDragon],
          inkwell: maleficentMonstrousDragon.cost,
          play: [anotherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentMonstrousDragon, {
          resolveOptional: true,
          targets: [anotherCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(anotherCharacter)).toBe("discard");
    });

    it("is optional — player can choose not to banish a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentMonstrousDragon],
          inkwell: maleficentMonstrousDragon.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maleficentMonstrousDragon, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("Maleficent herself enters play when ability is used", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentMonstrousDragon],
          inkwell: maleficentMonstrousDragon.cost,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentMonstrousDragon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentMonstrousDragon, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(maleficentMonstrousDragon)).toBe("play");
    });

    it("gains lore when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maleficentMonstrousDragon],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Pass turns so Maleficent is dry
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(maleficentMonstrousDragon)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(maleficentMonstrousDragon.lore);
    });
  });
});
