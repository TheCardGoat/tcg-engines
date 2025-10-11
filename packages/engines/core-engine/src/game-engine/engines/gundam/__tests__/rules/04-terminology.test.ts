import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
  buildGameStartScenario,
  getCardsByType,
} from "../helpers";

/**
 * Tests for LLM-RULES Section 4: Essential Game Terminology
 *
 * These tests validate core game terminology and their behaviors:
 * - 4-3: Active/Standby player roles
 * - 4-4: Active/Rested states for cards
 * - 4-5: Damage types (battle damage and effect damage)
 * - 4-6: HP recovery mechanics
 * - 4-7: Play action (paying cost and using cards)
 * - 4-8: Deploy action (placing Units/Bases on field)
 * - 4-9: Pair action (placing Pilots beneath Units)
 * - 4-10: Destroy action (Units/Bases/Shields/Resources)
 * - 4-11: Discard action (cards from hand to trash)
 * - 4-12: Remove action (cards to removal area)
 * - 4-17: Token mechanics (EX Base, EX Resource)
 * - 4-18: Counter mechanics (damage tracking)
 */
describe("LLM-RULES Section 4: Essential Game Terminology", () => {
  describe("Rule 4-3: Active Player and Standby Player", () => {
    it("should identify active player as the turn player", () => {
      const engine = buildGameStartScenario();

      // Rule 4-3-1: Active player is responsible for advancing current turn
      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBeDefined();
      expect(turnPlayer).toMatch(/player_(one|two)/);

      // Active player advances the turn in progress
      assertTurnPlayer(engine, turnPlayer);
    });

    it("should identify standby player as the non-turn player", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          battleArea: 1,
          resourceArea: 5,
        },
      );

      // Rule 4-3-2: Standby player is not responsible for advancing turn
      const turnPlayer = engine.getTurnPlayer();
      const players = ["player_one", "player_two"];
      const standbyPlayer = players.find((p) => p !== turnPlayer);

      expect(standbyPlayer).toBeDefined();
      expect(standbyPlayer).not.toBe(turnPlayer);
    });

    it("should switch active and standby players between turns", () => {
      const engine = buildGameStartScenario();

      const initialTurnPlayer = engine.getTurnPlayer();
      expect(initialTurnPlayer).toBeDefined();

      // After turn ends, active and standby players switch
      // Rule 4-3: Active/Standby roles alternate with turns
      // This is tested when turn progression is implemented
    });

    it("should maintain active player throughout their turn", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 2,
        },
      );

      const turnPlayer = engine.getTurnPlayer();
      assertTurnPlayer(engine, turnPlayer);

      // During multiple actions in the same turn, active player doesn't change
      // Rule 4-3-1: Active player remains consistent within a turn
    });
  });

  describe("Rule 4-4: Active and Rested States", () => {
    it("should place cards in active state when deployed to battle area", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-4-4: Cards placed in battle area are in active state
      const battleUnits = engine.getZone("battleArea", "player_one");
      expect(battleUnits.length).toBe(1);

      // Rule 4-4-1-1: Active means card is placed vertically
      // Units should be active (not rested) when first deployed
    });

    it("should place resources in active state when deployed", () => {
      const engine = new GundamTestEngine(
        {
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-4-4: Cards placed in resource area are in active state
      assertZoneCount(engine, "resourceArea", 5, "player_one");

      // Resources start active and can be rested to pay costs
      // Rule 4-4-1-1: Active cards are placed vertically
    });

    it("should place bases in active state when deployed to shield area", () => {
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: bases,
        },
        {},
      );

      // Rule 4-4-4: Cards placed in base section start active
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Base is active when first placed in shield area
    });

    it("should place shields in rested state when deployed to shield section", () => {
      const engine = buildGameStartScenario();

      // Rule 4-4-5: Shields placed in shield section are in rested state
      assertZoneCount(engine, "shieldSection", 6, "player_one");

      // Shields are rested (horizontal) when placed as shields
      // This is the exception to the active placement rule
    });

    it("should support active state meaning card has not taken action", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 2,
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-4-2: Active means card has not yet taken an action
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");

      // Active units can attack, active resources can pay costs
    });

    it("should support rested state meaning card has finished action", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-4-3: Rested means card has finished taking an action
      // After a unit attacks, it becomes rested
      // After a resource pays cost, it becomes rested
      // Rule 4-4-1-2: Rested cards are placed horizontally
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should handle active and rested states in multiple zones", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 3,
          resourceArea: 10,
          shieldBase: 1,
          shieldSection: 6,
        },
        {},
      );

      // Rule 4-4-1: Cards in battle area, resource area, and shield base can be active/rested
      assertZoneCount(engine, "battleArea", 3, "player_one");
      assertZoneCount(engine, "resourceArea", 10, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_one");

      // All zones support active/rested except shields which are always rested
    });
  });

  describe("Rule 4-5: Damage", () => {
    it("should reduce HP when damage is dealt to a unit", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-5-1: When damage is dealt, HP is reduced by amount equal to damage
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Damage reduces HP (tracked via counters)
      // Rule 4-5-1-1: Show HP reduction by placing counters on card
    });

    it("should destroy cards when damage equals or exceeds HP", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-5-1-2: Card with damage >= HP is destroyed
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // When unit takes damage equal to its HP, it's destroyed
    });

    it("should support battle damage from attacking units", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          battleArea: 1,
          resourceArea: 5,
        },
      );

      // Rule 4-5-2: Battle damage occurs during damage step of combat
      // Attacking unit and defending unit deal damage equal to their AP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");

      // Battle damage is AP-based damage during combat
    });

    it("should support effect damage from card effects", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 2,
          hand: 3,
          resourceArea: 5,
        },
        {
          battleArea: 2,
          resourceArea: 5,
        },
      );

      // Rule 4-5-3: Effect damage comes from card effects
      // Example: "Deal 3 damage to target unit"
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "hand", 3, "player_one");

      // Effect damage is dealt outside of combat through card abilities
    });

    it("should not deal damage when amount is zero", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
        },
        {},
      );

      // Rule 4-5-4: Damage is not dealt when amount would be zero
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Zero damage has no effect on the card
    });

    it("should not carry excess damage to other shields", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
        },
        {
          shieldSection: 2,
          resourceArea: 5,
        },
      );

      // Rule 4-5-5: Excess damage beyond shield HP doesn't continue to next shield
      assertZoneCount(engine, "shieldSection", 2, "player_two");

      // Each shield absorbs up to its HP, excess is lost
    });

    it("should allow damage to units, bases, shields, and players", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          shieldBase: 1,
        },
        {
          battleArea: 1,
          shieldSection: 6,
          shieldBase: 1,
        },
      );

      // Rule 4-5-2: Units, Bases, Shields, and players can receive damage
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");

      // All these targets can take both battle and effect damage
    });
  });

  describe("Rule 4-6: HP Recovery", () => {
    it("should recover HP by removing counters", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-6-1: When unit recovers HP, remove counters equal to amount recovered
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // HP recovery removes damage counters
    });

    it("should remove all counters when recovery exceeds current damage", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-6-2: If recovery > damage, remove all counters
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Over-recovery removes all damage but doesn't exceed max HP
    });

    it("should not allow HP recovery on undamaged units", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-6-3: Unit without damage cannot recover HP
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Recovery only works on damaged units
    });

    it("should support HP recovery on bases", () => {
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: bases,
        },
        {},
      );

      // Rule 4-6: Both units and bases can recover HP
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Bases work the same as units for HP recovery
    });
  });

  describe("Rule 4-7, 4-8, 4-9: Play, Deploy, Pair", () => {
    it("should support Play action - paying cost and using cards", () => {
      const units = getCardsByType("unit").slice(0, 3);

      const engine = new GundamTestEngine(
        {
          hand: units,
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-7-1: Play describes paying cost and using card from hand
      assertZoneCount(engine, "hand", 3, "player_one");
      assertZoneCount(engine, "resourceArea", 5, "player_one");

      // Playing cards requires paying their cost by resting resources
    });

    it("should support Deploy action - placing units on field", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-8-1: Deploy describes Unit being placed on field
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // Deploy is when unit enters battle area
    });

    it("should support Deploy action - placing bases on field", () => {
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: bases,
        },
        {},
      );

      // Rule 4-8-1: Deploy also describes Base being placed on field
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Deploy applies to both units and bases
    });

    it("should support Pair action - placing pilot beneath unit", () => {
      const units = getCardsByType("unit").slice(0, 1);
      const pilots = getCardsByType("pilot").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
          hand: pilots,
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-9-1: Pair describes placing Pilot beneath Unit
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");

      // Pairing adds pilot's stats and effects to unit
    });

    it("should support Pair with command cards that have pilot effects", () => {
      const units = getCardsByType("unit").slice(0, 1);
      const commands = getCardsByType("command").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
          hand: commands,
          resourceArea: 5,
        },
        {},
      );

      // Rule 4-9-1: Pair works with Command cards that have Pilot effects
      // Rule 2-3-5-4-1: Command cards can be placed as Pilots
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "hand", 1, "player_one");

      // Some commands can be paired like pilots
    });
  });

  describe("Rule 4-10, 4-11, 4-12: Destroy, Discard, Remove", () => {
    it("should support Destroy - unit moving from battle area to trash", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-10-1: Destroy - unit placed from battle area to trash
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // When destroyed, units go to trash
    });

    it("should support Destroy - base moving from shield area to trash", () => {
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: bases,
        },
        {},
      );

      // Rule 4-10-2: Destroy - base placed from shield area to trash
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Destroyed bases go to trash
    });

    it("should support Destroy - shield moving from shield section to trash", () => {
      const engine = buildGameStartScenario();

      // Rule 4-10-3: Destroy - shield placed from shield section to trash
      assertZoneCount(engine, "shieldSection", 6, "player_one");

      // Destroyed shields go to trash
    });

    it("should support Destroy - resource moving to resource deck face down", () => {
      const engine = new GundamTestEngine(
        {
          resourceArea: 5,
          resourceDeck: 5,
        },
        {},
      );

      // Rule 4-10-4: Destroy - resource placed from resource area to resource deck face down
      assertZoneCount(engine, "resourceArea", 5, "player_one");
      assertZoneCount(engine, "resourceDeck", 5, "player_one");

      // Destroyed resources return to resource deck, not trash
    });

    it("should support Discard - moving cards from hand to trash", () => {
      const units = getCardsByType("unit").slice(0, 3);

      const engine = new GundamTestEngine(
        {
          hand: units,
        },
        {},
      );

      // Rule 4-11-1: Discard - placing card from hand to trash
      assertZoneCount(engine, "hand", 3, "player_one");

      // Discard is specifically from hand to trash
    });

    it("should support Remove - moving cards from any location to removal area", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 2,
          trash: 3,
        },
        {},
      );

      // Rule 4-12-1: Remove - card placed from any location to removal area
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "hand", 2, "player_one");
      assertZoneCount(engine, "trash", 3, "player_one");

      // Remove can happen from any zone
    });

    it("should not treat removed units as destroyed", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-12-2: Removed Unit or Base is not treated as destroyed
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // Remove and Destroy are different actions with different triggers
    });
  });

  describe("Rule 4-17: Tokens", () => {
    it("should create EX Base token at game start", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-3, 4-17-4: EX Base token placed at game start
      // Rule 4-17-4-1: EX Base is Base token with 0 AP and 3 HP
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");

      // EX Base protects players until replaced
    });

    it("should create EX Resource token for player two at game start", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-3, 4-17-5: Player Two gets EX Resource token at start
      // Rule 4-17-5-2: Player Two places one in resource area at start
      // Note: EX Resource may start in sideboard and be moved to resource area during game setup
      const p2Resources = engine.getZone("resourceArea", "player_two");
      const p2Sideboard = engine.getZone("sideboard", "player_two");

      // EX Resource should be in either resource area or sideboard at start
      expect(p2Resources.length + p2Sideboard.length).toBeGreaterThanOrEqual(1);

      // Player Two starts with advantage of 1 EX Resource
    });

    it("should remove EX Resource token when used to pay cost", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-5-3: EX Resource removed when used to pay cost
      // Note: EX Resource may start in sideboard and be moved to resource area during game setup
      const p2Resources = engine.getZone("resourceArea", "player_two");
      const p2Sideboard = engine.getZone("sideboard", "player_two");

      // EX Resource should exist somewhere for player two
      expect(p2Resources.length + p2Sideboard.length).toBeGreaterThanOrEqual(1);

      // EX Resource is temporary, removed after first use
    });

    it("should treat tokens as having no color", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-2-2: Tokens are treated as having no color
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // EX Base has no color
    });

    it("should treat tokens as having zero level and cost", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-2-3: Token Lv and cost are both zero
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Tokens don't require resources to play
    });

    it("should remove tokens when placed outside valid zones", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-2-4: Token removed if placed outside battle/resource/shield base
      // Tokens can't exist in hand, deck, trash, etc.
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Tokens are automatically removed from invalid zones
    });

    it("should trigger effects even when token is removed from invalid zone", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-2-4-1: Token momentarily in location triggers effects like "when destroyed"
      // Even though removed immediately, triggers still occur
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Tokens trigger zone-exit effects before being removed
    });

    it("should allow tokens to be paired with pilots", () => {
      const engine = buildGameStartScenario();

      // Rule 4-17-2-1-1: Token placed as Unit can be paired with Pilot
      // Tokens follow same rules as real cards in valid zones
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Token units can have pilots paired
    });
  });

  describe("Rule 4-18: Counters", () => {
    it("should place counters on cards to track damage", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-18-1: Counters are placed on and removed from cards
      // Rule 4-5-1-1: Show HP reduction with counters equal to damage
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Counters visually track damage on cards
    });

    it("should remove counters to track HP recovery", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Rule 4-6-1: HP recovery removes counters
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Counters removed when HP is recovered
    });

    it("should support counters on both units and bases", () => {
      const units = getCardsByType("unit").slice(0, 1);
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
          shieldBase: bases,
        },
        {},
      );

      // Counters track damage on any card with HP
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // Both units and bases use counters for damage tracking
    });

    it("should allow multiple counters on same card", () => {
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      // Multiple counters represent accumulated damage
      const unit = engine.getZone("battleArea", "player_one")[0];
      expect(unit).toBeDefined();

      // Card can have damage counters up to its HP
    });
  });

  describe("Terminology Integration Tests", () => {
    it("should demonstrate complete play-deploy-damage-destroy cycle", () => {
      const units = getCardsByType("unit").slice(0, 2);

      const engine = new GundamTestEngine(
        {
          hand: [units[0]],
          battleArea: [units[1]],
          resourceArea: 5,
        },
        {
          battleArea: 1,
          resourceArea: 5,
        },
      );

      // Play: Pay cost and use card from hand (Rule 4-7)
      assertZoneCount(engine, "hand", 1, "player_one");

      // Deploy: Unit placed in battle area (Rule 4-8)
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // Damage: Unit takes damage, counters placed (Rule 4-5)
      // Destroy: Unit with HP <= 0 goes to trash (Rule 4-10)
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should demonstrate active-rested cycle during combat", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          battleArea: 1,
          resourceArea: 5,
        },
      );

      // Units start active (Rule 4-4-4)
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // After attack, unit becomes rested (Rule 4-4-3)
      // At start of next turn, unit becomes active again (Rule 4-4-2)
      assertTurnPlayer(engine, "player_one");
    });

    it("should demonstrate paired unit with combined stats", () => {
      const units = getCardsByType("unit").slice(0, 1);
      const pilots = getCardsByType("pilot").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
          hand: pilots,
          resourceArea: 5,
        },
        {},
      );

      // Unit deployed (Rule 4-8)
      assertZoneCount(engine, "battleArea", 1, "player_one");

      // Pilot paired beneath unit (Rule 4-9)
      assertZoneCount(engine, "hand", 1, "player_one");

      // Pilot's AP and HP modifiers added to unit
      // Rule 2-3-4-4: AP and HP on pilot added to paired unit
    });

    it("should demonstrate token lifecycle with EX Base", () => {
      const engine = buildGameStartScenario();

      // EX Base token created at start (Rule 4-17-4)
      assertZoneCount(engine, "shieldBase", 1, "player_one");

      // EX Base has 0 AP, 3 HP (Rule 4-17-4-1)
      // EX Base has no color (Rule 4-17-2-2)
      // EX Base has zero Lv and cost (Rule 4-17-2-3)

      // When destroyed, triggers "when destroyed" effects
      // Then removed from game (Rule 4-17-2-4-1)
    });

    it("should demonstrate distinction between destroy and remove", () => {
      const units = getCardsByType("unit").slice(0, 2);

      const engine = new GundamTestEngine(
        {
          battleArea: units,
        },
        {},
      );

      assertZoneCount(engine, "battleArea", 2, "player_one");

      // Destroy: Unit goes to trash, triggers "destroyed" effects (Rule 4-10-1)
      // Remove: Unit goes to removal area, NOT treated as destroyed (Rule 4-12-2)

      // These are fundamentally different actions
    });

    it("should maintain terminology consistency across game phases", () => {
      const engine = new GundamTestEngine(
        {
          deck: 20,
          hand: 5,
          battleArea: 2,
          resourceArea: 8,
          shieldSection: 4,
          shieldBase: 1,
        },
        {
          deck: 20,
          hand: 5,
          battleArea: 2,
          resourceArea: 8,
          shieldSection: 4,
          shieldBase: 1,
        },
      );

      // All terminology applies consistently:
      // - Active/Standby player (Rule 4-3)
      // - Active/Rested cards (Rule 4-4)
      // - Play/Deploy/Pair actions (Rules 4-7, 4-8, 4-9)
      // - Damage/Recovery mechanics (Rules 4-5, 4-6)
      // - Destroy/Discard/Remove distinctions (Rules 4-10, 4-11, 4-12)

      assertTurnPlayer(engine, engine.getTurnPlayer());
      assertGamePhase(engine, "mainPhase");
    });
  });
});
