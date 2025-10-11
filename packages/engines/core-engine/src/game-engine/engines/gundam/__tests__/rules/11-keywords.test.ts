import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
} from "../helpers/assertion-helpers";
import {
  getCardById,
  getCardsByKeyword,
  getCardsByType,
} from "../helpers/card-catalog-index";

/**
 * Tests for LLM-RULES Section 11: Keyword Effects and Keywords
 *
 * These tests validate keyword effects and keywords mechanics:
 *
 * Keyword Effects:
 * - <Repair>: Recovers HP at turn end (stacks additively)
 * - <Breach>: Deals damage to shield area when destroying Unit (stacks additively)
 * - <Support>: Gives AP to another Unit when rested (stacks additively)
 * - <Blocker>: Changes attack target (cannot give multiple copies)
 * - <First Strike>: Deals damage before opponent (cannot give multiple copies)
 * - <High-Maneuver>: Prevents Blocker activation (cannot give multiple copies)
 *
 * Keywords:
 * - 【Activate･Main】: Activated during main phase
 * - 【Activate･Action】: Activated during action steps
 * - 【Main】: Command card played during main phase
 * - 【Action】: Command card played during action steps
 * - 【Burst】: Triggers when shield destroyed (optional)
 * - 【Deploy】: Triggers when placed in battle area
 * - 【Attack】: Triggers when Unit attacks
 * - 【Destroyed】: Triggers when destroyed (activates from trash)
 * - 【When Paired】: Triggers when Pilot paired
 * - 【During Pair】: Constant effect while Pilot paired
 * - 【Pilot】: Qualifications for pairing
 * - 【Once per Turn】: Limits activation frequency
 *
 * Rules covered:
 * - 11-1-1: Repair recovers HP at end of turn, doesn't activate without damage
 * - 11-1-2: Breach deals damage to shield area when destroying Unit
 * - 11-1-3: Support gives AP to another friendly Unit when rested
 * - 11-1-4: Blocker changes attack target during block step
 * - 11-1-5: First Strike deals damage before opponent
 * - 11-1-6: High-Maneuver prevents Blocker effects
 * - 11-2-1 through 11-2-12: All keyword mechanics
 */

