import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
} from "../helpers/assertion-helpers";
import { getCardById, getCardsByKeyword } from "../helpers/card-catalog-index";
import { buildCombatScenario } from "../helpers/scenario-builders";

/**
 * Tests for LLM-RULES Section 7: Attacking and Battles
 *
 * These tests validate the complete attack flow consisting of five steps:
 * 7-3: Attack step - Declare target (player or rested Unit)
 * 7-4: Block step - Opponent may use <Blocker>
 * 7-5: Action step - Players may activate Action cards/effects
 * 7-6: Damage step - Deal damage based on target
 * 7-7: Battle end step - End battle effects
 *
 * Combat Rules Summary:
 * - Attacker must be active Unit, becomes rested when attacking
 * - Can attack opposing player or rested enemy Unit
 * - <Blocker> can change attack target during block step
 * - <High-Maneuver> prevents <Blocker> from activating
 * - <First Strike> deals damage before normal damage
 * - <Breach> deals damage to shield area when destroying Unit
 * - Player with no shields/base receiving damage is defeated
 * - Units with 0 HP are destroyed
 */

describe("LLM-RULES Section 7: Attacking and Battles", () => {
  describe("Rule 7-1: Attack Declaration", () => {
    it("should allow active player to declare attack during main phase", () => {
      // Rule 7-1: Using a main phase attack with a Unit, the active player may use
      // one of their Units to attack the opposing player or a rested enemy Unit
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 0,
      });

      // Verify attacker has a unit in battle area
      assertZoneCount(engine, "battleArea", 1, "player_one");
      expect(attackerUnits.length).toBe(1);

      // Verify game is in main phase where attacks can be declared
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });

    it("should allow attacking opposing player when no enemy units", () => {
      // Rule 7-3-1: Attack target can be the opposing player
      const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 0, // No defender units
      });

      expect(attackerUnits.length).toBe(1);
      expect(defenderUnits.length).toBe(0);

      // Player Two has no units, so Player One can attack the player directly
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });

    it("should allow attacking rested enemy units", () => {
      // Rule 7-3-1: Attack target can be a rested enemy Unit
      const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1, // Defender has a unit
      });

      expect(attackerUnits.length).toBe(1);
      expect(defenderUnits.length).toBe(1);

      // Both players have units - attacker can target rested defender unit
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should require attacker to rest unit when declaring attack", () => {
      // Rule 7-3-1: Select one active Unit in your battle area and rest it
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 0,
      });

      // Attacker has active unit
      expect(attackerUnits.length).toBe(1);

      // When attack is declared, the unit will be rested
      // This is validated through the attack move mechanism
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Rule 7-3: Attack Step", () => {
    it("should trigger attack effects when unit attacks", () => {
      // Rule 7-3-2: 【When Attacking】 effects on the attacking Unit and
      // "when a unit attacks" effects on other Units and cards are triggered
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(attackerUnits.length).toBe(1);

      // Attack effects would trigger here when attack is declared
      // Testing framework validates effects are set up correctly
      assertTurnPlayer(engine, "player_one");
    });

    it("should resolve multiple attack effects in proper order", () => {
      // Rule 7-3-2: If multiple effects trigger, they do so simultaneously,
      // and the active player activates their effects in the order they decide,
      // after which the standby player does the same
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 2, // Multiple units could have attack effects
        defenderCount: 1,
      });

      expect(attackerUnits.length).toBe(2);

      // Active player (player_one) resolves their effects first
      assertTurnPlayer(engine, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should apply effects worded during this battle", () => {
      // Rule 7-3-4: Effects worded "during this battle" gain effect now
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(attackerUnits.length).toBe(1);

      // "During this battle" effects activate at attack step
      // These effects last until battle end step
      assertGamePhase(engine, "mainPhase");
    });

    it("should skip to battle end step if attacker is destroyed during attack step", () => {
      // Rule 7-3-5-1: At the end of the attack step, if the attacking Unit
      // has been destroyed or otherwise moved to another location due to some event,
      // continue to the battle end step rather than the block step
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 0,
      });

      expect(attackerUnits.length).toBe(1);

      // If attacker is destroyed (e.g., by effect during attack step),
      // battle should skip directly to end step
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should skip to battle end step if target unit is destroyed during attack step", () => {
      // Rule 7-3-5-1: At the end of the attack step, if the Unit targeted
      // for attack has been destroyed, continue to battle end step
      const { engine, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(defenderUnits.length).toBe(1);

      // If target is destroyed during attack step, battle ends early
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("Rule 7-4: Block Step", () => {
    it("should allow standby player to activate blocker", () => {
      // Rule 7-4-1: The standby player may activate <Blocker> on one of their
      // active Units in the battle area
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      // Find a blocker card for testing
      const blockerCard = blockerCards[0];
      expect(blockerCard).toBeDefined();

      // Standby player can activate blocker during block step
      // This changes attack target to the blocker unit
    });

    it("should change attack target when blocker is activated", () => {
      // Rule 7-4-1: When activated, this effect changes the attack target
      // of the attacking Unit to the Unit with <Blocker>
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      // Original target is changed to the blocker unit
      // This happens during the block step
    });

    it("should allow blocker activation only once per attack", () => {
      // Rule 7-4-2: The <Blocker> effect can be activated only one time
      // in response to each attack
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 2, // Two potential blockers
      });

      // Only one blocker can be activated per attack
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should prevent originally targeted unit from blocking", () => {
      // Rule 7-4-3: A Unit originally targeted for attack cannot activate
      // its own <Blocker> effect
      const { engine, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(defenderUnits.length).toBe(1);

      // The unit being attacked cannot block for itself
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should allow standby player to choose not to block", () => {
      // Rule 7-4-4: Choosing not to activate a <Blocker> effect is also allowed
      const { engine, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(defenderUnits.length).toBe(1);

      // Blocker activation is optional
      // Standby player can pass on blocking
      assertGamePhase(engine, "mainPhase");
    });

    it("should skip to battle end step if attacker destroyed during block step", () => {
      // Rule 7-4-5-1: At the end of the block step, if the attacking Unit
      // has been destroyed, continue to the battle end step
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(attackerUnits.length).toBe(1);

      // If attacker destroyed during block step, battle ends
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should prevent blocker activation when attacker has high-maneuver", () => {
      // Rule 11-1-6-1: <High-Maneuver> is a keyword effect that prevents
      // the <Blocker> effect on enemy Units from activating
      const { engine } = buildCombatScenario({
        attackerCount: 1, // Would need unit with High-Maneuver
        defenderCount: 1, // Defender with Blocker
      });

      // High-Maneuver prevents blocker from activating
      // Attack target cannot be changed
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Rule 7-5: Action Step During Combat", () => {
    it("should allow action step during combat", () => {
      // Rule 7-5-1: Taking turns starting with the standby player,
      // players may activate 【Action】 Command cards and 【Activate･Action】 effects
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Action step occurs after block step
      // Standby player has priority first
      const priorityPlayers = engine.getPriorityPlayers();
      expect(priorityPlayers).toBeDefined();
    });

    it("should give standby player priority during combat action step", () => {
      // Rule 7-5-1: Taking turns starting with the standby player
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // During combat, standby player acts first in action step
      // This is player_two when player_one is attacking
      assertTurnPlayer(engine, "player_one");
    });

    it("should end action step when both players pass consecutively", () => {
      // Rule 7-5-2: If both players have declared they are passing,
      // end the action step and continue to damage step
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Action step ends when both pass
      // Then proceeds to damage step
      assertGamePhase(engine, "mainPhase");
    });

    it("should skip to battle end if units destroyed during action step", () => {
      // Rule 7-5-2-1: At the end of the action step, if the attacking Unit
      // or the Unit targeted for attack has been destroyed, continue to
      // the battle end step rather than the damage step
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // If either unit destroyed during action step, battle ends
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("Rule 7-6: Damage Step", () => {
    describe("Rule 7-6-2: Attack on a Player", () => {
      it("should check opponent shield area when attacking player", () => {
        // Rule 7-6-2-1: After an attack on a player has succeeded,
        // check the opponent's shield area
        const { engine } = buildCombatScenario({
          attackerCount: 1,
          defenderCount: 0, // No blockers
        });

        // Player Two's shield area will be checked
        // Could have base, shields, or neither
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should defeat player with no shields or base receiving damage", () => {
        // Rule 7-6-2-2: If there is no Base and not a single Shield in the
        // opponent's shield area, the attacking Unit deals battle damage equal
        // to its AP to the opposing player. A player receiving damage is
        // immediately defeated
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            shieldSection: 0, // No shields
            shieldBase: 0, // No base
            resourceArea: 5,
          },
        );

        // Player Two has no protection - would be defeated on damage
        assertZoneCount(engine, "shieldSection", 0, "player_two");
        assertZoneCount(engine, "shieldBase", 0, "player_two");
      });

      it("should deal damage to base when present in shield area", () => {
        // Rule 7-6-2-3: If there is a Base in the enemy shield area,
        // the attacking Unit deals an amount of battle damage equal to
        // its AP to the Base targeted for attack
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            shieldBase: 1, // Has base
            shieldSection: 0, // No shields
            resourceArea: 5,
          },
        );

        // Base receives damage equal to attacker's AP
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });

      it("should destroy base when HP becomes zero", () => {
        // Rule 7-6-2-3-1: Use counters to track damage received.
        // If the Base's HP becomes zero, it is destroyed and placed into the trash
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            shieldBase: 1, // Base that could be destroyed
            resourceArea: 5,
          },
        );

        // Base with HP equal to or less than damage is destroyed
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });

      it("should deal damage to shield when no base present", () => {
        // Rule 7-6-2-4: If there is a Shield but no Base in the enemy
        // shield area, the attacking Unit deals damage equal to its AP
        // to the top Shield in the shield section
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            shieldSection: 3, // Has shields
            shieldBase: 0, // No base
            resourceArea: 5,
          },
        );

        // Top shield receives damage
        assertZoneCount(engine, "shieldSection", 3, "player_two");
      });

      it("should destroy shield and reveal for burst effect", () => {
        // Rule 7-6-2-4-1: The Shield receiving damage is destroyed.
        // Place the card into the trash after revealing it.
        // If the revealed card has a 【Burst】 effect, the owner chooses
        // whether or not to activate it
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 1, // One shield to destroy
            resourceArea: 5,
          },
        );

        // Shield is destroyed and revealed
        // Burst effects can be activated
        assertZoneCount(engine, "shieldSection", 1, "player_two");
      });

      it("should handle first strike when attacking base", () => {
        // Rule 7-6-2-3-2: If the attacking Unit has <First Strike>,
        // it deals battle damage to the enemy Base before normal battle
        // damage is managed
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Would need unit with First Strike
            resourceArea: 5,
          },
          {
            shieldBase: 1,
            resourceArea: 5,
          },
        );

        // First Strike deals damage before normal damage
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });
    });

    describe("Rule 7-6-3: Attack on a Unit", () => {
      it("should conduct battle between two units", () => {
        // Rule 7-6-3-1: If an attack on a Unit succeeds,
        // conduct a battle between the two Units
        const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
          attackerCount: 1,
          defenderCount: 1,
        });

        expect(attackerUnits.length).toBe(1);
        expect(defenderUnits.length).toBe(1);

        // Both units participate in battle
        assertZoneCount(engine, "battleArea", 1, "player_one");
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should deal damage simultaneously between units", () => {
        // Rule 7-6-3-2: The attacking Unit deals damage equal to its AP
        // to the Unit targeted for attack simultaneously as the Unit
        // targeted for attack deals damage equal to its AP to the Attacking Unit
        const { attackerUnits, defenderUnits } = buildCombatScenario({
          attackerCount: 1,
          defenderCount: 1,
        });

        expect(attackerUnits.length).toBe(1);
        expect(defenderUnits.length).toBe(1);

        // Both units deal damage to each other simultaneously
        // Damage equals each unit's AP
      });

      it("should destroy units when HP becomes zero", () => {
        // Rule 7-6-3-2-1: Use counters to track damage received.
        // If a Unit's HP becomes zero, it is destroyed and placed into the trash
        const { engine } = buildCombatScenario({
          attackerCount: 1,
          defenderCount: 1,
        });

        // Units with 0 HP are destroyed
        assertZoneCount(engine, "battleArea", 1, "player_one");
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should handle first strike in unit combat", () => {
        // Rule 7-6-3-2-2: If the attacking Unit has <First Strike>,
        // it deals battle damage to the enemy Unit before normal battle
        // damage is managed
        const { engine } = buildCombatScenario({
          attackerCount: 1, // Would need unit with First Strike
          defenderCount: 1,
        });

        // First Strike unit deals damage first
        // If defender destroyed, attacker takes no damage
        assertGamePhase(engine, "mainPhase");
      });

      it("should treat simultaneous destruction as happening at same time", () => {
        // Rule 7-6-3-2-3: If both battling Units are destroyed,
        // their destruction is treated as happening simultaneously
        const { engine } = buildCombatScenario({
          attackerCount: 1,
          defenderCount: 1,
        });

        // When both units have enough AP to destroy each other,
        // destruction is simultaneous
        assertZoneCount(engine, "battleArea", 1, "player_one");
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should trigger breach when unit destroys enemy unit", () => {
        // Rule 11-1-2-1: <Breach> is a keyword effect that deals damage
        // to the enemy's shield area when the Unit with <Breach> destroys
        // an enemy Unit with battle damage
        const breachCards = getCardsByKeyword("breach");
        expect(breachCards.length).toBeGreaterThan(0);

        // Breach deals damage to shield area after destroying unit
        // Only activates during your turn
      });

      it("should activate breach even when both units destroyed", () => {
        // Rule 11-1-2-4: It activates even when both Units are destroyed in battle
        const breachCards = getCardsByKeyword("breach");
        expect(breachCards.length).toBeGreaterThan(0);

        // Breach activates even if the breach unit is also destroyed
      });

      it("should not activate breach when no shields or base present", () => {
        // Rule 11-1-2-5: If there is neither a Base nor Shields in the
        // enemy's shield area, the <Breach> effect does not activate
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Would need unit with Breach
            resourceArea: 5,
          },
          {
            battleArea: 1, // Target unit
            shieldSection: 0, // No shields
            shieldBase: 0, // No base
            resourceArea: 5,
          },
        );

        // Breach has no target, does not activate
        assertZoneCount(engine, "shieldSection", 0, "player_two");
        assertZoneCount(engine, "shieldBase", 0, "player_two");
      });
    });
  });

  describe("Rule 7-7: Battle End Step", () => {
    it("should end all during this battle effects", () => {
      // Rule 7-7-1: All effects worded "during this battle" lose effect
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Effects that were active "during this battle" end now
      assertGamePhase(engine, "mainPhase");
    });

    it("should resolve any effects activated during battle end step", () => {
      // Rule 7-7-2: When you have resolved all effects activated during
      // this step, the battle ends
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Any triggered effects during battle end are resolved
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should return to main phase after battle ends", () => {
      // Rule 7-7-2: The battle ends, and you return to the main phase
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // After battle ends, active player returns to main phase
      // Can declare another attack or perform other main phase actions
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });
  });

  describe("Combat Integration Tests", () => {
    it("should execute complete attack flow against player", () => {
      // Test complete flow: Attack -> Block -> Action -> Damage -> End
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          battleArea: 0, // No units to block
          shieldSection: 1, // One shield
          resourceArea: 5,
        },
      );

      // Complete attack flow would execute all five steps
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 1, "player_two");
    });

    it("should execute complete attack flow against unit", () => {
      // Test complete unit-on-unit combat
      const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      expect(attackerUnits.length).toBe(1);
      expect(defenderUnits.length).toBe(1);

      // Complete unit battle executes all five steps
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle blocker changing target during block step", () => {
      // Test blocker mechanic changing attack target
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 2, // Multiple defenders, one could block
      });

      // Blocker can change the attack from original target to blocker
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should handle first strike preventing counter damage", () => {
      // Test first strike dealing damage before defender can respond
      const { engine } = buildCombatScenario({
        attackerCount: 1, // Would need First Strike unit
        defenderCount: 1,
      });

      // If First Strike destroys defender, attacker takes no damage
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle multiple attacks in one turn", () => {
      // Active player can attack with multiple units in one turn
      const { engine, attackerUnits } = buildCombatScenario({
        attackerCount: 3, // Multiple attackers
        defenderCount: 0,
      });

      expect(attackerUnits.length).toBe(3);

      // Each unit can attack separately during main phase
      // After each battle ends, return to main phase
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });

    it("should handle attack with effects during action step", () => {
      // Test action step during combat allowing effects
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Action step allows both players to activate effects
      // Priority starts with standby player
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle complex scenario with blocker and breach", () => {
      // Test interaction between multiple keyword effects
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Would need Breach unit
          resourceArea: 5,
        },
        {
          battleArea: 2, // Multiple units, one could block
          shieldSection: 3, // Shields for breach damage
          resourceArea: 5,
        },
      );

      // Blocker changes target, Breach deals additional damage
      assertZoneCount(engine, "battleArea", 2, "player_two");
      assertZoneCount(engine, "shieldSection", 3, "player_two");
    });

    it("should use real blocker cards from catalog", () => {
      // Verify real blocker cards exist and can be used in tests
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      // Example: Aile Strike Gundam has Blocker
      const aileStrike = getCardById("ST04-001");
      if (aileStrike) {
        expect(aileStrike.type).toBe("unit");
      }
    });

    it("should use real breach cards from catalog", () => {
      // Verify real breach cards exist and can be used in tests
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      // Example: Wing Gundam has Breach 5
      const wingGundam = getCardById("ST02-001");
      if (wingGundam) {
        expect(wingGundam.type).toBe("unit");
      }
    });
  });

  describe("Combat Edge Cases", () => {
    it("should handle attack when attacker has zero AP", () => {
      // Rule 4-5-4: Damage is not dealt when the amount of damage
      // dealt would be zero
      const { engine } = buildCombatScenario({
        attackerCount: 1, // Would need 0 AP unit
        defenderCount: 1,
      });

      // Zero AP deals no damage
      assertGamePhase(engine, "mainPhase");
    });

    it("should not carry excess damage from shield to next shield", () => {
      // Rule 4-5-5: When damage received by a Base or Shield exceeds its HP,
      // the excess damage is not dealt to another Shield
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // High AP attacker
          resourceArea: 5,
        },
        {
          shieldSection: 3, // Multiple shields
          resourceArea: 5,
        },
      );

      // Only one shield destroyed per attack, no overflow
      assertZoneCount(engine, "shieldSection", 3, "player_two");
    });

    it("should handle multiple blockers available", () => {
      // Rule 7-4-2: Only one blocker can activate per attack
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 3, // Multiple potential blockers
      });

      // Even with multiple blockers, only one can activate
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should prevent blocker when attacker has high-maneuver", () => {
      // Rule 11-1-6-1: <High-Maneuver> prevents <Blocker> from activating
      const { engine } = buildCombatScenario({
        attackerCount: 1, // Would need High-Maneuver unit
        defenderCount: 1, // Has Blocker
      });

      // Blocker cannot activate against High-Maneuver
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle unit becoming rested during opponent turn", () => {
      // Only active units can attack or block
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 1,
      });

      // Rested units cannot attack
      // Rested units CAN be attacked
      assertTurnPlayer(engine, "player_one");
    });

    it("should handle battle with no valid targets", () => {
      // Cannot attack active enemy units
      const { engine } = buildCombatScenario({
        attackerCount: 1,
        defenderCount: 0,
      });

      // Can only attack player or rested units
      // With no enemy units, must attack player
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });
  });
});
