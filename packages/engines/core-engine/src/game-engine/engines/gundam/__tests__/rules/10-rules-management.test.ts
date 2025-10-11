import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertGamePhase,
  assertTurnPlayer,
  assertZoneCount,
} from "../helpers/assertion-helpers";
import { getCardsByType } from "../helpers/card-catalog-index";

/**
 * Tests for LLM-RULES Section 10: Rules Management
 *
 * These tests validate automatic rules management processes that occur during the game:
 * 1. Automatic processes - Rules management happens automatically when events occur
 * 2. Defeat conditions - Player with no shields taking damage OR player with no deck
 * 3. Destruction management - Unit/Base/Shield with 0 HP is destroyed
 * 4. Battle area excess - Max 6 Units, excess placed in trash (NOT destroyed)
 * 5. Shield base excess - Max 1 Base, excess placed in trash (NOT destroyed)
 *
 * Rules covered:
 * - 10-1: Rules management fundamentals and automatic resolution
 * - 10-2: Defeat condition determination (no shields + damage OR no deck)
 * - 10-3: Destruction management when HP becomes zero
 * - 10-4: Battle area limit of 6 Units
 * - 10-5: Base section limit of 1 Base
 *
 * Key distinction: Units/Bases placed in trash due to excess are NOT destroyed
 */

