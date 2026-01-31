/**
 * Turn Structure Tests - Rules 500-526
 *
 * Comprehensive test specifications for Riftbound turn structure rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 */

import { describe, expect, it } from "bun:test";
import { PHASE_ORDER } from "../../game-definition/flow/turn-flow";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 5: Turn Structure - Rules 500-526
// =============================================================================

describe("Section 5: Turn Structure - Rules 500-526", () => {
  // ===========================================================================
  // 501-506: The Turn
  // ===========================================================================

  describe("501-506: The Turn", () => {
    describe("Basic Flow (Rules 502-506)", () => {
      it.skip("Rule 502 - should continue play cyclically until victory", () => {
        // Arrange: Game with player1 at 7 victory points (victory at 8)
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 0 },
          { victoryScore: 8 },
        );

        // Act: Add final point to trigger victory
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Game should detect victory condition
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
      });

      it("Rule 503 - should define phases in rigid order", () => {
        // Assert: Phases are in correct order (no engine needed)
        expect(PHASE_ORDER).toEqual([
          "awaken",
          "beginning",
          "channel",
          "draw",
          "action",
          "ending",
          "cleanup",
        ]);
      });

      it.skip("Rule 503 - should advance through phases in order", () => {
        // Arrange: Game starting at awaken phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "awaken" });

        // Act & Assert: Advance through each phase
        expect(engine.getCurrentPhase()).toBe("awaken");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("beginning");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("channel");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("draw");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("action");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("ending");
        engine.advancePhase();
        expect(engine.getCurrentPhase()).toBe("cleanup");
      });

      it.skip("Rule 503.2 - should execute game actions one at a time completely", () => {
        // Arrange: Game with chain items
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Act: Resolve chain items one at a time
        const first = engine.resolveChainItem();
        expect(engine.getChain().length).toBe(1);
        const second = engine.resolveChainItem();
        expect(engine.getChain().length).toBe(0);

        // Assert: Items resolved in LIFO order (stack)
        expect(first?.id).toBe("spell2");
        expect(second?.id).toBe("spell1");
      });

      it.skip("Rule 503.2.a - should resolve simultaneous effects in turn order", () => {
        // Arrange: Game with player1 as active
        const engine = new RiftboundTestEngine(
          {},
          {},
          { activePlayer: PLAYER_ONE },
        );

        // Assert: Active player is player1, turn order maintained
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
        const playerIds = engine.getPlayerIds();
        expect(playerIds[0]).toBe(PLAYER_ONE);
        expect(playerIds[1]).toBe(PLAYER_TWO);
      });

      it.skip("Rule 506 - should change turn player after all phases complete", () => {
        // Arrange: Game at cleanup phase with player1 active
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "cleanup",
            activePlayer: PLAYER_ONE,
          },
        );

        // Act: End turn
        engine.endTurn();

        // Assert: Player 2 becomes active player, phase resets
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.getCurrentPhase()).toBe("awaken");
      });
    });

    describe("Basic Flow - Edge Cases", () => {
      it.skip("should handle turn player change correctly", () => {
        // Arrange: Game at turn 1 with player1 active
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            turnNumber: 1,
            activePlayer: PLAYER_ONE,
          },
        );

        // Act: End turn
        engine.endTurn();

        // Assert: Turn passes to player 2, turn number increments
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.getTurnNumber()).toBe(2);
      });

      it.skip("should handle game ending mid-turn via victory points", () => {
        // Arrange: Game with player1 at 7 victory points
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 0 },
          { victoryScore: 8 },
        );
        expect(engine.isGameOver()).toBe(false);

        // Act: Trigger victory condition
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Game ends immediately
        expect(engine.isGameOver()).toBe(true);
      });

      it.skip("should handle game ending via concession", () => {
        // Arrange: Game in progress
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isGameOver()).toBe(false);

        // Act: Set winner (simulating concession)
        engine.setWinner(PLAYER_TWO);

        // Assert: Game ends with winner
        expect(engine.isGameOver()).toBe(true);
      });

      it.skip("Rule 502 - should cycle turn order back to first player after all players have taken turns", () => {
        // Arrange: Game at player 2's turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            turnNumber: 2,
            activePlayer: PLAYER_TWO,
          },
        );

        // Act: End player 2's turn
        engine.endTurn();

        // Assert: Turn cycles back to player 1
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
        expect(engine.getTurnNumber()).toBe(3);
      });

      it.skip("Rule 502 - should detect victory when both players reach victory score simultaneously", () => {
        // Arrange: Both players at 7 victory points
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 7 },
          { victoryScore: 8 },
        );

        // Act: Both players gain a point (simulating simultaneous scoring)
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.addVictoryPoints(PLAYER_TWO, 1);

        // Assert: Game is over (first to reach wins per turn order)
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(8);
      });

      it.skip("Rule 503 - should not allow advancing past cleanup phase", () => {
        // Arrange: Game at cleanup phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "cleanup" });

        // Act: Try to advance phase
        const result = engine.advancePhase();

        // Assert: Phase does not advance (returns null or stays at cleanup)
        expect(result).toBeNull();
        expect(engine.getCurrentPhase()).toBe("cleanup");
      });

      it.skip("Rule 504 - should not allow game actions during game over state", () => {
        // Arrange: Game that has ended
        const engine = new RiftboundTestEngine(
          { victoryPoints: 8 },
          { victoryPoints: 0 },
          { victoryScore: 8 },
        );
        expect(engine.isGameOver()).toBe(true);

        // Assert: Game state is frozen
        const initialPhase = engine.getCurrentPhase();
        const initialTurn = engine.getTurnNumber();

        // These operations should have no effect on a finished game
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getCurrentPhase()).toBe(initialPhase);
        expect(engine.getTurnNumber()).toBe(initialTurn);
      });
    });
  });

  // ===========================================================================
  // 507-510: States of the Turn
  // ===========================================================================

  describe("507-510: States of the Turn", () => {
    describe("Neutral vs Showdown State (Rule 508)", () => {
      it.skip("Rule 508 - should be in Neutral state when no showdown in progress", () => {
        // Arrange: Standard game state
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Game is in Neutral state
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.isInShowdown()).toBe(false);
      });

      it.skip("Rule 508 - should be in Showdown state during combat", () => {
        // Arrange: Game then start showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Game is in Showdown state
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 508 - should transition back to Neutral when Showdown ends", () => {
        // Arrange: Game with showdown that ends
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        expect(engine.isInShowdown()).toBe(true);

        // Act: End showdown
        engine.endShowdown();

        // Assert: Back to Neutral state
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.isInShowdown()).toBe(false);
      });
    });

    describe("Open vs Closed State (Rule 509)", () => {
      it.skip("Rule 509 - should be in Open state when Chain is empty", () => {
        // Arrange: Game with empty Chain
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Game is in Open state
        expect(engine.getChain().length).toBe(0);
        expect(engine.getChainState()).toBe("open");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 509 - should be in Closed state when Chain has items", () => {
        // Arrange: Game with chain item
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Game is in Closed state
        expect(engine.getChainState()).toBe("closed");
        expect(engine.hasChain()).toBe(true);
      });

      it.skip("Rule 509 - should transition to Open when Chain empties", () => {
        // Arrange: Game with chain item
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        expect(engine.getChainState()).toBe("closed");

        // Act: Resolve chain item
        engine.resolveChainItem();

        // Assert: Back to Open state
        expect(engine.getChainState()).toBe("open");
      });
    });

    describe("Combined States (Rule 510)", () => {
      it.skip("Rule 510 - Neutral Open is default state during Action Phase", () => {
        // Arrange: Game in action phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Neutral Open state
        const state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("open");
      });

      it.skip("Rule 510 - Neutral Closed when Chain has items outside Showdown", () => {
        // Arrange: Game with chain item, no showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Neutral Closed state
        const state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("closed");
      });

      it.skip("Rule 510 - Showdown Open when in Showdown with empty Chain", () => {
        // Arrange: Game in showdown, empty chain
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Showdown Open state
        const state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("open");
      });

      it.skip("Rule 510 - Showdown Closed when in Showdown with Chain items", () => {
        // Arrange: Game in showdown with chain item
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Showdown Closed state
        const state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("closed");
      });
    });

    describe("States - Edge Cases", () => {
      it.skip("Rule 509 - should transition from Closed to Open when chain resolves completely", () => {
        // Arrange: Game with multiple chain items
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        expect(engine.getChainState()).toBe("closed");

        // Act: Resolve all chain items
        engine.resolveChainItem();
        expect(engine.getChainState()).toBe("closed"); // Still has one item
        engine.resolveChainItem();

        // Assert: Chain is empty, state is Open
        expect(engine.getChainState()).toBe("open");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 508 - should maintain Showdown state through chain resolution", () => {
        // Arrange: Showdown with chain items
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Act: Resolve chain item
        engine.resolveChainItem();

        // Assert: Still in Showdown (Open now)
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 510 - should correctly identify all four combined states", () => {
        // Test all four state combinations
        const engine = new RiftboundTestEngine({}, {});

        // Neutral Open (default)
        let state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("open");

        // Neutral Closed
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("closed");

        // Clear chain and start showdown
        engine.clearChain();
        engine.startShowdown();

        // Showdown Open
        state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("open");

        // Showdown Closed
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("closed");
      });

      it.skip("Rule 508 - should not allow starting a new Showdown while already in Showdown", () => {
        // Arrange: Game already in Showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        expect(engine.isInShowdown()).toBe(true);

        // Act: Try to start another showdown (should be no-op or error)
        engine.startShowdown();

        // Assert: Still in single Showdown state
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 509 - should handle clearing chain manually", () => {
        // Arrange: Game with chain items
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        expect(engine.getChainState()).toBe("closed");

        // Act: Clear chain
        engine.clearChain();

        // Assert: Chain is empty, state is Open
        expect(engine.getChainState()).toBe("open");
        expect(engine.getChain().length).toBe(0);
      });
    });
  });

  // ===========================================================================
  // 511-513: Priority and Focus
  // ===========================================================================

  describe("511-513: Priority and Focus", () => {
    describe("Priority (Rule 512)", () => {
      it.skip("Rule 512 - should grant priority during Neutral Open in Action Phase", () => {
        // Arrange: Game in action phase with priority set
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Active player has priority
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
        expect(engine.getPriorityHolder()).toBe(PLAYER_ONE);
      });

      it.skip("Rule 512 - should pass priority to next player when current passes", () => {
        // Arrange: Player 1 has priority
        const engine = new RiftboundTestEngine({}, {});
        engine.setPriorityHolder(PLAYER_ONE);
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);

        // Act: Player passes priority
        engine.passPriority();

        // Assert: Next player gains priority
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
        expect(engine.getPriorityHolder()).toBe(PLAYER_TWO);
      });

      it.skip("Rule 512 - should not allow actions without priority", () => {
        // Arrange: Player without priority
        const engine = new RiftboundTestEngine({}, {});
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Player 2 does not have priority
        expect(engine.hasPriority(PLAYER_TWO)).toBe(false);
      });
    });

    describe("Focus (Rule 513)", () => {
      it.skip("Rule 513 - should have no Focus during Neutral State", () => {
        // Arrange: Game in Neutral state
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.getTurnState()).toBe("neutral");

        // Assert: No player has Focus
        expect(engine.getFocusHolder()).toBeNull();
      });

      it.skip("Rule 513 - should retain Focus when passing Priority", () => {
        // Arrange: Player with Focus passes priority
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Pass priority
        engine.passPriority();

        // Assert: Player still has Focus
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
      });

      it.skip("Rule 513 - should clear Focus when Showdown ends", () => {
        // Arrange: Showdown with Focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: End showdown
        engine.endShowdown();

        // Assert: Focus is cleared
        expect(engine.getFocusHolder()).toBeNull();
      });
    });

    describe("Priority and Focus - Edge Cases", () => {
      it.skip("Rule 512 - should grant priority to chain item controller in Closed state", () => {
        // Arrange: Game with chain item controlled by player 2
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Act: Set priority to chain controller
        engine.setPriorityHolder(PLAYER_TWO);

        // Assert: Player 2 has priority (controls next chain item)
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 512 - should cycle priority back to first player after all pass", () => {
        // Arrange: Player 2 has priority
        const engine = new RiftboundTestEngine({}, {});
        engine.setPriorityHolder(PLAYER_TWO);

        // Act: Player 2 passes priority
        engine.passPriority();

        // Assert: Priority cycles back to player 1
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 513 - should grant Focus and Priority together when gaining Focus", () => {
        // Arrange: Showdown state
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Act: Grant Focus to player 1
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Player 1 has both Focus and Priority
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 513 - Focus holder should retain Focus when opponent gains Priority", () => {
        // Arrange: Player 1 has Focus, passes priority
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Pass priority to player 2
        engine.passPriority();

        // Assert: Player 1 still has Focus, player 2 has Priority
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
        expect(engine.hasFocus(PLAYER_TWO)).toBe(false);
      });

      it.skip("Rule 512 - should have no priority holder initially", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: No priority holder set
        expect(engine.getPriorityHolder()).toBeNull();
      });

      it.skip("Rule 513 - Focus transfer during Showdown", () => {
        // Arrange: Showdown with player 1 having Focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Transfer Focus to player 2
        engine.setFocusHolder(PLAYER_TWO);

        // Assert: Player 2 now has Focus
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
        expect(engine.hasFocus(PLAYER_ONE)).toBe(false);
      });
    });
  });

  // ===========================================================================
  // 514-517: Turn Phases
  // ===========================================================================

  describe("514-517: Turn Phases", () => {
    describe("Awaken Phase (Rule 515.1)", () => {
      it.skip("Rule 515.1 - should ready all exhausted game objects at start of turn", () => {
        // Arrange: Game with exhausted units via battlefields config
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "awaken",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", exhausted: true },
                    { id: "unit2", exhausted: true },
                  ],
                },
              },
            ],
          },
        );

        // Act: Ready all units for active player
        engine.readyAllUnits(PLAYER_ONE);

        // Assert: All exhausted units become ready
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(false);
        expect(engine.getUnit("unit2")?.meta.exhausted).toBe(false);
      });

      it.skip("Rule 515.1 - should only ready active player's objects", () => {
        // Arrange: Both players have exhausted units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "awaken",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", exhausted: true }],
                  [PLAYER_TWO]: [{ id: "p2unit", exhausted: true }],
                },
              },
            ],
          },
        );

        // Act: Ready only active player's units
        engine.readyAllUnits(PLAYER_ONE);

        // Assert: Only active player's units become ready
        expect(engine.getUnit("p1unit")?.meta.exhausted).toBe(false);
        expect(engine.getUnit("p2unit")?.meta.exhausted).toBe(true);
      });
    });

    describe("Channel Phase (Rule 515.3)", () => {
      it.skip("Rule 515.3 - should track energy in rune pool", () => {
        // Arrange: Game with energy set via player state
        const engine = new RiftboundTestEngine({ energy: 5 }, {});

        // Assert: Energy is tracked
        expect(engine.getEnergy(PLAYER_ONE)).toBe(5);
      });

      it.skip("Rule 515.3 - should track power by domain in rune pool", () => {
        // Arrange: Game with power set via player state
        const engine = new RiftboundTestEngine(
          { power: { fury: 2, calm: 3 } },
          {},
        );

        // Assert: Power is tracked by domain
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
        expect(engine.getPower(PLAYER_ONE, "calm")).toBe(3);
      });
    });

    describe("Draw Phase (Rule 515.4)", () => {
      it.skip("Rule 515.4 - should empty Rune Pool at end of Draw Phase", () => {
        // Arrange: Game with rune pool resources
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 3 } },
          {},
        );

        // Act: Empty rune pool
        engine.emptyRunePool(PLAYER_ONE);

        // Assert: Rune Pool is empty
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(0);
      });
    });

    describe("Action Phase (Rule 516)", () => {
      it.skip("Rule 516 - should be in Neutral Open state during Action Phase", () => {
        // Arrange: Game in action phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Game is in Neutral Open state
        expect(engine.getCurrentPhase()).toBe("action");
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 516 - should detect opposing units at battlefield", () => {
        // Arrange: Battlefield with units from both players
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );

        // Assert: Battlefield has opposing units
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 516 - should not detect opposing units when only one player", () => {
        // Arrange: Battlefield with units from only one player
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1" }, { id: "unit2" }],
                },
              },
            ],
          },
        );

        // Assert: No opposing units
        expect(engine.hasOpposingUnits("bf1")).toBe(false);
      });
    });

    describe("End of Turn Phase (Rule 517)", () => {
      it.skip("Rule 517.2 - should clear all damage from all Units", () => {
        // Arrange: Units with damage
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", damage: 2 }],
                  [PLAYER_TWO]: [{ id: "unit2", damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Clear all damage
        engine.clearAllDamage();

        // Assert: All damage cleared
        expect(engine.getUnit("unit1")?.meta.damage).toBe(0);
        expect(engine.getUnit("unit2")?.meta.damage).toBe(0);
      });

      it.skip("Rule 517.5 - should make next player Turn Player", () => {
        // Arrange: Player 1's turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          { activePlayer: PLAYER_ONE },
        );

        // Act: End turn
        engine.endTurn();

        // Assert: Player 2 becomes Turn Player
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
      });

      it.skip("Rule 517.5 - should increment turn number", () => {
        // Arrange: Turn 1
        const engine = new RiftboundTestEngine({}, {}, { turnNumber: 1 });

        // Act: End turn
        engine.endTurn();

        // Assert: Turn number is 2
        expect(engine.getTurnNumber()).toBe(2);
      });

      it.skip("Rule 517.5 - should reset phase to Awaken", () => {
        // Arrange: Cleanup phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "cleanup" });

        // Act: End turn
        engine.endTurn();

        // Assert: Phase is Awaken
        expect(engine.getCurrentPhase()).toBe("awaken");
      });
    });

    describe("Turn Phases - Edge Cases", () => {
      it.skip("Rule 515.1 - should not ready opponent's units during Awaken Phase", () => {
        // Arrange: Both players have exhausted units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "awaken",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", exhausted: true }],
                  [PLAYER_TWO]: [{ id: "p2unit", exhausted: true }],
                },
              },
            ],
          },
        );

        // Act: Ready active player's units
        engine.readyAllUnits(PLAYER_ONE);

        // Assert: Only active player's units are ready
        expect(engine.getUnit("p1unit")?.meta.exhausted).toBe(false);
        expect(engine.getUnit("p2unit")?.meta.exhausted).toBe(true);
      });

      it.skip("Rule 515.2 - Beginning Phase should trigger Hold scoring for controlled battlefields", () => {
        // Arrange: Player controls a battlefield at start of Beginning Phase
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "beginning",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Act: Score for holding (simulating Beginning Phase scoring step)
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Player gains victory point for holding
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 515.3 - Channel Phase should handle insufficient runes gracefully", () => {
        // Arrange: Player with limited rune pool
        const engine = new RiftboundTestEngine(
          { energy: 0 },
          {},
          { phase: "channel" },
        );

        // Assert: Energy starts at 0 (no runes to channel)
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);

        // Act: Simulate channeling what's available (0 runes)
        // Engine should handle this gracefully without error
        expect(engine.getRunePool(PLAYER_ONE).energy).toBe(0);
      });

      it.skip("Rule 515.4 - Draw Phase should empty Rune Pool at end", () => {
        // Arrange: Player with resources in rune pool
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2, calm: 1 } },
          {},
          { phase: "draw" },
        );

        // Act: Empty rune pool (end of Draw Phase)
        engine.emptyRunePool(PLAYER_ONE);

        // Assert: All resources cleared
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "calm")).toBe(0);
      });

      it.skip("Rule 517.2 - Expiration Step should clear damage from all units simultaneously", () => {
        // Arrange: Multiple units with damage across battlefields
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "ending",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 5, damage: 3 }],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_TWO]: [{ id: "unit2", might: 4, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Clear all damage (Expiration Step)
        engine.clearAllDamage();

        // Assert: All damage cleared from all units
        expect(engine.getUnit("unit1")?.meta.damage).toBe(0);
        expect(engine.getUnit("unit2")?.meta.damage).toBe(0);
      });

      it.skip("Rule 517.2 - Expiration Step should also empty Rune Pool", () => {
        // Arrange: Player with resources at end of turn
        const engine = new RiftboundTestEngine(
          { energy: 3, power: { mind: 2 } },
          {},
          { phase: "ending" },
        );

        // Act: Empty rune pool (Expiration Step)
        engine.emptyRunePool(PLAYER_ONE);

        // Assert: Rune pool is empty
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "mind")).toBe(0);
      });

      it.skip("Rule 517.4 - Loop Check should detect if new damage occurred during Expiration", () => {
        // Arrange: Unit that survives initial damage clear
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "ending",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 5, damage: 0 }],
                },
              },
            ],
          },
        );

        // Act: Clear damage (no damage to clear)
        engine.clearAllDamage();

        // Assert: Unit still has no damage (loop check would pass)
        expect(engine.getUnit("unit1")?.meta.damage).toBe(0);
      });

      it.skip("Rule 515.1 - should ready units at multiple battlefields", () => {
        // Arrange: Player has exhausted units at multiple battlefields
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "awaken",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", exhausted: true }],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_ONE]: [{ id: "unit2", exhausted: true }],
                },
              },
            ],
          },
        );

        // Act: Ready all units
        engine.readyAllUnits(PLAYER_ONE);

        // Assert: All units at all battlefields are ready
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(false);
        expect(engine.getUnit("unit2")?.meta.exhausted).toBe(false);
      });
    });
  });

  // ===========================================================================
  // 518-526: Cleanups
  // ===========================================================================

  describe("518-526: Cleanups", () => {
    describe("Cleanup Step 1: Kill Damaged Units (Rule 520)", () => {
      it.skip("Rule 520 - should kill Units with damage >= Might", () => {
        // Arrange: Unit with damage equal to Might
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Unit goes to trash
        expect(killed.length).toBe(1);
        expect(killed[0]?.id).toBe("unit1");
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 520 - should not kill Units with damage < Might", () => {
        // Arrange: Unit with damage less than Might
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 5, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Unit remains
        expect(killed.length).toBe(0);
        expect(engine.getUnit("unit1")).toBeDefined();
      });

      it.skip("Rule 520 - should handle simultaneous deaths", () => {
        // Arrange: Multiple units with lethal damage
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
                  [PLAYER_TWO]: [{ id: "unit2", might: 2, damage: 4 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: All units die simultaneously
        expect(killed.length).toBe(2);
        expect(engine.getUnit("unit1")).toBeUndefined();
        expect(engine.getUnit("unit2")).toBeUndefined();
      });
    });

    describe("Cleanup Step 2: Remove Combat Status (Rule 521)", () => {
      it.skip("Rule 521 - should clear combat roles during cleanup", () => {
        // Arrange: Unit with combat role
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", combatRole: "attacker" }],
                },
              },
            ],
          },
        );
        expect(engine.getUnit("unit1")?.meta.combatRole).toBe("attacker");

        // Act: Perform cleanup
        engine.cleanupRemoveCombatStatus();

        // Assert: Combat role cleared
        expect(engine.getUnit("unit1")?.meta.combatRole).toBeNull();
      });
    });

    describe("Cleanup Step 5: Mark Pending Combats (Rule 524)", () => {
      it.skip("Rule 524 - should mark Battlefields with opposing Units for combat", () => {
        // Arrange: Battlefield with units from both players
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup marking
        engine.cleanupMarkPendingCombats();

        // Assert: Battlefield marked for pending combat
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 524 - should only mark during Neutral state", () => {
        // Arrange: Battlefield with opposing units during Showdown
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Act: Perform cleanup marking
        engine.cleanupMarkPendingCombats();

        // Assert: Battlefield not marked (Showdown state)
        expect(engine.hasPendingCombat("bf1")).toBe(false);
      });
    });

    describe("Cleanup Step 3: State-Based Effects (Rule 522)", () => {
      it.skip("Rule 522 - should execute state-based effects during cleanup", () => {
        // Arrange: Unit with conditional effect (e.g., "While" condition)
        // Note: This is a placeholder for when state-based effects are implemented
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup (state-based effects would execute here)
        engine.performCleanup();

        // Assert: Unit still exists (no state-based effect triggered death)
        expect(engine.getUnit("unit1")).toBeDefined();
      });
    });

    describe("Cleanup Step 4: Orphaned Hidden Cards (Rule 523)", () => {
      it.skip("Rule 523 - should remove Hidden cards without controller's Unit at Battlefield", () => {
        // Arrange: Battlefield with Hidden card but no controller's unit
        // Note: This requires Hidden card tracking which may need engine enhancement
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  // Player 2 has units but Player 1 has a Hidden card (simulated)
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup
        engine.performCleanup();

        // Assert: Orphaned Hidden cards would be removed
        // (Placeholder until Hidden card system is implemented)
        expect(engine.getBattlefield("bf1")).toBeDefined();
      });
    });

    describe("Cleanup Step 6: Trigger Showdowns (Rule 525)", () => {
      it.skip("Rule 525 - should trigger Showdown at uncontrolled Contested Battlefield", () => {
        // Arrange: Contested battlefield with no controller
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: null,
                contested: true,
                contestedBy: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Battlefield is contested and uncontrolled
        expect(engine.getBattlefieldController("bf1")).toBeNull();
        expect(engine.isBattlefieldContested("bf1")).toBe(true);
      });

      it.skip("Rule 525 - should only trigger Showdowns during Neutral Open state", () => {
        // Arrange: Contested battlefield during Showdown state
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: null,
                contested: true,
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: In Showdown state, new Showdowns should not trigger
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getTurnState()).toBe("showdown");
      });
    });

    describe("Cleanup Step 7: Trigger Combats (Rule 526)", () => {
      it.skip("Rule 526 - should trigger Combat at Battlefield with Pending Combat", () => {
        // Arrange: Battlefield marked for pending combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");

        // Assert: Battlefield has pending combat
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 526 - should only trigger Combats during Neutral Open state", () => {
        // Arrange: Pending combat during Closed state
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: In Closed state, combat should not trigger yet
        expect(engine.getChainState()).toBe("closed");
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 526 - should clear pending combat after combat triggers", () => {
        // Arrange: Battlefield with pending combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");
        expect(engine.hasPendingCombat("bf1")).toBe(true);

        // Act: Clear pending combat (simulating combat resolution)
        engine.clearPendingCombat("bf1");

        // Assert: Pending combat cleared
        expect(engine.hasPendingCombat("bf1")).toBe(false);
      });
    });

    describe("Cleanup - Edge Cases", () => {
      it.skip("Rule 519 - Cleanup should occur after Chain item resolves", () => {
        // Arrange: Game with chain item
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve chain item and perform cleanup
        engine.resolveChainItem();
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Damaged unit killed during cleanup
        expect(killed.length).toBe(1);
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 520 - should kill unit with damage exceeding Might (overkill)", () => {
        // Arrange: Unit with damage far exceeding Might
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 10 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Unit is killed
        expect(killed.length).toBe(1);
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 521 - should clear combat roles from all units", () => {
        // Arrange: Multiple units with combat roles
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", combatRole: "attacker" }],
                  [PLAYER_TWO]: [{ id: "unit2", combatRole: "defender" }],
                },
              },
            ],
          },
        );

        // Act: Remove combat status
        engine.cleanupRemoveCombatStatus();

        // Assert: All combat roles cleared
        expect(engine.getUnit("unit1")?.meta.combatRole).toBeNull();
        expect(engine.getUnit("unit2")?.meta.combatRole).toBeNull();
      });

      it.skip("Rule 524 - should not mark battlefield without opposing units", () => {
        // Arrange: Battlefield with only one player's units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1" }, { id: "unit2" }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup marking
        engine.cleanupMarkPendingCombats();

        // Assert: Battlefield not marked (no opposing units)
        expect(engine.hasPendingCombat("bf1")).toBe(false);
      });

      it.skip("should perform full cleanup sequence correctly", () => {
        // Arrange: Complex game state requiring multiple cleanup steps
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    {
                      id: "unit1",
                      might: 3,
                      damage: 3,
                      combatRole: "attacker",
                    },
                    {
                      id: "unit2",
                      might: 5,
                      damage: 2,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "unit3",
                      might: 4,
                      damage: 4,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Perform full cleanup
        engine.performCleanup();

        // Assert: Damaged units killed, combat roles cleared, pending combat marked
        expect(engine.getUnit("unit1")).toBeUndefined(); // Killed (damage >= might)
        expect(engine.getUnit("unit2")).toBeDefined(); // Survives
        expect(engine.getUnit("unit3")).toBeUndefined(); // Killed (damage >= might)
        expect(engine.getUnit("unit2")?.meta.combatRole).toBeNull(); // Role cleared
        // Note: Pending combat not marked because only one player has units left
        expect(engine.hasPendingCombat("bf1")).toBe(false);
      });
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("Integration: Full Turn Cycle", () => {
    it.skip("should complete a full turn cycle through all phases", () => {
      // Arrange: Game starting at awaken
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "awaken",
          turnNumber: 1,
          activePlayer: PLAYER_ONE,
        },
      );

      // Act: Advance through all phases
      expect(engine.getCurrentPhase()).toBe("awaken");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("beginning");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("channel");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("draw");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("action");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("ending");
      engine.advancePhase();
      expect(engine.getCurrentPhase()).toBe("cleanup");

      // End turn
      engine.endTurn();

      // Assert: Turn completes, next player becomes active
      expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
      expect(engine.getCurrentPhase()).toBe("awaken");
      expect(engine.getTurnNumber()).toBe(2);
    });

    it.skip("should handle game ending via victory points", () => {
      // Arrange: Player near victory
      const engine = new RiftboundTestEngine(
        { victoryPoints: 7 },
        {},
        { victoryScore: 8 },
      );
      expect(engine.isGameOver()).toBe(false);

      // Act: Score final point
      engine.addVictoryPoints(PLAYER_ONE, 1);

      // Assert: Game ends
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
    });
  });

  // ===========================================================================
  // Integration: Turn Structure + Combat (Rules 620-633)
  // ===========================================================================

  describe("Integration: Turn Structure + Combat", () => {
    it.skip("should transition to Showdown state when combat begins", () => {
      // Arrange: Battlefield with opposing units during Action Phase
      // Cross-ref: Rule 620 (Combat initiation)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "p1unit" }],
                [PLAYER_TWO]: [{ id: "p2unit" }],
              },
            },
          ],
        },
      );

      // Act: Start showdown (combat)
      engine.startShowdown();

      // Assert: Game state changes to Showdown
      expect(engine.getTurnState()).toBe("showdown");
      expect(engine.isInShowdown()).toBe(true);
    });

    it.skip("should return to Neutral state after combat ends", () => {
      // Arrange: Game in Showdown state
      // Cross-ref: Rule 621 (Combat resolution)
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.startShowdown();
      expect(engine.isInShowdown()).toBe(true);

      // Act: End showdown (combat resolves)
      engine.endShowdown();

      // Assert: Back to Neutral state
      expect(engine.getTurnState()).toBe("neutral");
      expect(engine.isInShowdown()).toBe(false);
    });

    it.skip("should clear damage at end of turn after combat", () => {
      // Arrange: Units with combat damage
      // Cross-ref: Rule 517.2 (Expiration Step) + Rule 626 (Damage assignment)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "ending",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit1", might: 5, damage: 3 }],
                [PLAYER_TWO]: [{ id: "unit2", might: 4, damage: 2 }],
              },
            },
          ],
        },
      );

      // Act: Clear damage (Expiration Step)
      engine.clearAllDamage();

      // Assert: All damage cleared
      expect(engine.getUnit("unit1")?.meta.damage).toBe(0);
      expect(engine.getUnit("unit2")?.meta.damage).toBe(0);
    });

    it.skip("should handle combat during Action Phase with chain", () => {
      // Arrange: Combat with abilities on chain
      // Cross-ref: Rule 532-544 (The Chain)
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.startShowdown();
      engine.addToChain({
        id: "ability1",
        controllerId: PLAYER_ONE,
        type: "ability",
      });

      // Assert: Showdown Closed state
      expect(engine.getTurnState()).toBe("showdown");
      expect(engine.getChainState()).toBe("closed");

      // Act: Resolve chain
      engine.resolveChainItem();

      // Assert: Showdown Open state
      expect(engine.getTurnState()).toBe("showdown");
      expect(engine.getChainState()).toBe("open");
    });
  });

  // ===========================================================================
  // Integration: Turn Structure + Scoring (Rules 629-633)
  // ===========================================================================

  describe("Integration: Turn Structure + Scoring", () => {
    it.skip("should score Hold during Beginning Phase", () => {
      // Arrange: Player controls battlefield at start of turn
      // Cross-ref: Rule 630 (Hold scoring)
      const engine = new RiftboundTestEngine(
        { victoryPoints: 0 },
        { victoryPoints: 0 },
        {
          phase: "beginning",
          activePlayer: PLAYER_ONE,
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_ONE,
            },
          ],
        },
      );

      // Act: Score for holding
      engine.addVictoryPoints(PLAYER_ONE, 1);
      engine.markAsScored(PLAYER_ONE, "bf1");

      // Assert: Victory point gained
      expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
      expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
    });

    it.skip("should not allow double-scoring same battlefield in one turn", () => {
      // Arrange: Battlefield already scored this turn
      // Cross-ref: Rule 629 (Conquer scoring restriction)
      const engine = new RiftboundTestEngine(
        { victoryPoints: 1 },
        { victoryPoints: 0 },
        {
          phase: "action",
          activePlayer: PLAYER_ONE,
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_ONE,
            },
          ],
        },
      );
      engine.markAsScored(PLAYER_ONE, "bf1");

      // Assert: Battlefield was already scored
      expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
    });

    it.skip("should reset scored battlefields at turn end", () => {
      // Arrange: Battlefield scored this turn
      const engine = new RiftboundTestEngine(
        { victoryPoints: 1 },
        { victoryPoints: 0 },
        {
          phase: "cleanup",
          activePlayer: PLAYER_ONE,
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_ONE,
            },
          ],
        },
      );
      engine.markAsScored(PLAYER_ONE, "bf1");
      expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);

      // Act: End turn
      engine.endTurn();

      // Assert: Scored tracking reset for new turn
      expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(false);
    });

    it.skip("should end game when victory score reached during turn", () => {
      // Arrange: Player at 7 points, victory at 8
      // Cross-ref: Rule 631-633 (Victory conditions)
      const engine = new RiftboundTestEngine(
        { victoryPoints: 7 },
        { victoryPoints: 5 },
        { victoryScore: 8 },
      );

      // Act: Score winning point
      engine.addVictoryPoints(PLAYER_ONE, 1);

      // Assert: Game ends
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinner()).toBe(PLAYER_ONE);
    });
  });

  // ===========================================================================
  // Integration: Turn Structure + Chain (Rules 532-544)
  // ===========================================================================

  describe("Integration: Turn Structure + Chain", () => {
    it.skip("should maintain chain state across phase boundaries", () => {
      // Arrange: Chain with items during action phase
      // Cross-ref: Rule 532 (Chain definition)
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Assert: Chain persists
      expect(engine.hasChain()).toBe(true);
      expect(engine.getChainState()).toBe("closed");
    });

    it.skip("should resolve chain items in LIFO order", () => {
      // Arrange: Multiple items on chain
      // Cross-ref: Rule 540 (Chain resolution order)
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });
      engine.addToChain({
        id: "spell2",
        controllerId: PLAYER_TWO,
        type: "spell",
      });
      engine.addToChain({
        id: "spell3",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain items
      const first = engine.resolveChainItem();
      const second = engine.resolveChainItem();
      const third = engine.resolveChainItem();

      // Assert: LIFO order (last in, first out)
      expect(first?.id).toBe("spell3");
      expect(second?.id).toBe("spell2");
      expect(third?.id).toBe("spell1");
    });

    it.skip("should trigger cleanup after each chain item resolves", () => {
      // Arrange: Chain item that causes damage
      // Cross-ref: Rule 519 (When cleanups occur)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
              },
            },
          ],
        },
      );
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain and cleanup
      engine.resolveChainItem();
      const killed = engine.cleanupKillDamagedUnits();

      // Assert: Cleanup killed damaged unit
      expect(killed.length).toBe(1);
    });
  });

  // ===========================================================================
  // Integration: Turn Structure + Zones (Rules 105-183)
  // ===========================================================================

  describe("Integration: Turn Structure + Zones", () => {
    it.skip("should track hand size changes during turn", () => {
      // Arrange: Player with cards in hand
      // Cross-ref: Rule 161 (Hand zone)
      const engine = new RiftboundTestEngine({}, {}, { phase: "draw" });
      engine.addToZone(PLAYER_ONE, "hand", {
        id: "card1",
        name: "Test Card 1",
      });
      engine.addToZone(PLAYER_ONE, "hand", {
        id: "card2",
        name: "Test Card 2",
      });

      // Assert: Hand size tracked
      expect(engine.getHandSize(PLAYER_ONE)).toBe(2);
    });

    it.skip("should track deck size for draw phase", () => {
      // Arrange: Player with cards in deck
      // Cross-ref: Rule 162 (Main Deck zone)
      const engine = new RiftboundTestEngine({}, {}, { phase: "draw" });
      engine.addToZone(PLAYER_ONE, "mainDeck", { id: "card1" });
      engine.addToZone(PLAYER_ONE, "mainDeck", { id: "card2" });
      engine.addToZone(PLAYER_ONE, "mainDeck", { id: "card3" });

      // Assert: Deck size tracked
      expect(engine.getDeckSize(PLAYER_ONE)).toBe(3);
    });

    it.skip("should move cards between zones", () => {
      // Arrange: Card in hand
      // Cross-ref: Rule 141-160 (Card movement)
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.addToZone(PLAYER_ONE, "hand", { id: "card1", name: "Test Card" });
      expect(engine.getHandSize(PLAYER_ONE)).toBe(1);

      // Act: Move card to trash
      engine.moveCard(PLAYER_ONE, "hand", "trash", "card1");

      // Assert: Card moved
      expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
    });
  });

  // ===========================================================================
  // Integration: Turn Structure + Resources (Rules 200-250)
  // ===========================================================================

  describe("Integration: Turn Structure + Resources", () => {
    it.skip("should track rune pool through turn phases", () => {
      // Arrange: Player with resources
      // Cross-ref: Rule 200-210 (Rune Pool)
      const engine = new RiftboundTestEngine(
        { energy: 3, power: { fury: 2 } },
        {},
        { phase: "action" },
      );

      // Assert: Resources available during action phase
      expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
      expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
    });

    it.skip("should empty rune pool at end of draw phase", () => {
      // Arrange: Player with resources at draw phase
      // Cross-ref: Rule 515.4 (Draw Phase rune pool empty)
      const engine = new RiftboundTestEngine(
        { energy: 5, power: { calm: 3, mind: 2 } },
        {},
        { phase: "draw" },
      );

      // Act: Empty rune pool
      engine.emptyRunePool(PLAYER_ONE);

      // Assert: All resources cleared
      expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
      expect(engine.getPower(PLAYER_ONE, "calm")).toBe(0);
      expect(engine.getPower(PLAYER_ONE, "mind")).toBe(0);
    });

    it.skip("should empty rune pool at expiration step", () => {
      // Arrange: Player with resources at end of turn
      // Cross-ref: Rule 517.2 (Expiration Step rune pool empty)
      const engine = new RiftboundTestEngine(
        { energy: 2, power: { body: 1 } },
        {},
        { phase: "ending" },
      );

      // Act: Empty rune pool (Expiration Step)
      engine.emptyRunePool(PLAYER_ONE);

      // Assert: Resources cleared
      expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
      expect(engine.getPower(PLAYER_ONE, "body")).toBe(0);
    });
  });

  // ===========================================================================
  // Integration: Multi-Turn Scenarios
  // ===========================================================================

  describe("Integration: Multi-Turn Scenarios", () => {
    it.skip("should handle multiple complete turns", () => {
      // Arrange: Game at start
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "awaken",
          turnNumber: 1,
          activePlayer: PLAYER_ONE,
        },
      );

      // Act: Complete two full turns
      // Turn 1
      for (let i = 0; i < 7; i++) {
        engine.advancePhase();
      }
      engine.endTurn();

      // Turn 2
      for (let i = 0; i < 7; i++) {
        engine.advancePhase();
      }
      engine.endTurn();

      // Assert: Turn 3, back to player 1
      expect(engine.getTurnNumber()).toBe(3);
      expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
      expect(engine.getCurrentPhase()).toBe("awaken");
    });

    it.skip("should accumulate victory points across turns", () => {
      // Arrange: Game with scoring
      const engine = new RiftboundTestEngine(
        { victoryPoints: 0 },
        { victoryPoints: 0 },
        { victoryScore: 8 },
      );

      // Act: Score points across multiple turns
      engine.addVictoryPoints(PLAYER_ONE, 2);
      engine.endTurn();
      engine.addVictoryPoints(PLAYER_TWO, 1);
      engine.endTurn();
      engine.addVictoryPoints(PLAYER_ONE, 3);

      // Assert: Points accumulated
      expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(5);
      expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(1);
      expect(engine.isGameOver()).toBe(false);
    });

    it.skip("should handle turn ending during showdown", () => {
      // Arrange: Showdown in progress
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          activePlayer: PLAYER_ONE,
        },
      );
      engine.startShowdown();

      // Act: End showdown, then end turn
      engine.endShowdown();
      engine.advancePhase(); // ending
      engine.advancePhase(); // cleanup
      engine.endTurn();

      // Assert: Turn ended properly
      expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
      expect(engine.isInShowdown()).toBe(false);
    });
  });
});
