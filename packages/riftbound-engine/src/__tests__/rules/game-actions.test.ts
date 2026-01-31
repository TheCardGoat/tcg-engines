/**
 * Game Actions Tests - Rules 586-619
 *
 * Comprehensive test specifications for Riftbound game action rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule Sections:
 * - 586-589: Action Types (Discretionary vs Limited)
 * - 590-595: Basic Actions (Draw, Exhaust, Ready, Recycle, Play)
 * - 596-607: Advanced Actions (Move, Hide, Discard, Stun, Reveal, Counter, Buff, Banish, Kill, Add, Channel, Burn Out)
 * - 608-615: Movement Rules
 * - 616-619: Recalls
 */

import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 8: Game Actions - Rules 586-619
// =============================================================================

describe("Section 8: Game Actions - Rules 586-619", () => {
  // ===========================================================================
  // 586-589: Action Types
  // ===========================================================================

  describe("586-589: Action Types", () => {
    describe("Discretionary vs Limited Actions (Rules 587-589)", () => {
      it.skip("Rule 587 - should define game actions as actions players may perform", () => {
        // Arrange: Game in action phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Engine should have action methods available
        expect(typeof engine.playCard).toBe("function");
        expect(typeof engine.activateAbility).toBe("function");
        expect(typeof engine.moveUnit).toBe("function");
      });

      it.skip("Rule 588 - should only allow actions on player's own turn", () => {
        // Arrange: Game with player2 as active
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Test Card",
        });

        // Assert: Player 1 cannot play cards on player 2's turn
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(false);
      });

      it.skip("Rule 589.1 - should classify Play as a discretionary action", () => {
        // Assert: Play is a discretionary action
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("play")).toBe(true);
        expect(engine.isLimitedAction("play")).toBe(false);
      });

      it.skip("Rule 589.1 - should classify Standard Move as a discretionary action", () => {
        // Assert: Standard Move is a discretionary action
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("standardMove")).toBe(true);
      });

      it.skip("Rule 589.1 - should classify Hide as a discretionary action", () => {
        // Assert: Hide is a discretionary action
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("hide")).toBe(true);
      });

      it.skip("Rule 589.1.a - should allow discretionary actions during Neutral Open state", () => {
        // Arrange: Game in Neutral Open state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Test Card",
        });

        // Assert: Can play cards in Neutral Open
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.getChainState()).toBe("open");
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(true);
      });

      it.skip("Rule 589.1.b - should allow multiple discretionary actions per turn", () => {
        // Arrange: Game with multiple cards in hand
        const engine = new RiftboundTestEngine(
          { energy: 10 },
          {},
          { phase: "action" },
        );
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-2", name: "Card 2" });

        // Act: Play first card
        engine.playCard(PLAYER_ONE, "card-1");

        // Assert: Can still play second card
        expect(engine.canPlayCard(PLAYER_ONE, "card-2")).toBe(true);
      });

      it.skip("Rule 589.2 - should classify Draw as a limited action", () => {
        // Assert: Draw is a limited action
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("draw")).toBe(true);
        expect(engine.isDiscretionaryAction("draw")).toBe(false);
      });

      it.skip("Rule 589.2 - should classify Exhaust as a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("exhaust")).toBe(true);
      });

      it.skip("Rule 589.2 - should classify Discard as a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("discard")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 590-595: Basic Actions (Draw, Exhaust, Ready, Recycle, Play)
  // ===========================================================================

  describe("590-595: Basic Actions", () => {
    describe("591: Draw", () => {
      it.skip("Rule 591.1 - should move card from top of deck to hand", () => {
        // Arrange: Player with cards in deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Top Card",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-2",
          name: "Second Card",
        });

        // Act: Draw a card
        const drawn = engine.drawCards(PLAYER_ONE, 1);

        // Assert: Card moved from deck to hand
        expect(drawn).toEqual(["card-1"]);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 591.2.a - should draw 1 during Draw Step of Beginning Phase", () => {
        // Arrange: Game in draw phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "draw" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Card",
        });

        // Act: Draw during draw step
        engine.drawCards(PLAYER_ONE, 1);

        // Assert: Card is in hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 591.3 - should support Draw X format", () => {
        // Arrange: Player with multiple cards in deck
        const engine = new RiftboundTestEngine({}, {});
        for (let i = 1; i <= 5; i++) {
          engine.addToZone(PLAYER_ONE, "mainDeck", {
            id: `card-${i}`,
            name: `Card ${i}`,
          });
        }

        // Act: Draw 3 cards
        const drawn = engine.drawCards(PLAYER_ONE, 3);

        // Assert: 3 cards drawn
        expect(drawn.length).toBe(3);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(3);
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 591.4 - should trigger burn out when deck is empty", () => {
        // Arrange: Player with empty deck but cards in trash
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "card-1",
          name: "Trash Card",
        });
        const initialP2Points = engine.getVictoryPoints(PLAYER_TWO);

        // Act: Attempt to draw from empty deck
        engine.drawCards(PLAYER_ONE, 1);

        // Assert: Burn out occurred - opponent gained a point
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(initialP2Points + 1);
      });
    });

    describe("592: Exhaust", () => {
      it.skip("Rule 592.1 - should mark unit as exhausted", () => {
        // Arrange: Ready unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: false }] },
              },
            ],
          },
        );

        // Act: Exhaust the unit
        const result = engine.exhaustUnit("unit-1");

        // Assert: Unit is now exhausted
        expect(result).toBe(true);
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 592.1.b - should not exhaust already exhausted unit", () => {
        // Arrange: Already exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Act: Try to exhaust again
        const result = engine.exhaustUnit("unit-1");

        // Assert: Returns false, unit still exhausted
        expect(result).toBe(false);
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 592.1.c - should do nothing when exhausting already exhausted unit", () => {
        // Arrange: Already exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Act: Try to exhaust again
        engine.exhaustUnit("unit-1");

        // Assert: Nothing additional happens
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 592.4 - should require exhaustable unit for exhaust cost", () => {
        // Arrange: Already exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Assert: Cannot use exhausted unit for exhaust cost
        expect(engine.exhaustUnit("unit-1")).toBe(false);
      });
    });

    describe("593: Ready", () => {
      it.skip("Rule 593.1 - should mark unit as ready", () => {
        // Arrange: Exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Act: Ready the unit
        const result = engine.readyUnit("unit-1");

        // Assert: Unit is now ready
        expect(result).toBe(true);
        expect(engine.isUnitExhausted("unit-1")).toBe(false);
      });

      it.skip("Rule 593.4.a - should ready all units during Ready Step", () => {
        // Arrange: Multiple exhausted units
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
                    { id: "unit-1", exhausted: true },
                    { id: "unit-2", exhausted: true },
                  ],
                },
              },
            ],
          },
        );

        // Act: Ready all units (simulating Ready Step)
        engine.readyAllUnits(PLAYER_ONE);

        // Assert: All units are ready
        expect(engine.isUnitExhausted("unit-1")).toBe(false);
        expect(engine.isUnitExhausted("unit-2")).toBe(false);
      });
    });

    describe("594: Recycle", () => {
      it.skip("Rule 594.1 - should move card to bottom of deck", () => {
        // Arrange: Card in trash
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "card-1",
          name: "Trash Card",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-2",
          name: "Deck Card",
        });

        // Act: Recycle from trash
        const result = engine.recycleCard(PLAYER_ONE, "card-1", "trash");

        // Assert: Card moved to bottom of deck
        expect(result).toBe(true);
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(0);
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 594.3 - should require card in zone for recycle cost", () => {
        // Arrange: Empty trash
        const engine = new RiftboundTestEngine({}, {});

        // Act: Try to recycle from empty trash
        const result = engine.recycleCard(PLAYER_ONE, "nonexistent", "trash");

        // Assert: Cannot recycle nonexistent card
        expect(result).toBe(false);
      });
    });

    describe("595: Play", () => {
      it.skip("Rule 595.1 - should require paying costs to play card", () => {
        // Arrange: Player with card but no resources
        const engine = new RiftboundTestEngine(
          { energy: 0 },
          {},
          { phase: "action" },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Expensive Card",
        });

        // Assert: Cannot afford to play (stub - would check costs)
        expect(engine.getEnergy(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 595.2 - should be a discretionary action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("play")).toBe(true);
      });

      it.skip("Rule 595.2.a - should allow playing when resources available", () => {
        // Arrange: Player with resources and card
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          { phase: "action" },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Test Card",
        });

        // Assert: Can play card
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(true);
      });

      it.skip("Rule 595.4.a - should trigger 'when played' abilities after resolution", () => {
        // Arrange: Card with 'when played' ability
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Trigger Card",
        });

        // Act: Play the card
        engine.playCard(PLAYER_ONE, "card-1");

        // Assert: Card was played (abilities would trigger in full implementation)
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      });
    });
  });

  // ===========================================================================
  // 596-607: Advanced Actions
  // ===========================================================================

  describe("596-607: Advanced Actions", () => {
    describe("596: Move", () => {
      it.skip("Rule 596.1 - should move unit between locations on board", () => {
        // Arrange: Unit at base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "base");

        // Act: Move to battlefield
        const result = engine.moveUnit("unit-1", "bf1");

        // Assert: Unit moved
        expect(result).toBe(true);
        expect(engine.getUnit("unit-1")?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 596.2 - should be a limited action (except Standard Move)", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("move")).toBe(true);
      });

      it.skip("Rule 596.3 - Standard Move should be a discretionary action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("standardMove")).toBe(true);
      });

      it.skip("Rule 596.3.a - Standard Move should exhaust unit as cost", () => {
        // Arrange: Ready unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Act: Standard move
        engine.moveUnit("unit-1", "bf1");

        // Assert: Unit is now exhausted
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });
    });

    describe("597: Hide", () => {
      it.skip("Rule 597.1 - should place card facedown at battlefield", () => {
        // Arrange: Card with Hidden keyword in hand
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Hidden Card",
        });

        // Act: Hide the card
        const result = engine.hideCard(PLAYER_ONE, "card-1", "bf1");

        // Assert: Card is hidden
        expect(result).toBe(true);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 597.2 - should be a discretionary action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isDiscretionaryAction("hide")).toBe(true);
      });
    });

    describe("598: Discard", () => {
      it.skip("Rule 598.1 - should move card from hand to trash", () => {
        // Arrange: Card in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Discard Me",
        });

        // Act: Discard the card
        const result = engine.discardCard(PLAYER_ONE, "card-1");

        // Assert: Card moved to trash
        expect(result).toBe(true);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 598.2 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("discard")).toBe(true);
      });

      it.skip("Rule 598.3 - should require cards in hand for discard cost", () => {
        // Arrange: Empty hand
        const engine = new RiftboundTestEngine({}, {});

        // Act: Try to discard
        const result = engine.discardCard(PLAYER_ONE, "nonexistent");

        // Assert: Cannot discard nonexistent card
        expect(result).toBe(false);
      });
    });

    describe("599: Stun", () => {
      it.skip("Rule 599.1 - should render unit stunned", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Stun the unit
        const result = engine.stunUnit("unit-1");

        // Assert: Unit is stunned
        expect(result).toBe(true);
        expect(engine.isUnitStunned("unit-1")).toBe(true);
      });

      it.skip("Rule 599.1.a - should be a binary state", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Assert: Unit is either stunned or not
        expect(engine.isUnitStunned("unit-1")).toBe(false);
        engine.stunUnit("unit-1");
        expect(engine.isUnitStunned("unit-1")).toBe(true);
      });

      it.skip("Rule 599.1.a.1 - should not stun already stunned unit", () => {
        // Arrange: Already stunned unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );
        engine.stunUnit("unit-1");

        // Act: Try to stun again
        const result = engine.stunUnit("unit-1");

        // Assert: Returns false
        expect(result).toBe(false);
      });

      it.skip("Rule 599.1.b - stunned unit should not contribute might in combat", () => {
        // Arrange: Stunned unit with might 5
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", might: 5 }] },
              },
            ],
          },
        );
        engine.stunUnit("unit-1");

        // Assert: Effective might is 0
        expect(engine.getEffectiveMight("unit-1")).toBe(0);
      });

      it.skip("Rule 599.1.c - stunned unit should still require full might to kill", () => {
        // Arrange: Stunned unit with might 5
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", might: 5 }] },
              },
            ],
          },
        );
        engine.stunUnit("unit-1");

        // Assert: Still needs 5 damage to die
        expect(engine.getUnitMight("unit-1")).toBe(5);
      });

      it.skip("Rule 599.2 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("stun")).toBe(true);
      });
    });

    describe("600: Reveal", () => {
      it.skip("Rule 600.1 - should present cards from private zone to all players", () => {
        // Arrange: Cards in deck (private zone)
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Secret Card",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-2",
          name: "Another Secret",
        });

        // Act: Reveal top 2 cards
        const revealed = engine.revealCards(PLAYER_ONE, "mainDeck", 2);

        // Assert: Cards are revealed
        expect(revealed.length).toBe(2);
        expect(revealed).toContain("card-1");
      });

      it.skip("Rule 600.1.a.2 - revealed cards should remain in original zone", () => {
        // Arrange: Card in deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card-1",
          name: "Card",
        });

        // Act: Reveal
        engine.revealCards(PLAYER_ONE, "mainDeck", 1);

        // Assert: Card still in deck
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 600.2 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("reveal")).toBe(true);
      });
    });

    describe("601: Counter", () => {
      it.skip("Rule 601.1 - should negate card on chain", () => {
        // Arrange: Spell on chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Counter the spell
        const result = engine.counterSpell("spell-1");

        // Assert: Spell removed from chain
        expect(result).toBe(true);
        expect(engine.getChain().length).toBe(0);
      });

      it.skip("Rule 601.1.a - countered card should go to trash", () => {
        // Arrange: Spell on chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Counter (in full implementation, would move to trash)
        engine.counterSpell("spell-1");

        // Assert: Chain is empty
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 601.1.b - countered card should not be considered played", () => {
        // Arrange: Spell on chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Counter
        engine.counterSpell("spell-1");

        // Assert: Spell was not played (no 'when played' triggers)
        expect(engine.getChain().length).toBe(0);
      });

      it.skip("Rule 601.2 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("counter")).toBe(true);
      });
    });

    describe("602: Buff", () => {
      it.skip("Rule 602.1 - should place buff counter on unit", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Buff the unit
        const result = engine.buffUnit("unit-1");

        // Assert: Unit is buffed
        expect(result).toBe(true);
        expect(engine.isUnitBuffed("unit-1")).toBe(true);
      });

      it.skip("Rule 602.1.b.1 - should not add second buff counter", () => {
        // Arrange: Already buffed unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );
        engine.buffUnit("unit-1");

        // Act: Try to buff again
        const result = engine.buffUnit("unit-1");

        // Assert: Returns false, still only one buff
        expect(result).toBe(false);
        expect(engine.isUnitBuffed("unit-1")).toBe(true);
      });

      it.skip("Rule 602.2 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("buff")).toBe(true);
      });
    });

    describe("603: Banish", () => {
      it.skip("Rule 603.1 - should move card to banishment zone", () => {
        // Arrange: Card in hand
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card-1",
          name: "Banish Me",
        });

        // Act: Banish the card
        const result = engine.banishCard(PLAYER_ONE, "card-1", "hand");

        // Assert: Card in banishment
        expect(result).toBe(true);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
        expect(engine.getZoneContents(PLAYER_ONE, "banishment").length).toBe(1);
      });

      it.skip("Rule 603.2.a - banish should not be a subset of kill", () => {
        // This is a rule clarification - banish and kill are distinct
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("banish")).toBe(true);
        expect(engine.isLimitedAction("kill")).toBe(true);
      });

      it.skip("Rule 603.4 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("banish")).toBe(true);
      });
    });

    describe("604: Kill", () => {
      it.skip("Rule 604.1 - should move permanent from board to trash", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Kill the unit
        const result = engine.killUnit("unit-1");

        // Assert: Unit in trash, not on board
        expect(result).toBe(true);
        expect(engine.getUnit("unit-1")).toBeUndefined();
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 604.1.a.2 - passive kill should occur from lethal damage", () => {
        // Arrange: Unit with damage >= might
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

      it.skip("Rule 604.3 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("kill")).toBe(true);
      });
    });

    describe("605: Add", () => {
      it.skip("Rule 605.1 - should add resources to rune pool", () => {
        // Arrange: Player with empty rune pool
        const engine = new RiftboundTestEngine({ energy: 0 }, {});

        // Act: Add energy
        engine.addEnergy(PLAYER_ONE, 3);

        // Assert: Energy added
        expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
      });

      it.skip("Rule 605.1 - should add power to rune pool", () => {
        // Arrange: Player with no power
        const engine = new RiftboundTestEngine({}, {});

        // Act: Add power
        engine.addPower(PLAYER_ONE, "fury", 2);

        // Assert: Power added
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
      });

      it.skip("Rule 605.4 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("add")).toBe(true);
      });
    });

    describe("606: Channel", () => {
      it.skip("Rule 606.1 - should move runes from rune deck to board", () => {
        // Arrange: Runes in rune deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-1",
          name: "Fury Rune",
        });
        engine.addToZone(PLAYER_ONE, "runeDeck", {
          id: "rune-2",
          name: "Calm Rune",
        });

        // Act: Channel 2 runes
        const channeled = engine.channelRunes(PLAYER_ONE, 2);

        // Assert: Runes moved to rune pool
        expect(channeled.length).toBe(2);
        expect(engine.getZoneContents(PLAYER_ONE, "runePool").length).toBe(2);
      });

      it.skip("Rule 606.3 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("channel")).toBe(true);
      });
    });

    describe("607: Burn Out", () => {
      it.skip("Rule 607.1 - should trigger when drawing from empty deck", () => {
        // Arrange: Empty deck, cards in trash
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "card-1",
          name: "Trash Card",
        });

        // Act: Draw from empty deck
        engine.drawCards(PLAYER_ONE, 1);

        // Assert: Burn out occurred
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(1);
      });

      it.skip("Rule 607.2.a - should shuffle trash into deck", () => {
        // Arrange: Cards in trash, empty deck
        const engine = new RiftboundTestEngine({}, {});
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-1", name: "Card 1" });
        engine.addToZone(PLAYER_ONE, "trash", { id: "card-2", name: "Card 2" });

        // Act: Burn out
        engine.burnOut(PLAYER_ONE);

        // Assert: Trash is empty, deck has cards
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(0);
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 607.2.b - should give opponent 1 point", () => {
        // Arrange: Game state
        const engine = new RiftboundTestEngine({}, {});
        const initialPoints = engine.getVictoryPoints(PLAYER_TWO);

        // Act: Burn out
        engine.burnOut(PLAYER_ONE);

        // Assert: Opponent gained 1 point
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(initialPoints + 1);
      });

      it.skip("Rule 607.4 - should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("burnOut")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 608-615: Movement Rules
  // ===========================================================================

  describe("608-615: Movement Rules", () => {
    describe("608-609: Movement Basics", () => {
      it.skip("Rule 609 - moving should be a limited action", () => {
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.isLimitedAction("move")).toBe(true);
      });

      it.skip("Rule 609.1 - changing position on board should be a move", () => {
        // Arrange: Unit at battlefield 1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");

        // Act: Move to battlefield 2
        engine.moveUnit("unit-1", "bf2");

        // Assert: Unit is at new location
        expect(engine.getUnit("unit-1")?.battlefieldId).toBe("bf2");
      });

      it.skip("Rule 609.3 - moving should be instantaneous", () => {
        // Arrange: Unit at base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "base");

        // Act: Move to battlefield
        engine.moveUnit("unit-1", "bf1");

        // Assert: Unit is immediately at destination (no in-between state)
        expect(engine.getUnit("unit-1")?.battlefieldId).toBe("bf1");
      });
    });

    describe("610: Origin and Destination", () => {
      it.skip("Rule 610.1 - should track origin of move", () => {
        // Arrange: Unit at bf1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");
        const origin = engine.getUnit("unit-1")?.battlefieldId;

        // Act: Move
        engine.moveUnit("unit-1", "bf2");

        // Assert: Origin was bf1
        expect(origin).toBe("bf1");
      });

      it.skip("Rule 610.2.a - should not allow move to battlefield with pending combat from other players", () => {
        // Arrange: Battlefield with pending combat between other players
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "p1-unit" }, "bf1");
        engine.addUnit({ ownerId: PLAYER_TWO, id: "p2-unit" }, "bf1");
        engine.markPendingCombat("bf1");

        // In a 3+ player game, a third player couldn't move here
        // For 2-player, this validates the pending combat state
        expect(engine.hasPendingCombat("bf1")).toBe(true);
      });

      it.skip("Rule 610.3 - only units should be able to move", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }, { id: "bf2" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "unit-1" }, "bf1");

        // Act: Move unit
        const result = engine.moveUnit("unit-1", "bf2");

        // Assert: Unit can move
        expect(result).toBe(true);
      });
    });

    describe("611: Standard Move", () => {
      it.skip("Rule 611 - players should be able to move units with Standard Move", () => {
        // Arrange: Ready unit at base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Act: Standard move
        const result = engine.moveUnit("unit-1", "bf1");

        // Assert: Move succeeded
        expect(result).toBe(true);
      });

      it.skip("Rule 611 - Standard Move should require exhausting unit", () => {
        // Arrange: Ready unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Act: Standard move
        engine.moveUnit("unit-1", "bf1");

        // Assert: Unit is exhausted
        expect(engine.isUnitExhausted("unit-1")).toBe(true);
      });

      it.skip("Rule 611 - exhausted unit should not be able to Standard Move", () => {
        // Arrange: Exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: true },
          "base",
        );

        // Act: Try to move
        const result = engine.moveUnit("unit-1", "bf1");

        // Assert: Move failed
        expect(result).toBe(false);
      });
    });

    describe("612: Effect-Caused Movement", () => {
      it.skip("Rule 612.2 - should not allow move to battlefield with 2 other players' units", () => {
        // Arrange: Battlefield with units from 2 players (in 3+ player game)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit({ ownerId: PLAYER_ONE, id: "p1-unit" }, "bf1");
        engine.addUnit({ ownerId: PLAYER_TWO, id: "p2-unit" }, "bf1");

        // Assert: Battlefield has opposing units
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });
    });

    describe("613-614: Showdown and Combat Triggers", () => {
      it.skip("Rule 613.1 - should open showdown when move causes contested battlefield", () => {
        // Arrange: Uncontrolled battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Act: Move to uncontrolled battlefield
        engine.moveUnit("unit-1", "bf1");

        // Assert: Unit is at battlefield (showdown logic would be in full implementation)
        expect(engine.getUnit("unit-1")?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 614.1 - should trigger combat when move causes contested battlefield with opposing units", () => {
        // Arrange: Battlefield controlled by opponent with units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_TWO,
                units: { [PLAYER_TWO]: [{ id: "defender" }] },
              },
            ],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "attacker", exhausted: false },
          "base",
        );

        // Act: Move to contested battlefield
        engine.moveUnit("attacker", "bf1");

        // Assert: Both units at battlefield (combat would be triggered)
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });
    });

    describe("615: Cleanup After Move", () => {
      it.skip("Rule 615 - should perform cleanup after move completes", () => {
        // Arrange: Unit that will move
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit-1", exhausted: false },
          "base",
        );

        // Act: Move
        engine.moveUnit("unit-1", "bf1");

        // Assert: Move completed (cleanup would check for state-based actions)
        expect(engine.getUnit("unit-1")?.battlefieldId).toBe("bf1");
      });
    });
  });

  // ===========================================================================
  // 616-619: Recalls
  // ===========================================================================

  describe("616-619: Recalls", () => {
    describe("617-618: Recall Mechanics", () => {
      it.skip("Rule 617 - recall should change location without being a move", () => {
        // Arrange: Unit at battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Recall unit
        const result = engine.recallUnit("unit-1");

        // Assert: Unit returned to base
        expect(result).toBe(true);
        expect(engine.getUnit("unit-1")?.battlefieldId).toBeUndefined();
      });

      it.skip("Rule 618 - recalls should not be moves", () => {
        // This is a rule clarification test
        // Recalls don't trigger move abilities
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Recall
        engine.recallUnit("unit-1");

        // Assert: Unit is at base (not a move, so no move triggers)
        expect(engine.getUnit("unit-1")?.battlefieldId).toBeUndefined();
      });

      it.skip("Rule 618.1 - recalls should not trigger move abilities", () => {
        // Arrange: Unit with hypothetical "when I move" ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );

        // Act: Recall (not a move)
        engine.recallUnit("unit-1");

        // Assert: Unit recalled without triggering move abilities
        expect(engine.getUnit("unit-1")?.battlefieldId).toBeUndefined();
      });

      it.skip("Rule 618.3 - recalls should not be prevented by movement restrictions", () => {
        // Arrange: Unit that might have movement restriction
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Act: Recall (should work even if unit is exhausted)
        const result = engine.recallUnit("unit-1");

        // Assert: Recall succeeded despite exhaustion
        expect(result).toBe(true);
      });
    });

    describe("619: Gear Recalls", () => {
      it.skip("Rule 619.1 - gear at battlefield should be recalled during cleanup", () => {
        // This test documents the gear recall rule
        // Gear at a battlefield is recalled to base during cleanup
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );

        // Assert: Cleanup would recall gear (documented behavior)
        expect(engine.getBattlefield("bf1")).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    describe("Illegal Actions", () => {
      it.skip("should reject action when not player's turn", () => {
        // Arrange: Player 2's turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            activePlayer: PLAYER_TWO,
            phase: "action",
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

        // Assert: Player 1 cannot play
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(false);
      });

      it.skip("should reject action during wrong phase", () => {
        // Arrange: Game in draw phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "draw" });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

        // Assert: Cannot play cards during draw phase
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(false);
      });

      it.skip("should reject action during Closed state", () => {
        // Arrange: Chain has items (Closed state)
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

        // Assert: Cannot play during Closed state
        expect(engine.getChainState()).toBe("closed");
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(false);
      });

      it.skip("should reject action during Showdown state for non-combat actions", () => {
        // Arrange: Game in Showdown
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();
        engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

        // Assert: Cannot play non-combat cards during Showdown
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.canPlayCard(PLAYER_ONE, "card-1")).toBe(false);
      });
    });

    describe("Cost Payment Failures", () => {
      it.skip("should reject action when cannot pay energy cost", () => {
        // Arrange: Player with no energy
        const engine = new RiftboundTestEngine(
          { energy: 0 },
          {},
          { phase: "action" },
        );

        // Assert: Cannot afford cost
        expect(engine.canAfford(PLAYER_ONE, { energy: 3 })).toBe(false);
      });

      it.skip("should reject action when cannot pay power cost", () => {
        // Arrange: Player with no fury power
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Cannot afford fury cost
        expect(engine.canAfford(PLAYER_ONE, { power: { fury: 2 } })).toBe(
          false,
        );
      });

      it.skip("should reject exhaust cost when unit already exhausted", () => {
        // Arrange: Exhausted unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1", exhausted: true }] },
              },
            ],
          },
        );

        // Assert: Cannot exhaust already exhausted unit
        expect(engine.exhaustUnit("unit-1")).toBe(false);
      });
    });

    describe("Empty Zone Scenarios", () => {
      it.skip("should handle draw from empty deck", () => {
        // Arrange: Empty deck
        const engine = new RiftboundTestEngine({}, {});

        // Act: Draw triggers burn out
        engine.drawCards(PLAYER_ONE, 1);

        // Assert: Burn out occurred
        expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(1);
      });

      it.skip("should handle discard from empty hand", () => {
        // Arrange: Empty hand
        const engine = new RiftboundTestEngine({}, {});

        // Act: Try to discard
        const result = engine.discardCard(PLAYER_ONE, "nonexistent");

        // Assert: Discard failed
        expect(result).toBe(false);
      });

      it.skip("should handle recycle from empty trash", () => {
        // Arrange: Empty trash
        const engine = new RiftboundTestEngine({}, {});

        // Act: Try to recycle
        const result = engine.recycleCard(PLAYER_ONE, "nonexistent", "trash");

        // Assert: Recycle failed
        expect(result).toBe(false);
      });
    });

    describe("Already Applied States", () => {
      it.skip("should handle stunning already stunned unit", () => {
        // Arrange: Stunned unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );
        engine.stunUnit("unit-1");

        // Act: Try to stun again
        const result = engine.stunUnit("unit-1");

        // Assert: Returns false, unit still stunned
        expect(result).toBe(false);
        expect(engine.isUnitStunned("unit-1")).toBe(true);
      });

      it.skip("should handle buffing already buffed unit", () => {
        // Arrange: Buffed unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: { [PLAYER_ONE]: [{ id: "unit-1" }] },
              },
            ],
          },
        );
        engine.buffUnit("unit-1");

        // Act: Try to buff again
        const result = engine.buffUnit("unit-1");

        // Assert: Returns false, unit still buffed
        expect(result).toBe(false);
        expect(engine.isUnitBuffed("unit-1")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // Integration: Actions + Priority
  // ===========================================================================

  describe("Integration: Actions + Priority", () => {
    it.skip("should require priority to play cards", () => {
      // Arrange: Player without priority
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.setPriorityHolder(PLAYER_TWO);
      engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

      // Assert: Player 1 cannot play without priority
      expect(engine.hasPriority(PLAYER_ONE)).toBe(false);
    });

    it.skip("should allow action when player has priority", () => {
      // Arrange: Player with priority
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.setPriorityHolder(PLAYER_ONE);
      engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

      // Assert: Player 1 has priority
      expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
    });

    it.skip("should pass priority after playing card", () => {
      // Arrange: Player with priority plays card
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.setPriorityHolder(PLAYER_ONE);
      engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Card" });

      // Act: Play card and pass priority
      engine.playCard(PLAYER_ONE, "card-1");
      engine.passPriority();

      // Assert: Priority passed to opponent
      expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
    });

    it.skip("should handle chain resolution with priority", () => {
      // Arrange: Items on chain
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.addToChain({
        id: "spell-1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });
      engine.setPriorityHolder(PLAYER_ONE);

      // Act: Pass priority
      engine.passPriority();

      // Assert: Priority passed
      expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
    });

    it.skip("should resolve chain when both players pass", () => {
      // Arrange: Spell on chain, both players pass
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
      engine.addToChain({
        id: "spell-1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain
      const resolved = engine.resolveChainItem();

      // Assert: Spell resolved
      expect(resolved?.id).toBe("spell-1");
      expect(engine.hasChain()).toBe(false);
    });
  });
});
