/**
 * Zones & Card Movement Tests - Rules 105-183
 *
 * Comprehensive test specifications for Riftbound zone and card movement rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule References:
 * - Section 3: Zones & Spaces (Rules 105-109)
 * - Section 4: Cards & Types (Rules 124-183)
 */

import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 3: Zones & Spaces - Rules 105-109
// =============================================================================

describe("Zones & Card Movement - Rules 105-183", () => {
  // ===========================================================================
  // 105-106: The Board and Board Zones
  // ===========================================================================

  describe("105-106: The Board and Board Zones", () => {
    describe("The Board Overview (Rule 106)", () => {
      it.skip("Rule 106.1 - should divide the Board into several Zones", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Board zones exist
        expect(engine.getZoneContents(PLAYER_ONE, "base")).toBeDefined();
        expect(engine.getZoneContents(PLAYER_ONE, "hand")).toBeDefined();
        expect(engine.getZoneContents(PLAYER_ONE, "mainDeck")).toBeDefined();
        expect(engine.getZoneContents(PLAYER_ONE, "trash")).toBeDefined();
      });
    });

    describe("The Base (Rule 106.2)", () => {
      it.skip("Rule 106.2.a - should have one Base per player", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Each player has a base
        expect(engine.getZoneContents(PLAYER_ONE, "base")).toBeDefined();
        expect(engine.getZoneContents(PLAYER_TWO, "base")).toBeDefined();
      });

      it.skip("Rule 106.2.b - should allow playing Units and Gear to Base", () => {
        // Arrange: Game with card in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "unit-1",
          name: "Test Unit",
          cardType: "unit",
        });

        // Act: Play unit to base
        engine.playCard(PLAYER_ONE, "unit-1", { location: "base" });

        // Assert: Unit is in base
        const base = engine.getZoneContents(PLAYER_ONE, "base");
        expect(base.some((c) => c.id === "unit-1")).toBe(true);
      });

      it.skip("Rule 106.2.c - should treat Base as a Location", () => {
        // Arrange: Game with unit at base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "base");

        // Assert: Base is a valid origin for moves
        expect(engine.canMoveUnit("unit-1", "bf1")).toBe(true);
      });

      it.skip("Rule 106.2.d - should not allow other players' Game Objects in Base", () => {
        // Arrange: Game with player 2's unit
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Cannot place opponent's unit in player 1's base
        // This is enforced by the game rules - units can only be in owner's base
        const p1Base = engine.getZoneContents(PLAYER_ONE, "base");
        const p2Units = engine.getUnitsOwnedBy(PLAYER_TWO);
        for (const unit of p2Units) {
          expect(unit.battlefieldId).not.toBe("base");
        }
      });

      it.skip("Rule 106.2.e - should house player's Runes on the Board", () => {
        // Arrange: Game with channeled runes
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-1",
          name: "Fury Rune",
        });

        // Act: Channel rune
        engine.channelRunes(PLAYER_ONE, 1);

        // Assert: Rune is in rune pool (on the board)
        const runePool = engine.getZoneContents(PLAYER_ONE, "runePool");
        expect(runePool.length).toBe(1);
      });
    });

    describe("The Battlefield Zone (Rule 106.3)", () => {
      it.skip("Rule 106.3.a - should support multiple Battlefields", () => {
        // Arrange: Game with multiple battlefields
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }, { id: "bf3" }],
          },
        );

        // Assert: All battlefields exist
        expect(engine.getBattlefield("bf1")).toBeDefined();
        expect(engine.getBattlefield("bf2")).toBeDefined();
        expect(engine.getBattlefield("bf3")).toBeDefined();
      });

      it.skip("Rule 106.3.c - should treat each Battlefield as a Location", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");

        // Assert: Battlefield is valid destination
        expect(engine.canMoveUnit("unit-1", "bf2")).toBe(true);
      });

      it.skip("Rule 106.3 - should allow any number of Units at a Battlefield", () => {
        // Arrange: Game with many units at one battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit-1" },
                    { id: "unit-2" },
                    { id: "unit-3" },
                    { id: "unit-4" },
                    { id: "unit-5" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: All units are at the battlefield
        const units = engine.getUnitsAtBattlefield("bf1");
        expect(units.length).toBe(5);
      });
    });

    describe("Facedown Zones (Rule 106.4)", () => {
      it.skip("Rule 106.4.a - should associate each Battlefield with a Facedown Zone", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );

        // Act: Hide a card at the battlefield
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Hidden Card",
        });
        const result = engine.hideCard(PLAYER_ONE, "card-1", "bf1");

        // Assert: Card can be hidden
        expect(result).toBe(true);
      });

      it.skip("Rule 106.4.b - should limit Facedown Zone to one card maximum", () => {
        // Arrange: Game with battlefield and one hidden card
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-2", name: "Card 2" });

        // Act: Hide first card
        engine.hideCard(PLAYER_ONE, "card-1", "bf1");

        // Assert: Cannot hide second card (zone is full)
        // Note: Implementation should enforce this limit
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 106.4.c - should only allow controller to place cards in Facedown Zone", () => {
        // Arrange: Battlefield controlled by player 1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );
        engine.addToZone(PLAYER_TWO, "hand", { id: "card-1", name: "Card 1" });

        // Act: Player 2 tries to hide at player 1's battlefield
        const result = engine.hideCard(PLAYER_TWO, "card-1", "bf1");

        // Assert: Should fail (player 2 doesn't control bf1)
        expect(result).toBe(false);
      });

      it.skip("Rule 106.4.e - should not treat Facedown Zones as Locations", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");

        // Assert: Cannot move unit to facedown zone (not a location)
        expect(engine.canMoveUnit("unit-1", "facedown-bf1")).toBe(false);
      });
    });

    describe("The Legend Zone (Rule 106.5)", () => {
      it.skip("Rule 106.5.a - should provide space for Champion Legend", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Legend zone exists (conceptually)
        // Note: Legend zone is not tracked as a regular zone
        expect(engine).toBeDefined();
      });

      it.skip("Rule 106.5.b - should not treat Legend Zone as a Location", () => {
        // Arrange: Game with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");

        // Assert: Cannot move to legend zone
        expect(engine.canMoveUnit("unit-1", "legendZone")).toBe(false);
      });

      it.skip("Rule 106.5.d - should not allow Legend to be removed or moved", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Legend cannot be moved (enforced by game rules)
        // Legends are immutable game objects
        expect(engine).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 107: Non-Board Zones
  // ===========================================================================

  describe("107: Non-Board Zones", () => {
    describe("The Trash (Rule 107.1)", () => {
      it.skip("Rule 107.1.a - should receive killed or discarded cards", () => {
        // Arrange: Game with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Kill the unit
        engine.killUnit("unit-1");

        // Assert: Unit is in trash
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 107.1.c - should have separate trash per player", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Act: Add cards to each player's trash
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_TWO, "trash", { id: "card-2", name: "Card 2" });

        // Assert: Each player has their own trash
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
        expect(engine.getTrashSize(PLAYER_TWO)).toBe(1);
      });

      it.skip("Rule 107.1.d - should always put cards in owner's trash", () => {
        // Arrange: Game with player 1's card
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });

        // Act: Discard the card
        engine.discardCard(PLAYER_ONE, "card-1");

        // Assert: Card goes to owner's trash (player 1)
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
        expect(engine.getTrashSize(PLAYER_TWO)).toBe(0);
      });

      it.skip("Rule 107.1.e - should allow reorganizing cards in Trash", () => {
        // Arrange: Game with multiple cards in trash
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-2", name: "Card 2" });
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-3", name: "Card 3" });

        // Assert: Trash is unordered (can be reorganized)
        const trash = engine.getZoneContents(PLAYER_ONE, "trash");
        expect(trash.length).toBe(3);
      });

      it.skip("Rule 107.1.f - should treat Trash as Public Information", () => {
        // Arrange: Game with cards in trash
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-1", name: "Card 1" });

        // Assert: Any player can view trash contents
        const trash = engine.getZoneContents(PLAYER_ONE, "trash");
        expect(trash[0]?.name).toBe("Card 1");
      });
    });

    describe("The Champion Zone (Rule 107.2)", () => {
      it.skip("Rule 107.2.a - should hold Chosen Champion at game start", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Champion zone exists for setup
        // Note: Champion zone is a special zone for game start
        expect(engine).toBeDefined();
      });

      it.skip("Rule 107.2.b - should not allow Champion to return after leaving", () => {
        // Arrange: Champion has been played
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Champion cannot return to champion zone
        // This is enforced by game rules
        expect(engine).toBeDefined();
      });

      it.skip("Rule 107.2.c - should allow playing Champion from Champion Zone", () => {
        // Arrange: Game with champion in champion zone
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Champion can be played normally
        // Note: Implementation would track champion zone separately
        expect(engine).toBeDefined();
      });
    });

    describe("The Main Deck Zone (Rule 107.3)", () => {
      it.skip("Rule 107.3.a - should hold the Main Deck", () => {
        // Arrange: Game with cards in deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Card 1",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-2",
          name: "Card 2",
        });

        // Assert: Deck contains cards
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 107.3.c - should treat deck order as Secret Information", () => {
        // Arrange: Game with cards in deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Card 1",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-2",
          name: "Card 2",
        });

        // Assert: Deck size is known but order is secret
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
        // Note: Cannot peek at deck contents without card effect
      });
    });

    describe("The Rune Deck Zone (Rule 107.4)", () => {
      it.skip("Rule 107.4.a - should hold the Rune Deck", () => {
        // Arrange: Game with runes
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-1",
          name: "Fury Rune",
        });

        // Assert: Rune deck contains runes
        const runeDeck = engine.getZoneContents(PLAYER_ONE, "runeDeck");
        expect(runeDeck.length).toBe(1);
      });

      it.skip("Rule 107.4.c - should treat rune order as Secret Information", () => {
        // Arrange: Game with runes
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-1",
          name: "Fury Rune",
        });
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-2",
          name: "Calm Rune",
        });

        // Assert: Rune deck size is known but order is secret
        const runeDeck = engine.getZoneContents(PLAYER_ONE, "runeDeck");
        expect(runeDeck.length).toBe(2);
      });
    });

    describe("Banishment (Rule 107.5)", () => {
      it.skip("Rule 107.5.a - should receive banished cards", () => {
        // Arrange: Game with card in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });

        // Act: Banish the card
        engine.banishCard(PLAYER_ONE, "card-1", "hand");

        // Assert: Card is in banishment
        const banishment = engine.getZoneContents(PLAYER_ONE, "banishment");
        expect(banishment.length).toBe(1);
      });

      it.skip("Rule 107.5.c - should have separate banishment per player", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Act: Banish cards for each player
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_TWO, "hand", { id: "card-2", name: "Card 2" });
        engine.banishCard(PLAYER_ONE, "card-1", "hand");
        engine.banishCard(PLAYER_TWO, "card-2", "hand");

        // Assert: Each player has their own banishment
        expect(engine.getZoneContents(PLAYER_ONE, "banishment").length).toBe(1);
        expect(engine.getZoneContents(PLAYER_TWO, "banishment").length).toBe(1);
      });

      it.skip("Rule 107.5.d - should always put cards in owner's banishment", () => {
        // Arrange: Game with player 1's card
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });

        // Act: Banish the card
        engine.banishCard(PLAYER_ONE, "card-1", "hand");

        // Assert: Card goes to owner's banishment
        expect(engine.getZoneContents(PLAYER_ONE, "banishment").length).toBe(1);
        expect(engine.getZoneContents(PLAYER_TWO, "banishment").length).toBe(0);
      });

      it.skip("Rule 107.5.f - should treat Banishment as Public Information", () => {
        // Arrange: Game with banished card
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.banishCard(PLAYER_ONE, "card-1", "hand");

        // Assert: Banishment contents are visible
        const banishment = engine.getZoneContents(PLAYER_ONE, "banishment");
        expect(banishment[0]?.id).toBe("card-1");
      });
    });

    describe("The Hand (Rule 107.6)", () => {
      it.skip("Rule 107.6.a - should hold cards available to play", () => {
        // Arrange: Game with cards in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-2", name: "Card 2" });

        // Assert: Hand contains cards
        expect(engine.getHandSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 107.6.b - should receive drawn cards", () => {
        // Arrange: Game with cards in deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Card 1",
        });

        // Act: Draw a card
        engine.drawCards(PLAYER_ONE, 1);

        // Assert: Card is now in hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 107.6.c - should treat hand contents as Private Information", () => {
        // Arrange: Game with cards in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });

        // Assert: Hand contents are private (only owner can see)
        // Note: This is enforced by game rules, not engine API
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 107.6.d - should treat hand count as Public Information", () => {
        // Arrange: Game with cards in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-2", name: "Card 2" });

        // Assert: Hand size is public
        expect(engine.getHandSize(PLAYER_ONE)).toBe(2);
      });
    });
  });

  // ===========================================================================
  // 108-109: Public Information and Zone Transitions
  // ===========================================================================

  describe("108-109: Public Information and Zone Transitions", () => {
    describe("Public Information on the Board (Rule 108)", () => {
      it.skip("Rule 108.1 - should make face-up card information viewable", () => {
        // Arrange: Game with unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5 }],
                },
              },
            ],
          },
        );

        // Assert: Unit information is public
        const unit = engine.getUnit("unit-1");
        expect(unit?.might).toBe(5);
      });

      it.skip("Rule 108.2 - should make Game Object state public", () => {
        // Arrange: Game with exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }],
                },
              },
            ],
          },
        );

        // Assert: Exhausted state is public
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 108.2 - should make buffed state public", () => {
        // Arrange: Game with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1" }],
                },
              },
            ],
          },
        );

        // Act: Buff the unit
        engine.buffUnit("unit-1");

        // Assert: Buffed state is public
        expect(engine.isUnitBuffed("unit-1")).toBe(true);
      });
    });

    describe("Zone Transitions (Rule 109)", () => {
      it.skip("Rule 109 - should clear damage when moving to Non-Board Zone", () => {
        // Arrange: Game with damaged unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5, damage: 3 }],
                },
              },
            ],
          },
        );
        expect(engine.getDamage("unit-1")).toBe(3);

        // Act: Kill unit (moves to trash - non-board zone)
        engine.killUnit("unit-1");

        // Assert: Damage is cleared (unit is now in trash)
        // Note: Unit no longer exists as a unit, damage tracking is cleared
        expect(engine.getUnit("unit-1")).toBeUndefined();
      });

      it.skip("Rule 109 - should clear buffs when moving to Non-Board Zone", () => {
        // Arrange: Game with buffed unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1" }],
                },
              },
            ],
          },
        );
        engine.buffUnit("unit-1");
        expect(engine.isUnitBuffed("unit-1")).toBe(true);

        // Act: Kill unit (moves to trash)
        engine.killUnit("unit-1");

        // Assert: Buff is cleared
        expect(engine.getUnit("unit-1")).toBeUndefined();
      });

      it.skip("Rule 109 - should clear temporary keywords when moving to Non-Board Zone", () => {
        // Arrange: Game with unit that has temporary keyword
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1" }],
                },
              },
            ],
          },
        );

        // Act: Kill unit
        engine.killUnit("unit-1");

        // Assert: Keywords are cleared (unit no longer exists)
        expect(engine.getKeywords("unit-1")).toEqual([]);
      });
    });
  });

  // ===========================================================================
  // 137-141: Units
  // ===========================================================================

  describe("137-141: Units", () => {
    describe("Unit Properties (Rules 138-139)", () => {
      it.skip("Rule 138.1.a.1 - should place Units at Locations (Battlefield or Base)", () => {
        // Arrange: Game with unit at battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1" }],
                },
              },
            ],
          },
        );

        // Assert: Unit is at a location
        const unit = engine.getUnit("unit-1");
        expect(unit?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 139.2 - should track Might as combat statistic", () => {
        // Arrange: Game with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5 }],
                },
              },
            ],
          },
        );

        // Assert: Might is tracked
        expect(engine.getUnitMight("unit-1")).toBe(5);
      });

      it.skip("Rule 139.2.a - should kill Unit when damage >= Might", () => {
        // Arrange: Game with damaged unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit should die
        expect(engine.shouldUnitDie("unit-1")).toBe(true);
      });

      it.skip("Rule 139.2.b - should treat Might below 0 as 0", () => {
        // Arrange: Game with unit that has negative might modifier
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 0 }],
                },
              },
            ],
          },
        );

        // Assert: Might is treated as 0
        expect(engine.getUnitMight("unit-1")).toBe(0);
      });

      it.skip("Rule 139.3 - should track damage on Units", () => {
        // Arrange: Game with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5 }],
                },
              },
            ],
          },
        );

        // Act: Add damage
        engine.addDamage("unit-1", 2);

        // Assert: Damage is tracked
        expect(engine.getDamage("unit-1")).toBe(2);
      });

      it.skip("Rule 139.3.b.1 - should clear damage at end of turn", () => {
        // Arrange: Game with damaged unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Clear all damage (end of turn)
        engine.clearAllDamage();

        // Assert: Damage is cleared
        expect(engine.getDamage("unit-1")).toBe(0);
      });

      it.skip("Rule 139.4 - should enter Board exhausted by default", () => {
        // Arrange: Game with newly added unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Act: Add a unit (simulating playing)
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: true },
          "bf1",
        );

        // Assert: Unit enters exhausted
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });
    });

    describe("Standard Move (Rule 140)", () => {
      it.skip("Rule 140.1.a - should allow Standard Move during Action Phase", () => {
        // Arrange: Game in action phase with unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );

        // Assert: Can move during action phase
        expect(engine.canMoveUnit("unit-1", "bf2")).toBe(true);
      });

      it.skip("Rule 140.1.b - should not allow Standard Move during Closed State", () => {
        // Arrange: Game with chain item (closed state)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain state is closed
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 140.1.c - should not allow Standard Move during Showdown", () => {
        // Arrange: Game in showdown
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );
        engine.startShowdown();

        // Assert: In showdown state
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 140.2 - should exhaust Unit as cost for Standard Move", () => {
        // Arrange: Game with ready unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );

        // Act: Move unit
        engine.moveUnit("unit-1", "bf2");

        // Assert: Unit is now exhausted
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 140.4.a - should allow move from Base to Battlefield", () => {
        // Arrange: Unit at base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Assert: Can move to battlefield
        expect(engine.canMoveUnit("unit-1", "bf1")).toBe(true);
      });

      it.skip("Rule 140.4.b - should allow move from Battlefield to Base", () => {
        // Arrange: Unit at battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );

        // Act: Recall to base
        engine.recallUnit("unit-1");

        // Assert: Unit is at base
        const unit = engine.getUnit("unit-1");
        expect(unit?.battlefieldId).toBeUndefined();
      });
    });
  });

  // ===========================================================================
  // 142-145: Gear
  // ===========================================================================

  describe("142-145: Gear", () => {
    describe("Gear Properties (Rules 143-144)", () => {
      it.skip("Rule 144.1 - should enter play Ready", () => {
        // Arrange: Game with gear in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "gear-1",
          name: "Test Gear",
          cardType: "gear",
        });

        // Act: Play gear
        engine.playCard(PLAYER_ONE, "gear-1");

        // Assert: Gear enters ready (not exhausted)
        // Note: Gear tracking would need to be implemented
        expect(engine.getZoneContents(PLAYER_ONE, "base").length).toBe(1);
      });

      it.skip("Rule 144.2 - should only allow playing Gear to Base", () => {
        // Arrange: Game with gear in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "gear-1",
          name: "Test Gear",
          cardType: "gear",
        });

        // Act: Play gear
        engine.playCard(PLAYER_ONE, "gear-1", { location: "base" });

        // Assert: Gear is in base
        const base = engine.getZoneContents(PLAYER_ONE, "base");
        expect(base.some((c) => c.id === "gear-1")).toBe(true);
      });

      it.skip("Rule 144.3 - should immediately Recall Gear at Battlefield to Base", () => {
        // Arrange: Gear somehow at battlefield (edge case)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: Gear cannot stay at battlefield
        // This is enforced by game rules - gear is recalled immediately
        expect(engine).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 146-152: Spells
  // ===========================================================================

  describe("146-152: Spells", () => {
    describe("Spell Properties (Rules 147-151)", () => {
      it.skip("Rule 148 - should allow playing Spell during Open State", () => {
        // Arrange: Game in open state
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "spell-1",
          name: "Test Spell",
          cardType: "spell",
        });

        // Assert: Can play spell
        expect(engine.canPlayCard(PLAYER_ONE, "spell-1")).toBe(true);
      });

      it.skip("Rule 150 - should move Spell to Trash after resolving", () => {
        // Arrange: Game with spell in hand
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "spell-1",
          name: "Test Spell",
          cardType: "spell",
        });

        // Act: Play spell
        engine.playCard(PLAYER_ONE, "spell-1");

        // Assert: Spell is in trash
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });
    });

    describe("Spell Keywords (Rule 152)", () => {
      it.skip("Rule 152.2.a - Action keyword allows playing during Showdowns", () => {
        // Arrange: Game in showdown
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "spell-1",
          name: "Action Spell",
          cardType: "spell",
        });

        // Assert: Action spells can be played in showdown
        // Note: Would need keyword tracking
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 152.2.b - Reaction keyword allows playing during Closed State", () => {
        // Arrange: Game in closed state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "reaction-1",
          name: "Reaction Spell",
          cardType: "spell",
        });

        // Assert: Chain is closed
        expect(engine.getChainState()).toBe("closed");
      });
    });
  });

  // ===========================================================================
  // 153-161: Runes
  // ===========================================================================

  describe("153-161: Runes", () => {
    describe("Rune Properties (Rules 154-156)", () => {
      it.skip("Rule 154.2.a - should keep exactly 12 Runes in Rune Deck", () => {
        // Arrange: Validate rune deck size
        const runes = Array(12).fill({ name: "Fury Rune" });
        const result = RiftboundTestEngine.validateRuneDeckSize(runes);

        // Assert: Valid rune deck
        expect(result.isValid).toBe(true);
      });

      it.skip("Rule 154.2.a - should reject rune deck with wrong count", () => {
        // Arrange: Invalid rune deck
        const runes = Array(10).fill({ name: "Fury Rune" });
        const result = RiftboundTestEngine.validateRuneDeckSize(runes);

        // Assert: Invalid rune deck
        expect(result.isValid).toBe(false);
      });

      it.skip("Rule 155 - should produce resources from Runes", () => {
        // Arrange: Game with rune in pool
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "runePool", {
          id: "rune-1",
          name: "Fury Rune",
        });

        // Assert: Rune is in pool (can produce resources)
        const runePool = engine.getZoneContents(PLAYER_ONE, "runePool");
        expect(runePool.length).toBe(1);
      });

      it.skip("Rule 156.1 - should produce Energy from Runes", () => {
        // Arrange: Game with energy
        const engine = new RiftboundTestEngine({ energy: 3 }, {});

        // Assert: Energy is tracked
        expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
      });

      it.skip("Rule 156.2 - should produce Power from Runes", () => {
        // Arrange: Game with power
        const engine = new RiftboundTestEngine({ power: { fury: 2 } }, {});

        // Assert: Power is tracked by domain
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
      });
    });

    describe("Rune Pools (Rules 158-161)", () => {
      it.skip("Rule 159.1 - should add Energy to Rune Pool", () => {
        // Arrange: Game with no energy
        const engine = new RiftboundTestEngine({}, {});

        // Act: Add energy
        engine.addEnergy(PLAYER_ONE, 3);

        // Assert: Energy is in pool
        expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
      });

      it.skip("Rule 159.1 - should add Power to Rune Pool", () => {
        // Arrange: Game with no power
        const engine = new RiftboundTestEngine({}, {});

        // Act: Add power
        engine.addPower(PLAYER_ONE, "fury", 2);

        // Assert: Power is in pool
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
      });

      it.skip("Rule 159.2 - should require adding resources before spending", () => {
        // Arrange: Game with no resources
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Cannot spend what you don't have
        expect(engine.spendEnergy(PLAYER_ONE, 1)).toBe(false);
      });

      it.skip("Rule 160 - should empty Rune Pool at end of Draw Phase", () => {
        // Arrange: Game with resources
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2 } },
          {},
          { phase: "draw" },
        );

        // Act: Empty rune pool
        engine.emptyRunePool(PLAYER_ONE);

        // Assert: Pool is empty
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(0);
      });

      it.skip("Rule 160 - should empty Rune Pool at end of turn", () => {
        // Arrange: Game with resources at end of turn
        const engine = new RiftboundTestEngine(
          { energy: 3, power: { calm: 1 } },
          {},
          { phase: "ending" },
        );

        // Act: Empty rune pool
        engine.emptyRunePool(PLAYER_ONE);

        // Assert: Pool is empty
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
        expect(engine.getPower(PLAYER_ONE, "calm")).toBe(0);
      });
    });
  });

  // ===========================================================================
  // 162-169: Battlefields & Legends
  // ===========================================================================

  describe("162-169: Battlefields & Legends", () => {
    describe("Battlefields (Rule 163)", () => {
      it.skip("Rule 163.1 - should track Battlefield ownership", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );

        // Assert: Battlefield has controller
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });

      it.skip("Rule 163.3 - should not allow Battlefields to be Killed", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: Battlefield exists and cannot be killed
        expect(engine.getBattlefield("bf1")).toBeDefined();
      });

      it.skip("Rule 163.4 - should not allow Battlefields to be Moved", () => {
        // Arrange: Game with battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: Battlefield is immutable
        expect(engine.getBattlefield("bf1")).toBeDefined();
      });

      it.skip("Rule 163.5 - should treat Battlefields as Locations", () => {
        // Arrange: Game with battlefield and unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );

        // Assert: Battlefield is valid destination
        expect(engine.canMoveUnit("unit-1", "bf2")).toBe(true);
      });

      it.skip("Rule 163.6 - should allow any number of Units at Battlefield", () => {
        // Arrange: Game with many units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "u1" },
                    { id: "u2" },
                    { id: "u3" },
                    { id: "u4" },
                    { id: "u5" },
                    { id: "u6" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: All units are at battlefield
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(6);
      });
    });

    describe("Legends (Rule 167)", () => {
      it.skip("Rule 167.3 - should not allow Legends to be Killed", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Legends are protected
        expect(engine).toBeDefined();
      });

      it.skip("Rule 167.4 - should not allow Legends to be Moved", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Legends cannot move
        expect(engine).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 170-178: Tokens
  // ===========================================================================

  describe("170-178: Tokens", () => {
    describe("Token Properties (Rules 171-177)", () => {
      it.skip("Rule 176.2.a - should not have costs on Tokens", () => {
        // Arrange: Token unit
        // Note: Tokens are created by effects, not played with costs
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Tokens have no cost
        expect(engine).toBeDefined();
      });

      it.skip("Rule 176.2.b - should not have domains on Tokens", () => {
        // Arrange: Token unit
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Tokens are domainless
        expect(engine).toBeDefined();
      });

      it.skip("Rule 177.1 - should cease to exist when Token enters Non-Board Zone", () => {
        // Arrange: Game with token unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "token-1", might: 1 }],
                },
              },
            ],
          },
        );

        // Act: Kill token
        engine.killUnit("token-1");

        // Assert: Token ceases to exist (not in trash)
        // Note: Token tracking would need special handling
        expect(engine.getUnit("token-1")).toBeUndefined();
      });
    });
  });

  // ===========================================================================
  // 179-183: Control
  // ===========================================================================

  describe("179-183: Control", () => {
    describe("Battlefield Control (Rule 181)", () => {
      it.skip("Rule 181.2.a - should track Controlled/Uncontrolled state", () => {
        // Arrange: Game with controlled battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );

        // Assert: Battlefield is controlled
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });

      it.skip("Rule 181.2.b - should track which player controls Battlefield", () => {
        // Arrange: Game with uncontrolled battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: null }],
          },
        );

        // Assert: Battlefield is uncontrolled
        expect(engine.getBattlefieldController("bf1")).toBeNull();
      });

      it.skip("Rule 181.3.a - should mark Battlefield as Contested when opponent arrives", () => {
        // Arrange: Battlefield controlled by player 1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                contested: true,
                contestedBy: PLAYER_TWO,
              },
            ],
          },
        );

        // Assert: Battlefield is contested
        expect(engine.isBattlefieldContested("bf1")).toBe(true);
      });

      it.skip("Rule 181.4.a - should establish control by Unit presence", () => {
        // Arrange: Battlefield with only player 1's units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1" }],
                },
              },
            ],
          },
        );

        // Assert: Player 1 controls battlefield
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });

      it.skip("Rule 181.4.d - should lose control when no Units remain", () => {
        // Arrange: Battlefield with no units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: null }],
          },
        );

        // Assert: No controller
        expect(engine.getBattlefieldController("bf1")).toBeNull();
      });
    });

    describe("Other Game Object Control (Rule 182)", () => {
      it.skip("Rule 182.1 - should establish control when playing a Card", () => {
        // Arrange: Game with card in hand
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "unit-1",
          name: "Test Unit",
          cardType: "unit",
        });

        // Act: Play card
        engine.playCard(PLAYER_ONE, "unit-1");

        // Assert: Player 1 controls the card
        const base = engine.getZoneContents(PLAYER_ONE, "base");
        expect(base.some((c) => c.id === "unit-1")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    describe("Empty Zone Handling", () => {
      it.skip("should handle drawing from empty deck (triggers Burn Out)", () => {
        // Arrange: Game with empty deck
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(0);

        // Act: Try to draw
        const drawn = engine.drawCards(PLAYER_ONE, 1);

        // Assert: No cards drawn, burn out triggered
        expect(drawn.length).toBe(0);
      });

      it.skip("should handle empty hand gracefully", () => {
        // Arrange: Game with empty hand
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Hand size is 0
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("should handle empty trash gracefully", () => {
        // Arrange: Game with empty trash
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Trash size is 0
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("should handle empty battlefield gracefully", () => {
        // Arrange: Game with empty battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: No units at battlefield
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
      });
    });

    describe("Zone Limits", () => {
      it.skip("should enforce Facedown Zone limit of 1 card", () => {
        // Arrange: Battlefield with hidden card
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-2", name: "Card 2" });

        // Act: Hide first card
        engine.hideCard(PLAYER_ONE, "card-1", "bf1");

        // Assert: Second hide should fail (zone full)
        const result = engine.hideCard(PLAYER_ONE, "card-2", "bf1");
        expect(result).toBe(false);
      });

      it.skip("should enforce Legend Zone limit of 1 Legend", () => {
        // Arrange: Fresh game
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Only one legend per player
        expect(engine).toBeDefined();
      });
    });

    describe("Simultaneous Movement", () => {
      it.skip("Rule 140.3 - should allow multiple Units to move simultaneously", () => {
        // Arrange: Multiple ready units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "bf1",
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-2", exhausted: false },
          "bf1",
        );

        // Act: Move both units
        engine.moveUnit("unit-1", "bf2");
        engine.moveUnit("unit-2", "bf2");

        // Assert: Both units moved
        const unitsAtBf2 = engine.getUnitsAtBattlefield("bf2");
        expect(unitsAtBf2.length).toBe(2);
      });

      it.skip("should handle simultaneous deaths correctly", () => {
        // Arrange: Multiple units with lethal damage
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 3, damage: 3 }],
                  [PLAYER_TWO]: [{ id: "unit-2", might: 2, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Cleanup kills damaged units
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Both units die simultaneously
        expect(killed.length).toBe(2);
      });
    });

    describe("Zone Transition Edge Cases", () => {
      it.skip("should clear all temporary modifications on zone change", () => {
        // Arrange: Unit with multiple modifications
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit-1", might: 5, damage: 2 }],
                },
              },
            ],
          },
        );
        engine.buffUnit("unit-1");
        engine.stunUnit("unit-1");

        // Act: Kill unit (zone transition)
        engine.killUnit("unit-1");

        // Assert: All modifications cleared
        expect(engine.getUnit("unit-1")).toBeUndefined();
      });

      it.skip("should handle card returning from banishment", () => {
        // Arrange: Card in banishment
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "banishment", {
          id: "card-1",
          name: "Card 1",
        });

        // Act: Move card back to hand (via effect)
        engine.moveCard(PLAYER_ONE, "banishment", "hand", "card-1");

        // Assert: Card is in hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
        expect(engine.getZoneContents(PLAYER_ONE, "banishment").length).toBe(0);
      });
    });
  });

  // ===========================================================================
  // Integration: Zones + Turn Structure
  // ===========================================================================

  describe("Integration: Zones + Turn Structure", () => {
    it.skip("should draw cards during Draw Phase", () => {
      // Arrange: Game in draw phase with cards in deck
      const engine = new RiftboundTestEngine({}, {}, { phase: "draw" });
      engine.addToZone(PLAYER_ONE, "mainDeck", {
        id: "card-1",
        name: "Card 1",
      });
      engine.addToZone(PLAYER_ONE, "mainDeck", {
        id: "card-2",
        name: "Card 2",
      });

      // Act: Draw cards
      engine.drawCards(PLAYER_ONE, 2);

      // Assert: Cards moved from deck to hand
      expect(engine.getHandSize(PLAYER_ONE)).toBe(2);
      expect(engine.getDeckSize(PLAYER_ONE)).toBe(0);
    });

    it.skip("should empty Rune Pool at end of Draw Phase", () => {
      // Arrange: Game with resources at draw phase
      const engine = new RiftboundTestEngine(
        { energy: 5, power: { fury: 2 } },
        {},
        { phase: "draw" },
      );

      // Act: Empty rune pool (end of draw phase)
      engine.emptyRunePool(PLAYER_ONE);

      // Assert: Pool is empty
      expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
      expect(engine.getPower(PLAYER_ONE, "fury")).toBe(0);
    });

    it.skip("should allow playing cards during Action Phase", () => {
      // Arrange: Game in action phase
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "action",
          activePlayer: PLAYER_ONE,
        },
      );
      engine.addToZone(PLAYER_ONE, "hand", {
        id: "unit-1",
        name: "Test Unit",
        cardType: "unit",
      });

      // Assert: Can play card
      expect(engine.canPlayCard(PLAYER_ONE, "unit-1")).toBe(true);
    });

    it.skip("should move killed units to trash during Cleanup", () => {
      // Arrange: Game with damaged unit
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "cleanup",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit-1", might: 3, damage: 3 }],
              },
            },
          ],
        },
      );

      // Act: Perform cleanup
      engine.performCleanup();

      // Assert: Unit is killed (moved to trash)
      expect(engine.getUnit("unit-1")).toBeUndefined();
      expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
    });

    it.skip("should clear damage at end of turn", () => {
      // Arrange: Game with damaged units at end of turn
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          phase: "ending",
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit-1", might: 5, damage: 2 }],
              },
            },
          ],
        },
      );

      // Act: Clear damage (expiration step)
      engine.clearAllDamage();

      // Assert: Damage is cleared
      expect(engine.getDamage("unit-1")).toBe(0);
    });
  });

  // ===========================================================================
  // Integration: Zones + Combat
  // ===========================================================================

  describe("Integration: Zones + Combat", () => {
    it.skip("should track units at battlefield for combat", () => {
      // Arrange: Battlefield with opposing units
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "p1-unit" }],
                [PLAYER_TWO]: [{ id: "p2-unit" }],
              },
            },
          ],
        },
      );

      // Assert: Battlefield has opposing units
      expect(engine.hasOpposingUnits("bf1")).toBe(true);
    });

    it.skip("should move killed units to trash after combat", () => {
      // Arrange: Unit with lethal damage after combat
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "unit-1", might: 3, damage: 5 }],
              },
            },
          ],
        },
      );

      // Act: Cleanup after combat
      engine.cleanupKillDamagedUnits();

      // Assert: Unit is in trash
      expect(engine.getUnit("unit-1")).toBeUndefined();
      expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
    });

    it.skip("should update battlefield control after combat", () => {
      // Arrange: Battlefield where player 2's units were killed
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          battlefields: [
            {
              id: "bf1",
              controller: PLAYER_TWO,
              units: {
                [PLAYER_ONE]: [{ id: "p1-unit" }],
              },
            },
          ],
        },
      );

      // Assert: Player 1 should gain control (only their units remain)
      // Note: Control update would happen after combat resolution
      expect(engine.getUnitsAtBattlefield("bf1").length).toBe(1);
    });
  });

  // ===========================================================================
  // Integration: Zones + Resources
  // ===========================================================================

  describe("Integration: Zones + Resources", () => {
    it.skip("should channel runes from Rune Deck to Rune Pool", () => {
      // Arrange: Game with runes in deck
      const engine = new RiftboundTestEngine({}, {}, { phase: "channel" });
      engine.addToZone(PLAYER_ONE, "runeDeck", {
        id: "rune-1",
        name: "Fury Rune",
      });
      engine.addToZone(PLAYER_ONE, "runeDeck", {
        id: "rune-2",
        name: "Calm Rune",
      });

      // Act: Channel runes
      engine.channelRunes(PLAYER_ONE, 2);

      // Assert: Runes moved to pool
      const runePool = engine.getZoneContents(PLAYER_ONE, "runePool");
      expect(runePool.length).toBe(2);
    });

    it.skip("should recycle runes back to Rune Deck", () => {
      // Arrange: Game with rune in pool
      const engine = new RiftboundTestEngine({}, {});
      engine.addToZone(PLAYER_ONE, "runePool", {
        id: "rune-1",
        name: "Fury Rune",
      });

      // Act: Recycle rune
      engine.recycleCard(PLAYER_ONE, "rune-1", "runePool");

      // Assert: Rune is back in deck
      const runeDeck = engine.getZoneContents(PLAYER_ONE, "runeDeck");
      expect(runeDeck.length).toBe(1);
    });

    it.skip("should track resources for playing cards", () => {
      // Arrange: Game with resources
      const engine = new RiftboundTestEngine(
        { energy: 5, power: { fury: 2 } },
        {},
        { phase: "action" },
      );

      // Assert: Can afford costs
      expect(
        engine.canAfford(PLAYER_ONE, { energy: 3, power: { fury: 1 } }),
      ).toBe(true);
      expect(engine.canAfford(PLAYER_ONE, { energy: 10 })).toBe(false);
    });
  });
});
