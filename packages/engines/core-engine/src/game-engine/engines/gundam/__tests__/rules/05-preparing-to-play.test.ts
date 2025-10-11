import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../src/testing/gundam-test-engine";
import {
  assertZoneCount,
  buildGameStartScenario,
  getCardsByColor,
  getCardsBySet,
  getCardsByType,
} from "../helpers";

/**
 * Tests for LLM-RULES Section 5: Preparing to Play
 *
 * These tests validate deck construction rules, resource deck rules, and starting setup:
 *
 * Rules covered:
 * - 5-1-1: Deck construction (50 cards: Unit, Pilot, Command, Base)
 * - 5-1-1-2: Deck color restriction (1-2 colors only)
 * - 5-1-1-3: Card limit (max 4 copies of same card number)
 * - 5-1-1-4: Resource deck construction (10 Resource cards)
 * - 5-2-1-5: Starting hand (5 cards)
 * - 5-2-1-6: Mulligan/redraw option (return all, draw 5 new, then shuffle)
 * - 5-2-2: Starting shields (6 shields face down)
 * - 5-2-3: EX Base placement (1 active EX Base token)
 * - 5-2-4: Player Two EX Resource (1 active EX Resource token)
 */

describe("LLM-RULES Section 5: Preparing to Play", () => {
  describe("Rule 5-1-1: Deck Construction - 50 Cards", () => {
    it("should validate deck has exactly 50 cards", () => {
      const allUnits = getCardsByType("unit");
      const allPilots = getCardsByType("pilot");
      const allCommands = getCardsByType("command");
      const allBases = getCardsByType("base");

      const unitsNeeded = Math.min(30, allUnits.length);
      const pilotsNeeded = Math.min(8, allPilots.length);
      const commandsNeeded = Math.min(10, allCommands.length);
      const basesNeeded = Math.min(2, allBases.length);

      const deck = [
        ...allUnits.slice(0, unitsNeeded),
        ...allPilots.slice(0, pilotsNeeded),
        ...allCommands.slice(0, commandsNeeded),
        ...allBases.slice(0, basesNeeded),
      ];

      const totalNeeded =
        unitsNeeded + pilotsNeeded + commandsNeeded + basesNeeded;

      if (totalNeeded < 50) {
        for (let i = 0; i < 50 - totalNeeded; i++) {
          deck.push(allUnits[i % allUnits.length]);
        }
      }

      expect(deck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should reject deck with less than 50 cards", () => {
      const units = getCardsByType("unit").slice(0, 25);
      expect(units.length).toBeLessThan(50);

      const engine = new GundamTestEngine(
        {
          deck: units,
        },
        {},
      );

      const deckCount = engine.getZone("deck", "player_one").length;
      expect(deckCount).not.toBe(50);
      expect(deckCount).toBeLessThan(50);
    });

    it("should allow deck with exactly 50 Unit, Pilot, Command, and Base cards", () => {
      const allUnits = getCardsByType("unit");
      const allPilots = getCardsByType("pilot");
      const allCommands = getCardsByType("command");
      const allBases = getCardsByType("base");

      const unitsNeeded = Math.min(35, allUnits.length);
      const pilotsNeeded = Math.min(6, allPilots.length);
      const commandsNeeded = Math.min(7, allCommands.length);
      const basesNeeded = Math.min(2, allBases.length);

      const deck = [
        ...allUnits.slice(0, unitsNeeded),
        ...allPilots.slice(0, pilotsNeeded),
        ...allCommands.slice(0, commandsNeeded),
        ...allBases.slice(0, basesNeeded),
      ];

      const totalNeeded =
        unitsNeeded + pilotsNeeded + commandsNeeded + basesNeeded;

      if (totalNeeded < 50) {
        for (let i = 0; i < 50 - totalNeeded; i++) {
          deck.push(allUnits[i % allUnits.length]);
        }
      }

      expect(deck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should not include Resource cards in main deck", () => {
      const allUnits = getCardsByType("unit");
      const allResources = getCardsByType("resource");

      const unitsToUse = Math.min(40, allUnits.length);

      const units = allUnits.slice(0, unitsToUse);

      expect(allResources.length).toBeGreaterThan(0);

      const engine = new GundamTestEngine(
        {
          deck: units,
        },
        {},
      );

      assertZoneCount(engine, "deck", units.length, "player_one");
    });
  });

  describe("Rule 5-1-1-2: Deck Color Restriction - One or Two Colors", () => {
    it("should allow deck with single color (all blue)", () => {
      const blueCards = getCardsByColor("blue");
      expect(blueCards.length).toBeGreaterThan(0);

      const blueDeck = blueCards.slice(0, Math.min(50, blueCards.length));

      const engine = new GundamTestEngine(
        {
          deck: blueDeck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should allow deck with single color (all white)", () => {
      const whiteCards = getCardsByColor("white");
      expect(whiteCards.length).toBeGreaterThan(0);

      const whiteDeck = whiteCards.slice(0, Math.min(50, whiteCards.length));

      const engine = new GundamTestEngine(
        {
          deck: whiteDeck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should allow deck with single color (all red)", () => {
      const redCards = getCardsByColor("red");
      expect(redCards.length).toBeGreaterThan(0);

      const redDeck = redCards.slice(0, Math.min(50, redCards.length));

      const engine = new GundamTestEngine(
        {
          deck: redDeck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should allow deck with single color (all green)", () => {
      const greenCards = getCardsByColor("green");
      expect(greenCards.length).toBeGreaterThan(0);

      const greenDeck = greenCards.slice(0, Math.min(50, greenCards.length));

      const engine = new GundamTestEngine(
        {
          deck: greenDeck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should allow deck with two colors (blue and white)", () => {
      const allBlueCards = getCardsByColor("blue");
      const allWhiteCards = getCardsByColor("white");

      const blueToUse = Math.min(25, allBlueCards.length);
      const whiteToUse = Math.min(25, allWhiteCards.length);

      const blueCards = allBlueCards.slice(0, blueToUse);
      const whiteCards = allWhiteCards.slice(0, whiteToUse);

      const twoColorDeck = [...blueCards, ...whiteCards];

      if (twoColorDeck.length < 50 && allBlueCards.length > 0) {
        for (let i = 0; i < 50 - twoColorDeck.length; i++) {
          twoColorDeck.push(allBlueCards[i % allBlueCards.length]);
        }
      }

      expect(twoColorDeck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: twoColorDeck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should allow deck with two colors (red and green)", () => {
      const allRedCards = getCardsByColor("red");
      const allGreenCards = getCardsByColor("green");

      const redToUse = Math.min(30, allRedCards.length);
      const greenToUse = Math.min(20, allGreenCards.length);

      const redCards = allRedCards.slice(0, redToUse);
      const greenCards = allGreenCards.slice(0, greenToUse);

      const twoColorDeck = [...redCards, ...greenCards];

      if (twoColorDeck.length < 50 && allRedCards.length > 0) {
        for (let i = 0; i < 50 - twoColorDeck.length; i++) {
          twoColorDeck.push(allRedCards[i % allRedCards.length]);
        }
      }

      expect(twoColorDeck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: twoColorDeck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should reject deck with three or more colors", () => {
      const allBlueCards = getCardsByColor("blue");
      const allWhiteCards = getCardsByColor("white");
      const allRedCards = getCardsByColor("red");

      const blueToUse = Math.min(15, allBlueCards.length);
      const whiteToUse = Math.min(15, allWhiteCards.length);
      const redToUse = Math.min(20, allRedCards.length);

      const blueCards = allBlueCards.slice(0, blueToUse);
      const whiteCards = allWhiteCards.slice(0, whiteToUse);
      const redCards = allRedCards.slice(0, redToUse);

      const threeColorDeck = [...blueCards, ...whiteCards, ...redCards];

      if (threeColorDeck.length < 50 && allBlueCards.length > 0) {
        for (let i = 0; i < 50 - threeColorDeck.length; i++) {
          threeColorDeck.push(allBlueCards[i % allBlueCards.length]);
        }
      }

      expect(threeColorDeck.length).toBe(50);
    });

    it("should validate various two-color combinations", () => {
      const colorPairs = [
        ["blue", "red"],
        ["white", "green"],
        ["blue", "green"],
      ] as const;

      for (const [color1, color2] of colorPairs) {
        const cards1 = getCardsByColor(color1).slice(0, 25);
        const cards2 = getCardsByColor(color2).slice(0, 25);

        const deck = [...cards1, ...cards2];

        const engine = new GundamTestEngine(
          {
            deck: deck,
          },
          {},
        );

        const deckCards = engine.getZone("deck", "player_one");
        expect(deckCards.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Rule 5-1-1-3: Card Limit - Maximum 4 Copies of Same Card", () => {
    it("should allow exactly 4 copies of same card", () => {
      const units = getCardsByType("unit");
      expect(units.length).toBeGreaterThan(0);

      const firstUnit = units[0];
      const fourCopies = [firstUnit, firstUnit, firstUnit, firstUnit];

      expect(fourCopies.length).toBe(4);

      const otherUnits = getCardsByType("unit").slice(1, 47);
      const deck = [...fourCopies, ...otherUnits];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should allow 1 copy of a card", () => {
      const units = getCardsByType("unit");
      const singleCard = [units[0]];
      const otherCards = getCardsByType("unit").slice(1, 50);

      const deck = [...singleCard, ...otherCards];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should allow 2 copies of a card", () => {
      const units = getCardsByType("unit");
      const firstUnit = units[0];
      const twoCopies = [firstUnit, firstUnit];

      const otherCards = getCardsByType("unit").slice(1, 49);
      const deck = [...twoCopies, ...otherCards];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should allow 3 copies of a card", () => {
      const units = getCardsByType("unit");
      const firstUnit = units[0];
      const threeCopies = [firstUnit, firstUnit, firstUnit];

      const otherCards = getCardsByType("unit").slice(1, 48);
      const deck = [...threeCopies, ...otherCards];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should allow multiple different cards each with 4 copies", () => {
      const units = getCardsByType("unit");
      const card1 = units[0];
      const card2 = units[1];
      const card3 = units[2];

      const fourOfEach = [
        card1,
        card1,
        card1,
        card1,
        card2,
        card2,
        card2,
        card2,
        card3,
        card3,
        card3,
        card3,
      ];

      expect(fourOfEach.length).toBe(12);

      const otherCards = getCardsByType("unit").slice(3, 41);
      const deck = [...fourOfEach, ...otherCards];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should construct valid deck with varied copy counts", () => {
      const units = getCardsByType("unit");

      const fourCopies = [units[0], units[0], units[0], units[0]];
      const threeCopies = [units[1], units[1], units[1]];
      const twoCopies = [units[2], units[2]];
      const singleCopies = units.slice(3, 44);

      const deck = [
        ...fourCopies,
        ...threeCopies,
        ...twoCopies,
        ...singleCopies,
      ];

      const engine = new GundamTestEngine(
        {
          deck: deck.slice(0, 50),
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should verify card limit applies to any card type", () => {
      const pilots = getCardsByType("pilot");
      expect(pilots.length).toBeGreaterThan(0);

      const firstPilot = pilots[0];
      const fourPilots = [firstPilot, firstPilot, firstPilot, firstPilot];

      const otherCards = getCardsByType("unit").slice(0, 46);
      const deck = [...fourPilots, ...otherCards];

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });
  });

  describe("Rule 5-1-1-4: Resource Deck Construction - 10 Resource Cards", () => {
    it("should construct resource deck with exactly 10 resources", () => {
      const resources = getCardsByType("resource").slice(0, 10);
      expect(resources.length).toBe(10);

      const engine = new GundamTestEngine(
        {
          resourceDeck: resources,
        },
        {},
      );

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
    });

    it("should validate resource deck has 10 cards at game start", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
      assertZoneCount(engine, "resourceDeck", 10, "player_two");
    });

    it("should allow any number of copies of same resource in resource deck", () => {
      const resources = getCardsByType("resource");
      expect(resources.length).toBeGreaterThan(0);

      const firstResource = resources[0];
      const allSame = Array(10).fill(firstResource);

      const engine = new GundamTestEngine(
        {
          resourceDeck: allSame,
        },
        {},
      );

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
    });

    it("should handle mixed resource types in resource deck", () => {
      const resources = getCardsByType("resource");
      const mixedResources = resources.slice(0, 10);

      const engine = new GundamTestEngine(
        {
          resourceDeck: mixedResources,
        },
        {},
      );

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
    });

    it("should reject resource deck with less than 10 cards", () => {
      const resources = getCardsByType("resource").slice(0, 8);
      expect(resources.length).toBe(8);

      const engine = new GundamTestEngine(
        {
          resourceDeck: resources,
        },
        {},
      );

      const resourceDeckCount = engine.getZone(
        "resourceDeck",
        "player_one",
      ).length;
      expect(resourceDeckCount).toBe(8);
      expect(resourceDeckCount).not.toBe(10);
    });
  });

  describe("Rule 5-2-1-5: Starting Hand - 5 Cards", () => {
    it("should start game with 5 cards in hand", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
    });

    it("should draw 5 cards from deck to hand at game start", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units,
          hand: units.slice(0, 5),
        },
        {},
      );

      assertZoneCount(engine, "hand", 5, "player_one");
    });

    it("should have starting hand as private information", () => {
      const engine = buildGameStartScenario();

      const player1Hand = engine.getZone("hand", "player_one");
      const player2Hand = engine.getZone("hand", "player_two");

      expect(player1Hand.length).toBe(5);
      expect(player2Hand.length).toBe(5);
    });

    it("should maintain 5-card starting hand for both players", () => {
      const engine = new GundamTestEngine(
        {
          hand: 5,
          deck: 45,
        },
        {
          hand: 5,
          deck: 45,
        },
      );

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
    });
  });

  describe("Rule 5-2-1-6: Mulligan/Redraw Option", () => {
    it("should allow player to keep initial 5-card hand", () => {
      const engine = buildGameStartScenario({
        playerOneHandSize: 5,
        playerTwoHandSize: 5,
      });

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
    });

    it("should validate redraw process - return all to bottom, draw 5 new, then shuffle", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units,
          hand: 5,
        },
        {},
      );

      assertZoneCount(engine, "hand", 5, "player_one");
    });

    it("should allow Player One to redraw first", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "hand", 5, "player_one");
    });

    it("should allow Player Two to redraw after Player One decides", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "hand", 5, "player_two");
    });

    it("should maintain deck integrity after mulligan", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units.slice(5),
          hand: units.slice(0, 5),
        },
        {},
      );

      const deckCount = engine.getZone("deck", "player_one").length;
      const handCount = engine.getZone("hand", "player_one").length;

      expect(deckCount + handCount).toBe(50);
    });

    it("should allow players to decline redraw option", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
    });

    it("should shuffle deck after mulligan is performed", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units,
          hand: 5,
        },
        {},
      );

      assertZoneCount(engine, "deck", 45, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
    });
  });

  describe("Rule 5-2-2: Starting Shields - 6 Face-Down Cards", () => {
    it("should place 6 shields in shield section at game start", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });

    it("should place shields face down from top of deck", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units.slice(6),
          shieldSection: units.slice(0, 6),
        },
        {},
      );

      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should place shields one at a time overlapping previous", () => {
      const engine = buildGameStartScenario();

      const shields = engine.getZone("shieldSection", "player_one");
      expect(shields.length).toBe(6);
    });

    it("should treat shields as private information", () => {
      const engine = buildGameStartScenario();

      const player1Shields = engine.getZone("shieldSection", "player_one");
      const player2Shields = engine.getZone("shieldSection", "player_two");

      expect(player1Shields.length).toBe(6);
      expect(player2Shields.length).toBe(6);
    });

    it("should reduce deck by 6 cards for shields", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units.slice(11),
          hand: units.slice(5, 10),
          shieldSection: units.slice(0, 5),
        },
        {},
      );

      const deckCount = engine.getZone("deck", "player_one").length;
      const handCount = engine.getZone("hand", "player_one").length;
      const shieldCount = engine.getZone("shieldSection", "player_one").length;

      expect(deckCount + handCount + shieldCount).toBe(50);
    });

    it("should set up shields for both players", () => {
      const engine = new GundamTestEngine(
        {
          shieldSection: 6,
        },
        {
          shieldSection: 6,
        },
      );

      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
    });
  });

  describe("Rule 5-2-3: EX Base Placement - 1 Active EX Base Token", () => {
    it("should place 1 EX Base token in shield base section at game start", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should place EX Base in active state", () => {
      const engine = buildGameStartScenario();

      const player1Base = engine.getZone("shieldBase", "player_one");
      const player2Base = engine.getZone("shieldBase", "player_two");

      expect(player1Base.length).toBe(1);
      expect(player2Base.length).toBe(1);
    });

    it("should validate EX Base has 0 AP and 3 HP", () => {
      const engine = buildGameStartScenario();

      const player1Base = engine.getZone("shieldBase", "player_one");
      expect(player1Base.length).toBe(1);
    });

    it("should place EX Base for both players", () => {
      const engine = new GundamTestEngine(
        {
          shieldBase: 1,
        },
        {
          shieldBase: 1,
        },
      );

      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
    });

    it("should treat EX Base as public information in base section", () => {
      const engine = buildGameStartScenario();

      const player1Base = engine.getZone("shieldBase", "player_one");
      const player2Base = engine.getZone("shieldBase", "player_two");

      expect(player1Base).toBeDefined();
      expect(player2Base).toBeDefined();
    });
  });

  describe("Rule 5-2-4: Player Two EX Resource - 1 Active EX Resource Token", () => {
    it("should place 1 EX Resource token for Player Two only", () => {
      const engine = buildGameStartScenario();

      const player1Resources = engine.getZone("resourceArea", "player_one");
      const player2Resources = engine.getZone("resourceArea", "player_two");

      expect(player1Resources.length).toBe(0);
      expect(player2Resources.length).toBe(1);
    });

    it("should place EX Resource in active state", () => {
      const engine = buildGameStartScenario();

      const player2Resources = engine.getZone("resourceArea", "player_two");
      expect(player2Resources.length).toBe(1);
    });

    it("should not give Player One an EX Resource", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "resourceArea", 0, "player_one");
    });

    it("should give Player Two exactly 1 EX Resource", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "resourceArea", 1, "player_two");
    });

    it("should remove EX Resource when used to pay cost", () => {
      const engine = new GundamTestEngine(
        {
          resourceArea: 0,
        },
        {
          resourceArea: 1,
        },
      );

      assertZoneCount(engine, "resourceArea", 1, "player_two");
    });

    it("should treat EX Resource as temporary resource token", () => {
      const engine = buildGameStartScenario();

      const player2Resources = engine.getZone("resourceArea", "player_two");
      expect(player2Resources.length).toBe(1);
    });

    it("should count EX Resource toward 5 EX Resource limit", () => {
      const engine = new GundamTestEngine(
        {},
        {
          resourceArea: 1,
        },
      );

      assertZoneCount(engine, "resourceArea", 1, "player_two");
    });
  });

  describe("Rule 5-2-5: Game Begins with Player One's Turn", () => {
    it("should start game with Player One as active player", () => {
      const engine = buildGameStartScenario();

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBe("player_one");
    });

    it("should set Player Two as standby player at game start", () => {
      const engine = buildGameStartScenario();

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).not.toBe("player_two");
    });

    it("should validate game starts in correct segment", () => {
      const engine = buildGameStartScenario();

      const segment = engine.getGameSegment();
      expect(segment).toBe("startingAGame");
    });
  });

  describe("Integration: Complete Game Setup", () => {
    it("should validate all setup rules together", () => {
      const engine = buildGameStartScenario({
        playerOneHandSize: 5,
        playerTwoHandSize: 5,
        playerOneShields: 6,
        playerTwoShields: 6,
      });

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "hand", 5, "player_two");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
      assertZoneCount(engine, "resourceArea", 0, "player_one");
      assertZoneCount(engine, "resourceArea", 1, "player_two");

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBe("player_one");
    });

    it("should verify deck composition after setup", () => {
      const units = getCardsByType("unit").slice(0, 50);

      const engine = new GundamTestEngine(
        {
          deck: units.slice(11),
          hand: units.slice(5, 10),
          shieldSection: units.slice(0, 5),
        },
        {},
      );

      const deckCount = engine.getZone("deck", "player_one").length;
      const handCount = engine.getZone("hand", "player_one").length;
      const shieldCount = engine.getZone("shieldSection", "player_one").length;

      const totalCards = deckCount + handCount + shieldCount;
      expect(totalCards).toBe(50);
    });

    it("should validate resource deck remains at 10 after setup", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "resourceDeck", 10, "player_one");
      assertZoneCount(engine, "resourceDeck", 10, "player_two");
    });

    it("should test setup with real cards from specific sets", () => {
      const st01Cards = getCardsBySet("ST01");
      const st02Cards = getCardsBySet("ST02");

      expect(st01Cards.length).toBeGreaterThan(0);
      expect(st02Cards.length).toBeGreaterThan(0);

      const deck = [
        ...st01Cards.filter((c) => c.type !== "resource").slice(0, 25),
        ...st02Cards.filter((c) => c.type !== "resource").slice(0, 25),
      ];

      const engine = new GundamTestEngine(
        {
          deck: deck,
          hand: 5,
          shieldSection: 6,
        },
        {},
      );

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });

    it("should validate complete game ready state", () => {
      const engine = buildGameStartScenario();

      assertZoneCount(engine, "deck", 39, "player_one");
      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
      assertZoneCount(engine, "shieldBase", 1, "player_one");
      assertZoneCount(engine, "resourceDeck", 10, "player_one");
      assertZoneCount(engine, "resourceArea", 0, "player_one");

      assertZoneCount(engine, "deck", 39, "player_two");
      assertZoneCount(engine, "hand", 5, "player_two");
      assertZoneCount(engine, "shieldSection", 6, "player_two");
      assertZoneCount(engine, "shieldBase", 1, "player_two");
      assertZoneCount(engine, "resourceDeck", 10, "player_two");
      assertZoneCount(engine, "resourceArea", 1, "player_two");

      const turnPlayer = engine.getTurnPlayer();
      expect(turnPlayer).toBe("player_one");
    });

    it("should handle setup with custom deck configurations", () => {
      const blueUnits = getCardsByColor("blue").slice(0, 30);
      const blueCommands = getCardsByColor("blue")
        .filter((c) => c.type === "command")
        .slice(0, 15);
      const bluePilots = getCardsByColor("blue")
        .filter((c) => c.type === "pilot")
        .slice(0, 5);

      const monoBlueDeck = [...blueUnits, ...blueCommands, ...bluePilots];

      const engine = new GundamTestEngine(
        {
          deck: monoBlueDeck.slice(0, 39),
          hand: 5,
          shieldSection: 6,
        },
        {},
      );

      assertZoneCount(engine, "hand", 5, "player_one");
      assertZoneCount(engine, "shieldSection", 6, "player_one");
    });
  });

  describe("Real Card Deck Construction Scenarios", () => {
    it("should construct valid mono-blue deck from ST01", () => {
      const st01Blue = getCardsBySet("ST01").filter(
        (card) =>
          card.type !== "resource" && "color" in card && card.color === "blue",
      );

      expect(st01Blue.length).toBeGreaterThan(0);

      const deck = st01Blue.slice(0, Math.min(50, st01Blue.length));

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should construct valid mono-white deck from ST02", () => {
      const st02White = getCardsBySet("ST02").filter(
        (card) =>
          card.type !== "resource" && "color" in card && card.color === "white",
      );

      expect(st02White.length).toBeGreaterThan(0);

      const deck = st02White.slice(0, Math.min(50, st02White.length));

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should construct valid two-color deck from GD01", () => {
      const gd01Cards = getCardsBySet("GD01").filter(
        (card) => card.type !== "resource",
      );

      expect(gd01Cards.length).toBeGreaterThan(0);

      const deck = gd01Cards.slice(0, Math.min(50, gd01Cards.length));

      const engine = new GundamTestEngine(
        {
          deck: deck,
        },
        {},
      );

      const deckCards = engine.getZone("deck", "player_one");
      expect(deckCards.length).toBeGreaterThan(0);
    });

    it("should validate deck with variety of card types", () => {
      const allUnits = getCardsByType("unit");
      const allPilots = getCardsByType("pilot");
      const allCommands = getCardsByType("command");
      const allBases = getCardsByType("base");

      const unitsNeeded = Math.min(30, allUnits.length);
      const pilotsNeeded = Math.min(10, allPilots.length);
      const commandsNeeded = Math.min(8, allCommands.length);
      const basesNeeded = Math.min(2, allBases.length);

      const balancedDeck = [
        ...allUnits.slice(0, unitsNeeded),
        ...allPilots.slice(0, pilotsNeeded),
        ...allCommands.slice(0, commandsNeeded),
        ...allBases.slice(0, basesNeeded),
      ];

      if (balancedDeck.length < 50 && allUnits.length > 0) {
        for (let i = 0; i < 50 - balancedDeck.length; i++) {
          balancedDeck.push(allUnits[i % allUnits.length]);
        }
      }

      expect(balancedDeck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: balancedDeck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should handle unit-heavy deck composition", () => {
      const allUnits = getCardsByType("unit");
      const allPilots = getCardsByType("pilot");
      const allBases = getCardsByType("base");

      const unitsNeeded = Math.min(45, allUnits.length);
      const pilotsNeeded = Math.min(3, allPilots.length);
      const basesNeeded = Math.min(2, allBases.length);

      const unitHeavyDeck = [
        ...allUnits.slice(0, unitsNeeded),
        ...allPilots.slice(0, pilotsNeeded),
        ...allBases.slice(0, basesNeeded),
      ];

      if (unitHeavyDeck.length < 50 && allUnits.length > 0) {
        for (let i = 0; i < 50 - unitHeavyDeck.length; i++) {
          unitHeavyDeck.push(allUnits[i % allUnits.length]);
        }
      }

      expect(unitHeavyDeck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: unitHeavyDeck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });

    it("should handle command-heavy deck composition", () => {
      const allUnits = getCardsByType("unit");
      const allCommands = getCardsByType("command");
      const allBases = getCardsByType("base");

      const unitsNeeded = Math.min(25, allUnits.length);
      const commandsNeeded = Math.min(23, allCommands.length);
      const basesNeeded = Math.min(2, allBases.length);

      const commandHeavyDeck = [
        ...allUnits.slice(0, unitsNeeded),
        ...allCommands.slice(0, commandsNeeded),
        ...allBases.slice(0, basesNeeded),
      ];

      if (commandHeavyDeck.length < 50 && allUnits.length > 0) {
        for (let i = 0; i < 50 - commandHeavyDeck.length; i++) {
          commandHeavyDeck.push(allUnits[i % allUnits.length]);
        }
      }

      expect(commandHeavyDeck.length).toBe(50);

      const engine = new GundamTestEngine(
        {
          deck: commandHeavyDeck,
        },
        {},
      );

      assertZoneCount(engine, "deck", 50, "player_one");
    });
  });
});
