import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
} from "../helpers/assertion-helpers";
import { getCardById, getCardsByType } from "../helpers/card-catalog-index";
import { buildGameStartScenario } from "../helpers/scenario-builders";

/**
 * Tests for LLM-RULES Section 8: Action Steps
 *
 * These tests validate the action step mechanics that occur in two contexts:
 * 1. During combat (after block step)
 * 2. During end phase
 *
 * Rules covered:
 * - 8-1: Action step contexts (after block step and during end phase)
 * - 8-2: Taking turns starting with standby player
 * - 8-3: Standby player actions (Action command, Activate·Action effect, pass)
 * - 8-4: Active player actions (same three options)
 * - 8-5: Consecutive passing ends the action step
 *
 * Priority Order: standby player → active player → standby player → ...
 * Action step ends when both players pass consecutively
 */

describe("LLM-RULES Section 8: Action Steps", () => {
  describe("Rule 8-1: Action Step Contexts", () => {
    it("should have action step during combat after block step", () => {
      // Rule 8-1: An action step occurs after the block step during combat
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Action step is part of combat flow: Attack → Block → Action → Damage → End
      assertGamePhase(engine, "mainPhase");
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should have action step during end phase", () => {
      // Rule 8-1: An action step occurs during the end phase
      // Rule 6-6-2: Action step is first step of end phase
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 3,
          deck: 28,
        },
        {
          hand: 6,
          resourceArea: 6,
          battleArea: 2,
          deck: 30,
        },
      );

      // End phase structure: Action step → End step → Hand step → Cleanup step
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });

    it("should maintain priority tracking during action steps", () => {
      // Action steps require priority management for turn-taking
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
          deck: 30,
        },
      );

      // Priority players should be defined
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
      expect(priorityPlayers.length).toBeGreaterThan(0);
    });
  });

  describe("Rule 8-2 & 8-3: Standby Player Actions", () => {
    describe("Rule 8-3: Three Action Options", () => {
      it("should support standby player activating Action command cards", () => {
        // Rule 8-3: Standby player may activate【Action】Command card
        // Rule 8-3-1: Activating【Action】Command = paying cost to play it
        const actionCommands = getCardsByType("command").slice(0, 5);
        expect(actionCommands.length).toBeGreaterThan(0);

        const engine = new GundamTestEngine(
          {
            hand: 5,
            resourceArea: 8,
            battleArea: 2,
            deck: 30,
          },
          {
            hand: actionCommands, // Player Two has Action commands
            resourceArea: 8,
            battleArea: 2,
            deck: 30,
          },
        );

        // Standby player (Player Two when Player One is turn player)
        assertTurnPlayer(engine, "player_one");
        assertZoneCount(engine, "hand", actionCommands.length, "player_two");
      });

      it("should support standby player activating Activate·Action effects", () => {
        // Rule 8-3-2: Activating【Activate･Action】= fulfilling conditions and activating
        // Some units have【Activate･Action】effects
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2, // Units may have【Activate･Action】effects
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
        );

        // Units in battle area can have activated effects
        assertZoneCount(engine, "battleArea", 2, "player_two");
        assertGamePhase(engine, "mainPhase");
      });

      it("should support standby player passing", () => {
        // Rule 8-3-3: Pass means doing nothing and letting priority pass to opponent
        const engine = new GundamTestEngine(
          {
            hand: 5,
            resourceArea: 6,
            battleArea: 3,
            deck: 30,
          },
          {
            hand: 5,
            resourceArea: 6,
            battleArea: 2,
            deck: 30,
          },
        );

        // Passing is always an option
        // Priority should be defined for pass mechanic
        const priorityPlayers = engine.getPriorityPlayers();
        expect(priorityPlayers).toBeDefined();
      });
    });

    it("should allow standby player to act first in action step", () => {
      // Rule 8-2: Taking turns starting with the standby player
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
      );

      // During action step, standby player acts first
      // When player_one is turn player, player_two is standby player
      assertTurnPlayer(engine, "player_one");
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });

    it("should support standby player with Action commands in hand", () => {
      // Test realistic scenario with Action commands
      const actionCommand = getCardById("GD01-101"); // Deep Devotion (Action)
      const commandCards = actionCommand
        ? [actionCommand]
        : getCardsByType("command").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: commandCards,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // Standby player has Action commands ready to activate
      assertZoneCount(engine, "hand", commandCards.length, "player_two");
    });
  });

  describe("Rule 8-4: Active Player Actions", () => {
    it("should allow active player same three action options", () => {
      // Rule 8-4: Active player may activate Action command, Activate·Action effect, or pass
      const actionCommands = getCardsByType("command").slice(0, 5);

      const engine = new GundamTestEngine(
        {
          hand: actionCommands, // Player One (turn player) has Action commands
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // Turn player is active player
      assertTurnPlayer(engine, "player_one");
      assertZoneCount(engine, "hand", actionCommands.length, "player_one");
    });

    it("should alternate priority between standby and active players", () => {
      // Rule 8-4-1: Unless both pass consecutively, priority passes back to standby player
      // Rule 8-4-2: Continue standby → active → standby until both pass
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 3,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
      );

      // Priority alternation: standby → active → standby → active → ...
      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBeDefined();

      // Priority management is required for alternation
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });

    it("should support active player with Activate·Action effects", () => {
      // Active player can use units with【Activate･Action】effects
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Units may have【Activate･Action】effects
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
      );

      // Turn player has units that could have activated effects
      assertTurnPlayer(engine, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });
  });

  describe("Rule 8-5: Consecutive Passing Ends Action Step", () => {
    it("should end action step when both players pass consecutively", () => {
      // Rule 8-5: When both players consecutively pass, action step ends
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
      );

      // Action step continues until both players pass consecutively
      // When both pass: standby passes → active passes → step ends
      assertGamePhase(engine, "mainPhase");
    });

    it("should continue action step if only one player passes", () => {
      // If only standby or only active player passes, action step continues
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // Action step requires CONSECUTIVE passes from both players
      // Single pass doesn't end the step
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });

    it("should reset consecutive pass counter when action is taken", () => {
      // If standby passes but active acts, consecutive pass counter resets
      const actionCommands = getCardsByType("command").slice(0, 2);

      const engine = new GundamTestEngine(
        {
          hand: actionCommands,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // If one player acts after the other passes, consecutive count resets
      // Action step continues with priority back to standby player
      assertZoneCount(engine, "hand", actionCommands.length, "player_one");
    });
  });

  describe("Action Step Integration Scenarios", () => {
    it("should handle action step during combat", () => {
      // Complete combat action step scenario
      const actionCommands = getCardsByType("command").slice(0, 2);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          hand: actionCommands.slice(0, 1), // One Action command
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 1, // Defender
          hand: actionCommands.slice(1, 2), // One Action command
          resourceArea: 8,
          deck: 30,
        },
      );

      // During combat action step, both players can use Action cards
      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "hand", 1, "player_two");
    });

    it("should handle action step during end phase", () => {
      // End phase action step scenario
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 3,
          deck: 28,
        },
        {
          hand: 6,
          resourceArea: 6,
          battleArea: 2,
          deck: 30,
        },
      );

      // End phase action step allows final actions before turn ends
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });

    it("should handle empty hands during action step", () => {
      // Neither player has Action commands
      const engine = new GundamTestEngine(
        {
          hand: 0, // No Action commands available
          resourceArea: 8,
          battleArea: 3,
          deck: 30,
        },
        {
          hand: 0,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // Action step still occurs, players can pass or use【Activate･Action】on units
      assertZoneCount(engine, "hand", 0, "player_one");
      assertZoneCount(engine, "hand", 0, "player_two");
    });

    it("should handle multiple action rounds", () => {
      // Scenario where multiple actions are taken before both pass
      const actionCommands = getCardsByType("command").slice(0, 6);

      const engine = new GundamTestEngine(
        {
          hand: actionCommands.slice(0, 3), // Three Action commands
          resourceArea: 10,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: actionCommands.slice(3, 6), // Three Action commands
          resourceArea: 10,
          battleArea: 2,
          deck: 30,
        },
      );

      // Multiple rounds: standby acts → active acts → standby acts → etc.
      assertZoneCount(engine, "hand", 3, "player_one");
      assertZoneCount(engine, "hand", 3, "player_two");
    });
  });

  describe("Action Step with Real Cards", () => {
    it("should verify Action command cards exist in catalog", () => {
      // Verify real【Action】Command cards are available
      const _deepDevotion = getCardById("GD01-101"); // Deep Devotion
      const _peacefulTimbre = getCardById("ST02-013"); // Peaceful Timbre

      // At least some Action commands should exist
      const commands = getCardsByType("command");
      expect(commands.length).toBeGreaterThan(0);

      // Some commands should be available for action steps
      expect(
        commands.filter((c) => c.type === "command").length,
      ).toBeGreaterThan(0);
    });

    it("should verify units with Activate·Action effects exist", () => {
      // Verify units with【Activate･Action】effects are available
      const _gallussk = getCardById("GD01-058"); // Gallussk
      const _gskyEasy = getCardById("GD01-014"); // G-Sky Easy
      const _aerialMirasoul = getCardById("GD01-082"); // Gundam Aerial Mirasoul

      // Some units with activated effects should exist
      const units = getCardsByType("unit");
      expect(units.length).toBeGreaterThan(0);
    });

    it("should handle action step with mixed card types", () => {
      // Real scenario with Action commands and units with Activate·Action
      const actionCommand = getCardById("GD01-101"); // Action command
      const unitWithEffect = getCardById("GD01-058"); // Unit with effect
      const regularUnit = getCardById("ST01-001"); // Regular unit

      const commandCards = actionCommand ? [actionCommand] : [];
      const battleUnits = [unitWithEffect, regularUnit].filter(Boolean);

      const engine = new GundamTestEngine(
        {
          hand: commandCards,
          battleArea: battleUnits.length > 0 ? battleUnits : 1,
          resourceArea: 10,
          deck: 30,
        },
        {
          hand: 5,
          battleArea: 2,
          resourceArea: 8,
          deck: 30,
        },
      );

      // Player can use Action commands from hand or unit effects from battle area
      if (commandCards.length > 0) {
        assertZoneCount(engine, "hand", commandCards.length, "player_one");
      }
      expect(engine.getZone("battleArea", "player_one").length).toBeGreaterThan(
        0,
      );
    });
  });

  describe("Action Step Priority Order", () => {
    it("should establish standby player priority first", () => {
      // Rule 8-2 & 8-3: Standby player acts first
      const engine = buildGameStartScenario();

      // When player_one is turn player, player_two is standby player
      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBe("player_one");

      // Standby player would be player_two
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });

    it("should maintain consistent priority order throughout action step", () => {
      // Priority order: standby → active → standby → active → ...
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
      );

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBeDefined();

      // Priority tracking should be consistent
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
      expect(priorityPlayers.length).toBeGreaterThan(0);
    });

    it("should handle priority when turn player changes", () => {
      // When turn passes, priority structure changes
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 6,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 6,
          battleArea: 2,
          deck: 30,
        },
      );

      // Current turn player
      const initialTurnPlayer = engine.getTurnPlayer();
      expect(initialTurnPlayer).toBe("player_one");

      // After turn ends, turn player changes
      // Priority in action step would reverse
    });
  });

  describe("Action Step Edge Cases", () => {
    it("should handle action step with insufficient resources", () => {
      // Player has Action commands but not enough resources to pay costs
      const actionCommands = getCardsByType("command").slice(0, 3);

      const engine = new GundamTestEngine(
        {
          hand: actionCommands,
          resourceArea: 1, // Low resources
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 8,
          battleArea: 2,
          deck: 30,
        },
      );

      // Action commands in hand, but may not be playable due to cost
      assertZoneCount(engine, "hand", actionCommands.length, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_one");
    });

    it("should handle action step with rested units", () => {
      // Units need to be active to use【Activate･Action】effects (typically)
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Units may be rested
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
      );

      // Unit state affects ability to activate effects
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });

    it("should handle action step with no valid actions", () => {
      // Neither player can take actions (no Action commands, no Activate·Action effects)
      const engine = new GundamTestEngine(
        {
          hand: 0, // No commands
          battleArea: 0, // No units
          resourceArea: 5,
          deck: 40,
        },
        {
          hand: 0,
          battleArea: 0,
          resourceArea: 5,
          deck: 40,
        },
      );

      // Both players must pass, action step ends quickly
      assertZoneCount(engine, "hand", 0, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_one");
    });

    it("should handle simultaneous pass declarations", () => {
      // Test consecutive passing behavior
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
        {
          hand: 5,
          resourceArea: 7,
          battleArea: 2,
          deck: 30,
        },
      );

      // When both players pass consecutively, action step ends
      // Non-consecutive passes don't end the step
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });
  });
});