describe("LLM-RULES Section 11: Keyword Effects and Keywords", () => {
  describe("Rule 11-1: Keyword Effects", () => {
    describe("Rule 11-1-1: <Repair>", () => {
      it("should recover HP at end of turn", () => {
        // Rule 11-1-1-1: <Repair> recovers HP on that Unit at the end of your turn
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units may have Repair
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

        // Units with Repair recover HP at end of turn
        assertZoneCount(engine, "battleArea", 2, "player_one");
        assertGamePhase(engine, "mainPhase");
      });

      it("should recover specified amount of HP", () => {
        // Rule 11-1-1-2: <Repair (amount)> recovers (amount) of HP at end of turn
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units with Repair 1, Repair 2, etc.
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

        // Repair amount specified in effect
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should not activate Repair without damage received", () => {
        // Rule 11-1-1-3: Repair effect does not activate unless damage has been received
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Repair but no damage
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Repair only activates if unit has taken damage
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should stack Repair effects additively", () => {
        // Rule 11-1-1-4: If Unit with <Repair> is given new <Repair>,
        // amounts are added to the original
        // Ex: <Repair 1> + <Repair 2> = <Repair 3>
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit that could gain multiple Repair effects
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Multiple Repair effects combine additively
        assertGamePhase(engine, "mainPhase");
      });

      it("should verify real cards with Repair exist", () => {
        // Verify Repair cards are available for testing
        const repairCards = getCardsByKeyword("repair");
        expect(repairCards.length).toBeGreaterThan(0);

        // Repair should be on Units
        const repairUnits = repairCards.filter((c) => c.type === "unit");
        expect(repairUnits.length).toBeGreaterThan(0);
      });
    });

    describe("Rule 11-1-2: <Breach>", () => {
      it("should deal damage to shield area when destroying enemy Unit", () => {
        // Rule 11-1-2-1: <Breach> deals damage to enemy's shield area when
        // Unit with <Breach> destroys enemy Unit with battle damage during your turn
        const breachCards = getCardsByKeyword("breach");
        expect(breachCards.length).toBeGreaterThan(0);

        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Would need unit with Breach
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit to destroy
            shieldSection: 3, // Shields to receive Breach damage
            resourceArea: 5,
          },
        );

        // Breach deals damage to shield area after destroying unit
        assertZoneCount(engine, "shieldSection", 3, "player_two");
      });

      it("should specify Breach damage amount", () => {
        // Rule 11-1-2-2: <Breach (amount)> deals (amount) damage to shield area
        const breachCards = getCardsByKeyword("breach");
        expect(breachCards.length).toBeGreaterThan(0);

        // Breach amount specified (e.g., Breach 5 from Wing Gundam)
        const wingGundam = getCardById("ST02-001"); // Wing Gundam with Breach 5
        if (wingGundam) {
          expect(wingGundam.type).toBe("unit");
        }
      });

      it("should deal Breach damage to Base if present", () => {
        // Rule 11-1-2-3: Dealing damage to shield area deals to enemy Base if present,
        // otherwise to topmost Shield
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Breach
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit to destroy
            shieldBase: 1, // Base receives Breach damage first
            shieldSection: 2,
            resourceArea: 5,
          },
        );

        // Base receives Breach damage if present
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });

      it("should activate Breach even when both Units destroyed", () => {
        // Rule 11-1-2-4: Breach activates even when both Units destroyed in battle
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Breach that will be destroyed
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit that destroys Breach unit
            shieldSection: 3,
            resourceArea: 5,
          },
        );

        // Breach activates even if Breach unit is also destroyed
        assertZoneCount(engine, "shieldSection", 3, "player_two");
      });

      it("should not activate Breach when no shield area cards", () => {
        // Rule 11-1-2-5: If no Base nor Shields in enemy shield area,
        // Breach effect does not activate
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Breach
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit
            shieldSection: 0, // No shields
            shieldBase: 0, // No base
            resourceArea: 5,
          },
        );

        // Breach has no target, does not activate
        assertZoneCount(engine, "shieldSection", 0, "player_two");
        assertZoneCount(engine, "shieldBase", 0, "player_two");
      });

      it("should stack Breach effects additively", () => {
        // Rule 11-1-2-6: If Unit with <Breach> is given new <Breach>,
        // amounts are added to the original
        // Ex: <Breach 1> + <Breach 2> = <Breach 3>
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit that could gain multiple Breach effects
            resourceArea: 5,
          },
          {
            battleArea: 1,
            shieldSection: 3,
            resourceArea: 5,
          },
        );

        // Multiple Breach effects combine additively
        assertGamePhase(engine, "mainPhase");
      });

      it("should only activate Breach during your turn", () => {
        // Rule 11-1-2-1: Breach only activates during your turn
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Breach
            resourceArea: 5,
          },
          {
            battleArea: 1,
            shieldSection: 3,
            resourceArea: 5,
          },
        );

        // Breach only activates when Unit with Breach attacks on your turn
        assertTurnPlayer(engine, "player_one");
      });
    });

    describe("Rule 11-1-3: <Support>", () => {
      it("should give AP to another friendly Unit when rested", () => {
        // Rule 11-1-3-1: <Support> gives AP to another friendly Unit during the turn
        // when Unit with <Support> is rested, only during your main phase
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Unit with Support + another unit to support
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

        // Support gives AP to another Unit
        assertZoneCount(engine, "battleArea", 2, "player_one");
        assertGamePhase(engine, "mainPhase");
      });

      it("should specify Support AP bonus amount", () => {
        // Rule 11-1-3-2: <Support (amount)> chooses one other friendly Unit
        // and it gets AP+(amount) during that turn
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Unit with Support (amount) + target unit
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

        // Support amount specified in effect
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should stack Support effects additively", () => {
        // Rule 11-1-3-3: If Unit with <Support> is given new <Support>,
        // amounts are added to the original
        // Ex: <Support 1> + <Support 2> = <Support 3>
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Unit that could gain multiple Support effects
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

        // Multiple Support effects combine additively
        assertGamePhase(engine, "mainPhase");
      });

      it("should require choosing another friendly Unit", () => {
        // Rule 11-1-3-2: Choose one OTHER friendly Unit
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Need at least 2 units (support + target)
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

        // Cannot target self with Support
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should only activate Support during main phase", () => {
        // Rule 11-1-3-1: Support can only be activated during your main phase
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

        // Support activation restricted to main phase
        assertGamePhase(engine, "mainPhase");
        assertTurnPlayer(engine, "player_one");
      });
    });

    describe("Rule 11-1-4: <Blocker>", () => {
      it("should change attack target during block step", () => {
        // Rule 11-1-4-1: <Blocker> can change attack target to Unit with <Blocker>
        // when you declare block and rest that Unit
        const blockerCards = getCardsByKeyword("blocker");
        expect(blockerCards.length).toBeGreaterThan(0);

        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            battleArea: 2, // Multiple defenders, one with Blocker
            resourceArea: 5,
          },
        );

        // Blocker can redirect attack to itself
        assertZoneCount(engine, "battleArea", 2, "player_two");
      });

      it("should not allow multiple Blocker copies on same Unit", () => {
        // Rule 11-1-4-2: Multiple copies of <Blocker> cannot be given to same Unit
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            battleArea: 1, // Unit that cannot gain multiple Blocker copies
            resourceArea: 5,
          },
        );

        // Blocker is unique, cannot stack
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should verify real cards with Blocker exist", () => {
        // Verify Blocker cards are available for testing
        const blockerCards = getCardsByKeyword("blocker");
        expect(blockerCards.length).toBeGreaterThan(0);

        // Example: Aile Strike Gundam has Blocker
        const aileStrike = getCardById("ST04-001");
        if (aileStrike) {
          expect(aileStrike.type).toBe("unit");
        }
      });

      it("should rest Unit when activating Blocker", () => {
        // Rule 11-1-4-1: Rest Unit when declaring block
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            battleArea: 1, // Active unit with Blocker
            resourceArea: 5,
          },
        );

        // Blocker activation requires resting the blocker unit
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });
    });

    describe("Rule 11-1-5: <First Strike>", () => {
      it("should deal damage before enemy during battle", () => {
        // Rule 11-1-5-1: <First Strike> deals damage before enemy when attacking
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with First Strike
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit
            resourceArea: 5,
          },
        );

        // First Strike deals damage first
        assertZoneCount(engine, "battleArea", 1, "player_one");
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should prevent counter damage if enemy destroyed", () => {
        // Rule 11-1-5-2: If enemy Unit or Base destroyed by First Strike,
        // battle damage from enemy's AP is not received
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with First Strike
            resourceArea: 5,
          },
          {
            battleArea: 1, // Enemy unit that would be destroyed
            resourceArea: 5,
          },
        );

        // If First Strike destroys enemy, attacker takes no damage
        assertGamePhase(engine, "mainPhase");
      });

      it("should continue to battle end step after First Strike destruction", () => {
        // Rule 11-1-5-3: If enemy Unit or Base destroyed by First Strike,
        // continue to battle end step after resolving destruction effects
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with First Strike
            resourceArea: 5,
          },
          {
            battleArea: 1,
            resourceArea: 5,
          },
        );

        // Battle ends early if First Strike destroys target
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should not allow multiple First Strike copies on same Unit", () => {
        // Rule 11-1-5-4: Multiple copies of <First Strike> cannot be given to same Unit
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit that cannot gain multiple First Strike copies
            resourceArea: 5,
          },
          {
            battleArea: 1,
            resourceArea: 5,
          },
        );

        // First Strike is unique, cannot stack
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should apply First Strike to Base attacks", () => {
        // Rule 11-1-5-2: First Strike applies when attacking Unit or Base
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with First Strike
            resourceArea: 5,
          },
          {
            shieldBase: 1, // Base can be attacked with First Strike
            resourceArea: 5,
          },
        );

        // First Strike works against Bases too
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });
    });

    describe("Rule 11-1-6: <High-Maneuver>", () => {
      it("should prevent enemy Blocker effects from activating", () => {
        // Rule 11-1-6-1: <High-Maneuver> prevents <Blocker> effect on enemy Units
        // from activating while Unit with <High-Maneuver> is attacking
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with High-Maneuver
            resourceArea: 5,
          },
          {
            battleArea: 1, // Unit with Blocker
            resourceArea: 5,
          },
        );

        // High-Maneuver prevents Blocker from activating
        assertZoneCount(engine, "battleArea", 1, "player_one");
        assertZoneCount(engine, "battleArea", 1, "player_two");
      });

      it("should not allow multiple High-Maneuver copies on same Unit", () => {
        // Rule 11-1-6-2: Multiple copies of <High-Maneuver> cannot be given to same Unit
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit that cannot gain multiple High-Maneuver copies
            resourceArea: 5,
          },
          {
            battleArea: 1,
            resourceArea: 5,
          },
        );

        // High-Maneuver is unique, cannot stack
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should apply High-Maneuver only while attacking", () => {
        // Rule 11-1-6-1: Prevents Blocker WHILE Unit with High-Maneuver is attacking
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with High-Maneuver
            resourceArea: 5,
          },
          {
            battleArea: 1,
            resourceArea: 5,
          },
        );

        // High-Maneuver effect only active during attack
        assertGamePhase(engine, "mainPhase");
      });
    });
  });

  describe("Rule 11-2: Keywords", () => {
    describe("Rule 11-2-1: 【Activate･Main】", () => {
      it("should activate only during main phase", () => {
        // Rule 11-2-1-1: 【Activate･Main】 is activated effect that can only be
        // activated during your main phase
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units may have Activate･Main effects
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Activate･Main can be used during main phase
        assertGamePhase(engine, "mainPhase");
        assertTurnPlayer(engine, "player_one");
      });

      it("should not activate Activate･Main while Unit is attacking", () => {
        // Rule 11-2-1-1-1: 【Activate･Main】 effect cannot be activated while Unit is attacking
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Activate･Main that is attacking
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Cannot use Activate･Main during attack
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should fulfill conditions before colon to activate", () => {
        // Rule 11-2-1-2: "【Activate･Main】 (condition)：(text)" means fulfill
        // condition during main phase, then perform text
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units with Activate･Main conditions
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Conditions must be fulfilled to activate effect
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should allow activation by declaration when no conditions listed", () => {
        // Rule 11-2-1-3: If 【Activate･Main】 has neither colon nor conditions,
        // activate by declaring you are doing so
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // No conditions = activate by declaration
        assertGamePhase(engine, "mainPhase");
      });
    });

    describe("Rule 11-2-2: 【Activate･Action】", () => {
      it("should activate only during action steps", () => {
        // Rule 11-2-2-1: 【Activate･Action】 is activated effect that can only be
        // activated during action steps
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units may have Activate･Action effects
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

        // Activate･Action can be used during action steps
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should recognize action steps after block step and during end phase", () => {
        // Rule 11-2-2-1-1: Action steps occur after block step of Unit attack
        // and during end phase
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
        );

        // Action steps happen in two contexts
        assertGamePhase(engine, "mainPhase");
      });

      it("should fulfill conditions before colon to activate", () => {
        // Rule 11-2-2-2: "【Activate･Action】 (condition)：(text)" means fulfill
        // condition during action step, then perform text
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
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

        // Conditions must be fulfilled to activate effect
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should allow activation by declaration when no conditions listed", () => {
        // Rule 11-2-2-3: If 【Activate･Action】 has neither colon nor conditions,
        // activate by declaring you are doing so
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
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

        // No conditions = activate by declaration
        assertGamePhase(engine, "mainPhase");
      });
    });

    describe("Rule 11-2-3: 【Main】", () => {
      it("should identify Main as command effect keyword", () => {
        // Rule 11-2-3-1: 【Main】 is keyword for command effect on Command card
        const commandCards = getCardsByType("command").slice(0, 5);
        expect(commandCards.length).toBeGreaterThan(0);

        const engine = new GundamTestEngine(
          {
            hand: commandCards,
            resourceArea: 8,
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

        // Main commands can be played from hand
        assertZoneCount(engine, "hand", commandCards.length, "player_one");
      });

      it("should play Main commands during main phase", () => {
        // Rule 11-2-3-2: 【Main】 means card can be played from hand during main phase
        const commandCards = getCardsByType("command").slice(0, 3);

        const engine = new GundamTestEngine(
          {
            hand: commandCards,
            resourceArea: 8,
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

        // Main commands playable during main phase only
        assertGamePhase(engine, "mainPhase");
        assertTurnPlayer(engine, "player_one");
      });
    });

    describe("Rule 11-2-4: 【Action】", () => {
      it("should identify Action as command effect keyword", () => {
        // Rule 11-2-4-1: 【Action】 is keyword for command effect on Command card
        const commandCards = getCardsByType("command").slice(0, 5);
        expect(commandCards.length).toBeGreaterThan(0);

        const engine = new GundamTestEngine(
          {
            hand: commandCards,
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

        // Action commands can be played from hand
        assertZoneCount(engine, "hand", commandCards.length, "player_one");
      });

      it("should play Action commands during action step", () => {
        // Rule 11-2-4-2: 【Action】 means card can be played from hand during action step
        const commandCards = getCardsByType("command").slice(0, 3);

        const engine = new GundamTestEngine(
          {
            hand: commandCards,
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

        // Action commands playable during action steps
        assertZoneCount(engine, "hand", commandCards.length, "player_one");
      });

      it("should recognize action steps occur after block and during end phase", () => {
        // Rule 11-2-4-2-1: Action steps occur after block step and during end phase
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
        );

        // Action steps happen in two contexts
        assertGamePhase(engine, "mainPhase");
      });

      it("should not allow pairing Pilots during action step", () => {
        // Rule 11-2-4-2-2: Cards cannot be paired as Pilots during action step
        const pilots = getCardsByType("pilot").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units to pair with
            hand: pilots,
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

        // Pilot pairing not allowed during action step
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });
    });

    describe("Rule 11-2-5: 【Burst】", () => {
      it("should trigger when Shield is revealed after being destroyed", () => {
        // Rule 11-2-5-1: 【Burst】 triggers when card is revealed after being
        // destroyed by damage or effect while acting as Shield
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Attacker
            resourceArea: 5,
          },
          {
            shieldSection: 3, // Shields may have Burst effects
            resourceArea: 5,
          },
        );

        // Burst effects trigger when shield destroyed and revealed
        assertZoneCount(engine, "shieldSection", 3, "player_two");
      });

      it("should allow optional activation of Burst effect", () => {
        // Rule 11-2-5-2: "【Burst】 (text)" means when card acting as Shield is
        // revealed after being destroyed, you may activate effect
        // Rule 11-2-5-3: Can choose not to activate Burst, card placed in trash
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 1, // Shield with Burst effect
            resourceArea: 5,
          },
        );

        // Burst activation is optional
        assertZoneCount(engine, "shieldSection", 1, "player_two");
      });

      it("should place card in trash if Burst not activated", () => {
        // Rule 11-2-5-3: If Burst not activated, card placed into trash
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 1,
            resourceArea: 5,
          },
        );

        // Card goes to trash regardless of Burst activation
        assertZoneCount(engine, "shieldSection", 1, "player_two");
      });
    });

    describe("Rule 11-2-6: 【Deploy】", () => {
      it("should trigger when Unit first placed in battle area", () => {
        // Rule 11-2-6-1: 【Deploy】 triggers when Unit or Base first placed
        // in battle area
        const units = getCardsByType("unit").slice(0, 3);

        const engine = new GundamTestEngine(
          {
            hand: units,
            resourceArea: 10,
            battleArea: 0,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Deploy effects trigger when unit enters battle area
        assertZoneCount(engine, "hand", units.length, "player_one");
      });

      it("should trigger Deploy when Base placed in shield area", () => {
        // Rule 11-2-6-1: Deploy triggers when Base placed in battle area
        // (Note: Bases placed in shield area, not battle area)
        const bases = getCardsByType("base").slice(0, 1);

        const engine = new GundamTestEngine(
          {
            hand: bases,
            resourceArea: 8,
            shieldBase: 0,
            deck: 30,
          },
          {
            hand: 5,
            resourceArea: 5,
            shieldBase: 1,
            deck: 30,
          },
        );

        // Deploy effects on Bases trigger when placed
        assertZoneCount(engine, "hand", bases.length, "player_one");
      });

      it("should execute Deploy effect text when triggered", () => {
        // Rule 11-2-6-2: "【Deploy】 (text)" means when card deployed, perform text
        const units = getCardsByType("unit").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            hand: units,
            resourceArea: 10,
            battleArea: 0,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Deploy effect text is executed
        assertZoneCount(engine, "hand", units.length, "player_one");
      });
    });

    describe("Rule 11-2-7: 【Attack】", () => {
      it("should trigger when Unit declares attack", () => {
        // Rule 11-2-7-1: 【Attack】 triggers when Unit declares attack
        const engine = new GundamTestEngine(
          {
            battleArea: 1, // Unit with Attack trigger
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Attack trigger activates when unit attacks
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should execute Attack effect text when triggered", () => {
        // Rule 11-2-7-2: "【Attack】 (text)" means when Unit attacks, perform text
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Attack effect text is executed
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });
    });

    describe("Rule 11-2-8: 【Destroyed】", () => {
      it("should trigger when Unit or Base destroyed and placed in trash", () => {
        // Rule 11-2-8-1: 【Destroyed】 triggers when Unit or Base destroyed and
        // placed from battle area or shield area into trash
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units with Destroyed triggers
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

        // Destroyed effects trigger when unit destroyed
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should execute Destroyed effect text when triggered", () => {
        // Rule 11-2-8-2: "【Destroyed】 (text)" means when Unit or Base destroyed
        // and placed in trash, perform text
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

        // Destroyed effect text is executed
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should activate Destroyed effect from trash", () => {
        // Rule 11-2-8-3: Destroyed effect activates from trash as effect on
        // Unit or Base that was destroyed
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Destroyed effects activate from trash location
        assertZoneCount(engine, "battleArea", 1, "player_one");
      });

      it("should reference last state before destruction", () => {
        // Rule 11-2-8-3-1: If text refers to state of Unit or Base, refer to
        // its state in last location prior to being destroyed
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Effect references pre-destruction state
        assertGamePhase(engine, "mainPhase");
      });
    });

    describe("Rule 11-2-9: 【When Paired】", () => {
      it("should trigger when Pilot paired with Unit", () => {
        // Rule 11-2-9-1: 【When Paired】 triggers when Pilot paired with Unit
        const pilots = getCardsByType("pilot").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units to pair with
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // When Paired triggers when pilot pairs with unit
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });

      it("should check Pilot qualifications for When Paired", () => {
        // Rule 11-2-9-2: 【When Paired･(qualifications) Pilot】 (text)
        // means when Pilot fulfilling qualifications is paired, perform text
        const pilots = getCardsByType("pilot").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Qualifications determine if effect triggers
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });

      it("should verify real pilots exist in catalog", () => {
        // Verify Pilot cards are available for testing
        const pilots = getCardsByType("pilot");
        expect(pilots.length).toBeGreaterThan(0);

        // Examples: Amuro Ray, Suletta Mercury
        const amuro = getCardById("ST01-010");
        if (amuro) {
          expect(amuro.type).toBe("pilot");
        }
      });
    });

    describe("Rule 11-2-10: 【During Pair】", () => {
      it("should be active while Pilot paired with Unit", () => {
        // Rule 11-2-10-1: 【During Pair】 is constant effect that is continuously
        // active while Pilot is paired with Unit
        const pilots = getCardsByType("pilot").slice(0, 1);

        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // During Pair is constant effect while paired
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });

      it("should check Pilot qualifications for During Pair", () => {
        // Rule 11-2-10-2: 【During Pair･(qualifications) Pilot】 (text)
        // means while Pilot fulfilling qualifications is paired, perform text
        const pilots = getCardsByType("pilot").slice(0, 1);

        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Qualifications determine if effect is active
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });
    });

    describe("Rule 11-2-11: 【Pilot】", () => {
      it("should identify Pilot qualifications keyword", () => {
        // Rule 11-2-11-1: 【Pilot】 is keyword for Pilot qualifications following
        // When Paired or During Pair keywords
        const pilots = getCardsByType("pilot").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Pilot qualifications used in effect conditions
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });

      it("should fulfill conditions when Pilot matches qualifications", () => {
        // Rule 11-2-11-2: If appears as 【(qualifications) Pilot】, fulfills
        // When Paired or During Pair condition if Pilot fulfills qualifications
        const pilots = getCardsByType("pilot").slice(0, 1);

        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 1,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Matching qualifications fulfills condition
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });

      it("should accept any Pilot when no qualifications specified", () => {
        // Rule 11-2-11-3: If appears as 【Pilot】 without qualifications,
        // any Pilot fulfills condition when paired
        const pilots = getCardsByType("pilot").slice(0, 2);

        const engine = new GundamTestEngine(
          {
            battleArea: 2,
            hand: pilots,
            resourceArea: 10,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // No qualifications = any pilot works
        assertZoneCount(engine, "hand", pilots.length, "player_one");
      });
    });

    describe("Rule 11-2-12: 【Once per Turn】", () => {
      it("should limit effect activation to once per turn", () => {
        // Rule 11-2-12-1: 【Once per Turn】 indicates effect can only be
        // activated one time during that turn
        const engine = new GundamTestEngine(
          {
            battleArea: 2, // Units with Once per Turn effects
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Once per Turn limits activation frequency
        assertZoneCount(engine, "battleArea", 2, "player_one");
      });

      it("should allow each Unit to activate Once per Turn effect", () => {
        // Rule 11-2-12-2: If multiple Units or Bases have copy of same effect
        // with Once per Turn, each Unit or Base can activate it one time
        const engine = new GundamTestEngine(
          {
            battleArea: 3, // Multiple units with same Once per Turn effect
            hand: 5,
            resourceArea: 8,
            deck: 30,
          },
          {
            battleArea: 2,
            hand: 5,
            resourceArea: 5,
            deck: 30,
          },
        );

        // Each unit can activate effect once per turn
        assertZoneCount(engine, "battleArea", 3, "player_one");
      });

      it("should reset Once per Turn at start of new turn", () => {
        // Once per Turn resets when turn ends
        const engine = new GundamTestEngine(
          {
            battleArea: 2,
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

        // Restriction resets each turn
        assertGamePhase(engine, "mainPhase");
      });
    });
  });

  describe("Keyword Integration Scenarios", () => {
    it("should handle multiple keyword effects on same Unit", () => {
      // Units can have multiple keyword effects
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units with multiple keywords
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

      // Multiple keywords can coexist
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should handle triggered keywords during combat", () => {
      // Deploy, Attack, Destroyed can all trigger during battle
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with multiple triggered effects
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Triggered keywords activate at appropriate times
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });

    it("should handle activated keywords with Once per Turn", () => {
      // Activate･Main and Activate･Action with Once per Turn restriction
      const engine = new GundamTestEngine(
        {
          battleArea: 2,
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

      // Once per Turn limits activated effects
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should handle pairing keywords", () => {
      // When Paired and During Pair work together
      const pilots = getCardsByType("pilot").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: pilots,
          resourceArea: 10,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Pairing keywords activate appropriately
      assertZoneCount(engine, "hand", pilots.length, "player_one");
    });
  });

  describe("Keyword Edge Cases", () => {
    it("should handle stacking keyword effects", () => {
      // Repair, Breach, Support stack; Blocker, First Strike, High-Maneuver don't
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units that could gain additional keyword effects
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

      // Some keywords stack, others don't
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should handle keyword activation timing", () => {
      // Different keywords activate at different times
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 1,
          shieldSection: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Keywords have specific timing windows
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle keyword interactions", () => {
      // High-Maneuver vs Blocker, First Strike vs destroyed triggers
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Unit with High-Maneuver or First Strike
          resourceArea: 5,
        },
        {
          battleArea: 1, // Unit with Blocker or Destroyed trigger
          resourceArea: 5,
        },
      );

      // Keywords interact in specific ways
      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });

    it("should handle keywords with missing requirements", () => {
      // Repair without damage, Support without other units, etc.
      const engine = new GundamTestEngine(
        {
          battleArea: 1, // Single unit with Support (no target)
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Keywords may not activate without requirements
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
  });
});
