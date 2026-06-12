import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckCoinCollector } from "./037-donald-duck-coin-collector";
import { theNephewsPiggyBank } from "../items/044-the-nephews-piggy-bank";

const allyCharacter = createMockCharacter({
  id: "donald-cc-ally-1",
  name: "Ally One",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const allyCharacter2 = createMockCharacter({
  id: "donald-cc-ally-2",
  name: "Ally Two",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const drawnCard = createMockCharacter({
  id: "donald-cc-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Donald Duck - Coin Collector", () => {
  describe("HERE, PIGGY, PIGGY — For each item named The Nephews' Piggy Bank you have in play, you pay 2 less to play this character.", () => {
    it("costs full price when no Piggy Banks are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        inkwell: donaldDuckCoinCollector.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCard(donaldDuckCoinCollector).playCost).toBe(
        donaldDuckCoinCollector.cost,
      );
    });

    it("reduces cost by 2 for each Piggy Bank in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [theNephewsPiggyBank],
        inkwell: donaldDuckCoinCollector.cost - 2,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCard(donaldDuckCoinCollector).playCost).toBe(
        donaldDuckCoinCollector.cost - 2,
      );
      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(donaldDuckCoinCollector)).toBe("play");
    });

    it("reduces cost by 4 for two Piggy Banks in play", () => {
      const piggyBank2 = createMockItem({
        id: "piggy-bank-2",
        name: "The Nephews' Piggy Bank",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [theNephewsPiggyBank, piggyBank2],
        inkwell: donaldDuckCoinCollector.cost - 4,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCard(donaldDuckCoinCollector).playCost).toBe(
        donaldDuckCoinCollector.cost - 4,
      );
      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(donaldDuckCoinCollector)).toBe("play");
    });
  });

  describe("MONEY EVERYWHERE — When you play this character, your other characters gain '{E} — Draw a card' this turn.", () => {
    it("grants other characters an exert-to-draw ability when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [allyCharacter],
        inkwell: donaldDuckCoinCollector.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      // The ally should now be able to exert to draw a card
      expect(testEngine.asPlayerOne().activateAbility(allyCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.isExerted(allyCharacter)).toBe(true);
    });

    it("Donald Duck himself does NOT gain the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        inkwell: donaldDuckCoinCollector.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      // Donald Duck is drying and also should not have the ability
      const activateResult = testEngine.asPlayerOne().activateAbility(donaldDuckCoinCollector);
      expect(activateResult.success).toBe(false);
    });

    it("granted ability text entry uses the ability id as title (enables UI button matching)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [allyCharacter],
        inkwell: donaldDuckCoinCollector.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      const allyId = testEngine.findCardInstanceId(allyCharacter, "play", PLAYER_ONE);
      const grantedEntries = testEngine.asServer().getCard(allyId).grantedAbilityTextEntries;

      expect(grantedEntries).toBeDefined();
      expect(grantedEntries?.[0]?.title).toBe("draw-a-card-when-exerted");
    });

    it("grants all other characters the ability, not just one", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [allyCharacter, allyCharacter2],
        inkwell: donaldDuckCoinCollector.cost,
        deck: [drawnCard, drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().activateAbility(allyCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().activateAbility(allyCharacter2)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    });
  });
});
