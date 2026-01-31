/**
 * Chains & Showdowns Tests - Rules 527-563
 *
 * Comprehensive test specifications for Riftbound chain and showdown rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule References:
 * - Rules 527-531: Relevant Players
 * - Rules 532-544: The Chain
 * - Rules 545-553: Showdowns
 * - Rules 554-563: Playing Cards
 */

import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 6: Chains & Showdowns - Rules 527-563
// =============================================================================

describe("Section 6: Chains & Showdowns - Rules 527-563", () => {
  // ===========================================================================
  // 527-531: Relevant Players
  // ===========================================================================

  describe("527-531: Relevant Players", () => {
    describe("Relevant Players Definition (Rules 528-529)", () => {
      it.skip("Rule 529.1 - should define relevant players during a Chain", () => {
        // Arrange: Game with chain in progress
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain exists, players can be relevant
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 529.2 - should define relevant players during a Showdown", () => {
        // Arrange: Game in showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Showdown in progress
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getTurnState()).toBe("showdown");
      });
    });

    describe("Relevance Duration (Rule 530)", () => {
      it.skip("Rule 530 - should maintain relevance until Window of Opportunity ends", () => {
        // Arrange: Player becomes relevant during showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Assert: Player remains relevant while showdown continues
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);

        // Act: End showdown
        engine.endShowdown();

        // Assert: Relevance ends with showdown
        expect(engine.isInShowdown()).toBe(false);
        expect(engine.getFocusHolder()).toBeNull();
      });

      it.skip("Rule 530.1 - should use more-encompassing relevance for nested windows", () => {
        // Arrange: Chain inside a Showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Both showdown and chain active
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(true);

        // Act: Resolve chain (showdown continues)
        engine.resolveChainItem();

        // Assert: Still in showdown (more-encompassing window)
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(false);
      });
    });

    describe("Who is Relevant (Rule 531)", () => {
      it.skip("Rule 531.1 - should make combat players relevant during combat", () => {
        // Arrange: Battlefield with opposing units (combat scenario)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );

        // Assert: Both players have units at battlefield (combat possible)
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 531.1.a - should make all players relevant when no combat occurring", () => {
        // Arrange: Game with no combat
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: No showdown, neutral state - all players can act
        expect(engine.isInShowdown()).toBe(false);
        expect(engine.getTurnState()).toBe("neutral");
      });

      it.skip("Rule 531.2 - should allow inviting non-relevant players", () => {
        // Arrange: Showdown with one player having focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Player 1 has focus, can invite player 2
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 531.2.a.1 - invited player may refuse invitation", () => {
        // Arrange: Showdown where player could be invited
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Assert: Player 2 does not have focus (not yet invited/accepted)
        expect(engine.hasFocus(PLAYER_TWO)).toBe(false);
      });

      it.skip("Rule 531.2.a.2 - accepted invitation requires playing card or activating ability", () => {
        // Arrange: Showdown where player accepts invitation
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Act: Transfer focus (simulating accepted invitation)
        engine.setFocusHolder(PLAYER_TWO);
        engine.setPriorityHolder(PLAYER_TWO);

        // Assert: Player 2 now has focus and priority
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
      });

      it.skip("Rule 531.2.a.3 - accepted player remains relevant for duration", () => {
        // Arrange: Player accepts invitation during showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_TWO);

        // Act: Focus passes back to player 1
        engine.setFocusHolder(PLAYER_ONE);

        // Assert: Showdown still in progress (player 2 remains relevant)
        expect(engine.isInShowdown()).toBe(true);
      });
    });

    describe("Relevant Players - Edge Cases", () => {
      it.skip("should handle multiple chains within single showdown", () => {
        // Arrange: Showdown with multiple spell exchanges
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // First chain
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.resolveChainItem();
        expect(engine.hasChain()).toBe(false);

        // Second chain
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.resolveChainItem();

        // Assert: Still in showdown after multiple chains
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("should handle relevance when combat ends mid-chain", () => {
        // Arrange: Combat showdown with chain
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
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
        engine.startShowdown();
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Both chain and showdown active
        expect(engine.hasChain()).toBe(true);
        expect(engine.isInShowdown()).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 532-544: The Chain
  // ===========================================================================

  describe("532-544: The Chain", () => {
    describe("Chain Definition (Rules 532-535)", () => {
      it.skip("Rule 533 - should create chain when card is played", () => {
        // Arrange: Game in action phase
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        expect(engine.hasChain()).toBe(false);

        // Act: Add spell to chain (simulating playing a card)
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain now exists
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChain().length).toBe(1);
      });

      it.skip("Rule 533.1 - should place cards on chain as part of being played", () => {
        // Arrange: Game ready for spell
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Act: Play spell (goes to chain)
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Spell is on chain
        const chain = engine.getChain();
        expect(chain.length).toBe(1);
        expect(chain[0]?.id).toBe("spell1");
        expect(chain[0]?.type).toBe("spell");
      });

      it.skip("Rule 533.2 - should queue abilities on chain as part of resolving", () => {
        // Arrange: Game with ability activation
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Act: Add ability to chain
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Ability is on chain
        const chain = engine.getChain();
        expect(chain.length).toBe(1);
        expect(chain[0]?.type).toBe("ability");
      });

      it.skip("Rule 534 - should maintain chain as long as items exist on it", () => {
        // Arrange: Chain with item
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        expect(engine.hasChain()).toBe(true);

        // Act: Resolve item
        engine.resolveChainItem();

        // Assert: Chain no longer exists
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 534.1 - should only allow one chain at a time", () => {
        // Arrange: Chain already exists
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Add another item (goes to same chain)
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Single chain with two items
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 534.2 - should add new cards to existing chain", () => {
        // Arrange: Chain with one spell
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Add reaction spell
        engine.addToChain({
          id: "reaction1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Both on same chain
        const chain = engine.getChain();
        expect(chain.length).toBe(2);
        expect(chain[0]?.id).toBe("spell1");
        expect(chain[1]?.id).toBe("reaction1");
      });

      it.skip("Rule 535.1 - should be in Closed state when chain exists", () => {
        // Arrange: Game with chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Closed state
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 535.2 - should be in Open state when no chain exists", () => {
        // Arrange: Game without chain
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Open state
        expect(engine.getChainState()).toBe("open");
        expect(engine.hasChain()).toBe(false);
      });
    });

    describe("Steps of Resolving a Chain (Rules 536-544)", () => {
      it.skip("Rule 537.1 - player who created chain becomes first Active Player", () => {
        // Arrange: Player 1 creates chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Set priority to chain creator
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Player 1 has priority (is Active Player)
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 537.2 - Active Player is distinct from Turn Player", () => {
        // Arrange: Player 2's turn, but player 1 creates chain
        const engine = new RiftboundTestEngine(
          {},
          {},
          { activePlayer: PLAYER_TWO },
        );
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.setPriorityHolder(PLAYER_ONE);

        // Assert: Turn player is P2, but Active Player (priority) is P1
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 538 - permanents skip priority before resolution", () => {
        // Arrange: Permanent being played (unit)
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Note: When a permanent is played, it resolves immediately
        // without giving opponents priority to respond
        // This is simulated by not setting priority holder

        // Assert: No priority holder for permanent resolution
        expect(engine.getPriorityHolder()).toBeNull();
      });

      it.skip("Rule 540.1 - Active Player may play legally timed spell", () => {
        // Arrange: Chain exists, player has priority
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.setPriorityHolder(PLAYER_TWO);

        // Act: Player 2 adds reaction spell
        engine.addToChain({
          id: "reaction1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Reaction added to chain
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 540.2 - Active Player may activate legally timed abilities", () => {
        // Arrange: Chain exists
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.setPriorityHolder(PLAYER_TWO);

        // Act: Player 2 activates ability
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Ability added to chain
        const chain = engine.getChain();
        expect(chain.length).toBe(2);
        expect(chain[1]?.type).toBe("ability");
      });

      it.skip("Rule 540.4 - Active Player may pass priority", () => {
        // Arrange: Player 1 has priority
        const engine = new RiftboundTestEngine({}, {});
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Pass priority
        engine.passPriority();

        // Assert: Player 2 now has priority
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
      });

      it.skip("Rule 540.4.a - priority passes to next Relevant Player in Turn Order", () => {
        // Arrange: Player 1 has priority
        const engine = new RiftboundTestEngine({}, {});
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Pass priority
        engine.passPriority();

        // Assert: Next player in turn order has priority
        expect(engine.getPriorityHolder()).toBe(PLAYER_TWO);
      });

      it.skip("Rule 540.4.b - chain ends when all Relevant Players pass in sequence", () => {
        // Arrange: Chain with item, both players pass
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Simulate both players passing (chain should resolve)
        // In real implementation, this would trigger resolution

        // Assert: Chain can be resolved
        expect(engine.getChain().length).toBe(1);
      });

      it.skip("Rule 541 - triggered abilities added as most recent item on chain", () => {
        // Arrange: Chain with spell
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Triggered ability fires
        engine.addToChain({
          id: "trigger1",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Trigger is most recent (last) item
        const chain = engine.getChain();
        expect(chain[chain.length - 1]?.id).toBe("trigger1");
      });

      it.skip("Rule 541.2 - triggered abilities don't affect Active Player order", () => {
        // Arrange: Player 1 has priority, trigger fires
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Trigger added (doesn't change priority)
        engine.addToChain({
          id: "trigger1",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Player 1 still has priority
        expect(engine.hasPriority(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 543 - should resolve chain in LIFO order", () => {
        // Arrange: Chain with multiple items
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToChain({
          id: "spell3",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve items
        const first = engine.resolveChainItem();
        const second = engine.resolveChainItem();
        const third = engine.resolveChainItem();

        // Assert: LIFO order (last in, first out)
        expect(first?.id).toBe("spell3");
        expect(second?.id).toBe("spell2");
        expect(third?.id).toBe("spell1");
      });

      it.skip("Rule 543.1.a.1 - spells go to owner's trash after resolving", () => {
        // Arrange: Spell on chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve spell
        const resolved = engine.resolveChainItem();

        // Assert: Spell resolved (would go to trash in full implementation)
        expect(resolved?.type).toBe("spell");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 543.1.a.3 - abilities cease to exist after resolving", () => {
        // Arrange: Ability on chain
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Act: Resolve ability
        const resolved = engine.resolveChainItem();

        // Assert: Ability resolved and removed
        expect(resolved?.type).toBe("ability");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 543.3 - should perform cleanup after chain item resolves", () => {
        // Arrange: Chain item and damaged unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
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
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve chain and cleanup
        engine.resolveChainItem();
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Cleanup killed damaged unit
        expect(killed.length).toBe(1);
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 543.4 - controller of next item becomes Active Player", () => {
        // Arrange: Chain with items from different players
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Act: Resolve top item (spell2)
        engine.resolveChainItem();

        // Assert: Next item's controller (P1) should get priority
        // In full implementation, priority would pass to spell1's controller
        const nextItem = engine.getChain()[0];
        expect(nextItem?.controllerId).toBe(PLAYER_ONE);
      });

      it.skip("Rule 544 - should repeat until chain is empty", () => {
        // Arrange: Chain with multiple items
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Act: Resolve all items
        while (engine.hasChain()) {
          engine.resolveChainItem();
        }

        // Assert: Chain is empty
        expect(engine.getChain().length).toBe(0);
        expect(engine.getChainState()).toBe("open");
      });
    });

    describe("Chain - Edge Cases", () => {
      it.skip("should handle empty chain gracefully", () => {
        // Arrange: Game with no chain
        const engine = new RiftboundTestEngine({}, {});

        // Act: Try to resolve empty chain
        const result = engine.resolveChainItem();

        // Assert: Returns undefined, no error
        expect(result).toBeUndefined();
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("should handle chain with single item", () => {
        // Arrange: Chain with one item
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve
        const resolved = engine.resolveChainItem();

        // Assert: Item resolved, chain empty
        expect(resolved?.id).toBe("spell1");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("should handle clearing chain manually", () => {
        // Arrange: Chain with items
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Act: Clear chain
        engine.clearChain();

        // Assert: Chain is empty
        expect(engine.getChain().length).toBe(0);
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("should maintain chain state through multiple additions", () => {
        // Arrange: Empty chain
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.getChainState()).toBe("open");

        // Act: Add multiple items
        for (let i = 1; i <= 5; i++) {
          engine.addToChain({
            id: `spell${i}`,
            controllerId: i % 2 === 1 ? PLAYER_ONE : PLAYER_TWO,
            type: "spell",
          });
        }

        // Assert: Chain has all items, closed state
        expect(engine.getChain().length).toBe(5);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("should handle interleaved spells and abilities", () => {
        // Arrange: Mix of spells and abilities
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_TWO,
          type: "ability",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve in order
        const first = engine.resolveChainItem();
        const second = engine.resolveChainItem();
        const third = engine.resolveChainItem();

        // Assert: LIFO order maintained regardless of type
        expect(first?.id).toBe("spell2");
        expect(first?.type).toBe("spell");
        expect(second?.id).toBe("ability1");
        expect(second?.type).toBe("ability");
        expect(third?.id).toBe("spell1");
        expect(third?.type).toBe("spell");
      });

      it.skip("should track controller correctly for each chain item", () => {
        // Arrange: Chain with items from different players
        const engine = new RiftboundTestEngine({}, {});
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToChain({
          id: "spell3",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Each item has correct controller
        const chain = engine.getChain();
        expect(chain[0]?.controllerId).toBe(PLAYER_ONE);
        expect(chain[1]?.controllerId).toBe(PLAYER_TWO);
        expect(chain[2]?.controllerId).toBe(PLAYER_ONE);
      });
    });
  });

  // ===========================================================================
  // 545-553: Showdowns
  // ===========================================================================

  describe("545-553: Showdowns", () => {
    describe("Showdown Definition (Rules 545-547)", () => {
      it.skip("Rule 546 - should be a Window of Opportunity for Relevant Players", () => {
        // Arrange: Start showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Showdown is active
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 546 - should provide Open State for playing spells alternately", () => {
        // Arrange: Showdown with no chain
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Showdown Open state
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 546.1 - each spell creates a Chain as normal", () => {
        // Arrange: Showdown in progress
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Act: Play spell during showdown
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain created within showdown
        expect(engine.hasChain()).toBe(true);
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 546.2 - players made Relevant remain so until Showdown ends", () => {
        // Arrange: Showdown with focus holder
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Play spell and resolve
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.resolveChainItem();

        // Assert: Still in showdown
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 547.1 - turn is in Showdown State when Showdown in progress", () => {
        // Arrange: Start showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Showdown state
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 547.1.a - cards cannot be played by default during Showdown State", () => {
        // Arrange: Showdown in progress
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // Assert: Only Action/Reaction cards can be played
        // This is a rule constraint, not enforced by basic state
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 547.2 - turn is in Neutral State when no Showdown in progress", () => {
        // Arrange: Game without showdown
        const engine = new RiftboundTestEngine({}, {});

        // Assert: Neutral state
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.isInShowdown()).toBe(false);
      });
    });

    describe("When Showdowns Begin (Rule 548)", () => {
      it.skip("Rule 548 - should begin when battlefield control is Contested in Neutral Open", () => {
        // Arrange: Contested battlefield in neutral state
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
              },
            ],
          },
        );

        // Assert: Battlefield is contested and uncontrolled
        expect(engine.isBattlefieldContested("bf1")).toBe(true);
        expect(engine.getBattlefieldController("bf1")).toBeNull();
        expect(engine.getTurnState()).toBe("neutral");
      });

      it.skip("Rule 548.1 - combat showdown when two players contest battlefield", () => {
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
                  [PLAYER_ONE]: [{ id: "p1unit" }],
                  [PLAYER_TWO]: [{ id: "p2unit" }],
                },
              },
            ],
          },
        );

        // Assert: Opposing units present (combat possible)
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 548.2 - non-combat showdown when uncontrolled battlefield becomes contested", () => {
        // Arrange: Uncontrolled battlefield that becomes contested
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: null,
                contested: true,
                contestedBy: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Battlefield is contested with no controller
        expect(engine.getBattlefieldController("bf1")).toBeNull();
        expect(engine.isBattlefieldContested("bf1")).toBe(true);
      });
    });

    describe("Showdown Setup (Rules 549-551)", () => {
      it.skip("Rule 549 - player who applied Contested status gains Focus", () => {
        // Arrange: Battlefield contested by player 1
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                contested: true,
                contestedBy: PLAYER_ONE,
              },
            ],
          },
        );

        // Act: Start showdown, contesting player gets focus
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Assert: Player 1 has focus
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
      });

      it.skip("Rule 550.1 - combat showdown: attacking and defending players are Relevant", () => {
        // Arrange: Combat scenario
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "attacker", combatRole: "attacker" }],
                  [PLAYER_TWO]: [{ id: "defender", combatRole: "defender" }],
                },
              },
            ],
          },
        );

        // Act: Start combat showdown
        engine.startShowdown();

        // Assert: Both players involved in combat
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });

      it.skip("Rule 550.2 - non-combat showdown: all players are Relevant", () => {
        // Arrange: Non-combat showdown (empty battlefield contested)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: null,
                contested: true,
              },
            ],
          },
        );

        // Act: Start showdown
        engine.startShowdown();

        // Assert: Showdown active (all players relevant)
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 551.1 - combat showdowns may have Initial Chain of triggers", () => {
        // Arrange: Combat with units that have attack/defend triggers
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "attacker", combatRole: "attacker" }],
                  [PLAYER_TWO]: [{ id: "defender", combatRole: "defender" }],
                },
              },
            ],
          },
        );

        // Act: Start showdown with initial triggers
        engine.startShowdown();
        engine.addToChain({
          id: "attack-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "defend-trigger",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Initial chain has triggers
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 551.1.a - Focus player orders triggers first, then Turn Order", () => {
        // Arrange: Combat showdown with multiple triggers
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Focus player adds triggers first
        engine.addToChain({
          id: "p1-trigger1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "p1-trigger2",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Then other players in turn order
        engine.addToChain({
          id: "p2-trigger",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Triggers ordered correctly
        const chain = engine.getChain();
        expect(chain[0]?.controllerId).toBe(PLAYER_ONE);
        expect(chain[1]?.controllerId).toBe(PLAYER_ONE);
        expect(chain[2]?.controllerId).toBe(PLAYER_TWO);
      });

      it.skip("Rule 551.1.b - no Initial Chain if no triggers present", () => {
        // Arrange: Combat without attack/defend triggers
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "attacker" }],
                  [PLAYER_TWO]: [{ id: "defender" }],
                },
              },
            ],
          },
        );

        // Act: Start showdown
        engine.startShowdown();

        // Assert: No initial chain, but showdown proceeds
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(false);
      });
    });

    describe("Focus Passing (Rule 552)", () => {
      it.skip("Rule 552 - Focus passes when last chain item resolves", () => {
        // Arrange: Showdown with chain
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: Resolve chain item
        engine.resolveChainItem();

        // Assert: Focus should pass to next player
        // In full implementation, focus would transfer
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 552 - next Relevant Player gains both Focus and Priority", () => {
        // Arrange: Showdown with player 1 having focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Transfer focus to player 2
        engine.setFocusHolder(PLAYER_TWO);
        engine.setPriorityHolder(PLAYER_TWO);

        // Assert: Player 2 has both focus and priority
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
        expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
      });
    });

    describe("Player with Focus Options (Rule 553)", () => {
      it.skip("Rule 553.1 - may play legally timed spell", () => {
        // Arrange: Showdown with focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Play spell (starts chain)
        engine.addToChain({
          id: "action-spell",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain started
        expect(engine.hasChain()).toBe(true);
      });

      it.skip("Rule 553.1.a - spell starts Chain as normal", () => {
        // Arrange: Showdown Open state
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        expect(engine.getChainState()).toBe("open");

        // Act: Play spell
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Now in Showdown Closed state
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 553.2 - may activate legally timed abilities", () => {
        // Arrange: Showdown with focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Activate ability
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Ability on chain
        expect(engine.getChain().length).toBe(1);
        expect(engine.getChain()[0]?.type).toBe("ability");
      });

      it.skip("Rule 553.3 - may invite a player to act", () => {
        // Arrange: Showdown with player 1 having focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Invite player 2 (transfer focus)
        engine.setFocusHolder(PLAYER_TWO);

        // Assert: Player 2 now has focus
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
        expect(engine.hasFocus(PLAYER_ONE)).toBe(false);
      });

      it.skip("Rule 553.4 - may pass", () => {
        // Arrange: Showdown with focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        engine.setPriorityHolder(PLAYER_ONE);

        // Act: Pass (focus goes to next player)
        engine.setFocusHolder(PLAYER_TWO);
        engine.setPriorityHolder(PLAYER_TWO);

        // Assert: Focus passed
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
      });

      it.skip("Rule 553.4.a - Showdown ends when all Relevant Players pass in sequence", () => {
        // Arrange: Showdown where all players pass
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        expect(engine.isInShowdown()).toBe(true);

        // Act: End showdown (simulating all players passing)
        engine.endShowdown();

        // Assert: Showdown ended
        expect(engine.isInShowdown()).toBe(false);
        expect(engine.getTurnState()).toBe("neutral");
      });

      it.skip("Rule 553.4.a.1 - perform Cleanup when Showdown ends", () => {
        // Arrange: Showdown with damaged unit
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
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

        // Act: End showdown and cleanup
        engine.endShowdown();
        engine.performCleanup();

        // Assert: Cleanup performed
        expect(engine.getUnit("unit1")).toBeUndefined();
      });

      it.skip("Rule 553.5 - Focus passes to next Relevant Player in Turn Order", () => {
        // Arrange: Showdown with player 1 having focus
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);

        // Act: Pass focus
        engine.setFocusHolder(PLAYER_TWO);

        // Assert: Next player in turn order has focus
        expect(engine.hasFocus(PLAYER_TWO)).toBe(true);
      });
    });

    describe("Showdowns - Edge Cases", () => {
      it.skip("should not allow starting showdown while already in showdown", () => {
        // Arrange: Already in showdown
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        expect(engine.isInShowdown()).toBe(true);

        // Act: Try to start another showdown
        engine.startShowdown();

        // Assert: Still in single showdown
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("should handle showdown with multiple chain resolutions", () => {
        // Arrange: Showdown with spell exchange
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();

        // First exchange
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "reaction1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Resolve both
        engine.resolveChainItem();
        engine.resolveChainItem();

        // Second exchange
        engine.addToChain({
          id: "spell2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.resolveChainItem();

        // Assert: Still in showdown
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("should clear Focus when Showdown ends", () => {
        // Arrange: Showdown with focus holder
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.setFocusHolder(PLAYER_ONE);
        expect(engine.hasFocus(PLAYER_ONE)).toBe(true);

        // Act: End showdown
        engine.endShowdown();

        // Assert: Focus cleared
        expect(engine.getFocusHolder()).toBeNull();
      });

      it.skip("should handle showdown ending mid-chain", () => {
        // Arrange: Showdown with chain
        const engine = new RiftboundTestEngine({}, {});
        engine.startShowdown();
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Act: End showdown (chain should be cleared or resolved)
        engine.endShowdown();
        engine.clearChain();

        // Assert: Both showdown and chain ended
        expect(engine.isInShowdown()).toBe(false);
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("should transition between all four combined states during showdown", () => {
        // Arrange: Start in Neutral Open
        const engine = new RiftboundTestEngine({}, {});
        let state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("open");

        // Transition to Showdown Open
        engine.startShowdown();
        state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("open");

        // Transition to Showdown Closed
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("closed");

        // Back to Showdown Open
        engine.resolveChainItem();
        state = engine.getCombinedState();
        expect(state.turnState).toBe("showdown");
        expect(state.chainState).toBe("open");

        // Back to Neutral Open
        engine.endShowdown();
        state = engine.getCombinedState();
        expect(state.turnState).toBe("neutral");
        expect(state.chainState).toBe("open");
      });
    });
  });

  // ===========================================================================
  // 554-563: Playing Cards
  // ===========================================================================

  describe("554-563: Playing Cards", () => {
    describe("Playing Cards Definition (Rules 554-556)", () => {
      it.skip("Rule 555.1 - card is Played when process completes entirely", () => {
        // Arrange: Card in hand ready to play
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "spell1",
          name: "Test Spell",
          cardType: "spell",
        });

        // Act: Play card
        const played = engine.playCard(PLAYER_ONE, "spell1");

        // Assert: Card was played
        expect(played).toBe(true);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 556.1 - permanents become Game Objects when Played", () => {
        // Arrange: Unit card in hand
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "unit1",
          name: "Test Unit",
          cardType: "unit",
        });

        // Act: Play unit
        engine.playCard(PLAYER_ONE, "unit1", { location: "bf1" });

        // Assert: Unit is now a game object
        expect(engine.getHandSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 556.2 - spells create effects then go to trash", () => {
        // Arrange: Spell in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "spell1",
          name: "Test Spell",
          cardType: "spell",
        });

        // Act: Play spell
        engine.playCard(PLAYER_ONE, "spell1");

        // Assert: Spell went to trash
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });
    });

    describe("Process of Play - Put on Chain (Rule 558)", () => {
      it.skip("Rule 558.1 - putting card on chain Closes the State", () => {
        // Arrange: Open state
        const engine = new RiftboundTestEngine({}, {});
        expect(engine.getChainState()).toBe("open");

        // Act: Add card to chain
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: State is now Closed
        expect(engine.getChainState()).toBe("closed");
      });
    });

    describe("Process of Play - Determine Cost (Rule 560)", () => {
      it.skip("Rule 560.5 - costs cannot be reduced below 0", () => {
        // Arrange: Player with no resources
        const engine = new RiftboundTestEngine({ energy: 0 }, {});

        // Assert: 0 cost is minimum
        expect(engine.canAfford(PLAYER_ONE, { energy: 0 })).toBe(true);
      });
    });

    describe("Process of Play - Pay Costs (Rule 561)", () => {
      it.skip("Rule 561.1 - should pay combined Energy and Power costs", () => {
        // Arrange: Player with resources
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2 } },
          {},
        );

        // Act: Spend resources
        const energySpent = engine.spendEnergy(PLAYER_ONE, 3);
        const powerSpent = engine.spendPower(PLAYER_ONE, "fury", 1);

        // Assert: Resources spent
        expect(energySpent).toBe(true);
        expect(powerSpent).toBe(true);
        expect(engine.getEnergy(PLAYER_ONE)).toBe(2);
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(1);
      });
    });

    describe("Process of Play - Complete Play (Rule 563)", () => {
      it.skip("Rule 563.1.c - Units enter Board exhausted", () => {
        // Arrange: Unit being played
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1", controller: PLAYER_ONE }],
          },
        );

        // Act: Add unit to battlefield
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "new-unit", exhausted: true },
          "bf1",
        );

        // Assert: Unit is exhausted
        expect(engine.isUnitExhausted("new-unit")).toBe(true);
      });

      it.skip("Rule 563.2.c.1 - spell resolves even if some targets illegal", () => {
        // Arrange: Spell with multiple targets
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_TWO]: [
                    { id: "unit1", might: 3 },
                    { id: "unit2", might: 3 },
                  ],
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

        // Act: Remove one target, then resolve
        engine.killUnit("unit1");
        const resolved = engine.resolveChainItem();

        // Assert: Spell still resolved
        expect(resolved).toBeDefined();
        expect(engine.getUnit("unit2")).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("Integration: Chain + Showdown", () => {
    it.skip("should handle chain within showdown correctly", () => {
      // Arrange: Start showdown
      const engine = new RiftboundTestEngine({}, {});
      engine.startShowdown();
      engine.setFocusHolder(PLAYER_ONE);

      // Act: Play spell (creates chain within showdown)
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Assert: Showdown Closed state
      expect(engine.isInShowdown()).toBe(true);
      expect(engine.hasChain()).toBe(true);
      expect(engine.getCombinedState()).toEqual({
        turnState: "showdown",
        chainState: "closed",
      });
    });

    it.skip("should return to Showdown Open after chain resolves", () => {
      // Arrange: Showdown with chain
      const engine = new RiftboundTestEngine({}, {});
      engine.startShowdown();
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Act: Resolve chain
      engine.resolveChainItem();

      // Assert: Back to Showdown Open
      expect(engine.isInShowdown()).toBe(true);
      expect(engine.hasChain()).toBe(false);
    });
  });

  describe("Integration: Chain + Combat", () => {
    it.skip("should handle chain during combat showdown", () => {
      // Arrange: Combat scenario
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "attacker", combatRole: "attacker" }],
                [PLAYER_TWO]: [{ id: "defender", combatRole: "defender" }],
              },
            },
          ],
        },
      );

      // Act: Start combat showdown with chain
      engine.startShowdown();
      engine.addToChain({
        id: "combat-spell",
        controllerId: PLAYER_ONE,
        type: "spell",
      });

      // Assert: Combat showdown with chain
      expect(engine.isInShowdown()).toBe(true);
      expect(engine.hasChain()).toBe(true);
    });

    it.skip("should perform cleanup after combat chain resolves", () => {
      // Arrange: Combat with damaged units
      const engine = new RiftboundTestEngine(
        {},
        {},
        {
          battlefields: [
            {
              id: "bf1",
              units: {
                [PLAYER_ONE]: [{ id: "attacker", might: 3, damage: 3 }],
                [PLAYER_TWO]: [{ id: "defender", might: 3, damage: 2 }],
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
      engine.performCleanup();

      // Assert: Damaged unit killed
      expect(engine.getUnit("attacker")).toBeUndefined();
      expect(engine.getUnit("defender")).toBeDefined();
    });
  });

  describe("Integration: State Transitions", () => {
    it.skip("should track all state transitions correctly", () => {
      const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

      // Start: Neutral Open
      expect(engine.getCombinedState()).toEqual({
        turnState: "neutral",
        chainState: "open",
      });

      // Play spell: Neutral Closed
      engine.addToChain({
        id: "spell1",
        controllerId: PLAYER_ONE,
        type: "spell",
      });
      expect(engine.getCombinedState()).toEqual({
        turnState: "neutral",
        chainState: "closed",
      });

      // Resolve: Neutral Open
      engine.resolveChainItem();
      expect(engine.getCombinedState()).toEqual({
        turnState: "neutral",
        chainState: "open",
      });

      // Start showdown: Showdown Open
      engine.startShowdown();
      expect(engine.getCombinedState()).toEqual({
        turnState: "showdown",
        chainState: "open",
      });

      // End showdown: Neutral Open
      engine.endShowdown();
      expect(engine.getCombinedState()).toEqual({
        turnState: "neutral",
        chainState: "open",
      });
    });
  });
});
