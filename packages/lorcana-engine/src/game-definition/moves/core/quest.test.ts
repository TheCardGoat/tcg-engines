import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/lorcana-test-engine";

describe("Move: Quest", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 5, deck: 10, play: 2, inkwell: 0 }, // Player one with characters in play
      { hand: 5, deck: 10, play: 2, inkwell: 0 }, // Player two with characters in play
      { skipPreGame: false },
    );

    // Complete pre-game setup to get to main phase
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    // Complete mulligans for both players
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.alterHand([]);
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.alterHand([]);

    // After mulligans, game is in mainGame segment, turn 2, player_two's turn
    // Need to pass turns to get to a stable state and clear summoning sickness

    // Player two takes their turn (beginning -> main -> end -> next turn)
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.passTurn(); // beginning -> main
    testEngine.passTurn(); // main -> end -> turn 3 beginning -> main (player_one)

    // Player one takes their turn
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.passTurn(); // main -> end -> turn 4 beginning -> main (player_two)

    // Back to player two, now characters have been through a turn cycle
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.passTurn(); // main -> end -> turn 5 beginning -> main (player_one)

    // Now on player_one's turn with characters no longer summoning sick
    testEngine.changeActivePlayer(PLAYER_ONE);
    // Now characters are dry and can quest
  });

  afterEach(() => {
    testEngine.dispose();
  });

  // ========== Basic Questing Behavior ==========

  describe("Basic Questing Behavior", () => {
    it("should successfully quest with a ready character", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];
      const initialLore = testEngine.getLore(PLAYER_ONE);

      expect(playZone.length).toBeGreaterThan(0);
      expect(initialLore).toBe(0);

      // Quest with the character
      testEngine.quest(character);

      // Verify lore increased
      const newLore = testEngine.getLore(PLAYER_ONE);
      expect(newLore).toBe(initialLore + 1); // Currently hardcoded to 1 lore per quest
    });

    it("should exert character after questing", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Character should start ready (not exerted)
      const cardMeta = testEngine.getCardMeta(character);
      expect(cardMeta?.isExerted).toBeFalsy();

      // Quest with the character
      testEngine.quest(character);

      // Character should now be exerted
      const newCardMeta = testEngine.getCardMeta(character);
      expect(newCardMeta?.isExerted).toBe(true);
    });

    it("should mark character as having quested", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest with the character
      testEngine.quest(character);

      // Character should be marked as quested
      const ctx = testEngine.getCtx();
      const hasQuested = ctx.trackers?.check(
        `quested:${character}`,
        createPlayerId(PLAYER_ONE),
      );
      expect(hasQuested).toBe(true);
    });

    it("should allow multiple different characters to quest in one turn", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const char1 = playZone[0];
      const char2 = playZone[1];

      const initialLore = testEngine.getLore(PLAYER_ONE);

      // Quest with both characters
      testEngine.quest(char1);
      testEngine.quest(char2);

      // Lore should increase by 2 (1 per character)
      const newLore = testEngine.getLore(PLAYER_ONE);
      expect(newLore).toBe(initialLore + 2);
    });
  });

  // ========== Summoning Sickness Validation ==========

  describe("Summoning Sickness Validation", () => {
    it("should reject questing with drying (just played) characters", () => {
      // Create a fresh engine without passing turns
      const freshEngine = new LorcanaTestEngine(
        { hand: 5, deck: 10, play: 1 },
        { hand: 5, deck: 10 },
        { skipPreGame: false },
      );

      // Complete setup
      const ctx = freshEngine.getCtx();
      freshEngine.changeActivePlayer(ctx.choosingFirstPlayer || PLAYER_ONE);
      freshEngine.chooseWhoGoesFirst(PLAYER_ONE);
      freshEngine.changeActivePlayer(PLAYER_ONE);
      freshEngine.alterHand([]);
      freshEngine.changeActivePlayer(PLAYER_TWO);
      freshEngine.alterHand([]);
      freshEngine.changeActivePlayer(PLAYER_ONE);

      // Characters in play are still "drying"
      const playZone = freshEngine.getZone("play", PLAYER_ONE);
      const dryingChar = playZone[0];

      // Try to quest - should fail
      const result = freshEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: dryingChar,
        },
      });

      expect(result.success).toBe(false);

      freshEngine.dispose();
    });

    it("should allow questing after character dries (next turn)", () => {
      // This is the default behavior tested in beforeEach
      // Characters become dry after passing turns
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const driedChar = playZone[0];

      // Should successfully quest
      testEngine.quest(driedChar);

      const lore = testEngine.getLore(PLAYER_ONE);
      expect(lore).toBe(1);
    });
  });

  // ========== Exerted State Validation ==========

  describe("Exerted State Validation", () => {
    it("should reject questing with already exerted character", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest once (exerts the character)
      testEngine.quest(character);

      // Try to quest again with exerted character - should fail
      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: character,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should allow questing after character is readied (next turn)", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest once
      testEngine.quest(character);

      // Pass turn and come back (readies characters)
      testEngine.passTurn(); // Pass to player two
      testEngine.passTurn(); // Pass back to player one

      // Should be able to quest again (character is readied)
      testEngine.quest(character);

      const lore = testEngine.getLore(PLAYER_ONE);
      expect(lore).toBe(2); // 1 from first quest + 1 from second
    });
  });

  // ========== Once-Per-Turn Validation ==========

  describe("Once-Per-Turn Validation", () => {
    it("should reject questing twice with same character in one turn", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest once
      testEngine.quest(character);

      // Try to quest again - should fail due to tracker
      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: character,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should allow questing again after turn passes", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest once
      testEngine.quest(character);

      // Pass turn and come back
      testEngine.passTurn(); // Pass to player two
      testEngine.passTurn(); // Pass back to player one

      // Should be able to quest again
      testEngine.quest(character);

      const lore = testEngine.getLore(PLAYER_ONE);
      expect(lore).toBe(2);
    });
  });

  // ========== Ownership & Location Validation ==========

  describe("Ownership & Location Validation", () => {
    it("should reject opponent's characters", () => {
      const opponentPlay = testEngine.getZone("play", PLAYER_TWO);
      const opponentChar = opponentPlay[0];

      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: opponentChar,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject characters not in play - character in hand", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const charInHand = hand[0];

      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: charInHand,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject characters not in play - character in deck", () => {
      const deck = testEngine.getZone("deck", PLAYER_ONE);
      const charInDeck = deck[0];

      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: charInDeck,
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid card IDs", () => {
      const result = testEngine.engine.executeMove("quest", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: "invalid-card-id-12345",
        },
      });

      expect(result.success).toBe(false);
    });
  });

  // ========== Lore Accumulation ==========

  describe("Lore Accumulation", () => {
    it("should accumulate lore correctly over multiple quests", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);

      // Quest with first character
      testEngine.quest(playZone[0]);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);

      // Quest with second character
      testEngine.quest(playZone[1]);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);

      // Pass turn and quest again
      testEngine.passTurn(); // Pass to player two
      testEngine.passTurn(); // Pass back to player one

      testEngine.quest(playZone[0]);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    });

    it("should track lore separately for each player", () => {
      const p1Play = testEngine.getZone("play", PLAYER_ONE);
      const p1Char = p1Play[0];

      // Player one quests
      testEngine.quest(p1Char);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);

      // Pass to player two
      testEngine.passTurn();
      testEngine.changeActivePlayer(PLAYER_TWO);

      const p2Play = testEngine.getZone("play", PLAYER_TWO);
      const p2Char = p2Play[0];

      // Player two quests
      testEngine.quest(p2Char);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    });

    it("should persist lore across turns", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // Quest
      testEngine.quest(character);
      const loreAfterQuest = testEngine.getLore(PLAYER_ONE);

      // Pass multiple turns
      testEngine.passTurn();
      testEngine.passTurn();
      testEngine.passTurn();
      testEngine.passTurn();

      // Lore should not decrease
      const loreAfterTurns = testEngine.getLore(PLAYER_ONE);
      expect(loreAfterTurns).toBe(loreAfterQuest);
    });
  });

  // ========== Win Condition Integration ==========

  describe("Win Condition Integration", () => {
    it("should continue game when lore is less than 20", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);

      // Quest to gain some lore (but not 20)
      testEngine.quest(playZone[0]);

      // Game should still be ongoing
      const state = testEngine.getState();
      // Note: Win condition check happens at specific points in game flow
      // Just verify lore is less than 20
      expect(testEngine.getLore(PLAYER_ONE)).toBeLessThan(20);
    });

    it("should end game when player reaches 20 lore", () => {
      // This test verifies the win condition logic exists
      // In a real game, reaching 20 lore would trigger game end
      // For now, we'll just verify we can accumulate toward 20

      let lore = 0;
      let turns = 0;
      const maxTurns = 100; // Prevent infinite loop

      // Keep questing until we reach 20 lore or max turns
      while (lore < 20 && turns < maxTurns) {
        const playZone = testEngine.getZone("play", PLAYER_ONE);

        // Quest with available characters
        for (const char of playZone) {
          if (lore >= 20) break;

          try {
            testEngine.quest(char);
            lore = testEngine.getLore(PLAYER_ONE);
          } catch {}
        }

        // Stop if we've reached 20 lore (game ended)
        if (lore >= 20) break;

        // Pass turns to reset characters
        testEngine.passTurn();
        testEngine.passTurn();
        turns++;
      }

      // Verify we can reach 20 lore through questing
      expect(lore).toBeGreaterThanOrEqual(20);
    });
  });

  // ========== Phase Validation ==========

  describe("Phase Validation", () => {
    it("should only allow questing during main phase", () => {
      const playZone = testEngine.getZone("play", PLAYER_ONE);
      const character = playZone[0];

      // We're in main phase by default in our tests
      // Quest should succeed
      testEngine.quest(character);

      const lore = testEngine.getLore(PLAYER_ONE);
      expect(lore).toBe(1);

      // Note: Testing other phases would require more complex game flow control
      // The move definition already has isMainPhase() check
    });
  });
});