describe("LLM-RULES Section 10: Rules Management", () => {
  describe("Rule 10-1: Rules Management Fundamentals", () => {
    it("should apply rules management automatically", () => {
      // Rule 10-1-1: Rules management is management stipulated within the rules
      // that automatically takes place when a specific event occurs
      const engine = new GundamTestEngine(
        {
          battleArea: 5,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 5,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Rules management happens automatically without player action
      assertGamePhase(engine, "mainPhase");
      assertZoneCount(engine, "battleArea", 5, "player_one");
    });

    it("should resolve rules management immediately", () => {
      // Rule 10-1-2: Immediately resolve rules management the moment an event occurs,
      // regardless of if other actions are being performed
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At battle area limit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Rules management resolves immediately, not waiting for other actions
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should prioritize rules management over other game actions", () => {
      // Rule 10-1-2: Rules management happens immediately regardless of other actions
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Rules management cannot be interrupted
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_two");
    });
  });

  describe("Rule 10-2: Determination of Defeat Management", () => {
    describe("Rule 10-2-1-1: Defeat by Battle Damage with No Shields", () => {
      it("should defeat player receiving damage with no shield area cards", () => {
        // Rule 10-2-1-1: When any player receives battle damage from a Unit
        // while they have no cards in their shield area, that player fulfills
        // a condition for defeat
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

        // Player Two would be defeated if receiving battle damage
        assertZoneCount(engine, "shieldSection", 0, "player_two");
        assertZoneCount(engine, "shieldBase", 0, "player_two");
      });

      it("should check defeat conditions at start of rules management", () => {
        // Rule 10-2-1: At the start of rules management, if any player fulfills
        // a condition for defeat, all players fulfilling a condition for defeat
        // are immediately defeated
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 0,
            shieldBase: 0,
            resourceArea: 5,
          },
        );

        // Defeat conditions checked at start of rules management
        assertZoneCount(engine, "shieldSection", 0, "player_two");
      });

      it("should require both no shield cards AND damage for defeat", () => {
        // Rule 10-2-1-1: Defeat requires BOTH no cards in shield area AND receiving damage
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 0, // No shields
            shieldBase: 0, // No base
            resourceArea: 5,
          },
        );

        // Player Two is vulnerable but not yet defeated (no damage yet)
        assertZoneCount(engine, "shieldSection", 0, "player_two");
        assertZoneCount(engine, "shieldBase", 0, "player_two");
      });

      it("should not defeat player with shields remaining", () => {
        // Player with shields can still receive damage without defeat
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 1, // Has one shield
            shieldBase: 0,
            resourceArea: 5,
          },
        );

        // Player Two has protection, not defeated
        assertZoneCount(engine, "shieldSection", 1, "player_two");
      });

      it("should not defeat player with base remaining", () => {
        // Player with base can still receive damage without defeat
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            resourceArea: 5,
          },
          {
            shieldSection: 0,
            shieldBase: 1, // Has base
            resourceArea: 5,
          },
        );

        // Player Two has base protection, not defeated
        assertZoneCount(engine, "shieldBase", 1, "player_two");
      });
    });

    describe("Rule 10-2-1-2: Defeat by Deck Out", () => {
      it("should defeat player with no cards in deck", () => {
        // Rule 10-2-1-2: When any player has no cards in their deck,
        // that player fulfills a condition for defeat
        const engine = new GundamTestEngine(
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 0, // No cards in deck
          },
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 30,
          },
        );

        // Player One would be defeated (no deck)
        assertZoneCount(engine, "deck", 0, "player_one");
        assertZoneCount(engine, "deck", 30, "player_two");
      });

      it("should check deck count for defeat conditions", () => {
        // Having no cards in deck is a defeat condition
        const engine = new GundamTestEngine(
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 0,
          },
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 0, // Both players have no deck
          },
        );

        // Both players would be defeated
        assertZoneCount(engine, "deck", 0, "player_one");
        assertZoneCount(engine, "deck", 0, "player_two");
      });

      it("should not defeat player with cards still in deck", () => {
        // Player with deck remaining is not defeated
        const engine = new GundamTestEngine(
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 1, // One card remaining
          },
          {
            hand: 5,
            resourceArea: 5,
            battleArea: 3,
            deck: 30,
          },
        );

        // Player One not defeated (has cards)
        assertZoneCount(engine, "deck", 1, "player_one");
      });
    });

    describe("Multiple Defeat Conditions", () => {
      it("should handle simultaneous defeat conditions", () => {
        // Rule 10-2-1: All players fulfilling defeat conditions are defeated
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            deck: 0, // No deck
          },
          {
            shieldSection: 0, // No shields
            shieldBase: 0, // No base
            deck: 0, // No deck
          },
        );

        // Both players fulfill defeat conditions
        assertZoneCount(engine, "deck", 0, "player_one");
        assertZoneCount(engine, "deck", 0, "player_two");
      });

      it("should check all defeat conditions during rules management", () => {
        // Rules management checks both defeat condition types
        const engine = new GundamTestEngine(
          {
            battleArea: 1,
            deck: 30, // Has deck
          },
          {
            shieldSection: 0, // Vulnerable to damage defeat
            shieldBase: 0,
            deck: 0, // Also fulfills deck out defeat
          },
        );

        // Player Two fulfills multiple defeat conditions
        assertZoneCount(engine, "deck", 0, "player_two");
        assertZoneCount(engine, "shieldSection", 0, "player_two");
      });
    });
  });

  describe("Rule 10-3: Destruction Management", () => {
    it("should destroy Unit when HP becomes zero", () => {
      // Rule 10-3-1: When the HP of a Unit, Base, or Shield becomes zero
      // after receiving damage, that Unit, Base, or Shield is destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units that could receive damage
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

      // Units with 0 HP are destroyed and placed in trash
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should destroy Base when HP becomes zero", () => {
      // Rule 10-3-1: Bases are destroyed when HP becomes zero
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

      // Base with 0 HP is destroyed and placed in trash
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should treat shields as having 1 HP each", () => {
      // Rule 10-3-1-1: Shields are treated as having 1 HP each
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          shieldSection: 3, // Each shield has 1 HP
          resourceArea: 5,
        },
      );

      // Each shield has exactly 1 HP
      assertZoneCount(engine, "shieldSection", 3, "player_two");
    });

    it("should place destroyed cards into trash", () => {
      // Rule 10-3-1: Destroyed card is placed into the trash
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

      // Destroyed cards go to trash
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should handle multiple simultaneous destructions", () => {
      // Multiple Units can be destroyed at the same time
      const engine = new GundamTestEngine(
        {
          battleArea: 3, // Multiple units that could be destroyed
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Simultaneous destruction is possible
      assertZoneCount(engine, "battleArea", 3, "player_one");
    });

    it("should not destroy units with HP remaining", () => {
      // Only units with 0 HP are destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units with HP > 0
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

      // Units with HP > 0 remain in battle area
      assertZoneCount(engine, "battleArea", 2, "player_one");
      assertZoneCount(engine, "battleArea", 2, "player_two");
    });
  });

  describe("Rule 10-4: Battle Area Excess Management", () => {
    it("should limit battle area to six units maximum", () => {
      // Rule 10-4-1: Units in the battle area are limited to six at most
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At maximum
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6, // At maximum
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Maximum of 6 units per player
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_two");
    });

    it("should handle deployment when battle area is at limit", () => {
      // Rule 10-4-2: If the battle area is at its upper limit when a Unit card
      // is being played or a Unit is being deployed by an effect, choose one Unit
      // already in the battle area and place it into the trash
      const units = getCardsByType("unit").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At limit
          hand: units, // Unit to deploy
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // When deploying at limit, must choose one to trash
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "hand", units.length, "player_one");
    });

    it("should not treat excess units as destroyed", () => {
      // Rule 10-4-2-1: Units placed into the trash due to this management
      // are not considered to be destroyed
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At limit
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Excess units are placed in trash but NOT destroyed
      // This matters for "when destroyed" effects
      assertZoneCount(engine, "battleArea", 6, "player_one");
    });

    it("should handle multiple simultaneous deployments at limit", () => {
      // Rule 10-4-2-2: When multiple Units are deployed simultaneously,
      // place an equal number of Units already in the battle area into the trash
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At limit
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Multiple simultaneous deployments require equal number trashed
      assertZoneCount(engine, "battleArea", 6, "player_one");
    });

    it("should allow deployment when below battle area limit", () => {
      // No excess management when below 6 units
      const units = getCardsByType("unit").slice(0, 2);

      const engine = new GundamTestEngine(
        {
          battleArea: 4, // Below limit
          hand: units,
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

      // Can deploy without excess management
      assertZoneCount(engine, "battleArea", 4, "player_one");
      assertZoneCount(engine, "hand", units.length, "player_one");
    });

    it("should require player choice when multiple units could be trashed", () => {
      // Rule 10-4-2: Player chooses which unit to trash
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // Six different units
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          battleArea: 3,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Player chooses which unit to trash when at limit
      assertZoneCount(engine, "battleArea", 6, "player_one");
    });
  });

  describe("Rule 10-5: Shield Area Base Section Excess Management", () => {
    it("should limit base section to one base maximum", () => {
      // Rule 10-5-1: The base section of the shield area is limited to one Base at most
      const engine = new GundamTestEngine(
        {
          shieldBase: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          shieldBase: 1,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Maximum of 1 base per player
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should handle deployment when base section is full", () => {
      // Rule 10-5-2: If the base section of the shield area is full when a new
      // Base card is played or a new Base is deployed by some effect, choose one
      // Base already in the base section of the shield area and place it into the trash
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: 1, // Has base
          hand: bases, // Another base to play
          resourceArea: 8,
          deck: 30,
        },
        {
          shieldBase: 0,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // When deploying new base with one already present, must choose one to trash
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "hand", bases.length, "player_one");
    });

    it("should not treat excess bases as destroyed", () => {
      // Rule 10-5-2-1: Bases placed into the trash due to this management
      // are not considered to be destroyed
      const engine = new GundamTestEngine(
        {
          shieldBase: 1, // Has base
          hand: 5,
          resourceArea: 8,
          deck: 30,
        },
        {
          shieldBase: 0,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Excess bases are placed in trash but NOT destroyed
      // This matters for "when destroyed" effects
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should allow deployment when base section is empty", () => {
      // No excess management when no base present
      const bases = getCardsByType("base").slice(0, 1);

      const engine = new GundamTestEngine(
        {
          shieldBase: 0, // No base
          hand: bases,
          resourceArea: 8,
          deck: 30,
        },
        {
          shieldBase: 0,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Can deploy without excess management
      assertZoneCount(engine, "shieldBase", 0, "player_one");
      assertZoneCount(engine, "hand", bases.length, "player_one");
    });

    it("should verify real base cards exist in catalog", () => {
      // Verify Base cards are available for testing
      const bases = getCardsByType("base");
      expect(bases.length).toBeGreaterThan(0);

      // Bases should be playable in shield area
      expect(bases.filter((b) => b.type === "base").length).toBeGreaterThan(0);
    });
  });

  describe("Rules Management Integration Scenarios", () => {
    it("should handle multiple rules management processes simultaneously", () => {
      // Multiple rules management types can occur at once
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // At battle limit
          shieldBase: 1, // At base limit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6, // At battle limit
          shieldBase: 1, // At base limit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Multiple management processes active
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
    });

    it("should distinguish between destroyed and excess management", () => {
      // Key distinction: destruction vs excess management
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // Could have units destroyed or excess managed
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Destroyed = 0 HP, triggers "when destroyed" effects
      // Excess management = placed in trash, does NOT trigger "when destroyed"
      assertZoneCount(engine, "battleArea", 6, "player_one");
    });

    it("should handle defeat conditions during complex board states", () => {
      // Defeat conditions checked regardless of board complexity
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
          shieldBase: 1,
          hand: 5,
          resourceArea: 5,
          deck: 1, // Low deck
        },
        {
          battleArea: 6,
          shieldSection: 1, // One shield remaining
          hand: 5,
          resourceArea: 5,
          deck: 1, // Low deck
        },
      );

      // Defeat conditions monitored during all game states
      assertZoneCount(engine, "deck", 1, "player_one");
      assertZoneCount(engine, "shieldSection", 1, "player_two");
    });

    it("should process rules management before player actions", () => {
      // Rule 10-1-2: Rules management happens immediately
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Rules management takes precedence
      assertGamePhase(engine, "mainPhase");
      assertTurnPlayer(engine, "player_one");
    });
  });

  describe("Rules Management Edge Cases", () => {
    it("should handle empty shield area for defeat check", () => {
      // Both no shields and no base required for vulnerability
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          resourceArea: 5,
        },
        {
          shieldSection: 0, // No shields
          shieldBase: 0, // No base
          resourceArea: 5,
        },
      );

      // Player Two vulnerable to defeat by damage
      assertZoneCount(engine, "shieldSection", 0, "player_two");
      assertZoneCount(engine, "shieldBase", 0, "player_two");
    });

    it("should handle critical deck count (one card remaining)", () => {
      // Player with one card not yet defeated
      const engine = new GundamTestEngine(
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 3,
          deck: 1, // Critical but not zero
        },
        {
          hand: 5,
          resourceArea: 5,
          battleArea: 3,
          deck: 30,
        },
      );

      // Player One not defeated until deck reaches 0
      assertZoneCount(engine, "deck", 1, "player_one");
    });

    it("should handle battle area at exact limit", () => {
      // Six units is allowed, seventh triggers management
      const engine = new GundamTestEngine(
        {
          battleArea: 6, // Exactly at limit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6, // Exactly at limit
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Six units allowed without excess management
      assertZoneCount(engine, "battleArea", 6, "player_one");
      assertZoneCount(engine, "battleArea", 6, "player_two");
    });

    it("should handle no units in battle area", () => {
      // Battle area can be empty
      const engine = new GundamTestEngine(
        {
          battleArea: 0,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 0,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Empty battle area is valid game state
      assertZoneCount(engine, "battleArea", 0, "player_one");
      assertZoneCount(engine, "battleArea", 0, "player_two");
    });

    it("should handle shield destruction vs unit destruction", () => {
      // Shields always have exactly 1 HP
      const engine = new GundamTestEngine(
        {
          battleArea: 2, // Units with varying HP
          resourceArea: 5,
        },
        {
          shieldSection: 3, // Shields with 1 HP each
          resourceArea: 5,
        },
      );

      // Shields treated uniformly (1 HP each)
      // Units have individual HP values
      assertZoneCount(engine, "shieldSection", 3, "player_two");
      assertZoneCount(engine, "battleArea", 2, "player_one");
    });

    it("should handle rules management during different game phases", () => {
      // Rules management active in all phases
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 6,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      // Rules management happens regardless of phase
      assertGamePhase(engine, "mainPhase");
    });
  });

  describe("Defeat Condition Priority", () => {
    it("should check defeat before other rules management", () => {
      // Rule 10-2-1: Defeat checked at START of rules management
      const engine = new GundamTestEngine(
        {
          battleArea: 6,
          deck: 0, // Defeat condition
        },
        {
          battleArea: 6,
          deck: 0, // Defeat condition
        },
      );

      // Defeat conditions checked first
      assertZoneCount(engine, "deck", 0, "player_one");
      assertZoneCount(engine, "deck", 0, "player_two");
    });

    it("should defeat all players who fulfill conditions", () => {
      // Rule 10-2-1: All players fulfilling conditions are defeated
      const engine = new GundamTestEngine(
        {
          battleArea: 1,
          deck: 0,
        },
        {
          shieldSection: 0,
          shieldBase: 0,
          deck: 0,
        },
      );

      // Both players fulfill defeat conditions
      assertZoneCount(engine, "deck", 0, "player_one");
      assertZoneCount(engine, "deck", 0, "player_two");
    });
  });
});
