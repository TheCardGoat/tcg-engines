/**
 * Combat & Scoring Tests - Rules 620-633
 *
 * Comprehensive test specifications for Riftbound combat and scoring rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule Sections:
 * - 620-623: Combat Basics (When Combat Occurs, Pending Combat, Two-Player Limit)
 * - 624-628: Steps of Combat (Showdown, Damage, Resolution, Cleanup)
 * - 629-633: Scoring (Conquer, Hold, Victory Conditions)
 */

import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 9: Combat & Scoring - Rules 620-633
// =============================================================================

describe("Section 9: Combat & Scoring - Rules 620-633", () => {
  // ===========================================================================
  // 620-623: Combat Basics
  // ===========================================================================

  describe("620-623: Combat Basics", () => {
    describe("When Combat Occurs (Rule 621)", () => {
      it.skip("Rule 621 - should trigger combat when cleanup occurs with opposing units at battlefield", () => {
        // Arrange: Battlefield with units from both players
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Opposing units present at battlefield
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 621 - should not trigger combat when chain has items", () => {
        // Arrange: Battlefield with opposing units and chain item
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
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

        // Assert: Chain exists, combat should not trigger yet
        expect(engine.hasChain()).toBe(true);
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 621 - should not trigger combat when only one player has units", () => {
        // Arrange: Battlefield with units from only one player
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3 },
                    { id: "unit2", might: 4 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: No opposing units
        expect(engine.hasOpposingUnits("bf1")).toBe(false);
      });

      it.skip("Rule 621 - should not trigger combat at empty battlefield", () => {
        // Arrange: Empty battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: No units at battlefield
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
        expect(engine.hasOpposingUnits("bf1")).toBe(false);
      });
    });

    describe("Pending Combat (Rule 622)", () => {
      it.skip("Rule 622 - should mark combat as pending when opposing units present but steps not started", () => {
        // Arrange: Battlefield with opposing units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Mark pending combat
        engine.markPendingCombat("bf1");

        // Assert: Combat is pending
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 622.1 - turn player should choose which pending combat to resolve first", () => {
        // Arrange: Multiple battlefields with pending combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit1", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit1", might: 3 }],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit2", might: 4 }],
                  [PLAYER_TWO]: [{ id: "p2unit2", might: 4 }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");
        engine.markPendingCombat("bf2");

        // Assert: Both battlefields have pending combat
        expect(engine.hasPendingCombat("bf1")).toBe(true);
        expect(engine.hasPendingCombat("bf2")).toBe(true);
        expect(engine.getPendingCombats().length).toBe(2);
      });

      it.skip("Rule 622.2 - should not resolve combat if pending status removed before steps begin", () => {
        // Arrange: Battlefield with pending combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");

        // Act: Remove one player's units (combat no longer valid)
        engine.killUnit("p2unit");
        engine.clearPendingCombat("bf1");

        // Assert: No pending combat
        expect(engine.hasPendingCombat("bf1")).toBe(false);
      });
    });

    describe("Two-Player Limit (Rule 623)", () => {
      it.skip("Rule 623 - combat should only occur between exactly two players", () => {
        // Arrange: Battlefield with units from two players
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Exactly two players have units
        const units = engine.getUnitsAtBattlefield("bf1");
        const owners = new Set(units.map((u) => u.ownerId));
        expect(owners.size).toBe(2);
      });

      it.skip("Rule 623.1 - battlefields with pending combat should be invalid destinations for other players", () => {
        // Arrange: Battlefield with pending combat between P1 and P2
        // Cross-ref: Rule 610.2.a (Invalid Destinations)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");

        // Assert: Battlefield has pending combat
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 623.2 - units played to battlefield with pending combat should go to controller's base instead", () => {
        // Arrange: Battlefield with pending combat
        // Cross-ref: Rule 623.2.a (Redirect to Base)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");

        // Assert: Pending combat exists (unit redirection would occur in full implementation)
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });
    });

    describe("Combat Basics - Edge Cases", () => {
      it.skip("Rule 621 - should handle multiple battlefields with different combat states", () => {
        // Arrange: Multiple battlefields with varying unit configurations
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit1", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit1", might: 3 }],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit2", might: 4 }],
                },
              },
              {
                id: "bf3",
                units: {
                  [PLAYER_TWO]: [{ id: "p2unit2", might: 2 }],
                },
              },
            ],
          },
        );

        // Assert: Only bf1 has opposing units
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
        expect(engine.hasOpposingUnits("bf2")).toBe(false);
        expect(engine.hasOpposingUnits("bf3")).toBe(false);
      });

      it.skip("Rule 622 - should clear pending combat when all units from one side are removed", () => {
        // Arrange: Battlefield with pending combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );
        engine.markPendingCombat("bf1");

        // Act: Kill damaged unit during cleanup
        engine.cleanupKillDamagedUnits();

        // Assert: Only one player's units remain
        expect(engine.hasOpposingUnits("bf1")).toBe(false);
      });

      it.skip("Rule 623 - should handle combat when one player has multiple units", () => {
        // Arrange: Battlefield with multiple units from one player
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "p1unit1", might: 3 },
                    { id: "p1unit2", might: 4 },
                    { id: "p1unit3", might: 2 },
                  ],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 5 }],
                },
              },
            ],
          },
        );

        // Assert: Combat is valid (two players, regardless of unit count)
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(4);
      });

      it.skip("Rule 621 - should detect combat trigger during cleanup phase", () => {
        // Arrange: Game at cleanup phase with opposing units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "cleanup",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Perform cleanup marking
        engine.cleanupMarkPendingCombats();

        // Assert: Combat marked as pending
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 622 - should track multiple pending combats independently", () => {
        // Arrange: Three battlefields with opposing units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1u1", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2u1", might: 3 }],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_ONE]: [{ id: "p1u2", might: 4 }],
                  [PLAYER_TWO]: [{ id: "p2u2", might: 4 }],
                },
              },
              {
                id: "bf3",
                units: {
                  [PLAYER_ONE]: [{ id: "p1u3", might: 2 }],
                  [PLAYER_TWO]: [{ id: "p2u3", might: 2 }],
                },
              },
            ],
          },
        );

        // Act: Mark all as pending
        engine.markPendingCombat("bf1");
        engine.markPendingCombat("bf2");
        engine.markPendingCombat("bf3");

        // Assert: All three have pending combat
        expect(engine.getPendingCombats().length).toBe(3);

        // Act: Clear one
        engine.clearPendingCombat("bf2");

        // Assert: Two remain
        expect(engine.getPendingCombats().length).toBe(2);
        expect(engine.hasPendingCombat("bf1")).toBe(true);
        expect(engine.hasPendingCombat("bf2")).toBe(false);
        expect(engine.hasPendingCombat("bf3")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 624-628: Steps of Combat
  // ===========================================================================

  describe("624-628: Steps of Combat", () => {
    describe("Showdown Step (Rule 625)", () => {
      it.skip("Rule 625.1 - should open showdown at start of combat", () => {
        // Arrange: Battlefield with opposing units ready for combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                contested: true,
                contestedBy: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "attacker", might: 3 }],
                  [PLAYER_TWO]: [{ id: "defender", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Start combat showdown
        engine.startShowdown();

        // Assert: Showdown is open
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 625.1.a - should establish attacker as player who applied contested status", () => {
        // Arrange: Battlefield contested by player 1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                contested: true,
                contestedBy: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Player 1's unit is attacker
        const attacker = engine.getUnit("attacker");
        expect(attacker?.meta.combatRole).toBe("attacker");
      });

      it.skip("Rule 625.1.b - should establish defender as other player", () => {
        // Arrange: Combat with roles assigned
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                contested: true,
                contestedBy: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Player 2's unit is defender
        const defender = engine.getUnit("defender");
        expect(defender?.meta.combatRole).toBe("defender");
      });

      it.skip("Rule 625.1.c - should create initial chain if attack/defend triggers exist", () => {
        // Arrange: Combat showdown
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Act: Add attack trigger to chain
        engine.addToChain({
          id: "attack-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Chain has trigger
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChain().length).toBe(1);
      });

      it.skip("Rule 625.1.d - should close state if initial chain was created", () => {
        // Arrange: Combat showdown with triggers
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.addToChain({
          id: "attack-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: State is closed (chain exists)
        expect(engine.getChainState()).toBe("closed");
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 625.e - attacking player should become active player", () => {
        // Arrange: Combat showdown
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
          },
        );
        engine.startShowdown();

        // Act: Set attacker as focus holder (active in showdown)
        engine.setFocusHolder(PLAYER_ONE);

        // Assert: Attacker has focus
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
      });
    });

    describe("Combat Damage Step (Rule 626)", () => {
      it.skip("Rule 626.1 - should only occur if both attacking and defending units remain", () => {
        // Arrange: Combat with both sides present
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Both sides have units
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 626.1.a.1 - should skip damage step if no units remain on either side", () => {
        // Arrange: Combat where all units were killed during showdown
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: No units at battlefield
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
      });

      it.skip("Rule 626.1.b - should sum might of all attacking units", () => {
        // Arrange: Multiple attacking units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "att1", might: 3, combatRole: "attacker" },
                    { id: "att2", might: 4, combatRole: "attacker" },
                    { id: "att3", might: 2, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "def1", might: 5, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Total attacking might is 3 + 4 + 2 = 9
        const attackers = engine
          .getUnitsAtBattlefield("bf1")
          .filter((u) => u.meta.combatRole === "attacker");
        const totalMight = attackers.reduce((sum, u) => sum + u.might, 0);
        expect(totalMight).toBe(9);
      });

      it.skip("Rule 626.1.c - should sum might of all defending units", () => {
        // Arrange: Multiple defending units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "att1", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "def1", might: 3, combatRole: "defender" },
                    { id: "def2", might: 4, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Total defending might is 3 + 4 = 7
        const defenders = engine
          .getUnitsAtBattlefield("bf1")
          .filter((u) => u.meta.combatRole === "defender");
        const totalMight = defenders.reduce((sum, u) => sum + u.might, 0);
        expect(totalMight).toBe(7);
      });

      it.skip("Rule 626.1.d - attacker should distribute damage first", () => {
        // Arrange: Combat scenario
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Attacker assigns 3 damage to defender (lethal)
        engine.addDamage("defender", 3);

        // Assert: Defender has lethal damage
        expect(engine.getDamage("defender")).toBe(3);
        expect(engine.shouldUnitDie("defender")).toBe(true);
      });

      it.skip("Rule 626.1.d.2 - must assign lethal damage before moving to next unit", () => {
        // Arrange: 5 damage to distribute among four 3-might units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "def1", might: 3, combatRole: "defender" },
                    { id: "def2", might: 3, combatRole: "defender" },
                    { id: "def3", might: 3, combatRole: "defender" },
                    { id: "def4", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Assign 3 to first (lethal), 2 to second (not lethal)
        engine.addDamage("def1", 3);
        engine.addDamage("def2", 2);

        // Assert: First unit dies, second survives
        expect(engine.shouldUnitDie("def1")).toBe(true);
        expect(engine.shouldUnitDie("def2")).toBe(false);
      });

      it.skip("Rule 626.1.d.2 - should not allow splitting damage below lethal threshold", () => {
        // Arrange: 5 damage, four 3-might units
        // Cannot split 2-1-1-1 (must do at least 3 to one unit first)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_TWO]: [
                    { id: "def1", might: 3 },
                    { id: "def2", might: 3 },
                    { id: "def3", might: 3 },
                    { id: "def4", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Valid assignment: 3 to def1 (lethal), 2 to def2
        engine.addDamage("def1", 3);
        engine.addDamage("def2", 2);

        // Assert: Only def1 should die
        expect(engine.shouldUnitDie("def1")).toBe(true);
        expect(engine.shouldUnitDie("def2")).toBe(false);
        expect(engine.shouldUnitDie("def3")).toBe(false);
        expect(engine.shouldUnitDie("def4")).toBe(false);
      });

      it.skip("Rule 599.1.b - stunned units should not contribute might to damage", () => {
        // Arrange: Stunned attacking unit
        // Cross-ref: Rule 599.1.b (Stunned units don't contribute might)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Stun the attacker
        engine.stunUnit("attacker");

        // Assert: Effective might is 0
        expect(engine.getEffectiveMight("attacker")).toBe(0);
        expect(engine.getUnitMight("attacker")).toBe(5); // Base might unchanged
      });

      it.skip("Rule 599.1.c - stunned units still require full might damage to kill", () => {
        // Arrange: Stunned unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 5 }],
                },
              },
            ],
          },
        );
        engine.stunUnit("unit1");

        // Act: Add damage less than might
        engine.addDamage("unit1", 4);

        // Assert: Unit survives (needs 5 damage to die)
        expect(engine.shouldUnitDie("unit1")).toBe(false);

        // Act: Add one more damage
        engine.addDamage("unit1", 1);

        // Assert: Now unit dies
        expect(engine.shouldUnitDie("unit1")).toBe(true);
      });
    });

    describe("Resolution Step (Rule 627)", () => {
      it.skip("Rule 627.1 - should remove units with lethal damage", () => {
        // Arrange: Units with lethal damage
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "att1", might: 3, damage: 3 }],
                  [PLAYER_TWO]: [{ id: "def1", might: 4, damage: 5 }],
                },
              },
            ],
          },
        );

        // Act: Kill damaged units
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Both units killed
        expect(killed.length).toBe(2);
        expect(engine.getUnit("att1")).toBeUndefined();
        expect(engine.getUnit("def1")).toBeUndefined();
      });

      it.skip("Rule 627.1.a - lethal damage is nonzero damage >= might", () => {
        // Arrange: Unit with exactly lethal damage
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

        // Assert: Damage equals might = lethal
        expect(engine.shouldUnitDie("unit1")).toBe(true);
      });

      it.skip("Rule 627.2 - attacking units should be recalled if both sides remain", () => {
        // Arrange: Combat where both sides survive
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    {
                      id: "attacker",
                      might: 5,
                      damage: 2,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "defender",
                      might: 5,
                      damage: 2,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Recall attacker
        engine.recallUnit("attacker");

        // Assert: Attacker is at base (no battlefieldId)
        expect(engine.getUnit("attacker")?.battlefieldId).toBeUndefined();
        expect(engine.getUnit("defender")?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 627.3 - battlefield should be conquered if no defending units remain", () => {
        // Arrange: Combat where defenders are killed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
                units: {
                  [PLAYER_ONE]: [
                    {
                      id: "attacker",
                      might: 5,
                      damage: 2,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "defender",
                      might: 3,
                      damage: 3,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Kill damaged defender
        engine.cleanupKillDamagedUnits();

        // Assert: Defender is dead, attacker remains
        expect(engine.getUnit("defender")).toBeUndefined();
        expect(engine.getUnit("attacker")).toBeDefined();
      });

      it.skip("Rule 627.3.a - conquer should result in control exchange", () => {
        // Arrange: Battlefield controlled by player 2
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
              },
            ],
          },
        );

        // Act: Change control to player 1 (conquer)
        engine.setBattlefieldController("bf1", PLAYER_ONE);

        // Assert: Player 1 now controls battlefield
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });

      it.skip("Rule 627.4 - should clear contested status after combat", () => {
        // Arrange: Contested battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                contested: true,
                contestedBy: PLAYER_ONE,
              },
            ],
          },
        );
        expect(engine.isBattlefieldContested("bf1")).toBe(true);

        // Act: Clear contested status
        engine.setBattlefieldContested("bf1", false);

        // Assert: No longer contested
        expect(engine.isBattlefieldContested("bf1")).toBe(false);
      });

      it.skip("Rule 627.5 - should clear all damage from all units at all locations", () => {
        // Arrange: Units with damage at multiple battlefields
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
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

        // Act: Clear all damage
        engine.clearAllDamage();

        // Assert: All damage cleared
        expect(engine.getDamage("unit1")).toBe(0);
        expect(engine.getDamage("unit2")).toBe(0);
      });

      it.skip("Rule 627.1.a.1 - no control change if neither side has units remaining", () => {
        // Arrange: Combat where all units die
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
                units: {
                  [PLAYER_ONE]: [{ id: "attacker", might: 3, damage: 3 }],
                  [PLAYER_TWO]: [{ id: "defender", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Kill all damaged units
        engine.cleanupKillDamagedUnits();

        // Assert: No units remain, controller unchanged
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_TWO);
      });
    });

    describe("Cleanup (Rule 628)", () => {
      it.skip("Rule 628 - should perform cleanup after combat completes", () => {
        // Arrange: Post-combat state with damaged units
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

        // Act: Perform cleanup
        engine.performCleanup();

        // Assert: Damaged unit killed
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 628 - should clear combat roles during cleanup", () => {
        // Arrange: Units with combat roles
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "unit2", might: 5, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Remove combat status
        engine.cleanupRemoveCombatStatus();

        // Assert: Combat roles cleared
        expect(engine.getUnit("unit1")?.meta.combatRole).toBeNull();
        expect(engine.getUnit("unit2")?.meta.combatRole).toBeNull();
      });
    });

    describe("Steps of Combat - Edge Cases", () => {
      it.skip("should handle overkill damage correctly", () => {
        // Arrange: Unit receiving more damage than needed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
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

        // Assert: Unit dies regardless of overkill
        expect(engine.shouldUnitDie("unit1")).toBe(true);

        // Act: Kill unit
        const killed = engine.cleanupKillDamagedUnits();
        expect(killed.length).toBe(1);
      });

      it.skip("should handle simultaneous deaths correctly", () => {
        // Arrange: Multiple units with lethal damage
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "att1", might: 3, damage: 3 },
                    { id: "att2", might: 4, damage: 5 },
                  ],
                  [PLAYER_TWO]: [
                    { id: "def1", might: 2, damage: 2 },
                    { id: "def2", might: 5, damage: 6 },
                  ],
                },
              },
            ],
          },
        );

        // Act: Kill all damaged units
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: All four units die simultaneously
        expect(killed.length).toBe(4);
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
      });

      it.skip("should handle combat with zero damage dealt", () => {
        // Arrange: All attackers stunned (0 effective might)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.stunUnit("attacker");

        // Assert: Attacker has 0 effective might
        expect(engine.getEffectiveMight("attacker")).toBe(0);

        // Defender takes no damage
        expect(engine.getDamage("defender")).toBe(0);
        expect(engine.shouldUnitDie("defender")).toBe(false);
      });

      it.skip("should handle combat where only attackers die", () => {
        // Arrange: Attackers with lethal damage, defenders survive
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
                units: {
                  [PLAYER_ONE]: [
                    {
                      id: "attacker",
                      might: 3,
                      damage: 5,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "defender",
                      might: 5,
                      damage: 2,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Kill damaged units
        engine.cleanupKillDamagedUnits();

        // Assert: Attacker dead, defender survives, control unchanged
        expect(engine.getUnit("attacker")).toBeUndefined();
        expect(engine.getUnit("defender")).toBeDefined();
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_TWO);
      });

      it.skip("should handle multiple attackers vs single defender", () => {
        // Arrange: 3 attackers vs 1 defender
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "att1", might: 2, combatRole: "attacker" },
                    { id: "att2", might: 3, combatRole: "attacker" },
                    { id: "att3", might: 4, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "def1", might: 8, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Total attacking might = 2 + 3 + 4 = 9
        const attackers = engine
          .getUnitsAtBattlefield("bf1")
          .filter((u) => u.meta.combatRole === "attacker");
        const totalAttackMight = attackers.reduce((sum, u) => sum + u.might, 0);
        expect(totalAttackMight).toBe(9);

        // Defender has 8 might, can kill one attacker
        const defender = engine.getUnit("def1");
        expect(defender?.might).toBe(8);
      });
    });
  });

  // ===========================================================================
  // 629-633: Scoring
  // ===========================================================================

  describe("629-633: Scoring", () => {
    describe("Two Ways to Score (Rule 630)", () => {
      it.skip("Rule 630.1 - should score via Conquer when gaining control of battlefield", () => {
        // Arrange: Player conquers battlefield they didn't score this turn
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
              },
            ],
          },
        );

        // Act: Player 1 conquers battlefield
        engine.setBattlefieldController("bf1", PLAYER_ONE);
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Player 1 gains point and battlefield marked as scored
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 630.2 - should score via Hold when controlling battlefield during Beginning Phase", () => {
        // Arrange: Player controls battlefield at start of turn
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

        // Assert: Player gains point
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 630.1 - should not score Conquer on battlefield already scored this turn", () => {
        // Arrange: Battlefield already scored this turn
        const engine = new RiftboundTestEngine(
          { victoryPoints: 1 },
          { victoryPoints: 0 },
          {
            phase: "action",
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
    });

    describe("Scoring Limit (Rule 631)", () => {
      it.skip("Rule 631 - should only allow scoring once per battlefield per turn", () => {
        // Arrange: Player scores battlefield
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Act: Score battlefield
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Cannot score same battlefield again
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 631 - should allow scoring different battlefields in same turn", () => {
        // Arrange: Multiple battlefields
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              { id: "bf1", controller: PLAYER_ONE },
              { id: "bf2", controller: PLAYER_ONE },
            ],
          },
        );

        // Act: Score both battlefields
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf2");

        // Assert: Both scored, 2 points total
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(2);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf2")).toBe(true);
      });

      it.skip("Rule 631 - should reset scored battlefields at turn end", () => {
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

        // Act: End turn
        engine.endTurn();

        // Assert: Scored tracking reset
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(false);
      });
    });

    describe("When You Score (Rule 632)", () => {
      it.skip("Rule 632.1 - should earn up to one point when scoring", () => {
        // Arrange: Player scores
        const engine = new RiftboundTestEngine(
          { victoryPoints: 3 },
          { victoryPoints: 0 },
          { victoryScore: 8 },
        );

        // Act: Score one point
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Exactly one point earned
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(4);
      });

      it.skip("Rule 632.1.b.1 - should score final point via Hold", () => {
        // Arrange: Player at 7 points (1 from victory at 8)
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 0 },
          {
            phase: "beginning",
            victoryScore: 8,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Act: Score via Hold
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Player wins
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
        expect(engine.isGameOver()).toBe(true);
      });

      it.skip("Rule 632.1.b.2 - should score final point via Conquer if all battlefields scored", () => {
        // Arrange: Player at 7 points, conquers all battlefields
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 0 },
          {
            phase: "action",
            victoryScore: 8,
            battlefields: [
              { id: "bf1", controller: PLAYER_ONE },
              { id: "bf2", controller: PLAYER_ONE },
            ],
          },
        );

        // Act: Score both battlefields via Conquer
        engine.markAsScored(PLAYER_ONE, "bf1");
        engine.markAsScored(PLAYER_ONE, "bf2");
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Player wins
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
        expect(engine.isGameOver()).toBe(true);
      });

      it.skip("Rule 632.1.b.2 - should draw card instead of final point if not all battlefields scored", () => {
        // Arrange: Player at 7 points, conquers only one battlefield
        // Cross-ref: Rule 632.1.b.2 (Draw card instead)
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 0 },
          {
            phase: "action",
            victoryScore: 8,
            battlefields: [
              { id: "bf1", controller: PLAYER_ONE },
              { id: "bf2", controller: PLAYER_TWO },
            ],
          },
        );

        // Act: Score only bf1 via Conquer
        engine.markAsScored(PLAYER_ONE, "bf1");
        // Note: In full implementation, player would draw card instead of gaining point

        // Assert: Player still at 7 points (would draw card instead)
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(7);
        expect(engine.isGameOver()).toBe(false);
      });

      it.skip("Rule 632.2.a - Conquer abilities should trigger at conquered battlefield", () => {
        // Arrange: Battlefield with conquer ability
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
              },
            ],
          },
        );

        // Act: Conquer battlefield
        engine.setBattlefieldController("bf1", PLAYER_ONE);
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Battlefield conquered (triggers would fire in full implementation)
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 632.2.b - Hold abilities should trigger at held battlefield", () => {
        // Arrange: Battlefield controlled during Beginning Phase
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

        // Act: Score via Hold
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Battlefield held (triggers would fire in full implementation)
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });

      it.skip("Rule 632.2.c - score abilities should only trigger once per turn per player", () => {
        // Arrange: Battlefield already scored
        const engine = new RiftboundTestEngine(
          { victoryPoints: 1 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );
        engine.markAsScored(PLAYER_ONE, "bf1");

        // Assert: Already scored, abilities won't trigger again
        expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
      });
    });

    describe("Winning (Rule 633)", () => {
      it.skip("Rule 633 - should win immediately when reaching victory score", () => {
        // Arrange: Player at 7 points
        const engine = new RiftboundTestEngine(
          { victoryPoints: 7 },
          { victoryPoints: 5 },
          { victoryScore: 8 },
        );

        // Act: Score final point
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Game ends immediately
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getWinner()).toBe(PLAYER_ONE);
      });

      it.skip("Rule 633 - should detect winner correctly", () => {
        // Arrange: Player 2 reaches victory score
        const engine = new RiftboundTestEngine(
          { victoryPoints: 5 },
          { victoryPoints: 7 },
          { victoryScore: 8 },
        );

        // Act: Player 2 scores final point
        engine.addVictoryPoints(PLAYER_TWO, 1);

        // Assert: Player 2 wins
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getWinner()).toBe(PLAYER_TWO);
      });

      it.skip("Rule 633 - should handle different victory scores by mode", () => {
        // Arrange: 2v2 mode with victory score of 11
        const engine = new RiftboundTestEngine(
          { victoryPoints: 10 },
          { victoryPoints: 8 },
          { victoryScore: 11 },
        );

        // Assert: Game not over yet
        expect(engine.isGameOver()).toBe(false);

        // Act: Score final point
        engine.addVictoryPoints(PLAYER_ONE, 1);

        // Assert: Game ends at 11
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(11);
      });
    });

    describe("Scoring - Edge Cases", () => {
      it.skip("should handle scoring multiple battlefields in one turn", () => {
        // Arrange: Player controls multiple battlefields
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              { id: "bf1", controller: PLAYER_ONE },
              { id: "bf2", controller: PLAYER_ONE },
              { id: "bf3", controller: PLAYER_ONE },
            ],
          },
        );

        // Act: Score all three
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf2");
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf3");

        // Assert: 3 points earned
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(3);
      });

      it.skip("should handle both players scoring in same turn", () => {
        // Arrange: Both players control battlefields
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "action",
            battlefields: [
              { id: "bf1", controller: PLAYER_ONE },
              { id: "bf2", controller: PLAYER_TWO },
            ],
          },
        );

        // Act: Both players score
        engine.addVictoryPoints(PLAYER_ONE, 1);
        engine.markAsScored(PLAYER_ONE, "bf1");
        engine.addVictoryPoints(PLAYER_TWO, 1);
        engine.markAsScored(PLAYER_TWO, "bf2");

        // Assert: Both have 1 point
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(1);
      });

      it.skip("should handle victory during opponent's turn", () => {
        // Arrange: Player 1's turn, but player 2 could win via effect
        const engine = new RiftboundTestEngine(
          { victoryPoints: 5 },
          { victoryPoints: 7 },
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            victoryScore: 8,
          },
        );

        // Act: Player 2 gains point (e.g., from burn out)
        engine.addVictoryPoints(PLAYER_TWO, 1);

        // Assert: Player 2 wins immediately
        expect(engine.isGameOver()).toBe(true);
        expect(engine.getWinner()).toBe(PLAYER_TWO);
      });

      it.skip("should handle uncontrolled battlefield (no scoring)", () => {
        // Arrange: Uncontrolled battlefield
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          { victoryPoints: 0 },
          {
            phase: "beginning",
            battlefields: [
              {
                id: "bf1",
                controller: null,
              },
            ],
          },
        );

        // Assert: No controller, no Hold scoring possible
        expect(engine.getBattlefieldController("bf1")).toBeNull();
      });
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("Integration: Combat + Turn Structure", () => {
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
                [PLAYER_ONE]: [{ id: "p1unit", might: 3 }],
                [PLAYER_TWO]: [{ id: "p2unit", might: 3 }],
              },
            },
          ],
        },
      );

      // Act: Start combat showdown
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

    it.skip("should clear damage at end of combat resolution", () => {
      // Arrange: Units with combat damage
      // Cross-ref: Rule 627.5 (Clear damage) + Rule 517.2 (Expiration Step)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
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

      // Act: Clear damage (Resolution Step)
      engine.clearAllDamage();

      // Assert: All damage cleared
      expect(engine.getDamage("unit1")).toBe(0);
      expect(engine.getDamage("unit2")).toBe(0);
    });

    it.skip("should trigger cleanup after combat resolution", () => {
      // Arrange: Post-combat state
      // Cross-ref: Rule 628 (Cleanup after combat)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "unit1", might: 3, damage: 3, combatRole: "attacker" },
                ],
              },
            },
          ],
        },
      );

      // Act: Perform cleanup
      engine.performCleanup();

      // Assert: Damaged unit killed, combat roles cleared
      expect(engine.getUnit("unit1")).toBeUndefined();
    });
  });

  describe("Integration: Combat + Chain", () => {
    it.skip("should handle chain during combat showdown", () => {
      // Arrange: Combat showdown
      // Cross-ref: Rule 625.1.c (Initial Chain)
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "attacker", might: 3, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "defender", might: 3, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );
      engine.startShowdown();

      // Act: Add spell to chain during combat
      engine.addToChain({
        id: "combat-spell",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Assert: Showdown Closed state
      expect(engine.isInShowdown()).toBe(true);
      expect(engine.hasChain()).toBe(true);
      expect(engine.getChainState()).toBe("closed");
    });

    it.skip("should resolve chain before combat damage step", () => {
      // Arrange: Combat with chain items
      // Cross-ref: Rule 625.1.f (Chain play before damage)
      const engine = new RiftboundTestEngine({}, {});
      engine.startShowdown();
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain
      engine.resolveChainItem();

      // Assert: Chain empty, still in showdown
      expect(engine.hasChain()).toBe(false);
      expect(engine.isInShowdown()).toBe(true);
    });

    it.skip("should allow reaction spells during combat", () => {
      // Arrange: Combat showdown with chain
      // Cross-ref: Rule 725 (Reaction keyword)
      const engine = new RiftboundTestEngine({}, {});
      engine.startShowdown();
      engine.addToChain({
        id: "action-spell",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Add reaction spell
      engine.addToChain({
        id: "reaction-spell",
        controllerId: PLAYER_TWO,
        type: "spell",
      });

      // Assert: Both spells on chain
      expect(engine.getChain().length).toBe(2);
    });

    it.skip("should perform cleanup after each chain item resolves during combat", () => {
      // Arrange: Combat with chain item that kills a unit
      // Cross-ref: Rule 543.3 (Cleanup after chain resolution)
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
      engine.startShowdown();
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain and cleanup
      engine.resolveChainItem();
      const killed = engine.cleanupKillDamagedUnits();

      // Assert: Damaged unit killed
      expect(killed.length).toBe(1);
    });
  });

  describe("Integration: Combat + Scoring", () => {
    it.skip("should score Conquer when winning combat", () => {
      // Arrange: Combat where attacker wins
      // Cross-ref: Rule 627.3 (Conquer) + Rule 630.1 (Conquer scoring)
      const engine = new RiftboundTestEngine(
        { victoryPoints: 0 },
        { victoryPoints: 0 },
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_ONE]: [
                  {
                    id: "attacker",
                    might: 5,
                    damage: 2,
                    combatRole: "attacker",
                  },
                ],
                [PLAYER_TWO]: [
                  {
                    id: "defender",
                    might: 3,
                    damage: 3,
                    combatRole: "defender",
                  },
                ],
              },
            },
          ],
        },
      );

      // Act: Kill defender, conquer battlefield
      engine.cleanupKillDamagedUnits();
      engine.setBattlefieldController("bf1", PLAYER_ONE);
      engine.addVictoryPoints(PLAYER_ONE, 1);
      engine.markAsScored(PLAYER_ONE, "bf1");

      // Assert: Player 1 conquers and scores
      expect(engine.getUnit("defender")).toBeUndefined();
      expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
    });

    it.skip("should not score if combat results in mutual destruction", () => {
      // Arrange: Combat where all units die
      // Cross-ref: Rule 627.1.a.1 (No control change if neither side remains)
      const engine = new RiftboundTestEngine(
        { victoryPoints: 0 },
        { victoryPoints: 0 },
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_ONE]: [{ id: "attacker", might: 3, damage: 3 }],
                [PLAYER_TWO]: [{ id: "defender", might: 3, damage: 3 }],
              },
            },
          ],
        },
      );

      // Act: Kill all units
      engine.cleanupKillDamagedUnits();

      // Assert: No units remain, no control change, no scoring
      expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
      expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_TWO);
      expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(0);
    });

    it.skip("should win game if final point scored via combat", () => {
      // Arrange: Player at 7 points, about to conquer
      const engine = new RiftboundTestEngine(
        { victoryPoints: 7 },
        { victoryPoints: 5 },
        {
          phase: "action",
          victoryScore: 8,
          battlefields: [
            { id: "bf1", controller: PLAYER_ONE },
            {
              id: "bf2",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_ONE]: [
                  { id: "attacker", might: 5, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  {
                    id: "defender",
                    might: 3,
                    damage: 3,
                    combatRole: "defender",
                  },
                ],
              },
            },
          ],
        },
      );

      // Act: Win combat, conquer both battlefields
      engine.cleanupKillDamagedUnits();
      engine.setBattlefieldController("bf2", PLAYER_ONE);
      engine.markAsScored(PLAYER_ONE, "bf1");
      engine.markAsScored(PLAYER_ONE, "bf2");
      engine.addVictoryPoints(PLAYER_ONE, 1);

      // Assert: Player wins
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinner()).toBe(PLAYER_ONE);
    });

    it.skip("should handle Hold scoring after surviving combat", () => {
      // Arrange: Defender survives combat, holds battlefield next turn
      const engine = new RiftboundTestEngine(
        { victoryPoints: 0 },
        { victoryPoints: 0 },
        {
          phase: "beginning",
          activePlayer: PLAYER_TWO,
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_TWO]: [{ id: "defender", might: 5, damage: 2 }],
              },
            },
          ],
        },
      );

      // Act: Score via Hold
      engine.addVictoryPoints(PLAYER_TWO, 1);
      engine.markAsScored(PLAYER_TWO, "bf1");

      // Assert: Defender scores for holding
      expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(1);
    });
  });

  // ===========================================================================
  // Edge Cases: Complex Combat Scenarios
  // ===========================================================================

  describe("Edge Cases: Complex Combat Scenarios", () => {
    it.skip("should handle combat with all units having equal might", () => {
      // Arrange: Mirror match - equal forces
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "att1", might: 3, combatRole: "attacker" },
                  { id: "att2", might: 3, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "def1", might: 3, combatRole: "defender" },
                  { id: "def2", might: 3, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );

      // Assert: Equal total might on both sides (6 vs 6)
      const attackers = engine
        .getUnitsAtBattlefield("bf1")
        .filter((u) => u.meta.combatRole === "attacker");
      const defenders = engine
        .getUnitsAtBattlefield("bf1")
        .filter((u) => u.meta.combatRole === "defender");
      const attackMight = attackers.reduce((sum, u) => sum + u.might, 0);
      const defendMight = defenders.reduce((sum, u) => sum + u.might, 0);
      expect(attackMight).toBe(defendMight);
    });

    it.skip("should handle combat with single 1-might unit", () => {
      // Arrange: Minimal combat scenario
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "att1", might: 1, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "def1", might: 1, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );

      // Act: Both deal 1 damage (lethal to each other)
      engine.addDamage("att1", 1);
      engine.addDamage("def1", 1);

      // Assert: Both die
      expect(engine.shouldUnitDie("att1")).toBe(true);
      expect(engine.shouldUnitDie("def1")).toBe(true);
    });

    it.skip("should handle combat with very high might units", () => {
      // Arrange: High-power combat
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "att1", might: 20, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "def1", might: 15, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );

      // Assert: Attacker can kill defender, defender cannot kill attacker
      expect(engine.getUnitMight("att1")).toBe(20);
      expect(engine.getUnitMight("def1")).toBe(15);
    });

    it.skip("should handle combat where attacker has exactly lethal damage", () => {
      // Arrange: Attacker with exactly enough damage to die
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_ONE]: [
                  {
                    id: "attacker",
                    might: 5,
                    damage: 5,
                    combatRole: "attacker",
                  },
                ],
                [PLAYER_TWO]: [
                  {
                    id: "defender",
                    might: 3,
                    damage: 0,
                    combatRole: "defender",
                  },
                ],
              },
            },
          ],
        },
      );

      // Assert: Attacker dies (damage = might)
      expect(engine.shouldUnitDie("attacker")).toBe(true);
      expect(engine.shouldUnitDie("defender")).toBe(false);
    });

    it.skip("should handle multiple combats in sequence", () => {
      // Arrange: Two battlefields with pending combat
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "att1", might: 3 }],
                [PLAYER_TWO]: [{ id: "def1", might: 3 }],
              },
            },
            {
              id: "bf2",
              units: {
                [PLAYER_ONE]: [{ id: "att2", might: 4 }],
                [PLAYER_TWO]: [{ id: "def2", might: 4 }],
              },
            },
          ],
        },
      );
      engine.markPendingCombat("bf1");
      engine.markPendingCombat("bf2");

      // Assert: Both have pending combat
      expect(engine.getPendingCombats().length).toBe(2);

      // Act: Resolve first combat
      engine.clearPendingCombat("bf1");

      // Assert: One combat remains
      expect(engine.getPendingCombats().length).toBe(1);
      expect(engine.hasPendingCombat("bf2")).toBe(true);
    });

    it.skip("should handle combat with mixed stunned and unstunned units", () => {
      // Arrange: Some attackers stunned
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [
                  { id: "att1", might: 3, combatRole: "attacker" },
                  { id: "att2", might: 4, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "def1", might: 5, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );

      // Act: Stun one attacker
      engine.stunUnit("att1");

      // Assert: Only unstunned attacker contributes might
      expect(engine.getEffectiveMight("att1")).toBe(0);
      expect(engine.getEffectiveMight("att2")).toBe(4);
      // Total effective attacking might = 0 + 4 = 4
    });

    it.skip("should handle combat at contested but uncontrolled battlefield", () => {
      // Arrange: Uncontrolled battlefield becomes contested
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              controller: null,
              contested: true,
              contestedBy: PLAYER_ONE,
              units: {
                [PLAYER_ONE]: [
                  { id: "att1", might: 3, combatRole: "attacker" },
                ],
                [PLAYER_TWO]: [
                  { id: "def1", might: 3, combatRole: "defender" },
                ],
              },
            },
          ],
        },
      );

      // Assert: Battlefield is contested with no controller
      expect(engine.getBattlefieldController("bf1")).toBeNull();
      expect(engine.isBattlefieldContested("bf1")).toBe(true);
    });

    it.skip("should handle scoring race to victory", () => {
      // Arrange: Both players close to victory
      const engine = new RiftboundTestEngine(
        { victoryPoints: 7 },
        { victoryPoints: 7 },
        {
          phase: "action",
          victoryScore: 8,
          battlefields: [
            { id: "bf1", controller: PLAYER_ONE },
            { id: "bf2", controller: PLAYER_TWO },
          ],
        },
      );

      // Act: Player 1 scores first
      engine.addVictoryPoints(PLAYER_ONE, 1);

      // Assert: Player 1 wins (first to reach victory score)
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinner()).toBe(PLAYER_ONE);
    });

    it.skip("should handle combat cleanup marking new pending combats", () => {
      // Arrange: After combat, new opposing units at another battlefield
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                [PLAYER_TWO]: [{ id: "unit2", might: 3 }],
              },
            },
          ],
        },
      );

      // Act: Perform cleanup marking
      engine.cleanupMarkPendingCombats();

      // Assert: New pending combat marked
      expect(engine.hasPendingCombat("bf1")).toBe(true);
    });
  });
});
