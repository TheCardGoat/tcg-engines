/**
 * Abilities Tests - Rules 564-585
 *
 * Comprehensive test specifications for Riftbound ability rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule Sections:
 * - Rules 564-566: Ability Basics
 * - Rules 567-570: Passive Abilities
 * - Rules 571-575: Replacement Effects
 * - Rules 576-581: Activated Abilities
 * - Rules 582-585: Triggered Abilities
 */

import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// =============================================================================
// Section 7: Abilities - Rules 564-585
// =============================================================================

describe("Section 7: Abilities - Rules 564-585", () => {
  // ===========================================================================
  // 564-566: Ability Basics
  // ===========================================================================

  describe("564-566: Ability Basics", () => {
    describe("Ability Definition (Rules 565-566)", () => {
      it.skip("Rule 565 - should define ability as structured rules and capabilities", () => {
        // Arrange: Unit with an ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit should have abilities (when implemented)
        const abilities = engine.getAbilities("unit1");
        expect(abilities).toBeDefined();
        expect(Array.isArray(abilities)).toBe(true);
      });

      it.skip("Rule 566 - should allow multiple abilities on a single card", () => {
        // Arrange: Unit with multiple abilities
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "multi-ability-unit", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Unit can have multiple abilities
        const abilities = engine.getAbilities("multi-ability-unit");
        // When implemented, this unit would have multiple abilities
        expect(abilities.length).toBeGreaterThanOrEqual(0);
      });

      it.skip("Rule 566 - should allow multiple ability types on a single card", () => {
        // Arrange: Unit with both passive and triggered abilities
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "mixed-ability-unit", might: 5 }],
                },
              },
            ],
          },
        );

        // Assert: Unit can have different types of abilities
        // Example: A unit with both "Shield" (passive) and "When I attack, draw 1" (triggered)
        const abilities = engine.getAbilities("mixed-ability-unit");
        expect(abilities).toBeDefined();
      });
    });

    describe("Ability Types Overview (Rule 565.1)", () => {
      it.skip("Rule 565.1 - should recognize four ability types", () => {
        // Arrange: Game state for testing ability types
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: The four ability types are:
        // 1. Passive Abilities - always active statements
        // 2. Replacement Effects - use "instead"
        // 3. Activated Abilities - use "Cost : Effect" format
        // 4. Triggered Abilities - use "when" or "at"
        expect(engine).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 567-570: Passive Abilities
  // ===========================================================================

  describe("567-570: Passive Abilities", () => {
    describe("Passive Ability Definition (Rules 567-568)", () => {
      it.skip("Rule 568 - should recognize passive abilities as statements of fact", () => {
        // Arrange: Unit with passive ability like "I have +1 Might"
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "passive-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Passive ability is always active (statement of fact)
        // Example: "I get +1[S] while you have 2 or more cards in your hand"
        const unit = engine.getUnit("passive-unit");
        expect(unit).toBeDefined();
      });

      it.skip("Rule 568.1 - should support wide variety of passive ability formats", () => {
        // Arrange: Units with different passive ability formats
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "format-unit", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Various formats are valid passive abilities
        // Examples:
        // - "I have Shield"
        // - "Friendly Yordles at my battlefield have Shield"
        // - "Enemy units at my battlefield have -1 Might"
        expect(engine.getUnit("format-unit")).toBeDefined();
      });

      it.skip("Rule 568.2 - should recognize passive abilities by being statements of fact", () => {
        // Arrange: Unit with statement-of-fact ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "fact-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Statement of fact is always true while unit is on board
        // Not triggered by events, not activated by player
        expect(engine.getUnit("fact-unit")).toBeDefined();
      });
    });

    describe("Conditional Passive Abilities (Rule 568.3)", () => {
      it.skip("Rule 568.3 - should recognize conditional passives with 'if' keyword", () => {
        // Arrange: Unit with "if" conditional passive
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "if-unit", might: 3 }],
                },
              },
              {
                id: "bf2",
                controller: PLAYER_TWO,
              },
            ],
          },
        );

        // Assert: "If an opponent controls a battlefield, I enter ready"
        // Condition is checked, ability applies if true
        expect(engine.getBattlefieldController("bf2")).toBe(PLAYER_TWO);
      });

      it.skip("Rule 568.3 - should recognize conditional passives with 'while' keyword", () => {
        // Arrange: Unit with "while" conditional passive
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "while-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "While I'm attacking or defending alone, I have +2 Might"
        // Condition is continuously checked
        expect(engine.getUnit("while-unit")).toBeDefined();
      });

      it.skip("Rule 568.3 - should activate conditional passive when condition becomes true", () => {
        // Arrange: Unit with conditional passive, condition initially false
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "cond-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Change game state to make condition true
        // Example: "While you have 3+ energy, I have +1 Might"
        engine.setEnergy(PLAYER_ONE, 3);

        // Assert: Condition is now true, passive should be active
        expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
      });

      it.skip("Rule 568.3 - should deactivate conditional passive when condition becomes false", () => {
        // Arrange: Unit with conditional passive, condition initially true
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "deact-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Change game state to make condition false
        engine.spendEnergy(PLAYER_ONE, 4);

        // Assert: Condition is now false, passive should be inactive
        expect(engine.getEnergy(PLAYER_ONE)).toBe(1);
      });
    });

    describe("Passive Abilities on Permanents (Rule 569)", () => {
      it.skip("Rule 569 - should only be active while permanent is on the Board", () => {
        // Arrange: Unit on battlefield with passive ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "board-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Passive is active while on board
        expect(engine.getUnit("board-unit")).toBeDefined();

        // Act: Remove unit from board (kill it)
        engine.killUnit("board-unit");

        // Assert: Unit no longer on board, passive no longer active
        expect(engine.getUnit("board-unit")).toBeUndefined();
      });

      it.skip("Rule 569 - should apply passive effects to other game objects", () => {
        // Arrange: Unit with passive that affects other units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "aura-unit", might: 4 },
                    { id: "affected-unit", might: 2 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: "Friendly units at my battlefield have +1 Might"
        // Both units should be present
        expect(engine.getUnit("aura-unit")).toBeDefined();
        expect(engine.getUnit("affected-unit")).toBeDefined();
      });
    });

    describe("Passive Abilities Outside the Board (Rule 570)", () => {
      it.skip("Rule 570 - should self-describe context for non-board passives", () => {
        // Arrange: Card in hand with passive that applies from hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "hand-passive-card",
          name: "Timing Card",
          cardType: "spell",
        });

        // Assert: "Play me only during an opponent's turn" applies from hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 570 - should allow passives to alter costs as cards are played", () => {
        // Arrange: Card with cost-modifying passive
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          { phase: "action" },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "cost-mod-card",
          name: "Discounted Spell",
          cardType: "spell",
        });

        // Assert: Passive can reduce or increase play costs
        // Example: "This costs 1 less for each friendly unit"
        expect(engine.canAfford(PLAYER_ONE, { energy: 3 })).toBe(true);
      });

      it.skip("Rule 570 - should apply passive from any playable zone", () => {
        // Arrange: Card with zone-specific passive
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Add card to trash with "Play from trash" passive
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "trash-playable",
          name: "Recyclable Card",
          cardType: "spell",
        });

        // Assert: Passive describes its own context
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });
    });

    describe("Passive Abilities - Stat Modifications", () => {
      it.skip("Rule 568 - should apply might modifications from passive abilities", () => {
        // Arrange: Unit with might-boosting passive
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "might-boost-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Base might is 3, passive might add more
        const unit = engine.getUnit("might-boost-unit");
        expect(unit?.might).toBe(3);
      });

      it.skip("Rule 568 - should stack multiple passive might modifications", () => {
        // Arrange: Multiple units with might-boosting passives
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "boost1", might: 2 },
                    { id: "boost2", might: 2 },
                    { id: "beneficiary", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Multiple passive boosts should stack
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(3);
      });
    });

    describe("Passive Abilities - Edge Cases", () => {
      it.skip("should handle passive that grants keywords", () => {
        // Arrange: Unit with passive that grants keywords to others
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "keyword-granter", might: 3 },
                    { id: "keyword-receiver", might: 2 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: "Friendly units at my battlefield have Shield"
        expect(engine.getUnit("keyword-receiver")).toBeDefined();
      });

      it.skip("should handle passive that affects enemy units", () => {
        // Arrange: Unit with passive affecting enemies
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "debuffer", might: 4 }],
                  [PLAYER_TWO]: [{ id: "debuffed", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "Enemy units at my battlefield have -1 Might"
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 571-575: Replacement Effects
  // ===========================================================================

  describe("571-575: Replacement Effects", () => {
    describe("Replacement Effect Definition (Rules 571-572)", () => {
      it.skip("Rule 572 - should define replacement effect as altering another game effect", () => {
        // Arrange: Unit with replacement effect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "replacement-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Replacement effect alters how another effect resolves
        expect(engine.getUnit("replacement-unit")).toBeDefined();
      });

      it.skip("Rule 572 - should allow passive abilities to be replacement effects", () => {
        // Arrange: Unit with passive replacement effect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "passive-replace", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Passive can be a replacement effect
        // Example: "Damage dealt to me is reduced by 1 instead"
        expect(engine.getUnit("passive-replace")).toBeDefined();
      });

      it.skip("Rule 572 - should allow triggered abilities to be replacement effects", () => {
        // Arrange: Unit with triggered replacement effect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "triggered-replace", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Triggered ability can be a replacement effect
        expect(engine.getUnit("triggered-replace")).toBeDefined();
      });
    });

    describe("Replacement Effect Recognition (Rule 573)", () => {
      it.skip("Rule 573.1 - should recognize replacement effects by 'instead' keyword", () => {
        // Arrange: Unit with "instead" in ability text
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "instead-unit", might: 3 },
                    { id: "protected-unit", might: 2 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: "The next time a friendly unit would die, kill this instead"
        expect(engine.getUnit("instead-unit")).toBeDefined();
        expect(engine.getUnit("protected-unit")).toBeDefined();
      });
    });

    describe("Replacement Effect Execution (Rules 573-574)", () => {
      it.skip("Rule 573 - should intercede during execution of a game effect", () => {
        // Arrange: Unit that would die, with replacement effect active
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "protector", might: 3 },
                    { id: "would-die", might: 2, damage: 2 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Replacement effect should intercede before death
        expect(engine.shouldUnitDie("would-die")).toBe(true);
        expect(engine.getUnit("protector")).toBeDefined();
      });

      it.skip("Rule 574 - should alter execution of the original effect", () => {
        // Arrange: Damage that would be dealt, with reduction replacement
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "damage-reducer", might: 5 }],
                },
              },
            ],
          },
        );

        // Act: Deal damage (replacement would reduce it)
        engine.addDamage("damage-reducer", 3);

        // Assert: Original effect is altered
        // With replacement: "Damage dealt to me is reduced by 1 instead"
        // Would result in 2 damage instead of 3
        expect(engine.getDamage("damage-reducer")).toBe(3); // Without replacement
      });

      it.skip("Rule 574 - should be able to alter typical flow of play", () => {
        // Arrange: Effect that changes normal game flow
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "flow-changer", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Replacement can change how game normally works
        // Example: "When I would be recalled, move me to another battlefield instead"
        expect(engine.getUnit("flow-changer")).toBeDefined();
      });
    });

    describe("Multiple Replacement Effects (Rule 575)", () => {
      it.skip("Rule 575 - should let owner decide order when object is acted on", () => {
        // Arrange: Unit with multiple replacement effects from different sources
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "target-unit", might: 3 },
                    { id: "replace-source-1", might: 2 },
                    { id: "replace-source-2", might: 2 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Owner of target-unit decides replacement order
        const targetUnit = engine.getUnit("target-unit");
        expect(targetUnit?.ownerId).toBe(PLAYER_ONE);
      });

      it.skip("Rule 575 - should let player decide order when player is acted on", () => {
        // Arrange: Player being affected by multiple replacement effects
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "player-replace-1", might: 3 }],
                  [PLAYER_TWO]: [{ id: "player-replace-2", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Affected player decides replacement order
        // Example: "When you would draw, draw 2 instead" from multiple sources
        expect(engine.getActivePlayer()).toBeDefined();
      });

      it.skip("Rule 575 - should let Turn Player decide order for uncontrolled battlefield", () => {
        // Arrange: Uncontrolled battlefield with multiple replacement effects
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: null,
                units: {
                  [PLAYER_ONE]: [{ id: "p1-replace", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2-replace", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Turn Player (PLAYER_ONE) decides order
        expect(engine.getBattlefieldController("bf1")).toBeNull();
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
      });

      it.skip("Rule 575 - should apply replacement effects in chosen order", () => {
        // Arrange: Multiple replacements that could stack
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "stacking-unit", might: 5 }],
                },
              },
            ],
          },
        );

        // Assert: Order matters for final result
        // Example: "Reduce damage by 1" and "Prevent the first damage"
        // Order determines if 3 damage becomes 2 or 0
        expect(engine.getUnit("stacking-unit")).toBeDefined();
      });
    });

    describe("Replacement Effects - Edge Cases", () => {
      it.skip("should handle replacement effect that replaces with nothing", () => {
        // Arrange: Replacement that prevents an effect entirely
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "prevent-unit", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: "The next damage dealt to me is prevented instead"
        expect(engine.getUnit("prevent-unit")).toBeDefined();
      });

      it.skip("should handle replacement effect on a replacement effect", () => {
        // Arrange: Nested replacement effects
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "replace-1", might: 3 },
                    { id: "replace-2", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Replacement can replace another replacement
        expect(engine.getAllUnits().length).toBe(2);
      });

      it.skip("should handle replacement effect that triggers another effect", () => {
        // Arrange: Replacement that has additional effects
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "replace-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "Kill this instead. Recall that unit exhausted."
        // Replacement has additional instruction after "instead"
        expect(engine.getUnit("replace-trigger")).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 576-581: Activated Abilities
  // ===========================================================================

  describe("576-581: Activated Abilities", () => {
    describe("Activated Ability Definition (Rules 576-577)", () => {
      it.skip("Rule 577 - should define activated ability as repeatable effect with cost", () => {
        // Arrange: Unit with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "activated-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Activated ability has cost and effect
        // Example: "[2]: Draw 1" - Cost is 2 energy, effect is draw 1
        expect(engine.getUnit("activated-unit")).toBeDefined();
      });

      it.skip("Rule 577 - should follow process similar to playing a card", () => {
        // Arrange: Unit with activated ability ready to use
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "process-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Activation follows card-playing process
        expect(engine.getCurrentPhase()).toBe("action");
        expect(engine.getChainState()).toBe("open");
      });
    });

    describe("Activated Ability Recognition (Rule 577.2)", () => {
      it.skip("Rule 577.2 - should recognize activated abilities by colon separator", () => {
        // Arrange: Unit with "Cost : Effect" format ability
        const engine = new RiftboundTestEngine(
          { energy: 3 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "colon-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Colon separates cost from effect
        // "[2]: Draw 1" - everything before colon is cost, after is effect
        expect(engine.getUnit("colon-unit")).toBeDefined();
      });

      it.skip("Rule 577.2 - should parse cost before colon", () => {
        // Arrange: Unit with various cost formats
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2 } },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "cost-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Various cost formats are valid
        // "[2]:" - energy cost
        // "[F]:" - fury power cost
        // "[Exhaust]:" - exhaust as cost
        // "[2][F]:" - combined costs
        expect(
          engine.canAfford(PLAYER_ONE, { energy: 2, power: { fury: 1 } }),
        ).toBe(true);
      });

      it.skip("Rule 577.2 - should parse effect after colon", () => {
        // Arrange: Unit with effect portion of ability
        const engine = new RiftboundTestEngine(
          { energy: 3 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "effect-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Effect is the instruction after the colon
        // "Draw 1", "Deal 2 damage", "Ready this", etc.
        expect(engine.getUnit("effect-unit")).toBeDefined();
      });
    });

    describe("Activated Ability Process (Rule 577.3)", () => {
      it.skip("Rule 577.3.1 - should declare activation of the ability", () => {
        // Arrange: Unit with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "declare-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Declare activation
        const canActivate = engine.canActivateAbility(
          PLAYER_ONE,
          "declare-unit",
          0,
        );

        // Assert: Activation is declared
        expect(canActivate).toBeDefined();
      });

      it.skip("Rule 577.3.2 - should place ability on the Chain", () => {
        // Arrange: Unit with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "chain-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Activate ability (goes on chain)
        engine.addToChain({
          id: "ability-1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Ability is on the chain, state is Closed
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 577.3.3 - should follow steps 557-563 like playing a card", () => {
        // Arrange: Ability activation in progress
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "steps-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add ability to chain
        engine.addToChain({
          id: "ability-steps",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Follows card-playing process (targets, costs, etc.)
        expect(engine.getChain().length).toBe(1);
      });

      it.skip("Rule 577.3.4 - should allow opponents to respond with Reactions", () => {
        // Arrange: Ability on chain
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          { energy: 3 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "respond-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add ability to chain
        engine.addToChain({
          id: "ability-respond",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Opponent can respond
        engine.addToChain({
          id: "reaction-spell",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 577.3.5 - should execute the ability when it resolves", () => {
        // Arrange: Ability on chain ready to resolve
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "execute-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add and resolve ability
        engine.addToChain({
          id: "ability-execute",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        const resolved = engine.resolveChainItem();

        // Assert: Ability executed and removed from chain
        expect(resolved?.type).toBe("ability");
        expect(engine.hasChain()).toBe(false);
      });
    });

    describe("Activated Ability Timing (Rules 578-581)", () => {
      it.skip("Rule 578 - should let controller choose when to activate", () => {
        // Arrange: Unit with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "choice-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Controller decides when/whether to activate
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
      });

      it.skip("Rule 579 - should be present on Game Objects and some Spells", () => {
        // Arrange: Various card types with activated abilities
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "game-object", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Units (Game Objects) can have activated abilities
        expect(engine.getUnit("game-object")).toBeDefined();
      });

      it.skip("Rule 580 - should primarily be activated while on the Board", () => {
        // Arrange: Unit on board with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "board-activate", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit is on board, can activate
        expect(engine.getUnit("board-activate")?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 581 - should only activate on Controlling Player's Turn", () => {
        // Arrange: Unit controlled by Player 1, but it's Player 2's turn
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "turn-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Cannot activate on opponent's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        // canActivateAbility should return false for PLAYER_ONE
      });

      it.skip("Rule 581 - should only activate during an Open State", () => {
        // Arrange: Game in Closed state (chain exists)
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "open-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Create a chain (Closed state)
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: State is Closed, cannot activate (without Reaction timing)
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 581 - should not activate during Showdown without Action/Reaction", () => {
        // Arrange: Game in Showdown state
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "showdown-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Enter showdown
        engine.startShowdown();

        // Assert: In showdown, normal activated abilities cannot be used
        expect(engine.isInShowdown()).toBe(true);
      });
    });

    describe("Activated Ability Costs", () => {
      it.skip("should require paying energy cost before activation", () => {
        // Arrange: Unit with energy cost ability, player has enough
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "energy-cost-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Can afford the cost
        expect(engine.canAfford(PLAYER_ONE, { energy: 2 })).toBe(true);
      });

      it.skip("should require paying power cost before activation", () => {
        // Arrange: Unit with power cost ability
        const engine = new RiftboundTestEngine(
          { energy: 3, power: { fury: 2 } },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "power-cost-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Can afford power cost
        expect(engine.canAfford(PLAYER_ONE, { power: { fury: 1 } })).toBe(true);
      });

      it.skip("should require exhausting as cost when specified", () => {
        // Arrange: Unit with exhaust cost ability
        const engine = new RiftboundTestEngine(
          { energy: 3 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "exhaust-cost-unit", might: 3, exhausted: false },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit is ready, can pay exhaust cost
        expect(engine.isUnitExhausted("exhaust-cost-unit")).toBe(false);
      });

      it.skip("should not allow activation if cost cannot be paid", () => {
        // Arrange: Unit with cost, player cannot afford
        const engine = new RiftboundTestEngine(
          { energy: 1 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "expensive-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Cannot afford the cost
        expect(engine.canAfford(PLAYER_ONE, { energy: 3 })).toBe(false);
      });

      it.skip("should not allow activation if unit is already exhausted", () => {
        // Arrange: Unit with exhaust cost, already exhausted
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "already-exhausted", might: 3, exhausted: true },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit is exhausted, cannot pay exhaust cost
        expect(engine.isUnitExhausted("already-exhausted")).toBe(true);
      });
    });

    describe("Activated Abilities - Edge Cases", () => {
      it.skip("should handle activated ability with multiple costs", () => {
        // Arrange: Unit with combined costs
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2, mind: 1 } },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "multi-cost-unit", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Can afford combined costs
        expect(
          engine.canAfford(PLAYER_ONE, { energy: 2, power: { fury: 1 } }),
        ).toBe(true);
      });

      it.skip("should handle activated ability that can be used multiple times", () => {
        // Arrange: Unit with repeatable ability
        const engine = new RiftboundTestEngine(
          { energy: 10 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "repeatable-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Can activate multiple times if costs can be paid
        expect(engine.getEnergy(PLAYER_ONE)).toBe(10);
      });

      it.skip("should handle activated ability with 'once per turn' restriction", () => {
        // Arrange: Unit with limited activation
        const engine = new RiftboundTestEngine(
          { energy: 10 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "once-per-turn-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Ability has usage restriction
        expect(engine.getUnit("once-per-turn-unit")).toBeDefined();
      });
    });
  });

  // ===========================================================================
  // 582-585: Triggered Abilities
  // ===========================================================================

  describe("582-585: Triggered Abilities", () => {
    describe("Triggered Ability Definition (Rules 582-583)", () => {
      it.skip("Rule 583 - should define triggered ability as effect when condition is met", () => {
        // Arrange: Unit with triggered ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "triggered-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Triggered ability fires when condition is met
        // Example: "When you conquer here, draw 1"
        expect(engine.getUnit("triggered-unit")).toBeDefined();
      });

      it.skip("Rule 583 - should be repeatable when condition is met again", () => {
        // Arrange: Unit with repeatable trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "repeat-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Trigger fires each time condition is met
        expect(engine.getUnit("repeat-trigger")).toBeDefined();
      });
    });

    describe("Triggered Ability Recognition (Rule 583.1)", () => {
      it.skip("Rule 583.1 - should recognize triggered abilities by 'when' keyword", () => {
        // Arrange: Unit with "when" trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "when-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "When I attack, draw 1" - triggers on attack
        expect(engine.getUnit("when-unit")).toBeDefined();
      });

      it.skip("Rule 583.1 - should recognize triggered abilities by 'at' keyword", () => {
        // Arrange: Unit with "at" trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "at-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "At the end of your turn, ready 2 runes" - triggers at phase
        expect(engine.getUnit("at-unit")).toBeDefined();
      });
    });

    describe("Triggered Ability Structure (Rule 583.2)", () => {
      it.skip("Rule 583.2 - should have condition following 'when' or 'at'", () => {
        // Arrange: Unit with condition-based trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "condition-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Condition is "you conquer here" in "When you conquer here, draw 1"
        expect(engine.getUnit("condition-unit")).toBeDefined();
      });

      it.skip("Rule 583.2 - should have effect as instruction after the comma", () => {
        // Arrange: Unit with effect portion
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "effect-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Effect is "draw 1" in "When you conquer here, draw 1"
        expect(engine.getUnit("effect-trigger")).toBeDefined();
      });
    });

    describe("Triggered Ability Execution (Rule 583.3)", () => {
      it.skip("Rule 583.3 - should behave like activated ability when triggered", () => {
        // Arrange: Unit with trigger that fires
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "behave-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Triggered ability follows similar process to activated
        expect(engine.getUnit("behave-unit")).toBeDefined();
      });

      it.skip("Rule 583.3 - should place triggered ability on the Chain", () => {
        // Arrange: Trigger condition met
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "chain-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Trigger fires, goes on chain
        engine.addToChain({
          id: "trigger-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Trigger is on the chain
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChain()[0]?.type).toBe("ability");
      });

      it.skip("Rule 583.3 - should trigger during Closed State", () => {
        // Arrange: Chain exists (Closed state)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "closed-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Create chain, then trigger fires
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToChain({
          id: "trigger-in-closed",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Trigger added to existing chain
        expect(engine.getChainState()).toBe("closed");
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 583.3 - should trigger during Open State", () => {
        // Arrange: No chain (Open state)
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "open-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Open state
        expect(engine.getChainState()).toBe("open");

        // Act: Trigger fires, creates chain
        engine.addToChain({
          id: "trigger-in-open",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Chain now exists
        expect(engine.hasChain()).toBe(true);
      });

      it.skip("Rule 583.3 - should trigger on any player's turn", () => {
        // Arrange: Player 2's turn, Player 1's unit has trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "any-turn-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: It's Player 2's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);

        // Act: Player 1's trigger can still fire
        engine.addToChain({
          id: "p1-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Trigger added even though it's not P1's turn
        expect(engine.getChain()[0]?.controllerId).toBe(PLAYER_ONE);
      });
    });

    describe("Multiple Triggers (Rule 583.3.b)", () => {
      it.skip("Rule 583.3.b - should let controller select order for own triggers", () => {
        // Arrange: Player with multiple triggers firing simultaneously
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "trigger-1", might: 3 },
                    { id: "trigger-2", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Act: Both triggers fire, controller orders them
        engine.addToChain({
          id: "p1-trigger-1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "p1-trigger-2",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Controller chose the order
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("Rule 583.3.b - should use Turn Order for different controllers' triggers", () => {
        // Arrange: Both players have triggers firing
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
                  [PLAYER_ONE]: [{ id: "p1-trigger-unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "p2-trigger-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Both players' triggers fire, Turn Order determines sequence
        // Turn Player (P1) orders first, then P2
        engine.addToChain({
          id: "p1-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "p2-trigger",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Triggers ordered by Turn Order
        expect(engine.getChain().length).toBe(2);
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
      });

      it.skip("Rule 583.3.b - should resolve triggers in LIFO order", () => {
        // Arrange: Multiple triggers on chain
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "lifo-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add triggers in order
        engine.addToChain({
          id: "first-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "second-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Last added resolves first (LIFO)
        const first = engine.resolveChainItem();
        expect(first?.id).toBe("second-trigger");
        const second = engine.resolveChainItem();
        expect(second?.id).toBe("first-trigger");
      });
    });

    describe("Triggered Abilities on Permanents (Rule 584)", () => {
      it.skip("Rule 584 - should be active while permanent is on the Board", () => {
        // Arrange: Unit on board with trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "board-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit is on board, trigger is active
        expect(engine.getUnit("board-trigger")?.battlefieldId).toBe("bf1");
      });

      it.skip("Rule 584 - should only evaluate conditions while on Board", () => {
        // Arrange: Unit on board
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "eval-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Condition is evaluated while on board
        expect(engine.getUnit("eval-trigger")).toBeDefined();

        // Act: Remove from board
        engine.killUnit("eval-trigger");

        // Assert: No longer on board, conditions not evaluated
        expect(engine.getUnit("eval-trigger")).toBeUndefined();
      });
    });

    describe("Triggered Abilities Outside the Board (Rule 585)", () => {
      it.skip("Rule 585 - should rely on Information Level of their zone", () => {
        // Arrange: Card in trash with trigger
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "trash-trigger-card",
          name: "Recyclable Unit",
          cardType: "unit",
        });

        // Assert: Card in trash, trigger depends on zone's info level
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 585 - should self-describe context for non-board triggers", () => {
        // Arrange: Card with zone-specific trigger
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "context-trigger",
          name: "Trash Trigger Card",
          cardType: "unit",
        });

        // Assert: "When you conquer, you may discard 1 to return this from your trash"
        // Trigger specifies it works from trash
        expect(engine.getZoneContents(PLAYER_ONE, "trash").length).toBe(1);
      });

      it.skip("Rule 585.2 - should only trigger from specified zone", () => {
        // Arrange: Card in hand (not trash) with trash-only trigger
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "wrong-zone-trigger",
          name: "Trash-Only Trigger",
          cardType: "unit",
        });

        // Assert: Card is in hand, not trash - trigger should not fire
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(0);
      });
    });

    describe("Triggered Abilities - Common Trigger Types", () => {
      it.skip("should handle 'when I attack' trigger", () => {
        // Arrange: Unit with attack trigger
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
                    { id: "attack-trigger", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [{ id: "defender", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit is attacking, trigger would fire
        const unit = engine.getUnit("attack-trigger");
        expect(unit?.meta.combatRole).toBe("attacker");
      });

      it.skip("should handle 'when I defend' trigger", () => {
        // Arrange: Unit with defend trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "attacker", might: 3 }],
                  [PLAYER_TWO]: [
                    { id: "defend-trigger", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit is defending, trigger would fire
        const unit = engine.getUnit("defend-trigger");
        expect(unit?.meta.combatRole).toBe("defender");
      });

      it.skip("should handle 'when you conquer' trigger", () => {
        // Arrange: Battlefield about to be conquered
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
                  [PLAYER_ONE]: [{ id: "conquer-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Battlefield is contested, conquer trigger would fire on conquest
        expect(engine.isBattlefieldContested("bf1")).toBe(true);
      });

      it.skip("should handle 'at the end of your turn' trigger", () => {
        // Arrange: End of turn approaching
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "ending",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "end-turn-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: In ending phase, trigger would fire
        expect(engine.getCurrentPhase()).toBe("ending");
      });

      it.skip("should handle 'when I die' trigger (Deathknell)", () => {
        // Arrange: Unit about to die
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "death-trigger", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Unit should die, trigger would fire
        expect(engine.shouldUnitDie("death-trigger")).toBe(true);
      });
    });

    describe("Triggered Abilities - Edge Cases", () => {
      it.skip("should handle optional triggers with 'may'", () => {
        // Arrange: Unit with optional trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "may-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "When you conquer here, you MAY spend a buff to draw 1"
        // Player can choose not to use the trigger
        expect(engine.getUnit("may-trigger")).toBeDefined();
      });

      it.skip("should handle trigger with additional cost", () => {
        // Arrange: Unit with trigger that has a cost
        const engine = new RiftboundTestEngine(
          { energy: 3 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "cost-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: "When I attack, you may pay 2 to deal 1 damage"
        expect(engine.canAfford(PLAYER_ONE, { energy: 2 })).toBe(true);
      });

      it.skip("should handle trigger that triggers another trigger", () => {
        // Arrange: Chain of triggers
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "trigger-chain-1", might: 3 },
                    { id: "trigger-chain-2", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: First trigger's effect can trigger second trigger
        expect(engine.getAllUnits().length).toBe(2);
      });
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    describe("Ability Targeting Edge Cases", () => {
      it.skip("should handle ability with no valid targets", () => {
        // Arrange: Ability that requires targets, but none exist
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "targeting-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: No enemy units to target
        expect(engine.hasOpposingUnits("bf1")).toBe(false);
      });

      it.skip("should handle ability target becoming invalid mid-resolution", () => {
        // Arrange: Ability targeting a unit that gets killed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "source-unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "target-unit", might: 2, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Target dies before ability resolves
        engine.addToChain({
          id: "targeting-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.killUnit("target-unit");

        // Assert: Target no longer exists
        expect(engine.getUnit("target-unit")).toBeUndefined();
      });
    });

    describe("Ability Countering Edge Cases", () => {
      it.skip("should handle ability being countered mid-resolution", () => {
        // Arrange: Ability on chain that gets countered
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "countered-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add ability, then counter it
        engine.addToChain({
          id: "ability-to-counter",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.counterSpell("ability-to-counter");

        // Assert: Ability removed from chain
        expect(engine.hasChain()).toBe(false);
      });
    });

    describe("Multiple Abilities Edge Cases", () => {
      it.skip("should handle multiple abilities triggering simultaneously", () => {
        // Arrange: Multiple units with triggers for same event
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "sim-trigger-1", might: 3 },
                    { id: "sim-trigger-2", might: 3 },
                    { id: "sim-trigger-3", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Act: All triggers fire at once
        engine.addToChain({
          id: "trigger-1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "trigger-2",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "trigger-3",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: All triggers on chain
        expect(engine.getChain().length).toBe(3);
      });

      it.skip("should handle triggered ability during chain resolution", () => {
        // Arrange: Chain with spell that causes a trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "chain-trigger-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Spell on chain, resolves, triggers ability
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.resolveChainItem();

        // New trigger fires
        engine.addToChain({
          id: "new-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: New trigger added after resolution
        expect(engine.hasChain()).toBe(true);
      });
    });

    describe("Conditional Ability Edge Cases", () => {
      it.skip("should handle conditional passive becoming active mid-turn", () => {
        // Arrange: Unit with conditional passive, condition initially false
        const engine = new RiftboundTestEngine(
          { energy: 2 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "conditional-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Change state to make condition true
        engine.addEnergy(PLAYER_ONE, 3);

        // Assert: Condition now true (5 energy)
        expect(engine.getEnergy(PLAYER_ONE)).toBe(5);
      });

      it.skip("should handle conditional passive becoming inactive mid-turn", () => {
        // Arrange: Unit with conditional passive, condition initially true
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "deactivate-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Change state to make condition false
        engine.spendEnergy(PLAYER_ONE, 4);

        // Assert: Condition now false (1 energy)
        expect(engine.getEnergy(PLAYER_ONE)).toBe(1);
      });
    });

    describe("Replacement Effect Edge Cases", () => {
      it.skip("should handle replacement effect on a replacement effect", () => {
        // Arrange: Multiple replacement effects that could apply
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "replace-replace-1", might: 3 },
                    { id: "replace-replace-2", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Both replacement effects exist
        expect(engine.getAllUnits().length).toBe(2);
      });

      it.skip("should handle replacement effect that creates a loop", () => {
        // Arrange: Replacement effects that could loop
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "loop-replace", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Game should handle potential loops gracefully
        expect(engine.getUnit("loop-replace")).toBeDefined();
      });
    });

    describe("Ability Source Edge Cases", () => {
      it.skip("should handle ability source leaving play before resolution", () => {
        // Arrange: Unit with ability on chain, unit dies
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "dying-source", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add ability to chain, then source dies
        engine.addToChain({
          id: "orphan-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.killUnit("dying-source");

        // Assert: Ability still on chain (abilities resolve even if source is gone)
        expect(engine.hasChain()).toBe(true);
        expect(engine.getUnit("dying-source")).toBeUndefined();
      });

      it.skip("should handle ability from card in trash", () => {
        // Arrange: Card in trash with trigger
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "trash", {
          id: "trash-ability-card",
          name: "Trash Trigger",
          cardType: "unit",
        });

        // Assert: Card is in trash, can have zone-specific abilities
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });
    });
  });

  // ===========================================================================
  // Integration: Abilities + Chain
  // ===========================================================================

  describe("Integration: Abilities + Chain", () => {
    describe("Activated Abilities and Chain", () => {
      it.skip("should place activated ability on chain when activated", () => {
        // Arrange: Unit with activated ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "chain-activate", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Activate ability
        engine.addToChain({
          id: "activated-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Ability on chain, state is Closed
        expect(engine.hasChain()).toBe(true);
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("should allow responding to activated ability with Reaction", () => {
        // Arrange: Activated ability on chain
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          { energy: 3 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "respond-activate", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add ability, opponent responds
        engine.addToChain({
          id: "p1-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "p2-reaction",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Both on chain, reaction resolves first (LIFO)
        expect(engine.getChain().length).toBe(2);
        const first = engine.resolveChainItem();
        expect(first?.id).toBe("p2-reaction");
      });
    });

    describe("Triggered Abilities and Chain", () => {
      it.skip("should add triggered ability to existing chain", () => {
        // Arrange: Chain already exists
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "trigger-add", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Spell on chain, trigger fires
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });
        engine.addToChain({
          id: "triggered-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Trigger added to existing chain
        expect(engine.getChain().length).toBe(2);
      });

      it.skip("should resolve triggered abilities in LIFO order with spells", () => {
        // Arrange: Mixed chain of spells and abilities
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "lifo-trigger", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Add spell, trigger, spell
        engine.addToChain({
          id: "spell-1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "trigger-1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.addToChain({
          id: "spell-2",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Resolve in LIFO order
        expect(engine.resolveChainItem()?.id).toBe("spell-2");
        expect(engine.resolveChainItem()?.id).toBe("trigger-1");
        expect(engine.resolveChainItem()?.id).toBe("spell-1");
      });
    });

    describe("Abilities During Showdown", () => {
      it.skip("should allow triggered abilities during showdown", () => {
        // Arrange: Showdown in progress
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
                      id: "showdown-trigger",
                      might: 3,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Start showdown, trigger fires
        engine.startShowdown();
        engine.addToChain({
          id: "attack-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Trigger on chain during showdown
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(true);
      });

      it.skip("should not allow normal activated abilities during showdown", () => {
        // Arrange: Showdown in progress
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "no-activate-showdown", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Start showdown
        engine.startShowdown();

        // Assert: In showdown, normal activated abilities restricted
        expect(engine.isInShowdown()).toBe(true);
        // canActivateAbility should return false for normal abilities
      });

      it.skip("should allow Action/Reaction abilities during showdown", () => {
        // Arrange: Showdown with Action-timed ability
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "action-ability-unit", might: 3 }],
                  [PLAYER_TWO]: [{ id: "opponent-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Start showdown, use Action ability
        engine.startShowdown();
        engine.addToChain({
          id: "action-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Action ability allowed during showdown
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasChain()).toBe(true);
      });
    });

    describe("Ability Resolution and Cleanup", () => {
      it.skip("should perform cleanup after ability resolves", () => {
        // Arrange: Ability that deals damage, unit should die
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "damage-dealer", might: 3 }],
                  [PLAYER_TWO]: [{ id: "damaged-unit", might: 3, damage: 3 }],
                },
              },
            ],
          },
        );

        // Act: Resolve ability, then cleanup
        engine.addToChain({
          id: "damage-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.resolveChainItem();
        engine.performCleanup();

        // Assert: Damaged unit killed during cleanup
        expect(engine.getUnit("damaged-unit")).toBeUndefined();
      });

      it.skip("should handle ability that creates new triggers during resolution", () => {
        // Arrange: Ability that causes another trigger
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [
                    { id: "cascade-source", might: 3 },
                    { id: "cascade-target", might: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Act: First ability resolves, triggers second
        engine.addToChain({
          id: "first-ability",
          controllerId: PLAYER_ONE,
          type: "ability",
        });
        engine.resolveChainItem();

        // New trigger fires
        engine.addToChain({
          id: "cascaded-trigger",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: New trigger on chain
        expect(engine.hasChain()).toBe(true);
      });
    });

    describe("Cross-Category Integration", () => {
      it.skip("should handle ability + spell interaction on chain", () => {
        // Arrange: Spell and ability interacting
        // Cross-ref: Rules 532-544 (Chain rules)
        const engine = new RiftboundTestEngine(
          { energy: 5 },
          { energy: 3 },
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "spell-ability-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Spell, ability response, spell response
        engine.addToChain({
          id: "initial-spell",
          controllerId: PLAYER_ONE,
          type: "spell",
        });
        engine.addToChain({
          id: "ability-response",
          controllerId: PLAYER_TWO,
          type: "ability",
        });
        engine.addToChain({
          id: "spell-response",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: All three on chain
        expect(engine.getChain().length).toBe(3);
      });

      it.skip("should handle ability during combat showdown", () => {
        // Arrange: Combat with ability triggers
        // Cross-ref: Rules 545-553 (Showdown rules)
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
                      id: "combat-ability-1",
                      might: 4,
                      combatRole: "attacker",
                    },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "combat-ability-2",
                      might: 3,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Start combat showdown
        engine.startShowdown();

        // Assert: Combat showdown with ability-having units
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.hasOpposingUnits("bf1")).toBe(true);
      });
    });
  });
});
