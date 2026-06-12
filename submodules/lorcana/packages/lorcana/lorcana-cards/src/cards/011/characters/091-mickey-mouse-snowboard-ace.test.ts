import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { letItGo } from "../actions/163-let-it-go";
import { snowFort } from "../items/098-snow-fort";
import { mickeyMouseSnowboardAce } from "./091-mickey-mouse-snowboard-ace";

const opponentHandCard1 = createMockCharacter({
  id: "mickey-snowboard-opponent-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "mickey-snowboard-opponent-hand-2",
  name: "Opponent Hand Card 2",
  cost: 1,
});

const playerHandCard = createMockCharacter({
  id: "mickey-snowboard-player-hand",
  name: "Player Hand Card",
  cost: 1,
});

const survivingDefender = createMockCharacter({
  id: "mickey-snowboard-surviving-defender",
  name: "Surviving Defender",
  cost: 2,
  strength: 1,
  willpower: 7,
  lore: 1,
});

const wouldBeLethalAttacker = createMockCharacter({
  id: "mickey-snowboard-would-be-lethal-attacker",
  name: "Would-Be Lethal Attacker",
  cost: 4,
  strength: 6,
  willpower: 7,
  lore: 1,
});

describe("Mickey Mouse - Snowboard Ace", () => {
  describe("SLIPPERY SLOPE - When you play this character and when he leaves play, each opponent chooses and discards a card", () => {
    it("should make each opponent discard a card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: mickeyMouseSnowboardAce.cost,
          hand: [mickeyMouseSnowboardAce],
          deck: 5,
        },
        {
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 5,
        },
      );

      const opponentHandBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      expect(testEngine.asPlayerOne().playCard(mickeyMouseSnowboardAce)).toBeSuccessfulCommand();

      // SLIPPERY SLOPE triggers and bag auto-resolves (controller is active player).
      // Opponent (player two) must choose which card to discard.
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCard1] }),
      ).toBeSuccessfulCommand();

      const opponentHandAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(opponentHandAfter).toBe(opponentHandBefore - 1);
      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("discard");
    });

    it("should trigger when Mickey leaves play via put-into-inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseSnowboardAce],
          hand: [playerHandCard],
          deck: 5,
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo, opponentHandCard1, opponentHandCard2],
          deck: 5,
        },
      );

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two plays Let It Go targeting Mickey
      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [mickeyMouseSnowboardAce] }),
      ).toBeSuccessfulCommand();

      // Mickey should have left play (moved to inkwell)
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseSnowboardAce)).toBe("inkwell");

      // Capture hand count after Let It Go was played but before discard
      const opponentHandBeforeDiscard = testEngine
        .asPlayerTwo()
        .getCardsInZone("hand", PLAYER_TWO).count;

      // SLIPPERY SLOPE leave-play trigger fires. Bag is controlled by player_one
      // (Mickey's controller), so player_one resolves the bag.
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseSnowboardAce),
      ).toBeSuccessfulCommand();

      // Player two (opponent of Mickey's controller) must choose a card to discard
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCard1] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("discard");
      const opponentHandAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(opponentHandAfter).toBe(opponentHandBeforeDiscard - 1);
    });

    it("does not trigger when Mickey challenges with Snow Fort and remains in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [snowFort, { card: mickeyMouseSnowboardAce, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: survivingDefender, exerted: true }],
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseSnowboardAce, survivingDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseSnowboardAce)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(survivingDefender)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count).toBe(2);
    });

    it("does not trigger when Snow Fort prevents Mickey from leaving during an opponent challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [snowFort, { card: mickeyMouseSnowboardAce, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: wouldBeLethalAttacker, isDrying: false }],
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const opponentHandBeforeChallenge = testEngine
        .asPlayerTwo()
        .getCardsInZone("hand", PLAYER_TWO).count;

      expect(
        testEngine.asPlayerTwo().challenge(wouldBeLethalAttacker, mickeyMouseSnowboardAce),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseSnowboardAce)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(wouldBeLethalAttacker)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count).toBe(
        opponentHandBeforeChallenge,
      );
    });
  });
});
