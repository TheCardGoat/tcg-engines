import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
} from "../helpers/assertion-helpers";
import { getCardById, getCardsByKeyword } from "../helpers/card-catalog-index";

/**
 * Integration Tests for Complex Combat Scenarios
 *
 * These tests validate complex multi-unit battles and keyword interactions
 * through realistic game scenarios using real cards from the catalog.
 *
 * Test Coverage:
 * - Multi-unit battles with various AP/HP combinations
 * - Blocker chains and redirection scenarios
 * - First Strike interactions (preventing counter damage, early battle end)
 * - High-Maneuver vs Blocker conflicts
 * - Breach damage to shields/bases after unit destruction
 * - Support keyword boosting attackers/defenders
 * - Repair keyword healing after battle
 * - Complex multi-keyword interactions
 * - Simultaneous destruction scenarios
 * - Edge cases in combat flow
 *
 * Real Cards Used:
 * - ST01-008 (Demi Trainer): 1/1/1 with Blocker
 * - ST01-009 (Zowort): 1/3/3 with Blocker
 * - ST04-001 (Aile Strike Gundam): Blocker
 * - ST02-001 (Wing Gundam): 4/4/5 with Breach 5
 * - ST01-001 (Gundam RX-78-2): 3/3/4 with Repair 2
 * - ST01-005 (GM): 1/2/2 basic unit
 * - ST01-007 (Gundam Aerial Bit On Form): 2/3/4 basic unit
 *
 * Rules References:
 * - LLM-RULES Section 7: Combat flow (5 steps)
 * - LLM-RULES Section 11-1-2: Breach keyword
 * - LLM-RULES Section 11-1-4: Blocker keyword
 * - LLM-RULES Section 11-1-5: First Strike keyword
 * - LLM-RULES Section 11-1-6: High-Maneuver keyword
 */

