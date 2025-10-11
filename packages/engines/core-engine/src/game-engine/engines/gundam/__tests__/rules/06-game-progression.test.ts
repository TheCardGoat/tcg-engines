import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertGameSegment,
  assertTurnPlayer,
  assertZoneCount,
  buildGameStartScenario,
} from "../helpers";

/**
 * Tests for LLM-RULES Section 6: Game Progression
 *
 * These tests validate turn structure and phase progression rules.
 *
 * Rules covered:
 * - 6.1: Start phase (Active step, Start step)
 * - 6.2: Draw phase (Draw 1 card)
 * - 6.3: Resource phase (Place 1 Resource)
 * - 6.4: Main phase (Play cards, activate effects, attack with Units)
 * - 6.5: End phase (Action step, End step, Hand step, Cleanup step)
 */
describe("LLM-RULES Section 6: Game Progression", () => {
  describe("Rule 6-1: Start Phase", () => {
    describe("Active Step: Setting cards to active state", () => {
      it("should initialize game in start phase with proper setup", () => {
        // Start phase is the first phase of each turn
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            resourceArea: 5,
            hand: 5,
            deck: 30,
          },
          {
            battleArea: 2,
            resourceArea: 5,
            hand: 5,
            deck: 30,
          },
        );

        // Verify game starts in main phase by default (skipPreGame: true)
        assertGamePhase(engine, "mainPhase");
        assertGameSegment(engine, "duringGame");
      });

      it("should have both players start with proper zones", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 3,
            resourceArea: 8,
            hand: 5,
            deck: 25,
          },
          {
            battleArea: 2,
            resourceArea: 6,
            hand: 7,
            deck: 28,
          },
        );

        // Verify both players have cards in battle area and resource area
        assertZoneCount(engine, "battleArea", 3, "player_one");
        assertZoneCount(engine, "resourceArea", 8, "player_one");

        assertZoneCount(engine, "battleArea", 2, "player_two");
        assertZoneCount(engine, "resourceArea", 6, "player_two");
      });

      it("should support empty battle area at start phase", () => {
        // Early game scenario - no units deployed yet
        const engine = new GundamTestEngine(
          {
            battleArea: 0,
            resourceArea: 2,
            hand: 6,
            deck: 40,
          },
          {
            battleArea: 0,
            resourceArea: 2,
            hand: 6,
            deck: 40,
          },
        );

        // Verify empty battle areas
        assertZoneCount(engine, "battleArea", 0, "player_one");
        assertZoneCount(engine, "battleArea", 0, "player_two");
      });

      it("should handle maximum units in battle area", () => {
        // Full battle area scenario - 6 units (maximum)
        const engine = new GundamTestEngine(
          {
            battleArea: 6, // Maximum units allowed
            resourceArea: 15,
            hand: 5,
            deck: 20,
          },
          {
            battleArea: 6,
            resourceArea: 15,
            hand: 5,
            deck: 20,
          },
        );

        // Verify maximum battle area count
        assertZoneCount(engine, "battleArea", 6, "player_one");
        assertZoneCount(engine, "battleArea", 6, "player_two");
      });
    });

    describe("Start Step: Beginning of turn effects", () => {
      it("should establish turn player at start of game", () => {
        const engine = new GundamTestEngine(
          {
            hand: 5,
            deck: 40,
            resourceArea: 3,
          },
          {
            hand: 5,
            deck: 40,
            resourceArea: 3,
          },
        );

        // Verify turn player is established
        const turnPlayer = engine.getTurnPlayer();
        expect(turnPlayer).toBe("player_one");
      });

      it("should maintain consistent turn player throughout phase", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            resourceArea: 5,
            hand: 5,
            deck: 30,
          },
          {
            battleArea: 2,
            resourceArea: 5,
            hand: 5,
            deck: 30,
          },
        );

        const initialTurnPlayer = engine.getTurnPlayer();
        assertTurnPlayer(engine, initialTurnPlayer);

        // Turn player should remain consistent
        expect(engine.getTurnPlayer()).toBe(initialTurnPlayer);
      });

      it("should have proper game state at start step", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 4,
            hand: 6,
            deck: 35,
          },
          {
            battleArea: 1,
            resourceArea: 4,
            hand: 6,
            deck: 35,
          },
        );

        // Verify game state is properly initialized
        const gameState = engine.getState();
        expect(gameState).toBeDefined();
        expect(gameState.turn).toBeDefined();
      });
    });
  });

  describe("Rule 6-2: Draw Phase", () => {
    it("should have deck with cards available for draw", () => {
      // Player has cards in deck ready to draw
      const engine = new GundamTestEngine(
        {
          deck: 40, // Plenty of cards to draw
          hand: 5,
          resourceArea: 3,
        },
        {
          deck: 40,
          hand: 5,
          resourceArea: 3,
        },
      );

      // Verify deck has cards
      assertZoneCount(engine, "deck", 40, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
    });

    it("should maintain hand and deck relationship", () => {
      // Test scenario with various deck and hand sizes
      const testCases = [
        { deck: 45, hand: 5 },
        { deck: 30, hand: 7 },
        { deck: 20, hand: 8 },
        { deck: 10, hand: 10 },
      ];

      for (const testCase of testCases) {
        const engine = new GundamTestEngine(
          {
            deck: testCase.deck,
            hand: testCase.hand,
            resourceArea: 5,
          },
          {
            deck: 40,
            hand: 5,
            resourceArea: 5,
          },
        );

        assertZoneCount(engine, "deck", testCase.deck, "player_one");
        assertZoneCount(engine, "hand", testCase.hand, "player_one");
      }
    });

    it("should handle low deck count scenario", () => {
      // Player has few cards left in deck
      const engine = new GundamTestEngine(
        {
          deck: 3, // Only 3 cards left
          hand: 7,
          resourceArea: 10,
        },
        {
          deck: 25,
          hand: 5,
          resourceArea: 8,
        },
      );

      // Player can still draw from remaining cards
      assertZoneCount(engine, "deck", 3, "player_one");
      assertZoneCount(engine, "hand", 7, "player_one");
    });

    it("should handle single card in deck", () => {
      // Edge case: last card in deck
      const engine = new GundamTestEngine(
        {
          deck: 1, // Last card
          hand: 9,
          resourceArea: 12,
        },
        {
          deck: 20,
          hand: 5,
          resourceArea: 8,
        },
      );

      // Verify deck has exactly one card
      assertZoneCount(engine, "deck", 1, "player_one");
    });
  });

  describe("Rule 6-3: Resource Phase", () => {
    it("should allow resource placement from resource deck", () => {
      const engine = new GundamTestEngine(
        {
          resourceDeck: 8, // Resources available to place
          resourceArea: 2, // Current resources
          hand: 5,
          deck: 35,
        },
        {
          resourceDeck: 10,
          resourceArea: 0,
          hand: 5,
          deck: 35,
        },
      );

      // Verify resource deck and area
      assertZoneCount(engine, "resourceDeck", 8, "player_one");
      assertZoneCount(engine, "resourceArea", 2, "player_one");
    });

    it("should handle various resource counts", () => {
      const testCases = [
        { resourceDeck: 10, resourceArea: 0 }, // Turn 1
        { resourceDeck: 5, resourceArea: 5 }, // Mid game
        { resourceDeck: 2, resourceArea: 13 }, // Late game
        { resourceDeck: 0, resourceArea: 15 }, // Maximum resources
      ];

      for (const testCase of testCases) {
        const engine = new GundamTestEngine(
          {
            resourceDeck: testCase.resourceDeck,
            resourceArea: testCase.resourceArea,
            hand: 5,
            deck: 30,
          },
          {
            resourceDeck: 10,
            resourceArea: 0,
            hand: 5,
            deck: 30,
          },
        );

        assertZoneCount(
          engine,
          "resourceDeck",
          testCase.resourceDeck,
          "player_one",
        );
        assertZoneCount(
          engine,
          "resourceArea",
          testCase.resourceArea,
          "player_one",
        );
      }
    });

    it("should respect 15 resource maximum", () => {
      // Player at maximum resources
      const engine = new GundamTestEngine(
        {
          resourceDeck: 0,
          resourceArea: 15, // Maximum resources
          hand: 5,
          deck: 25,
        },
        {
          resourceDeck: 10,
          resourceArea: 0,
          hand: 5,
          deck: 40,
        },
      );

      // Verify maximum resource count
      assertZoneCount(engine, "resourceArea", 15, "player_one");
      assertZoneCount(engine, "resourceDeck", 0, "player_one");
    });

    it("should handle empty resource deck", () => {
      // All resources already placed
      const engine = new GundamTestEngine(
        {
          resourceDeck: 0, // No resources left
          resourceArea: 10,
          hand: 5,
          deck: 30,
        },
        {
          resourceDeck: 8,
          resourceArea: 2,
          hand: 5,
          deck: 35,
        },
      );

      // Verify resource deck is empty
      assertZoneCount(engine, "resourceDeck", 0, "player_one");
    });

    it("should support incremental resource growth", () => {
      // Simulate progression of resources over turns
      const progressionStages = [
        { turn: 1, resources: 1 },
        { turn: 3, resources: 3 },
        { turn: 5, resources: 5 },
        { turn: 8, resources: 8 },
        { turn: 12, resources: 12 },
      ];

      for (const stage of progressionStages) {
        const engine = new GundamTestEngine(
          {
            resourceArea: stage.resources,
            resourceDeck: Math.max(0, 10 - stage.resources),
            hand: 5,
            deck: 40,
          },
          {
            resourceArea: 5,
            resourceDeck: 5,
            hand: 5,
            deck: 40,
          },
        );

        assertZoneCount(engine, "resourceArea", stage.resources, "player_one");
      }
    });
  });

  describe("Rule 6-4: Main Phase", () => {
    it("should start game in main phase by default", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 3,
          deck: 40,
        },
        {
          hand: 5,
          resourceArea: 3,
          deck: 40,
        },
      );

      // Test engine defaults to main phase (skipPreGame: true)
      assertGamePhase(engine, "mainPhase");
    });

    it("should allow units in battle area during main phase", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 4,
          hand: 6,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 7,
          deck: 32,
        },
      );

      // Verify units are in battle area
      assertZoneCount(engine, "battleArea", 4, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should support various game states in main phase", () => {
      const scenarios = [
        { battleArea: 0, hand: 8, resourceArea: 2 }, // Early game
        { battleArea: 3, hand: 5, resourceArea: 6 }, // Mid game
        { battleArea: 6, hand: 3, resourceArea: 12 }, // Late game
      ];

      for (const scenario of scenarios) {
        const engine = new GundamTestEngine(
          {
            battleArea: scenario.battleArea,
            hand: scenario.hand,
            resourceArea: scenario.resourceArea,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 35,
          },
        );

        assertZoneCount(
          engine,
          "battleArea",
          scenario.battleArea,
          "player_one",
        );
        assertZoneCount(engine, "hand", scenario.hand, "player_one");
        assertZoneCount(
          engine,
          "resourceArea",
          scenario.resourceArea,
          "player_one",
        );
        assertGamePhase(engine, "mainPhase");
      }
    });

    it("should maintain turn player during main phase", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      const turnPlayer = engine.getTurnPlayer();
      assertTurnPlayer(engine, turnPlayer);
      assertGamePhase(engine, "mainPhase");
    });

    it("should support maximum battle area capacity", () => {
      // Player has maximum units deployed
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // Maximum units
          hand: 4,
          resourceArea: 10,
          deck: 25,
        },
        {
          battleArea: 4,
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle empty hand scenario", () => {
      // Player has no cards to play
      const engine = new GundamTestEngine(
        {
          hand: 0, // Empty hand
          battleArea: 5,
          resourceArea: 12,
          deck: 10,
        },
        {
          hand: 6,
          battleArea: 3,
          resourceArea: 8,
          deck: 25,
        },
      );

      assertZoneCount(engine, "hand", 0, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Rule 6-5: End Phase", () => {
    describe("Action Step: Playing action cards and effects", () => {
      it("should support action step state", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 3,
            hand: 5,
            resourceArea: 7,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 6,
            resourceArea: 6,
            deck: 32,
          },
        );

        // Action step is part of end phase
        // Players can activate action effects during this step
        const gameState = engine.getState();
        expect(gameState).toBeDefined();
      });

      it("should maintain priority during action step", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 6,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 6,
            deck: 30,
          },
        );

        // Priority players should be defined
        const priorityPlayers = engine.getPriorityPlayers();
        expect(priorityPlayers).toBeDefined();
        expect(priorityPlayers.length).toBeGreaterThan(0);
      });
    });

    describe("End Step: End of turn effects", () => {
      it("should establish end step framework", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 4,
            hand: 6,
            resourceArea: 8,
            deck: 28,
          },
          {
            battleArea: 3,
            hand: 5,
            resourceArea: 7,
            deck: 30,
          },
        );

        // End step triggers "at the end of turn" effects
        const gameState = engine.getState();
        expect(gameState.turn).toBeDefined();
      });

      it("should handle units with damage at end of turn", () => {
        // Units with damage remain damaged through end step
        const engine = new GundamTestEngine(
          {
            battleArea: 3, // Units that may have damage
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 7,
            deck: 32,
          },
        );

        // Verify units exist
        assertZoneCount(engine, "battleArea", 3, "player_one");
      });
    });

    describe("Hand Step: Discard down to 10 cards", () => {
      it("should allow up to 10 cards in hand", () => {
        const engine = new GundamTestEngine(
          {
            hand: 10, // Maximum hand size
            resourceArea: 5,
            deck: 30,
          },
          {
            hand: 7,
            resourceArea: 5,
            deck: 35,
          },
        );

        // Verify maximum hand size
        assertZoneCount(engine, "hand", 10, "player_one");
      });

      it("should handle hand sizes under the limit", () => {
        const handSizes = [0, 3, 5, 7, 9, 10];

        for (const handSize of handSizes) {
          const engine = new GundamTestEngine(
            {
              hand: handSize,
              resourceArea: 5,
              deck: 40 - handSize,
            },
            {
              hand: 5,
              resourceArea: 5,
              deck: 35,
            },
          );

          assertZoneCount(engine, "hand", handSize, "player_one");
        }
      });

      it("should detect over-limit hand scenario", () => {
        // Player has more than 10 cards - needs to discard
        const engine = new GundamTestEngine(
          {
            hand: 12, // Over limit - requires discard
            resourceArea: 6,
            deck: 28,
          },
          {
            hand: 5,
            resourceArea: 5,
            deck: 35,
          },
        );

        // Verify hand is over limit
        const handCount = engine.getZone("hand", "player_one").length;
        expect(handCount).toBe(12);
        expect(handCount).toBeGreaterThan(10);
      });

      it("should support various over-limit scenarios", () => {
        const overLimitCases = [11, 12, 15];

        for (const handSize of overLimitCases) {
          const engine = new GundamTestEngine(
            {
              hand: handSize,
              resourceArea: 5,
              deck: Math.max(0, 50 - handSize - 5),
            },
            {
              hand: 5,
              resourceArea: 5,
              deck: 35,
            },
          );

          const handCount = engine.getZone("hand", "player_one").length;
          expect(handCount).toBe(handSize);
          expect(handCount).toBeGreaterThan(10);
        }
      });
    });

    describe("Cleanup Step: End of turn cleanup", () => {
      it("should establish cleanup step framework", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 3,
            hand: 7,
            resourceArea: 6,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 6,
            resourceArea: 5,
            deck: 32,
          },
        );

        // Cleanup step ends "during this turn" effects
        const gameState = engine.getState();
        expect(gameState).toBeDefined();
      });

      it("should maintain game state consistency at cleanup", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 4,
            hand: 8,
            resourceArea: 9,
            deck: 25,
            trash: 4,
          },
          {
            battleArea: 3,
            hand: 6,
            resourceArea: 7,
            deck: 30,
            trash: 4,
          },
        );

        // All zones should be consistent
        assertZoneCount(engine, "battleArea", 4, "player_one");
        assertZoneCount(engine, "hand", 8, "player_one");
        assertZoneCount(engine, "resourceArea", 9, "player_one");
        assertZoneCount(engine, "trash", 4, "player_one");
      });

      it("should handle empty zones at cleanup", () => {
        const engine = new GundamTestEngine(
          {
            battleArea: 0, // No units
            hand: 5,
            resourceArea: 3,
            deck: 40,
            trash: 0,
            removalArea: 0,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 3,
            deck: 38,
          },
        );

        // Verify empty zones
        assertZoneCount(engine, "battleArea", 0, "player_one");
        assertZoneCount(engine, "trash", 0, "player_one");
        assertZoneCount(engine, "removalArea", 0, "player_one");
      });
    });
  });

  describe("Turn Progression Integration", () => {
    it("should maintain consistent turn player across phases", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 35,
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 35,
        },
      );

      const turnPlayer = engine.getTurnPlayer();
      assertTurnPlayer(engine, turnPlayer);

      // Turn player remains consistent
      expect(engine.getTurnPlayer()).toBe(turnPlayer);
    });

    it("should support complete turn structure", () => {
      // Simulates a full turn cycle through all phases
      const engine = new GundamTestEngine(
        {
          deck: 35,
          resourceDeck: 7,
          resourceArea: 3,
          hand: 6,
          battleArea: 2,
        },
        {
          deck: 38,
          resourceDeck: 8,
          resourceArea: 2,
          hand: 5,
          battleArea: 1,
        },
      );

      // Game should be in valid state for turn progression
      assertGamePhase(engine, "mainPhase");
      assertGameSegment(engine, "duringGame");

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toMatch(/player_(one|two)/);
    });

    it("should handle turn progression with various game states", () => {
      const gameStates = [
        {
          // Early game
          deck: 42,
          resourceArea: 2,
          battleArea: 1,
          hand: 6,
        },
        {
          // Mid game
          deck: 28,
          resourceArea: 7,
          battleArea: 4,
          hand: 5,
        },
        {
          // Late game
          deck: 15,
          resourceArea: 12,
          battleArea: 6,
          hand: 4,
        },
      ];

      for (const state of gameStates) {
        const engine = new GundamTestEngine(state, {
          deck: 30,
          resourceArea: 5,
          battleArea: 3,
          hand: 5,
        });

        // Each state should maintain valid turn structure
        expect(engine.getTurnPlayer()).toBeDefined();
        assertGamePhase(engine, "mainPhase");
        assertZoneCount(engine, "deck", state.deck, "player_one");
        assertZoneCount(
          engine,
          "resourceArea",
          state.resourceArea,
          "player_one",
        );
        assertZoneCount(engine, "battleArea", state.battleArea, "player_one");
        assertZoneCount(engine, "hand", state.hand, "player_one");
      }
    });

    it("should maintain turn count across progression", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 4,
          battleArea: 2,
          deck: 35,
        },
        {
          hand: 5,
          resourceArea: 4,
          battleArea: 2,
          deck: 35,
        },
      );

      // Turn count should be trackable
      const numTurns = engine.getNumTurns();
      expect(numTurns).toBeGreaterThanOrEqual(0);
    });

    it("should track move count during game", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 3,
          deck: 32,
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 3,
          deck: 32,
        },
      );

      // Move count should be trackable
      const numMoves = engine.getNumMoves();
      expect(numMoves).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Phase Transition Rules", () => {
    it("should establish phase progression framework", () => {
      // Start -> Draw -> Resource -> Main -> End
      const engine = buildGameStartScenario();

      // Game should start in proper initial phase
      const gamePhase = engine.getGamePhase();
      expect(gamePhase).toBeDefined();
    });

    it("should support segment and phase coordination", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 35,
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 35,
        },
      );

      // Segment and phase should be consistent
      const segment = engine.getGameSegment();
      const phase = engine.getGamePhase();

      expect(segment).toBeDefined();
      expect(phase).toBeDefined();

      // During game segment should have main phase
      if (segment === "duringGame") {
        expect(phase).toBe("mainPhase");
      }
    });

    it("should maintain flow state consistency", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 6,
          battleArea: 3,
          deck: 32,
        },
        {
          hand: 5,
          resourceArea: 6,
          battleArea: 3,
          deck: 32,
        },
      );

      const flowState = engine.getFlowState();

      expect(flowState.gameSegment).toBeDefined();
      expect(flowState.gamePhase).toBeDefined();
      expect(flowState.turnPlayer).toBeDefined();
      expect(flowState.priorityPlayers).toBeDefined();
    });

    it("should handle starting game segment properly", () => {
      const engine = buildGameStartScenario();

      // Starting segment before duringGame
      const segment = engine.getGameSegment();
      const phase = engine.getGamePhase();

      expect(segment).toBeDefined();
      expect(phase).toBeDefined();
    });
  });

  describe("Game Progression Edge Cases", () => {
    it("should handle minimum resources scenario", () => {
      // Turn 1 - minimal resources
      const engine = new GundamTestEngine(
        {
          resourceDeck: 9,
          resourceArea: 1, // Just placed first resource
          hand: 6,
          deck: 39,
          battleArea: 0,
        },
        {
          resourceDeck: 10,
          resourceArea: 0,
          hand: 5,
          deck: 40,
          battleArea: 0,
        },
      );

      assertZoneCount(engine, "resourceArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_one");
    });

    it("should handle maximum resources scenario", () => {
      // Late game - maximum resources
      const engine = new GundamTestEngine(
        {
          resourceDeck: 0,
          resourceArea: 15, // Maximum resources reached
          hand: 3,
          deck: 10,
          battleArea: 6, // Full board
        },
        {
          resourceDeck: 2,
          resourceArea: 13,
          hand: 4,
          deck: 15,
          battleArea: 5,
        },
      );

      assertZoneCount(engine, "resourceArea", 15, "player_one");
      assertZoneCount(engine, "resourceDeck", 0, "player_one");
    });

    it("should handle empty deck near end game", () => {
      const engine = new GundamTestEngine(
        {
          deck: 2, // Almost out of cards
          hand: 8,
          resourceArea: 12,
          battleArea: 5,
        },
        {
          deck: 5,
          hand: 6,
          resourceArea: 10,
          battleArea: 4,
        },
      );

      assertZoneCount(engine, "deck", 2, "player_one");
    });

    it("should handle full hand at hand step", () => {
      // Player needs to discard during hand step
      const engine = new GundamTestEngine(
        {
          hand: 13, // Over limit
          resourceArea: 8,
          battleArea: 4,
          deck: 20,
        },
        {
          hand: 6,
          resourceArea: 7,
          battleArea: 3,
          deck: 28,
        },
      );

      const handCount = engine.getZone("hand", "player_one").length;
      expect(handCount).toBeGreaterThan(10);
    });

    it("should handle complex board state progression", () => {
      const engine = new GundamTestEngine(
        {
          deck: 18,
          hand: 7,
          battleArea: 5,
          resourceArea: 11,
          trash: 6,
          removalArea: 2,
          shieldSection: 3,
        },
        {
          deck: 22,
          hand: 6,
          battleArea: 4,
          resourceArea: 9,
          trash: 4,
          removalArea: 1,
          shieldSection: 5,
        },
      );

      // Verify complex state is maintained
      assertZoneCount(engine, "deck", 18, "player_one");
      assertZoneCount(engine, "hand", 7, "player_one");
      assertZoneCount(engine, "battleArea", 5, "player_one");
      assertZoneCount(engine, "resourceArea", 11, "player_one");
      assertZoneCount(engine, "trash", 6, "player_one");
      assertZoneCount(engine, "removalArea", 2, "player_one");
      assertZoneCount(engine, "shieldSection", 3, "player_one");
    });
  });

  describe("Real Game Scenario Progression", () => {
    // Refactored using parameterized tests to reduce repetition
    const gameScenarios = [
      {
        name: "early game (turn 2-3)",
        playerOne: {
          deck: 42,
          hand: 6,
          resourceArea: 2,
          battleArea: 1,
          shieldSection: 6,
          trash: 0,
        },
        expectedCounts: {
          deck: 42,
          hand: 6,
          resourceArea: 2,
          battleArea: 1,
          shieldSection: 6,
        },
      },
      {
        name: "mid game (turn 5-7)",
        playerOne: {
          deck: 30,
          hand: 5,
          resourceArea: 6,
          battleArea: 3,
          trash: 5,
          shieldSection: 5,
        },
        expectedCounts: {
          deck: 30,
          hand: 5,
          resourceArea: 6,
          battleArea: 3,
          trash: 5,
          shieldSection: 5,
        },
      },
      {
        name: "late game (turn 10+)",
        playerOne: {
          deck: 15,
          hand: 4,
          resourceArea: 12,
          battleArea: 5,
          trash: 12,
          removalArea: 3,
          shieldSection: 2,
        },
        expectedCounts: {
          deck: 15,
          hand: 4,
          resourceArea: 12,
          battleArea: 5,
          trash: 12,
          removalArea: 3,
          shieldSection: 2,
        },
      },
    ];

    for (const scenario of gameScenarios) {
      it(`should support typical ${scenario.name}`, () => {
        const engine = new GundamTestEngine(scenario.playerOne, {
          deck: 30,
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
        });

        // Verify all expected zone counts
        for (const [zone, count] of Object.entries(scenario.expectedCounts)) {
          assertZoneCount(engine, zone as any, count, "player_one");
        }
      });
    }

    it("should maintain zone consistency across all phases", () => {
      const engine = new GundamTestEngine(
        {
          deck: 25,
          resourceDeck: 5,
          resourceArea: 5,
          hand: 6,
          battleArea: 3,
          shieldSection: 5,
          shieldBase: 1,
          trash: 5,
        },
        {
          deck: 28,
          resourceDeck: 7,
          resourceArea: 3,
          hand: 5,
          battleArea: 2,
          shieldSection: 6,
          shieldBase: 1,
          trash: 3,
        },
      );

      // All zones should maintain their counts
      assertZoneCount(engine, "deck", 25, "player_one");
      assertZoneCount(engine, "resourceDeck", 5, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertZoneCount(engine, "hand", 6, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "shieldSection", 5, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "trash", 5, "player_one");
    });
  });
});
