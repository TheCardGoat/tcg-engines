import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { baymaxGiantRobot } from "../../007/characters/104-baymax-giant-robot";
import { goGoTomagoMechanicalEngineer } from "./159-go-go-tomago-mechanical-engineer";

const nonFloodbornCharacter = createMockCharacter({
  id: "mech-eng-non-floodborn",
  name: "Non-Floodborn Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  classifications: ["Storyborn", "Hero"],
});

const deckCard = createMockCharacter({
  id: "mech-eng-deck-card",
  name: "Top Of Deck Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
});

function playFloodbornOnGoGo(testEngine: LorcanaMultiplayerTestEngine) {
  const goGoId = testEngine.findCardInstanceId(goGoTomagoMechanicalEngineer, "play", PLAYER_ONE);

  return testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
    cost: { cost: "shift", shiftTarget: goGoId },
  });
}

describe("Go Go Tomago - Mechanical Engineer", () => {
  describe("NEED THIS! — When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("triggers when a Floodborn character is played and lets you put top of deck into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goGoTomagoMechanicalEngineer],
        hand: [baymaxGiantRobot],
        inkwell: 4,
        deck: [deckCard],
      });

      expect(playFloodbornOnGoGo(testEngine)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(goGoTomagoMechanicalEngineer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(deckCard)).toBe(true);
    });

    it("does not put a card into inkwell when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goGoTomagoMechanicalEngineer],
        hand: [baymaxGiantRobot],
        inkwell: 4,
        deck: [deckCard],
      });

      expect(playFloodbornOnGoGo(testEngine)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(goGoTomagoMechanicalEngineer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("does not trigger when a non-Floodborn character is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goGoTomagoMechanicalEngineer],
        hand: [nonFloodbornCharacter],
        inkwell: nonFloodbornCharacter.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(nonFloodbornCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("places the deck card facedown and exerted in the inkwell when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goGoTomagoMechanicalEngineer],
        hand: [baymaxGiantRobot],
        inkwell: 4,
        deck: [deckCard],
      });

      expect(playFloodbornOnGoGo(testEngine)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(goGoTomagoMechanicalEngineer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // The deck card should be in the inkwell, exerted
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(deckCard)).toBe(true);
      // The deck should be empty now
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    });
  });
});