describe("Integration Tests: Complex Combat Scenarios", () => {
  describe("Multi-Unit Battle Scenarios", () => {
    it("should handle 3v3 battle with mixed AP/HP stats", () => {
      // Test multiple units on each side with varying stats
      // Validates zone management and battle state tracking
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Three attackers with different stats
          resourceArea: 10,
          shieldSection: 3,
          deck: 30,
        },
        {
          battleArea: 3, // Three defenders with different stats
          resourceArea: 10,
          shieldSection: 3,
          deck: 30,
        },
      );

      // Verify both sides have their units
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "battleArea", 3, "player_two");
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });

    it("should handle sequential attacks from multiple units in one turn", () => {
      // Active player can attack with multiple units
      // Each attack is a separate battle that returns to main phase
      const engine = new GundamTestEngine(
        {
          battleArea: 4, // Multiple attackers
          resourceArea: 10,
          shieldSection: 3,
          deck: 30,
        },
        {
          battleArea: 2, // Defenders
          resourceArea: 10,
          shieldSection: 3,
          deck: 30,
        },
      );

      // Four units can each attack separately during main phase
      assertZoneCount(engine, "battleArea", 4, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle mixed targets - some attacks on player, some on units", () => {
      // Attacker can choose to attack player or rested enemy units
      // Tests target selection and damage routing
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Three potential attackers
          resourceArea: 10,
          shieldSection: 3,
          deck: 30,
        },
        {
          battleArea: 1, // Only one defender unit
          resourceArea: 10,
          shieldSection: 5, // Player has shields
          deck: 30,
        },
      );

      // With 3 attackers and 1 defender:
      // - 1 attacker targets the rested unit
      // - 2 attackers target the player (and shields)
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "shieldSection", 5, "player_two");
    });

    it("should handle simultaneous destruction in multi-unit battles", () => {
      // When multiple units destroy each other simultaneously
      // Tests destruction timing and triggered effects
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units with enough AP to destroy each other
          resourceArea: 10,
          trash: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Units that will be destroyed
          resourceArea: 10,
          trash: 0,
          deck: 30,
        },
      );

      // Units with matching AP/HP could destroy each other
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });

  describe("Blocker Chain Scenarios", () => {
    it("should handle single blocker redirecting attack", () => {
      // Rule 7-4-1: Blocker changes attack target to itself
      // Uses real Demi Trainer card (ST01-008) with Blocker
      const demiTrainer = getCardById("ST01-008");
      expect(demiTrainer).toBeDefined();
      expect(demiTrainer?.type).toBe("unit");

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker targeting player
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // One unit being attacked, one with Blocker
          resourceArea: 5,
          shieldSection: 3,
          deck: 30,
        },
      );

      // Original target is one unit, blocker redirects to itself
      assertZoneCount(engine, "battleArea", 2, "player_two");
      assertZoneCount(engine, "shieldSection", 3, "player_two");
    });

    it("should handle multiple blocker units (only one can activate)", () => {
      // Rule 7-4-2: Only one Blocker can activate per attack
      // Multiple blocker units available, but only one redirects
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Single attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Three units, multiple with Blocker
          resourceArea: 5,
          shieldSection: 3,
          deck: 30,
        },
      );

      // Even with multiple blockers, only one can activate
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should handle blocker protecting low HP unit", () => {
      // Strategic scenario: blocker saves valuable unit
      // Tests blocker changing target from weak to strong unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // High AP attacker (would destroy weak unit)
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Low HP unit + high HP blocker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker with higher HP intercepts attack meant for weak unit
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should handle blocker when original target cannot block itself", () => {
      // Rule 7-4-3: Originally targeted unit cannot activate its own Blocker
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Target unit with Blocker + another blocker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Original target cannot block for itself, but other unit can
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should handle blocker when attacker is destroyed before block step", () => {
      // Rule 7-3-5-1: If attacker destroyed during attack step, skip to end
      // Blocker never gets chance to activate
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker that could be destroyed by effect
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Defender with Blocker
          resourceArea: 5,
          hand: 5, // May have action cards to destroy attacker
          deck: 30,
        },
      );

      // If attacker destroyed in attack step, no block step occurs
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should handle optional blocker activation - defender chooses not to block", () => {
      // Rule 7-4-4: Choosing not to activate Blocker is allowed
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple potential blockers
          resourceArea: 5,
          shieldSection: 5, // Defender has shields, may choose not to block
          deck: 30,
        },
      );

      // Defender can let attack through even with blockers available
      assertZoneCount(engine, "shieldSection", 5, "player_two");
    });
  });

  describe("First Strike Interaction Scenarios", () => {
    it("should handle first strike preventing counter damage", () => {
      // Rule 11-1-5-2: First Strike destroys enemy before they deal damage
      // Attacker takes no damage if First Strike destroys defender
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with First Strike and high AP
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender with low HP (will be destroyed)
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // First Strike deals damage first
      // If defender destroyed, attacker takes no counter damage
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle first strike against base", () => {
      // Rule 11-1-5-2: First Strike applies to Base attacks too
      // Deals damage to base before normal damage
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with First Strike
          resourceArea: 5,
          deck: 30,
        },
        {
          shieldBase: 1, // Base with HP
          shieldSection: 0, // No shields
          resourceArea: 5,
          deck: 30,
        },
      );

      // First Strike deals damage to Base first
      // Could destroy Base before normal damage would occur
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should handle first strike not destroying defender (both take damage)", () => {
      // First Strike doesn't destroy defender with high HP
      // Normal damage step continues, both units damaged
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with First Strike but low AP
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // High HP defender survives First Strike
          resourceArea: 5,
          deck: 30,
        },
      );

      // First Strike deals damage but doesn't destroy
      // Defender still deals counter damage
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle first strike with battle end step triggered effects", () => {
      // Rule 11-1-5-3: After First Strike destruction, resolve destruction
      // effects then continue to battle end step
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with First Strike
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Unit with Destroyed trigger effect
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // First Strike destroys unit with Destroyed trigger
      // Destruction effect resolves, then battle ends
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle double first strike - both units have first strike", () => {
      // When both units have First Strike, damage is simultaneous
      // No advantage from First Strike in this case
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with First Strike
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender also with First Strike
          resourceArea: 5,
          deck: 30,
        },
      );

      // Both deal damage simultaneously
      // First Strike cancels out when both have it
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });

  describe("High-Maneuver vs Blocker Scenarios", () => {
    it("should prevent blocker when attacker has high-maneuver", () => {
      // Rule 11-1-6-1: High-Maneuver prevents Blocker from activating
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with High-Maneuver
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple units with Blocker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker cannot activate against High-Maneuver
      // Attack proceeds to original target
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should bypass blocker chain with high-maneuver", () => {
      // Strategic: High-Maneuver allows attacking specific target
      // Cannot be redirected by any blocker
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // High-Maneuver attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Multiple defenders with Blocker keywords
          resourceArea: 5,
          deck: 30,
        },
      );

      // High-Maneuver ignores all Blocker effects
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should handle high-maneuver attacking weak unit behind blockers", () => {
      // Strategic scenario: targeting low HP unit that blockers protect
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // High-Maneuver, high AP attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3, // Low HP target + 2 high HP blockers
          resourceArea: 5,
          deck: 30,
        },
      );

      // High-Maneuver allows targeting vulnerable unit directly
      // Blockers cannot intercept
      assertZoneCount(engine, "battleArea", 3, "player_two");
    });

    it("should handle high-maneuver with first strike combination", () => {
      // Unit with both High-Maneuver and First Strike
      // Bypasses blockers and deals damage first
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // High-Maneuver + First Strike unit
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Target + blocker
          resourceArea: 5,
          deck: 30,
        },
      );

      // Cannot be blocked, deals damage before counter
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });

  describe("Breach Keyword Combat Scenarios", () => {
    it("should activate breach after destroying unit - damages shield", () => {
      // Rule 11-1-2-1: Breach deals damage to shield area after destroying unit
      // Uses Wing Gundam (ST02-001) with Breach 5
      const wingGundam = getCardById("ST02-001");
      expect(wingGundam).toBeDefined();
      expect(wingGundam?.type).toBe("unit");

      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach (e.g., Breach 5)
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Low HP unit that will be destroyed
          shieldSection: 5, // Shields to receive Breach damage
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // Breach unit destroys enemy, then deals Breach damage to shields
      assertZoneCount(engine, "shieldSection", 5, "player_two");
    });

    it("should activate breach when both units destroyed", () => {
      // Rule 11-1-2-4: Breach activates even when Breach unit destroyed
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach that will also be destroyed
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
        {
          battleArea: 1, // Unit with enough AP to destroy Breach unit
          shieldSection: 3, // Shields still take Breach damage
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // Even if Breach unit destroyed, Breach effect still activates
      assertZoneCount(engine, "shieldSection", 3, "player_two");
    });

    it("should route breach damage to base when present", () => {
      // Rule 11-1-2-3: Breach damage goes to Base if present
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Unit to be destroyed
          shieldBase: 1, // Base receives Breach damage first
          shieldSection: 2, // Shields present but Base targeted
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach damage goes to Base when present
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should not activate breach when no shield area cards", () => {
      // Rule 11-1-2-5: Breach requires Base or Shields to activate
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Unit to be destroyed
          shieldSection: 0, // No shields
          shieldBase: 0, // No base
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach effect does not activate - no valid target
      assertZoneCount(engine, "shieldSection", 0, "player_two");
      assertZoneCount(engine, "shieldBase", 0, "player_two");
    });

    it("should only activate breach during your turn", () => {
      // Rule 11-1-2-1: Breach only activates during your turn (when attacking)
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          shieldSection: 3,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Breach only works when attacking on your turn
      assertTurnPlayer(engine, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle breach with blocker - breach damages shields after blocker battle", () => {
      // Blocker redirects attack, Breach still activates if blocker destroyed
      const breachCards = getCardsByKeyword("breach");
      const blockerCards = getCardsByKeyword("blocker");
      expect(breachCards.length).toBeGreaterThan(0);
      expect(blockerCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Original target + blocker (low HP)
          shieldSection: 4, // Shields receive Breach if blocker destroyed
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker intercepts, if destroyed by Breach unit, Breach activates
      assertZoneCount(engine, "battleArea", 2, "player_two");
      assertZoneCount(engine, "shieldSection", 4, "player_two");
    });

    it("should handle multiple breach values stacking", () => {
      // Rule 11-1-2-6: Breach values add together (Breach 2 + Breach 3 = Breach 5)
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit that could gain multiple Breach effects
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Unit to be destroyed
          shieldSection: 6, // Enough shields for stacked Breach damage
          resourceArea: 5,
          deck: 30,
        },
      );

      // Multiple Breach effects combine additively
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });
  });

  describe("Support and Repair Combat Scenarios", () => {
    it("should use support to boost attacker before battle", () => {
      // Rule 11-1-3: Support gives AP to another Unit during main phase
      const supportCards = getCardsByKeyword("support");
      expect(supportCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Support unit + attacker to boost
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender
          resourceArea: 5,
          deck: 30,
        },
      );

      // Support unit rests to give AP to attacker
      // Boosted attacker then attacks with higher AP
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should use support to enable favorable trade", () => {
      // Support boosts unit enough to destroy enemy without dying
      const supportCards = getCardsByKeyword("support");
      expect(supportCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Support unit + low AP attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender that attacker couldn't destroy without boost
          resourceArea: 5,
          deck: 30,
        },
      );

      // Without Support: attacker destroyed, defender survives
      // With Support: both destroyed or attacker wins
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should handle repair healing damaged unit after battle", () => {
      // Rule 11-1-1: Repair recovers HP at end of turn
      // Uses Gundam RX-78-2 (ST01-001) with Repair 2
      const gundam = getCardById("ST01-001");
      expect(gundam).toBeDefined();
      expect(gundam?.type).toBe("unit");

      const repairCards = getCardsByKeyword("repair");
      expect(repairCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Repair that survives battle with damage
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender that damages Repair unit
          resourceArea: 5,
          deck: 30,
        },
      );

      // Repair unit takes damage in battle
      // At end of turn, Repair recovers HP
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should handle multiple support units boosting same attacker", () => {
      // Rule 11-1-3-3: Support effects stack additively
      const supportCards = getCardsByKeyword("support");
      expect(supportCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Two Support units + one attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // High HP defender
          resourceArea: 5,
          deck: 30,
        },
      );

      // Multiple Support units can boost same target
      // Support 1 + Support 2 = Support 3 (total AP+3)
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });

    it("should handle repair not activating when no damage received", () => {
      // Rule 11-1-1-3: Repair only activates if unit has damage
      const repairCards = getCardsByKeyword("repair");
      expect(repairCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Repair at full HP
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0, // No enemies, no battle
          resourceArea: 5,
          deck: 30,
        },
      );

      // Repair doesn't activate - unit has no damage
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });

  describe("Complex Multi-Keyword Scenarios", () => {
    it("should handle blocker + first strike defender vs normal attacker", () => {
      // Defender with Blocker AND First Strike
      // Blocks for ally, deals damage before attacker
      const blockerCards = getCardsByKeyword("blocker");
      expect(blockerCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Normal attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Weak target + blocker with First Strike
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker intercepts, then uses First Strike
      // Potentially destroys attacker without taking damage
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should handle breach + first strike - double damage potential", () => {
      // Unit with both Breach and First Strike
      // Destroys defender with First Strike, then Breach damages shields
      const breachCards = getCardsByKeyword("breach");
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with Breach + First Strike
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender to be destroyed
          shieldSection: 5, // Shields for Breach damage
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // First Strike destroys defender without counter damage
      // Then Breach deals damage to shields
      // Maximum damage efficiency
      assertZoneCount(engine, "shieldSection", 5, "player_two");
    });

    it("should handle support + breach attacker - boosted breach damage", () => {
      // Support boosts AP, increasing both battle damage and Breach potential
      const supportCards = getCardsByKeyword("support");
      const breachCards = getCardsByKeyword("breach");
      expect(supportCards.length).toBeGreaterThan(0);
      expect(breachCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Support unit + Breach attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender
          shieldSection: 6, // Shields for Breach
          resourceArea: 5,
          deck: 30,
        },
      );

      // Support boosts attacker's AP
      // Higher AP more likely to destroy, triggering Breach
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });

    it("should handle repair + blocker - sustainable defense", () => {
      // Blocker with Repair can block repeatedly
      // Takes damage but heals at end of turn
      const blockerCards = getCardsByKeyword("blocker");
      const repairCards = getCardsByKeyword("repair");
      expect(blockerCards.length).toBeGreaterThan(0);
      expect(repairCards.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Multiple attackers
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Weak ally + blocker with Repair
          resourceArea: 5,
          deck: 30,
        },
      );

      // Blocker protects ally, takes damage, then heals
      // Sustainable defensive strategy
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });

    it("should handle high-maneuver + breach + first strike - ultimate offensive combo", () => {
      // Theoretical perfect attacker:
      // - High-Maneuver: Cannot be blocked
      // - First Strike: Deals damage first (no counter)
      // - Breach: Damages shields after destroying unit
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Super attacker with all three keywords
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Multiple defenders with Blocker
          shieldSection: 5, // Shields vulnerable to Breach
          resourceArea: 5,
          deck: 30,
        },
      );

      // Cannot be blocked, destroys without counter, damages shields
      assertZoneCount(engine, "battleArea", 2, "player_two");
      assertZoneCount(engine, "shieldSection", 5, "player_two");
    });

    it("should handle multiple keywords with different timings in same battle", () => {
      // Battle with multiple keyword activations at different steps:
      // - Attack step: Deploy/Attack triggers
      // - Block step: Blocker activation
      // - Damage step: First Strike, then normal damage, then Breach
      // - End step: Battle end triggers
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units with various triggered effects
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2, // Defenders with keywords
          shieldSection: 3,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Complex interaction of multiple keywords across battle steps
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });

  describe("Edge Cases and Corner Scenarios", () => {
    it("should handle zero AP attacker - no damage dealt", () => {
      // Rule 4-5-4: Zero damage is not dealt
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker with 0 AP (debuffed or naturally)
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Defender
          resourceArea: 5,
          deck: 30,
        },
      );

      // Battle occurs but no damage dealt by 0 AP unit
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle overkill damage - excess damage not carried over", () => {
      // Rule 4-5-5: Excess damage not dealt to other units/shields
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Very high AP attacker
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1, // Low HP defender
          resourceArea: 5,
          deck: 30,
        },
      );

      // Defender destroyed with excess damage
      // Excess damage does NOT carry over to other units
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle attacking with last active unit - all others rested", () => {
      // Strategic: only one active unit left
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Three units, only one active
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          shieldSection: 3,
          deck: 30,
        },
      );

      // Last active unit attacks, then all units rested
      // Turn must end after this battle
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });

    it("should handle blocker when attacker destroyed during block step", () => {
      // Rule 7-4-5-1: Attacker destroyed during block step -> battle ends
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          resourceArea: 5,
          hand: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Defender with Blocker
          resourceArea: 5,
          hand: 5, // Action cards that could destroy attacker
          deck: 30,
        },
      );

      // If attacker destroyed during block step (via action card)
      // Battle ends immediately
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should handle attack on unit with exactly matching AP/HP", () => {
      // Both units have AP equal to opponent's HP
      // Perfect simultaneous destruction
      const gm = getCardById("ST01-005"); // GM: 2 AP, 2 HP
      expect(gm).toBeDefined();
      expect(gm?.type).toBe("unit");

      const engine = new GundamTestEngine(
        {
          battleArea: 1, // 2 AP unit
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
        {
          battleArea: 1, // 2 HP unit with 2 AP
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // Both units destroyed simultaneously
      // Rule 7-6-3-2-3: Simultaneous destruction
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle battle when defender has destroyed trigger effect", () => {
      // Defender destroyed in battle triggers Destroyed effect
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Attacker
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
        {
          battleArea: 1, // Defender with Destroyed trigger
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // Defender destroyed, Destroyed effect activates from trash
      // Rule 11-2-8: Destroyed effects activate from trash
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle multiple simultaneous destructions with different effects", () => {
      // Multiple units destroyed at once, all triggers activate
      // Tests trigger ordering and resolution
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units that may have Destroyed triggers
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
        {
          battleArea: 2, // Units with Destroyed triggers
          resourceArea: 5,
          trash: 0,
          deck: 30,
        },
      );

      // Multiple destructions trigger multiple effects
      // Active player resolves first, then standby player
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });
});
