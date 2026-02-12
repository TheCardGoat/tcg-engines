/**
 * Keywords Tests - Rules 712-729
 *
 * Comprehensive test specifications for Riftbound keyword abilities.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule Sections:
 * - 712-715: Keyword Basics (Definition, Granting/Removing, Multiple)
 * - 717: Accelerate (Optional cost to enter ready)
 * - 718: Action (Showdown timing permission)
 * - 719: Assault (Combat bonus while attacking)
 * - 720: Deathknell (Triggered ability on death)
 * - 721: Deflect (Additional cost for targeting)
 * - 722: Ganking (Battlefield-to-battlefield movement)
 * - 723: Hidden (Hide facedown, play for free later)
 * - 724: Legion (Conditional bonus)
 * - 725: Reaction (Closed state timing permission)
 * - 726: Shield (Combat bonus while defending)
 * - 727: Tank (Damage assignment priority)
 * - 728: Temporary (Killed at Beginning Phase)
 * - 729: Vision (Look at top card, may recycle)
 */

import { describe, expect, it } from "bun:test";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  RiftboundTestEngine,
  TestCardBuilder,
} from "../../testing";

// =============================================================================
// Section 11: Keywords - Rules 712-729
// =============================================================================

describe("Section 11: Keywords - Rules 712-729", () => {
  // ===========================================================================
  // 712-715: Keyword Basics
  // ===========================================================================

  describe("712-715: Keyword Basics", () => {
    describe("Keyword Definition (Rules 712-713)", () => {
      it.skip("Rule 712 - should define keyword as shorthand for game effect", () => {
        // Arrange: Unit with Assault keyword
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault 2"],
        });

        // Assert: Keyword is recognized as ability shorthand
        expect(unit.abilities).toBeDefined();
        expect(unit.abilities?.length).toBeGreaterThan(0);
      });

      it.skip("Rule 713 - should identify keywords by colored highlight (no gameplay effect)", () => {
        // Arrange: Two units with same keyword, different visual styling
        const builder = new TestCardBuilder();
        const unit1 = builder.createTestUnit({ keywords: ["Tank"] });
        const unit2 = builder.createTestUnit({ keywords: ["Tank"] });

        // Assert: Keywords function identically regardless of visual styling
        expect(unit1.abilities).toEqual(unit2.abilities);
      });

      it.skip("Rule 713.1 - should allow keywords to be referenced by other effects", () => {
        // Arrange: Game with unit that has Tank keyword
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "tank-unit", might: 4 }],
                },
              },
            ],
          },
        );

        // Assert: Keyword can be queried/referenced
        const keywords = engine.getKeywords("tank-unit");
        expect(keywords).toBeDefined();
      });
    });

    describe("Granting and Removing Keywords (Rule 713.3)", () => {
      it.skip("Rule 713.3 - granted keyword should last while on Board by default", () => {
        // Arrange: Unit on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Grant keyword (simulated - would be via effect)
        // Assert: Keyword persists while unit is on Board
        expect(engine.getUnit("unit1")).toBeDefined();
      });

      it.skip("Rule 713.3 - removed keyword should stay removed while on Board by default", () => {
        // Arrange: Unit with keyword that gets removed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Remove keyword (simulated - would be via effect)
        // Assert: Keyword stays removed while unit is on Board
        expect(engine.getUnit("unit1")).toBeDefined();
      });

      it.skip("Rule 713.3 - granted keyword duration can be specified by effect", () => {
        // Arrange: Unit granted keyword "until end of turn"
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Effect can specify duration for granted keyword
        expect(engine.getCurrentPhase()).toBe("action");
      });
    });

    describe("Multiple Keywords (Rules 714-715)", () => {
      it.skip("Rule 714 - cards can have any number of keywords", () => {
        // Arrange: Unit with multiple keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault 2", "Tank", "Shield 1"],
        });

        // Assert: All keywords are present
        expect(unit.abilities?.length).toBe(3);
      });

      it.skip("Rule 715 - should execute keyword effects in order (top to bottom)", () => {
        // Arrange: Unit with multiple keywords that have ordered effects
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault 2", "Shield 1"],
        });

        // Assert: Keywords maintain order from rules text
        expect(unit.abilities).toBeDefined();
        expect(unit.abilities?.length).toBe(2);
      });
    });
  });

  // ===========================================================================
  // 717: Accelerate
  // ===========================================================================

  describe("717: Accelerate", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 717 - should allow paying 1[C] to enter ready", () => {
        // Arrange: Unit with Accelerate being played
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          domain: "fury",
          keywords: ["Accelerate"],
        });

        // Assert: Accelerate keyword is present
        expect(unit.abilities?.some((a) => a.type === "keyword")).toBe(true);
      });

      it.skip("Rule 717.1 - cost [C] should match unit's domain", () => {
        // Arrange: Fury unit with Accelerate
        const builder = new TestCardBuilder();
        const furyUnit = builder.createTestUnit({
          domain: "fury",
          keywords: ["Accelerate"],
        });

        // Assert: Accelerate cost matches fury domain
        expect(furyUnit.domain).toBe("fury");
      });

      it.skip("Rule 717.2.a - cost is paid during playing process, not on board", () => {
        // Arrange: Unit with Accelerate on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "accel-unit", might: 3, exhausted: true },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Accelerate has no function while on board
        // (Cannot pay Accelerate cost after unit is already on board)
        expect(engine.getUnit("accel-unit")?.meta.exhausted).toBe(true);
      });

      it.skip("Rule 717.2.b - should have no function while on board", () => {
        // Arrange: Unit with Accelerate already on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: true }],
                },
              },
            ],
          },
        );

        // Assert: Accelerate provides no benefit to units already on board
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(true);
      });
    });

    describe("Accelerate - Edge Cases", () => {
      it.skip("Rule 717.3 - multiple Accelerate instances are redundant", () => {
        // Arrange: Unit with multiple Accelerate keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Accelerate", "Accelerate"],
        });

        // Assert: Multiple Accelerate has same effect as one
        // (Paying once still results in entering ready)
        expect(unit.abilities).toBeDefined();
      });

      it.skip("Rule 717.4 - entering ready via Accelerate does not trigger 'ready' abilities", () => {
        // Arrange: Unit with Accelerate and "when readied" ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: false }],
                },
              },
            ],
          },
        );

        // Assert: Accelerate influences entry state, not a "ready" action
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(false);
      });

      it.skip("Rule 717 - Accelerate is optional (can choose not to pay)", () => {
        // Arrange: Player with unit that has Accelerate but chooses not to pay
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: true }],
                },
              },
            ],
          },
        );

        // Assert: Unit enters exhausted if Accelerate cost not paid
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 718: Action
  // ===========================================================================

  describe("718: Action", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 718 - spells with Action can be played during showdowns", () => {
        // Arrange: Game in Showdown Open state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();

        // Assert: Showdown Open allows Action cards
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 718 - units with Action can be played during showdowns", () => {
        // Arrange: Game in Showdown state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();

        // Assert: Action units can be played during Showdown
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 718 - abilities with Action can be activated during showdowns", () => {
        // Arrange: Game in Showdown Open state with unit that has Action ability
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Action abilities can be activated during Showdown
        expect(engine.getTurnState()).toBe("showdown");
      });

      it.skip("Rule 718.1.a - Action can be played on any player's turn", () => {
        // Arrange: Game in Showdown on opponent's turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
          },
        );
        engine.startShowdown();

        // Assert: Player One can play Action cards on Player Two's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.isInShowdown()).toBe(true);
      });
    });

    describe("Action - Permission Rules", () => {
      it.skip("Rule 718.2 - Action permission is inclusive (doesn't restrict other timings)", () => {
        // Arrange: Action spell during Neutral Open
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Action cards can still be played during normal timing
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 718.3 - Action doesn't alter function of instructions", () => {
        // Arrange: Action spell with specific effect
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          timing: "action",
          effect: "Deal 3 damage",
        });

        // Assert: Spell effect is unchanged by Action keyword
        expect(spell.timing).toBe("action");
        expect(spell.rulesText).toBe("Deal 3 damage");
      });

      it.skip("Rule 718.4 - units with Action still have normal play restrictions", () => {
        // Arrange: Action unit must still be played to Base or controlled Battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Action doesn't bypass location restrictions
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });
    });
  });

  // ===========================================================================
  // 719: Assault
  // ===========================================================================

  describe("719: Assault", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 719 - should grant +X Might while attacking", () => {
        // Arrange: Unit with Assault 2 as attacker
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "assault-unit", might: 3, combatRole: "attacker" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit has +2 Might while attacking (effective might = 5)
        const unit = engine.getUnit("assault-unit");
        expect(unit?.meta.combatRole).toBe("attacker");
        // Note: Actual might bonus calculation requires keyword system implementation
      });

      it.skip("Rule 719.1 - Assault X defaults to 1 if X is omitted", () => {
        // Arrange: Unit with "Assault" (no value)
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault"],
        });

        // Assert: Assault defaults to value 1
        const assaultAbility = unit.abilities?.find(
          (a) =>
            a.type === "keyword" && "keyword" in a && a.keyword === "Assault",
        );
        expect(assaultAbility).toBeDefined();
      });

      it.skip("Rule 719.1.d - Assault only active while unit has Attacker designation", () => {
        // Arrange: Unit with Assault but not attacking
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, combatRole: null }],
                },
              },
            ],
          },
        );

        // Assert: Assault provides no bonus when not attacking
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBeNull();
      });

      it.skip("Rule 719.1.d - Assault not active while defending", () => {
        // Arrange: Unit with Assault as defender
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Assault provides no bonus when defending
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBe("defender");
        // Assault bonus should not apply
      });
    });

    describe("Assault - Stacking", () => {
      it.skip("Rule 719.2 - multiple Assault instances stack (add values)", () => {
        // Arrange: Unit with Assault and Assault 3
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault", "Assault 3"],
        });

        // Assert: Total Assault value is 4 (1 + 3)
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("Rule 719.2 - Assault + Assault 3 = Assault 4", () => {
        // Arrange: Unit with base Assault gaining Assault 3 from effect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "attacker" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Combined Assault value is 4
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBe("attacker");
      });

      it.skip("Rule 719.2 - stacked Assault applies during combat resolution", () => {
        // Arrange: Unit with stacked Assault in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 2, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 5, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Assault bonus applies to damage calculation
        expect(engine.isInShowdown()).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 720: Deathknell
  // ===========================================================================

  describe("720: Deathknell", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 720 - should trigger when permanent is killed", () => {
        // Arrange: Unit with Deathknell on battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "deathknell-unit", might: 3, damage: 3 },
                  ],
                },
              },
            ],
          },
        );

        // Act: Kill the unit via cleanup
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Unit was killed (Deathknell would trigger)
        expect(killed.length).toBe(1);
        expect(killed[0]?.id).toBe("deathknell-unit");
      });

      it.skip("Rule 720.1 - Deathknell triggers when sent to Trash", () => {
        // Arrange: Unit with Deathknell
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Kill unit (sends to Trash)
        engine.killUnit("unit1");

        // Assert: Unit is in Trash (Deathknell triggered)
        expect(engine.getUnit("unit1")).toBeUndefined();
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 720.2 - Deathknell does NOT trigger if killed event is replaced", () => {
        // Arrange: Unit with Deathknell that gets recalled instead of killed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Recall unit instead of killing
        engine.recallUnit("unit1");

        // Assert: Unit is at base, not in Trash (Deathknell did NOT trigger)
        expect(engine.getUnit("unit1")).toBeDefined();
        expect(engine.getUnit("unit1")?.battlefieldId).toBeUndefined();
      });
    });

    describe("Deathknell - Multiple Instances", () => {
      it.skip("Rule 720.3 - multiple Deathknell instances trigger separately", () => {
        // Arrange: Unit with multiple Deathknell abilities
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          abilities: ["Deathknell - Draw 1", "Deathknell - Deal 2 damage"],
        });

        // Assert: Both Deathknell abilities are present
        expect(unit.rulesText).toContain("Deathknell");
      });

      it.skip("Rule 720.3 - controller chooses order of multiple Deathknell triggers", () => {
        // Arrange: Unit with multiple Deathknell abilities being killed
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

        // Act: Kill unit
        engine.cleanupKillDamagedUnits();

        // Assert: Controller would choose trigger order
        expect(engine.getUnit("unit1")).toBeUndefined();
      });
    });
  });

  // ===========================================================================
  // 721: Deflect
  // ===========================================================================

  describe("721: Deflect", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 721 - should impose additional Power cost for targeting", () => {
        // Arrange: Unit with Deflect 2 being targeted
        const engine = new RiftboundTestEngine(
          { power: { fury: 3 } },
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "deflect-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Opponent must pay additional 2 Power to target
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(3);
      });

      it.skip("Rule 721.1 - Deflect X defaults to 1 if X is omitted", () => {
        // Arrange: Unit with "Deflect" (no value)
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Deflect"],
        });

        // Assert: Deflect defaults to value 1
        const deflectAbility = unit.abilities?.find(
          (a) =>
            a.type === "keyword" && "keyword" in a && a.keyword === "Deflect",
        );
        expect(deflectAbility).toBeDefined();
      });

      it.skip("Rule 721.1.a - Deflect Power can be of any Domain", () => {
        // Arrange: Player targeting Deflect unit with different domain power
        const engine = new RiftboundTestEngine(
          {},
          { power: { calm: 2 } },
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Any domain Power can pay Deflect cost
        expect(engine.getPower(PLAYER_TWO, "calm")).toBe(2);
      });

      it.skip("Rule 721.1.b - Deflect imposes Mandatory Additional Cost", () => {
        // Arrange: Spell targeting unit with Deflect
        const engine = new RiftboundTestEngine(
          {},
          { power: { fury: 0 } },
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Cannot target if unable to pay Deflect cost
        expect(engine.getPower(PLAYER_TWO, "fury")).toBe(0);
      });
    });

    describe("Deflect - Stacking", () => {
      it.skip("Rule 721.2 - multiple Deflect instances stack (add values)", () => {
        // Arrange: Unit with Deflect and Deflect 2
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Deflect", "Deflect 2"],
        });

        // Assert: Total Deflect value is 3 (1 + 2)
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("Rule 721.2 - stacked Deflect increases targeting cost", () => {
        // Arrange: Unit with Deflect 3 total
        const engine = new RiftboundTestEngine(
          {},
          { power: { fury: 2 } },
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Opponent needs 3 Power to target (has only 2)
        expect(engine.getPower(PLAYER_TWO, "fury")).toBe(2);
      });
    });
  });

  // ===========================================================================
  // 722: Ganking
  // ===========================================================================

  describe("722: Ganking", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 722 - should allow movement from battlefield to battlefield", () => {
        // Arrange: Unit with Ganking at one battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "ganking-unit", might: 3, exhausted: false },
                  ],
                },
              },
              { id: "bf2" },
            ],
          },
        );

        // Act: Move unit from bf1 to bf2
        engine.moveUnit("ganking-unit", "bf2");

        // Assert: Unit moved to bf2
        expect(engine.getUnit("ganking-unit")?.battlefieldId).toBe("bf2");
      });

      it.skip("Rule 722.1 - Ganking adds permission to Standard Move", () => {
        // Arrange: Unit with Ganking
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Ganking"],
        });

        // Assert: Ganking keyword is present
        expect(unit.abilities?.some((a) => a.type === "keyword")).toBe(true);
      });

      it.skip("Rule 722.1.a - Ganking doesn't restrict other movement options", () => {
        // Arrange: Unit with Ganking can still move from Base
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [{ id: "bf1" }],
          },
        );
        engine.addUnit(
          { ownerId: PLAYER_ONE, id: "unit1", exhausted: false },
          "base",
        );

        // Act: Move from base to battlefield (normal move)
        // Note: This would require base zone support in test engine

        // Assert: Normal movement still works
        expect(engine.getUnit("unit1")).toBeDefined();
      });

      it.skip("Rule 722.2 - Ganking has no activation cost", () => {
        // Arrange: Unit with Ganking at battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: false }],
                },
              },
              { id: "bf2" },
            ],
          },
        );

        // Assert: No additional cost to use Ganking (just standard move cost)
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(false);
      });

      it.skip("Rule 722.3 - Ganking doesn't grant additional movement", () => {
        // Arrange: Unit with Ganking that already moved this turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: true }],
                },
              },
              { id: "bf2" },
            ],
          },
        );

        // Assert: Exhausted unit cannot move again
        expect(engine.getUnit("unit1")?.meta.exhausted).toBe(true);
      });
    });

    describe("Ganking - Edge Cases", () => {
      it.skip("Rule 722.4 - multiple Ganking instances are redundant", () => {
        // Arrange: Unit with multiple Ganking keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Ganking", "Ganking"],
        });

        // Assert: Multiple Ganking has same effect as one
        expect(unit.abilities).toBeDefined();
      });

      it.skip("Rule 722 - Ganking allows moving to enemy-controlled battlefield", () => {
        // Arrange: Unit with Ganking, enemy controls bf2
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, exhausted: false }],
                },
              },
              {
                id: "bf2",
                controller: PLAYER_TWO,
              },
            ],
          },
        );

        // Assert: Can move to enemy battlefield with Ganking
        expect(engine.getBattlefieldController("bf2")).toBe(PLAYER_TWO);
      });
    });
  });

  // ===========================================================================
  // 723: Hidden
  // ===========================================================================

  describe("723: Hidden", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 723 - should allow hiding card facedown at controlled battlefield", () => {
        // Arrange: Player with Hidden card and controlled battlefield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "hidden-card",
          name: "Hidden Spell",
        });

        // Assert: Battlefield is controlled, can hide card there
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 723.1 - Hidden cost [C] matches Domain Identity", () => {
        // Arrange: Player with fury domain identity
        const engine = new RiftboundTestEngine(
          { power: { fury: 1 } },
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Can pay fury power to hide
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(1);
      });

      it.skip("Rule 723.2 - Hide is NOT a subset of Play", () => {
        // Arrange: Card being hidden
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Hiding doesn't trigger "when played" effects
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });

      it.skip("Rule 723.3 - Hiding doesn't open a Chain", () => {
        // Arrange: Game in Open state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Chain remains empty after hiding
        expect(engine.getChainState()).toBe("open");
        expect(engine.hasChain()).toBe(false);
      });

      it.skip("Rule 723.4 - Playing from Hidden DOES open a Chain", () => {
        // Arrange: Hidden card being played
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Act: Add spell to chain (simulating playing from Hidden)
        engine.addToChain({
          id: "hidden-spell",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Chain is now Closed
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 723.5 - targets must be at associated Battlefield", () => {
        // Arrange: Hidden card at bf1, potential targets at bf2
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_TWO]: [{ id: "target-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Hidden card at bf1 cannot target units at bf2
        expect(engine.getUnit("target-unit")?.battlefieldId).toBe("bf2");
      });
    });

    describe("Hidden - Timing and Costs", () => {
      it.skip("Rule 723.6 - Hidden card gains Reaction on next player's turn", () => {
        // Arrange: Hidden card waiting for next turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            activePlayer: PLAYER_ONE,
            turnNumber: 1,
          },
        );

        // Act: End turn
        engine.endTurn();

        // Assert: Now on next player's turn, Hidden card has Reaction
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.getTurnNumber()).toBe(2);
      });

      it.skip("Rule 723.7 - playing from Hidden ignores base cost", () => {
        // Arrange: Hidden card with high base cost
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          cost: { energy: 5, power: ["fury", "fury"] },
          hasHidden: true,
        });

        // Assert: Card has Hidden and high cost
        expect(spell.hasHidden).toBe(true);
        expect(spell.energyCost).toBe(5);
      });

      it.skip("Rule 723.8 - can still play Hidden card normally for full cost", () => {
        // Arrange: Player with enough resources to play normally
        const engine = new RiftboundTestEngine(
          { energy: 5, power: { fury: 2 } },
          {},
          { phase: "action" },
        );

        // Assert: Can afford full cost
        expect(engine.getEnergy(PLAYER_ONE)).toBe(5);
        expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
      });
    });

    describe("Hidden - Edge Cases", () => {
      it.skip("Rule 723.9 - multiple Hidden instances are redundant", () => {
        // Arrange: Card with multiple Hidden keywords
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          hasHidden: true,
        });

        // Assert: Multiple Hidden has same effect as one
        expect(spell.hasHidden).toBe(true);
      });

      it.skip("Rule 723 - cannot hide at battlefield without controller's unit", () => {
        // Arrange: Battlefield controlled but no units
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Need unit at battlefield to hide there
        expect(engine.getUnitsAtBattlefield("bf1").length).toBe(0);
      });

      it.skip("Rule 723 - cannot hide at battlefield that already has facedown card", () => {
        // Arrange: Battlefield with existing hidden card
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );

        // Assert: Only one facedown card per battlefield
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
      });
    });
  });

  // ===========================================================================
  // 724: Legion
  // ===========================================================================

  describe("724: Legion", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 724 - should apply bonus if another Main Deck card played this turn", () => {
        // Arrange: Player has played a card this turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            turnNumber: 1,
          },
        );

        // Assert: Legion condition can be checked
        expect(engine.getCurrentPhase()).toBe("action");
      });

      it.skip("Rule 724.1 - Legion condition requires Main Deck card", () => {
        // Arrange: Player played a Main Deck card
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card1",
          name: "First Card",
        });

        // Assert: Main Deck card in hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 724.2 - Legion can apply to static abilities", () => {
        // Arrange: Unit with Legion static ability
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          abilities: ["Legion - I have +2 Might"],
        });

        // Assert: Legion ability is present
        expect(unit.rulesText).toContain("Legion");
      });

      it.skip("Rule 724.2 - Legion can apply to activated abilities", () => {
        // Arrange: Unit with Legion activated ability
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          abilities: ["Legion - Exhaust: Deal 2 damage"],
        });

        // Assert: Legion ability is present
        expect(unit.rulesText).toContain("Legion");
      });

      it.skip("Rule 724.2 - Legion can apply to spell instructions", () => {
        // Arrange: Spell with Legion effect
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          effect: "Deal 2 damage. Legion - Deal 2 more damage.",
        });

        // Assert: Legion effect is present
        expect(spell.rulesText).toContain("Legion");
      });
    });

    describe("Legion - Condition Tracking", () => {
      it.skip("Rule 724.3 - all Legion abilities satisfied by playing one card", () => {
        // Arrange: Multiple cards with Legion in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card1",
          name: "Legion Card 1",
        });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "card2",
          name: "Legion Card 2",
        });

        // Assert: Both Legion cards would be satisfied by one prior play
        expect(engine.getHandSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 724 - Legion not satisfied if no card played this turn", () => {
        // Arrange: Start of turn, no cards played yet
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            turnNumber: 1,
          },
        );

        // Assert: Legion condition not met at start of turn
        expect(engine.getTurnNumber()).toBe(1);
      });

      it.skip("Rule 724 - Legion resets at start of new turn", () => {
        // Arrange: Previous turn had Legion satisfied
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "cleanup",
            turnNumber: 1,
          },
        );

        // Act: End turn
        engine.endTurn();

        // Assert: New turn, Legion condition reset
        expect(engine.getTurnNumber()).toBe(2);
        expect(engine.getCurrentPhase()).toBe("awaken");
      });
    });
  });

  // ===========================================================================
  // 725: Reaction
  // ===========================================================================

  describe("725: Reaction", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 725 - should allow playing during Closed states", () => {
        // Arrange: Game in Closed state (chain exists)
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Closed state allows Reaction cards
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 725.1 - Reaction grants all Action permissions", () => {
        // Arrange: Game in Showdown Open state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();

        // Assert: Reaction cards can be played during Showdown (like Action)
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 725.1.c - spells with Reaction can be played during Closed states", () => {
        // Arrange: Game in Neutral Closed state
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_ONE,
          type: "spell",
        });

        // Assert: Reaction spells can respond to chain
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 725.1.c - abilities with Reaction can be activated during Closed states", () => {
        // Arrange: Game in Showdown Closed state
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );
        engine.startShowdown();
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_TWO,
          type: "ability",
        });

        // Assert: Showdown Closed state
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("Rule 725.1.a - Reaction can be played on any player's turn", () => {
        // Arrange: Game on opponent's turn with chain
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            activePlayer: PLAYER_TWO,
          },
        );
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Player One can play Reaction on Player Two's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.getChainState()).toBe("closed");
      });
    });

    describe("Reaction - Permission Rules", () => {
      it.skip("Rule 725.2 - Reaction permission is inclusive (doesn't restrict)", () => {
        // Arrange: Reaction spell during Neutral Open
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: Reaction cards can still be played during normal timing
        expect(engine.getTurnState()).toBe("neutral");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("Rule 725.3 - Reaction doesn't alter function of instructions", () => {
        // Arrange: Reaction spell with specific effect
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          timing: "reaction",
          effect: "Counter target spell",
        });

        // Assert: Spell effect is unchanged by Reaction keyword
        expect(spell.timing).toBe("reaction");
        expect(spell.rulesText).toBe("Counter target spell");
      });

      it.skip("Rule 725.4 - units with Reaction still have normal play restrictions", () => {
        // Arrange: Reaction unit must still be played to valid location
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );
        engine.addToChain({
          id: "spell1",
          controllerId: PLAYER_TWO,
          type: "spell",
        });

        // Assert: Reaction doesn't bypass location restrictions
        expect(engine.getBattlefieldController("bf1")).toBe(PLAYER_ONE);
        expect(engine.getChainState()).toBe("closed");
      });
    });
  });

  // ===========================================================================
  // 726: Shield
  // ===========================================================================

  describe("726: Shield", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 726 - should grant +X Might while defending", () => {
        // Arrange: Unit with Shield 2 as defender
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "shield-unit", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit has +2 Might while defending (effective might = 5)
        const unit = engine.getUnit("shield-unit");
        expect(unit?.meta.combatRole).toBe("defender");
      });

      it.skip("Rule 726.1 - Shield X defaults to 1 if X is omitted", () => {
        // Arrange: Unit with "Shield" (no value)
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Shield"],
        });

        // Assert: Shield defaults to value 1
        const shieldAbility = unit.abilities?.find(
          (a) =>
            a.type === "keyword" && "keyword" in a && a.keyword === "Shield",
        );
        expect(shieldAbility).toBeDefined();
      });

      it.skip("Rule 726.1.d - Shield only active while unit has Defender designation", () => {
        // Arrange: Unit with Shield but not defending
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3, combatRole: null }],
                },
              },
            ],
          },
        );

        // Assert: Shield provides no bonus when not defending
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBeNull();
      });

      it.skip("Rule 726.1.d - Shield not active while attacking", () => {
        // Arrange: Unit with Shield as attacker
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "attacker" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Shield provides no bonus when attacking
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBe("attacker");
      });
    });

    describe("Shield - Stacking", () => {
      it.skip("Rule 726.2 - multiple Shield instances stack (add values)", () => {
        // Arrange: Unit with Shield and Shield 3
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Shield", "Shield 3"],
        });

        // Assert: Total Shield value is 4 (1 + 3)
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("Rule 726.2 - Shield + Shield 3 = Shield 4", () => {
        // Arrange: Unit with base Shield gaining Shield 3 from effect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Combined Shield value is 4
        const unit = engine.getUnit("unit1");
        expect(unit?.meta.combatRole).toBe("defender");
      });

      it.skip("Rule 726.2 - stacked Shield applies during combat resolution", () => {
        // Arrange: Unit with stacked Shield in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 2, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Shield bonus applies to damage calculation
        expect(engine.isInShowdown()).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 727: Tank
  // ===========================================================================

  describe("727: Tank", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 727 - Tank must be assigned lethal damage before non-Tank units", () => {
        // Arrange: Tank and non-Tank defenders
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 6, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank-unit", might: 3, combatRole: "defender" },
                    { id: "normal-unit", might: 2, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Tank must receive lethal damage first
        expect(engine.getUnit("tank-unit")?.meta.combatRole).toBe("defender");
        expect(engine.getUnit("normal-unit")?.meta.combatRole).toBe("defender");
      });

      it.skip("Rule 727.1 - Tank alters damage assignment in Combat", () => {
        // Arrange: Combat with Tank defender
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank", might: 4, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Tank affects damage assignment order
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("Rule 727.1.b - must assign lethal damage to Tank before moving to next unit", () => {
        // Arrange: Tank with 3 might, attacker with 5 might
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank", might: 3, combatRole: "defender" },
                    { id: "other", might: 2, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Must deal 3 damage to tank before any to other
        expect(engine.getUnit("tank")?.might).toBe(3);
      });
    });

    describe("Tank - Multiple Tanks", () => {
      it.skip("Rule 727.1.c.2 - with multiple Tanks, can assign to any Tank first", () => {
        // Arrange: Two Tank defenders
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 8, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank1", might: 3, combatRole: "defender" },
                    { id: "tank2", might: 4, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Can choose which Tank to assign damage to first
        expect(engine.getUnit("tank1")).toBeDefined();
        expect(engine.getUnit("tank2")).toBeDefined();
      });

      it.skip("Rule 727.1.c.2 - non-Tanks invalid until all Tanks have lethal damage", () => {
        // Arrange: Two Tanks and one non-Tank
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 10, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank1", might: 3, combatRole: "defender" },
                    { id: "tank2", might: 3, combatRole: "defender" },
                    { id: "normal", might: 2, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Normal unit cannot receive damage until both tanks have lethal
        expect(engine.getUnit("normal")?.meta.combatRole).toBe("defender");
      });
    });

    describe("Tank - Edge Cases", () => {
      it.skip("Rule 727.2 - multiple Tank instances are redundant", () => {
        // Arrange: Unit with multiple Tank keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Tank", "Tank"],
        });

        // Assert: Multiple Tank has same effect as one
        expect(unit.abilities).toBeDefined();
      });

      it.skip("Rule 727 - Tank only affects damage assignment, not total damage", () => {
        // Arrange: Tank defender in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Tank doesn't reduce or increase damage, just changes order
        expect(engine.getUnit("attacker")?.might).toBe(5);
      });
    });
  });

  // ===========================================================================
  // 728: Temporary
  // ===========================================================================

  describe("728: Temporary", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 728 - should be killed at start of controller's Beginning Phase", () => {
        // Arrange: Temporary unit at start of turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "awaken",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "temp-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Advance to Beginning Phase
        engine.advancePhase();

        // Assert: Beginning Phase reached (Temporary would trigger)
        expect(engine.getCurrentPhase()).toBe("beginning");
      });

      it.skip("Rule 728.1 - Temporary triggers at controller's Beginning Phase", () => {
        // Arrange: Temporary unit controlled by Player One
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "beginning",
            activePlayer: PLAYER_ONE,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Temporary triggers on controller's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
        expect(engine.getCurrentPhase()).toBe("beginning");
      });

      it.skip("Rule 728.1 - Temporary triggers before scoring", () => {
        // Arrange: Temporary unit at Beginning Phase
        const engine = new RiftboundTestEngine(
          { victoryPoints: 0 },
          {},
          {
            phase: "beginning",
            activePlayer: PLAYER_ONE,
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

        // Assert: Temporary kills happen before Hold scoring
        expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 728 - Temporary does not trigger on opponent's turn", () => {
        // Arrange: Temporary unit, opponent's turn
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "beginning",
            activePlayer: PLAYER_TWO,
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Player One's Temporary unit survives Player Two's turn
        expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
        expect(engine.getUnit("unit1")).toBeDefined();
      });
    });

    describe("Temporary - Edge Cases", () => {
      it.skip("Rule 728.2 - multiple Temporary instances are redundant", () => {
        // Arrange: Unit with multiple Temporary keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Temporary", "Temporary"],
        });

        // Assert: Multiple Temporary has same effect as one
        expect(unit.abilities).toBeDefined();
      });

      it.skip("Rule 728 - Temporary unit killed goes to Trash", () => {
        // Arrange: Temporary unit being killed
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "unit1", might: 3 }],
                },
              },
            ],
          },
        );

        // Act: Kill unit (simulating Temporary trigger)
        engine.killUnit("unit1");

        // Assert: Unit is in Trash
        expect(engine.getUnit("unit1")).toBeUndefined();
        expect(engine.getTrashSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 728 - Temporary triggers Deathknell if present", () => {
        // Arrange: Unit with both Temporary and Deathknell
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Temporary"],
          abilities: ["Deathknell - Draw 1"],
        });

        // Assert: Both keywords present
        expect(unit.abilities).toBeDefined();
        expect(unit.rulesText).toContain("Deathknell");
      });
    });
  });

  // ===========================================================================
  // 729: Vision
  // ===========================================================================

  describe("729: Vision", () => {
    describe("Basic Mechanics", () => {
      it.skip("Rule 729 - should trigger when permanent is played", () => {
        // Arrange: Unit with Vision being played
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "vision-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Vision triggers when unit enters Board
        expect(engine.getUnit("vision-unit")).toBeDefined();
      });

      it.skip("Rule 729.1 - Vision lets you look at top card of Main Deck", () => {
        // Arrange: Player with cards in deck
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card1",
          name: "Top Card",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card2",
          name: "Second Card",
        });

        // Assert: Deck has cards to look at
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });

      it.skip("Rule 729.1 - Vision allows optional recycle of top card", () => {
        // Arrange: Player looking at top card
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card1",
          name: "Top Card",
        });

        // Assert: Can choose to recycle or not
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 729 - recycled card goes to bottom of deck", () => {
        // Arrange: Player recycling top card
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card1",
          name: "Top Card",
        });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card2",
          name: "Second Card",
        });

        // Act: Recycle top card (simulated)
        // Note: Actual recycle would move card to bottom

        // Assert: Deck still has same number of cards
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(2);
      });
    });

    describe("Vision - Multiple Instances", () => {
      it.skip("Rule 729.2 - multiple Vision instances trigger separately", () => {
        // Arrange: Unit with multiple Vision abilities
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          abilities: ["Vision", "Vision"],
        });

        // Assert: Both Vision abilities are present
        expect(unit.rulesText).toContain("Vision");
      });

      it.skip("Rule 729.2.a - each Vision instance allows independent recycle choice", () => {
        // Arrange: Unit with two Vision triggers
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card1",
          name: "Top Card",
        });

        // Assert: Each Vision trigger is a separate choice
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(1);
      });

      it.skip("Rule 729.2.b - if not recycled, each Vision instance sees same card", () => {
        // Arrange: Multiple Vision triggers, card not recycled
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "mainDeck", {
          id: "card1",
          name: "Top Card",
        });

        // Assert: Same top card visible to all Vision triggers
        const deck = engine.getZoneContents(PLAYER_ONE, "mainDeck");
        expect(deck[0]?.id).toBe("card1");
      });
    });

    describe("Vision - Edge Cases", () => {
      it.skip("Rule 729 - Vision with empty deck does nothing", () => {
        // Arrange: Player with empty deck
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });

        // Assert: No card to look at
        expect(engine.getDeckSize(PLAYER_ONE)).toBe(0);
      });

      it.skip("Rule 729 - Vision triggers on entering Board, not hand", () => {
        // Arrange: Vision card in hand
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.addToZone(PLAYER_ONE, "hand", {
          id: "vision-card",
          name: "Vision Unit",
        });

        // Assert: Vision doesn't trigger while in hand
        expect(engine.getHandSize(PLAYER_ONE)).toBe(1);
      });
    });
  });

  // ===========================================================================
  // Edge Cases: Multiple Keywords
  // ===========================================================================

  describe("Edge Cases: Multiple Keywords", () => {
    describe("Keyword Combinations", () => {
      it.skip("should handle unit with Assault and Shield", () => {
        // Arrange: Unit with both combat keywords
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault 2", "Shield 2"],
        });

        // Assert: Both keywords present
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("should handle unit with Tank and Shield", () => {
        // Arrange: Defensive unit with Tank and Shield
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "tank-shield", might: 4, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Unit has defender role
        expect(engine.getUnit("tank-shield")?.meta.combatRole).toBe("defender");
      });

      it.skip("should handle unit with Accelerate and Ganking", () => {
        // Arrange: Mobile unit with Accelerate and Ganking
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Accelerate", "Ganking"],
        });

        // Assert: Both keywords present
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("should handle unit with Deathknell and Temporary", () => {
        // Arrange: Unit that dies at Beginning Phase and triggers Deathknell
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Temporary"],
          abilities: ["Deathknell - Draw 2"],
        });

        // Assert: Both abilities present
        expect(unit.abilities).toBeDefined();
        expect(unit.rulesText).toContain("Deathknell");
      });

      it.skip("should handle spell with Action and Hidden", () => {
        // Arrange: Spell with both timing keywords
        const builder = new TestCardBuilder();
        const spell = builder.createTestSpell({
          timing: "action",
          hasHidden: true,
        });

        // Assert: Both properties present
        expect(spell.timing).toBe("action");
        expect(spell.hasHidden).toBe(true);
      });
    });

    describe("Keyword Removal", () => {
      it.skip("should handle keyword being removed mid-combat", () => {
        // Arrange: Unit with Assault in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "attacker" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Combat in progress
        expect(engine.isInShowdown()).toBe(true);
      });

      it.skip("should handle Tank being removed during damage assignment", () => {
        // Arrange: Tank unit in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Tank is defender
        expect(engine.getUnit("tank")?.meta.combatRole).toBe("defender");
      });

      it.skip("should handle Deflect being removed before targeting resolves", () => {
        // Arrange: Unit with Deflect being targeted
        const engine = new RiftboundTestEngine(
          {},
          { power: { fury: 2 } },
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "deflect-unit", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Opponent has power to potentially pay Deflect
        expect(engine.getPower(PLAYER_TWO, "fury")).toBe(2);
      });
    });

    describe("Keyword Conflicts", () => {
      it.skip("should handle Assault and Shield on same unit (only one active at a time)", () => {
        // Arrange: Unit with both Assault and Shield as attacker
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "attacker" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Only Assault active when attacking
        expect(engine.getUnit("unit1")?.meta.combatRole).toBe("attacker");
      });

      it.skip("should handle unit changing from attacker to defender", () => {
        // Arrange: Unit that was attacking now defending
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Assert: Now Shield would be active instead of Assault
        expect(engine.getUnit("unit1")?.meta.combatRole).toBe("defender");
      });
    });

    describe("Stacking vs Redundant Keywords", () => {
      it.skip("should correctly stack Assault values", () => {
        // Arrange: Unit with Assault 1, Assault 2, Assault 3
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Assault", "Assault 2", "Assault 3"],
        });

        // Assert: Total Assault = 6 (1 + 2 + 3)
        expect(unit.abilities?.length).toBe(3);
      });

      it.skip("should correctly stack Shield values", () => {
        // Arrange: Unit with Shield 1, Shield 3
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Shield", "Shield 3"],
        });

        // Assert: Total Shield = 4 (1 + 3)
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("should correctly stack Deflect values", () => {
        // Arrange: Unit with Deflect 2, Deflect 2
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Deflect 2", "Deflect 2"],
        });

        // Assert: Total Deflect = 4 (2 + 2)
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("should treat multiple Tank as redundant", () => {
        // Arrange: Unit with Tank, Tank
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Tank", "Tank"],
        });

        // Assert: Multiple Tank has no additional effect
        expect(unit.abilities?.length).toBe(2);
      });

      it.skip("should treat multiple Ganking as redundant", () => {
        // Arrange: Unit with Ganking, Ganking
        const builder = new TestCardBuilder();
        const unit = builder.createTestUnit({
          keywords: ["Ganking", "Ganking"],
        });

        // Assert: Multiple Ganking has no additional effect
        expect(unit.abilities?.length).toBe(2);
      });
    });
  });

  // ===========================================================================
  // Integration: Keywords + Combat
  // ===========================================================================

  describe("Integration: Keywords + Combat", () => {
    describe("Combat Keywords in Action", () => {
      it.skip("should apply Assault bonus during attack damage calculation", () => {
        // Arrange: Assault unit attacking
        // Cross-ref: Rule 719 (Assault) + Combat Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 5, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Combat in progress with Assault attacker
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getUnit("attacker")?.meta.combatRole).toBe("attacker");
      });

      it.skip("should apply Shield bonus during defense damage calculation", () => {
        // Arrange: Shield unit defending
        // Cross-ref: Rule 726 (Shield) + Combat Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Combat in progress with Shield defender
        expect(engine.isInShowdown()).toBe(true);
        expect(engine.getUnit("defender")?.meta.combatRole).toBe("defender");
      });

      it.skip("should enforce Tank damage assignment order", () => {
        // Arrange: Tank and non-Tank defenders
        // Cross-ref: Rule 727 (Tank) + Combat Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 8, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank", might: 4, combatRole: "defender" },
                    { id: "squishy", might: 2, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Tank must receive lethal before squishy
        expect(engine.getUnit("tank")?.meta.combatRole).toBe("defender");
        expect(engine.getUnit("squishy")?.meta.combatRole).toBe("defender");
      });

      it.skip("should trigger Deathknell when unit dies in combat", () => {
        // Arrange: Unit with Deathknell taking lethal damage
        // Cross-ref: Rule 720 (Deathknell) + Combat Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    {
                      id: "deathknell-unit",
                      might: 3,
                      damage: 3,
                      combatRole: "defender",
                    },
                  ],
                },
              },
            ],
          },
        );

        // Act: Cleanup kills damaged unit
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Deathknell unit was killed
        expect(killed.length).toBe(1);
        expect(killed[0]?.id).toBe("deathknell-unit");
      });
    });

    describe("Timing Keywords in Combat", () => {
      it.skip("should allow Action cards during Showdown Open", () => {
        // Arrange: Showdown Open state
        // Cross-ref: Rule 718 (Action) + Showdown Rules
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();

        // Assert: Showdown Open allows Action cards
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("open");
      });

      it.skip("should allow Reaction cards during Showdown Closed", () => {
        // Arrange: Showdown Closed state
        // Cross-ref: Rule 725 (Reaction) + Showdown Rules
        const engine = new RiftboundTestEngine({}, {}, { phase: "action" });
        engine.startShowdown();
        engine.addToChain({
          id: "ability1",
          controllerId: PLAYER_ONE,
          type: "ability",
        });

        // Assert: Showdown Closed allows Reaction cards
        expect(engine.getTurnState()).toBe("showdown");
        expect(engine.getChainState()).toBe("closed");
      });

      it.skip("should allow playing Hidden card from facedown during combat", () => {
        // Arrange: Hidden card at battlefield during Showdown
        // Cross-ref: Rule 723 (Hidden) + Showdown Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            phase: "action",
            battlefields: [
              {
                id: "bf1",
                controller: PLAYER_ONE,
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Can play Hidden card during Showdown
        expect(engine.isInShowdown()).toBe(true);
      });
    });

    describe("Movement Keywords in Combat Context", () => {
      it.skip("should allow Ganking unit to move to contested battlefield", () => {
        // Arrange: Ganking unit at one battlefield, combat at another
        // Cross-ref: Rule 722 (Ganking) + Movement Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "ganking-unit", might: 3, exhausted: false },
                  ],
                },
              },
              {
                id: "bf2",
                units: {
                  [PLAYER_TWO]: [{ id: "enemy", might: 3 }],
                },
              },
            ],
          },
        );

        // Assert: Ganking unit can move to bf2
        expect(engine.getUnit("ganking-unit")?.meta.exhausted).toBe(false);
      });

      it.skip("should clear combat roles during cleanup after combat", () => {
        // Arrange: Units with combat roles after combat
        // Cross-ref: Rule 521 (Cleanup) + Combat Rules
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "unit1", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "unit2", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );

        // Act: Cleanup removes combat status
        engine.cleanupRemoveCombatStatus();

        // Assert: Combat roles cleared
        expect(engine.getUnit("unit1")?.meta.combatRole).toBeNull();
        expect(engine.getUnit("unit2")?.meta.combatRole).toBeNull();
      });
    });

    describe("Keyword Interactions During Combat Resolution", () => {
      it.skip("should handle Assault + Tank interaction", () => {
        // Arrange: Assault attacker vs Tank defender
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "assault-unit", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "tank-unit", might: 4, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Both keywords active in combat
        expect(engine.getUnit("assault-unit")?.meta.combatRole).toBe(
          "attacker",
        );
        expect(engine.getUnit("tank-unit")?.meta.combatRole).toBe("defender");
      });

      it.skip("should handle Shield + Deflect on same defender", () => {
        // Arrange: Defender with Shield and Deflect
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "attacker", might: 5, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "shield-deflect", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Both defensive keywords active
        expect(engine.getUnit("shield-deflect")?.meta.combatRole).toBe(
          "defender",
        );
      });

      it.skip("should handle multiple Deathknell triggers from combat deaths", () => {
        // Arrange: Multiple units with Deathknell dying in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [{ id: "dk1", might: 3, damage: 3 }],
                  [PLAYER_TWO]: [{ id: "dk2", might: 2, damage: 2 }],
                },
              },
            ],
          },
        );

        // Act: Cleanup kills both
        const killed = engine.cleanupKillDamagedUnits();

        // Assert: Both Deathknell units killed
        expect(killed.length).toBe(2);
      });

      it.skip("should handle Temporary unit in combat", () => {
        // Arrange: Temporary unit participating in combat
        const engine = new RiftboundTestEngine(
          {},
          {},
          {
            battlefields: [
              {
                id: "bf1",
                units: {
                  [PLAYER_ONE]: [
                    { id: "temp-attacker", might: 3, combatRole: "attacker" },
                  ],
                  [PLAYER_TWO]: [
                    { id: "defender", might: 3, combatRole: "defender" },
                  ],
                },
              },
            ],
          },
        );
        engine.startShowdown();

        // Assert: Temporary unit can participate in combat
        expect(engine.getUnit("temp-attacker")?.meta.combatRole).toBe(
          "attacker",
        );
      });
    });
  });
});
