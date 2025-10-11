/**
 * Comprehensive test suite for LorcanaCardFilterBuilder
 */

import { beforeEach, describe, expect, it } from "bun:test";
import {
  LorcanaCardFilterBuilder,
  type LorcanaCardFilterExtended,
  type NumericComparison,
  type NumericRange,
  type StringComparison,
} from "../cards/lorcana-card-filter-builder";

describe("LorcanaCardFilterBuilder", () => {
  let builder: LorcanaCardFilterBuilder;

  beforeEach(() => {
    builder = new LorcanaCardFilterBuilder();
  });

  // =============================================================================
  // BASIC ATTRIBUTE METHODS TESTS
  // =============================================================================

  describe("Basic Attribute Methods", () => {
    describe("cost()", () => {
      it("should set exact cost when passed a number", () => {
        const filter = builder.cost(3).build();
        expect(filter.cost).toEqual({ exact: 3 });
      });

      it("should set cost range when passed NumericRange", () => {
        const range: NumericRange = { min: 2, max: 5 };
        const filter = builder.cost(range).build();
        expect(filter.cost).toEqual(range);
      });

      it("should convert NumericComparison to range - eq", () => {
        const comparison: NumericComparison = { operator: "eq", value: 4 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ exact: 4 });
      });

      it("should convert NumericComparison to range - gte", () => {
        const comparison: NumericComparison = { operator: "gte", value: 3 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ min: 3 });
      });

      it("should convert NumericComparison to range - lte", () => {
        const comparison: NumericComparison = { operator: "lte", value: 5 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ max: 5 });
      });

      it("should convert NumericComparison to range - gt", () => {
        const comparison: NumericComparison = { operator: "gt", value: 2 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ min: 3 });
      });

      it("should convert NumericComparison to range - lt", () => {
        const comparison: NumericComparison = { operator: "lt", value: 4 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ max: 3 });
      });

      it("should handle ne operator as exact", () => {
        const comparison: NumericComparison = { operator: "ne", value: 3 };
        const filter = builder.cost(comparison).build();
        expect(filter.cost).toEqual({ exact: 3 });
      });
    });

    describe("strength()", () => {
      it("should set exact strength when passed a number", () => {
        const filter = builder.strength(4).build();
        expect(filter.strength).toEqual({ exact: 4 });
      });

      it("should set strength range when passed NumericRange", () => {
        const range: NumericRange = { min: 1, max: 6 };
        const filter = builder.strength(range).build();
        expect(filter.strength).toEqual(range);
      });

      it("should convert NumericComparison to range", () => {
        const comparison: NumericComparison = { operator: "gte", value: 2 };
        const filter = builder.strength(comparison).build();
        expect(filter.strength).toEqual({ min: 2 });
      });
    });

    describe("willpower()", () => {
      it("should set exact willpower when passed a number", () => {
        const filter = builder.willpower(5).build();
        expect(filter.willpower).toEqual({ exact: 5 });
      });

      it("should set willpower range when passed NumericRange", () => {
        const range: NumericRange = { min: 2, max: 8 };
        const filter = builder.willpower(range).build();
        expect(filter.willpower).toEqual(range);
      });
    });

    describe("lore()", () => {
      it("should set exact lore when passed a number", () => {
        const filter = builder.lore(2).build();
        expect(filter.lore).toEqual({ exact: 2 });
      });

      it("should set lore range when passed NumericRange", () => {
        const range: NumericRange = { min: 1, max: 4 };
        const filter = builder.lore(range).build();
        expect(filter.lore).toEqual(range);
      });
    });

    describe("moveCost()", () => {
      it("should set exact moveCost when passed a number", () => {
        const filter = builder.moveCost(1).build();
        expect(filter.moveCost).toEqual({ exact: 1 });
      });

      it("should set moveCost range when passed NumericRange", () => {
        const range: NumericRange = { min: 0, max: 3 };
        const filter = builder.moveCost(range).build();
        expect(filter.moveCost).toEqual(range);
      });
    });
  });

  // =============================================================================
  // STRING ATTRIBUTE METHODS TESTS
  // =============================================================================

  describe("String Attribute Methods", () => {
    describe("name()", () => {
      it("should set exact name when passed a string", () => {
        const filter = builder.name("Mickey Mouse").build();
        expect(filter.name).toEqual({ operator: "eq", value: "Mickey Mouse" });
      });

      it("should set name comparison when passed StringComparison", () => {
        const comparison: StringComparison = {
          operator: "contains",
          value: "Mickey",
        };
        const filter = builder.name(comparison).build();
        expect(filter.name).toEqual(comparison);
      });
    });

    describe("nameContains()", () => {
      it("should set name contains filter", () => {
        const filter = builder.nameContains("Mouse").build();
        expect(filter.name).toEqual({ operator: "contains", value: "Mouse" });
      });
    });

    describe("title()", () => {
      it("should set exact title when passed a string", () => {
        const filter = builder.title("Brave Little Tailor").build();
        expect(filter.title).toEqual({
          operator: "eq",
          value: "Brave Little Tailor",
        });
      });

      it("should set title comparison when passed StringComparison", () => {
        const comparison: StringComparison = {
          operator: "startsWith",
          value: "Brave",
        };
        const filter = builder.title(comparison).build();
        expect(filter.title).toEqual(comparison);
      });
    });

    describe("text()", () => {
      it("should set exact text when passed a string", () => {
        const filter = builder.text("Quest ability").build();
        expect(filter.text).toEqual({ operator: "eq", value: "Quest ability" });
      });

      it("should set text comparison when passed StringComparison", () => {
        const comparison: StringComparison = {
          operator: "contains",
          value: "quest",
        };
        const filter = builder.text(comparison).build();
        expect(filter.text).toEqual(comparison);
      });
    });

    describe("textContains()", () => {
      it("should set text contains filter", () => {
        const filter = builder.textContains("challenge").build();
        expect(filter.text).toEqual({
          operator: "contains",
          value: "challenge",
        });
      });
    });
  });

  // =============================================================================
  // CARD TYPE AND PROPERTIES TESTS
  // =============================================================================

  describe("Card Type and Properties", () => {
    describe("type()", () => {
      it("should set single card type", () => {
        const filter = builder.type("character").build();
        expect(filter.cardType).toEqual(["character"]);
      });

      it("should set multiple card types", () => {
        const filter = builder.type("character", "action", "item").build();
        expect(filter.cardType).toEqual(["character", "action", "item"]);
      });
    });

    describe("ink()", () => {
      it("should set single ink color", () => {
        const filter = builder.ink("red").build();
        expect(filter.ink).toEqual(["red"]);
      });

      it("should set multiple ink colors", () => {
        const filter = builder.ink("red", "blue", "green").build();
        expect(filter.ink).toEqual(["red", "blue", "green"]);
      });
    });

    describe("inkable()", () => {
      it("should set inkable to true by default", () => {
        const filter = builder.inkable().build();
        expect(filter.inkable).toBe(true);
      });

      it("should set inkable to false when specified", () => {
        const filter = builder.inkable(false).build();
        expect(filter.inkable).toBe(false);
      });
    });
  });

  // =============================================================================
  // KEYWORDS AND ABILITIES TESTS
  // =============================================================================

  describe("Keywords and Abilities", () => {
    describe("hasKeyword()", () => {
      it("should set single keyword", () => {
        const filter = builder.hasKeyword("rush").build();
        expect(filter.hasKeyword).toEqual(["rush"]);
      });

      it("should set multiple keywords", () => {
        const filter = builder.hasKeyword("rush", "evasive").build();
        expect(filter.hasKeyword).toEqual(["rush", "evasive"]);
      });

      it("should accumulate keywords across multiple calls", () => {
        const filter = builder
          .hasKeyword("rush")
          .hasKeyword("evasive", "bodyguard")
          .build();
        expect(filter.hasKeyword).toEqual(["rush", "evasive", "bodyguard"]);
      });
    });

    describe("hasAbility()", () => {
      it("should set single ability", () => {
        const filter = builder.hasAbility("Singer 4").build();
        expect(filter.hasAbility).toEqual(["Singer 4"]);
      });

      it("should set multiple abilities", () => {
        const filter = builder.hasAbility("Singer 4", "Shift 3").build();
        expect(filter.hasAbility).toEqual(["Singer 4", "Shift 3"]);
      });

      it("should accumulate abilities across multiple calls", () => {
        const filter = builder
          .hasAbility("Singer 4")
          .hasAbility("Shift 3", "Ward")
          .build();
        expect(filter.hasAbility).toEqual(["Singer 4", "Shift 3", "Ward"]);
      });
    });
  });

  // =============================================================================
  // CARD STATES TESTS
  // =============================================================================

  describe("Card States", () => {
    describe("exerted()", () => {
      it("should set exerted to true by default", () => {
        const filter = builder.exerted().build();
        expect(filter.exerted).toBe(true);
      });

      it("should set exerted to false when specified", () => {
        const filter = builder.exerted(false).build();
        expect(filter.exerted).toBe(false);
      });
    });

    describe("ready()", () => {
      it("should set ready to true by default", () => {
        const filter = builder.ready().build();
        expect(filter.ready).toBe(true);
      });

      it("should set ready to false when specified", () => {
        const filter = builder.ready(false).build();
        expect(filter.ready).toBe(false);
      });
    });

    describe("damaged()", () => {
      it("should set damaged to true by default", () => {
        const filter = builder.damaged().build();
        expect(filter.damaged).toBe(true);
      });

      it("should set damaged to false when specified", () => {
        const filter = builder.damaged(false).build();
        expect(filter.damaged).toBe(false);
      });

      it("should accept NumericComparison for damage amount", () => {
        const comparison: NumericComparison = { operator: "gte", value: 2 };
        const filter = builder.damaged(comparison).build();
        expect(filter.damaged).toEqual(comparison);
      });
    });

    describe("banished()", () => {
      it("should set banished to true by default", () => {
        const filter = builder.banished().build();
        expect(filter.banished).toBe(true);
      });

      it("should set banished to false when specified", () => {
        const filter = builder.banished(false).build();
        expect(filter.banished).toBe(false);
      });
    });

    describe("dry()", () => {
      it("should set dry to true by default", () => {
        const filter = builder.dry().build();
        expect(filter.dry).toBe(true);
      });

      it("should set dry to false when specified", () => {
        const filter = builder.dry(false).build();
        expect(filter.dry).toBe(false);
      });
    });

    describe("atLocation()", () => {
      it("should set atLocation to true by default", () => {
        const filter = builder.atLocation().build();
        expect(filter.atLocation).toBe(true);
      });

      it("should set atLocation to false when specified", () => {
        const filter = builder.atLocation(false).build();
        expect(filter.atLocation).toBe(false);
      });
    });

    describe("hasCardUnder()", () => {
      it("should set hasCardUnder to true by default", () => {
        const filter = builder.hasCardUnder().build();
        expect(filter.hasCardUnder).toBe(true);
      });

      it("should set hasCardUnder to false when specified", () => {
        const filter = builder.hasCardUnder(false).build();
        expect(filter.hasCardUnder).toBe(false);
      });
    });
  });

  // =============================================================================
  // CAPABILITIES TESTS
  // =============================================================================

  describe("Capabilities", () => {
    describe("canQuest()", () => {
      it("should set canQuest to true by default", () => {
        const filter = builder.canQuest().build();
        expect(filter.canQuest).toBe(true);
      });

      it("should set canQuest to false when specified", () => {
        const filter = builder.canQuest(false).build();
        expect(filter.canQuest).toBe(false);
      });
    });

    describe("canChallenge()", () => {
      it("should set canChallenge to true by default", () => {
        const filter = builder.canChallenge().build();
        expect(filter.canChallenge).toBe(true);
      });

      it("should set canChallenge to false when specified", () => {
        const filter = builder.canChallenge(false).build();
        expect(filter.canChallenge).toBe(false);
      });
    });

    describe("canSing()", () => {
      it("should set canSing to true by default", () => {
        const filter = builder.canSing().build();
        expect(filter.canSing).toBe(true);
      });

      it("should set canSing to false when specified", () => {
        const filter = builder.canSing(false).build();
        expect(filter.canSing).toBe(false);
      });
    });

    describe("canSingTogether()", () => {
      it("should set canSingTogether to true by default", () => {
        const filter = builder.canSingTogether().build();
        expect(filter.canSingTogether).toBe(true);
      });

      it("should set canSingTogether to false when specified", () => {
        const filter = builder.canSingTogether(false).build();
        expect(filter.canSingTogether).toBe(false);
      });
    });

    describe("canShift()", () => {
      it("should set canShift to true by default", () => {
        const filter = builder.canShift().build();
        expect(filter.canShift).toBe(true);
      });

      it("should set canShift to false when specified", () => {
        const filter = builder.canShift(false).build();
        expect(filter.canShift).toBe(false);
      });
    });

    describe("canBePlayed()", () => {
      it("should set canBePlayed to true by default", () => {
        const filter = builder.canBePlayed().build();
        expect(filter.canBePlayed).toBe(true);
      });

      it("should set canBePlayed to false when specified", () => {
        const filter = builder.canBePlayed(false).build();
        expect(filter.canBePlayed).toBe(false);
      });
    });

    describe("canTarget()", () => {
      it("should set single instance ID", () => {
        const filter = builder.canTarget("instance123").build();
        expect(filter.canTarget).toBe("instance123");
      });

      it("should set multiple instance IDs as array", () => {
        const filter = builder.canTarget("instance123", "instance456").build();
        expect(filter.canTarget).toEqual(["instance123", "instance456"]);
      });

      it("should handle empty array", () => {
        const filter = builder.canTarget().build();
        expect(filter.canTarget).toEqual([]);
      });
    });
  });

  // =============================================================================
  // CONTEXT AND OWNERSHIP TESTS
  // =============================================================================

  describe("Context and Ownership", () => {
    describe("ownedBy()", () => {
      it("should set owner to self", () => {
        const filter = builder.ownedBy("self").build();
        expect(filter.owner).toBe("self");
      });

      it("should set owner to opponent", () => {
        const filter = builder.ownedBy("opponent").build();
        expect(filter.owner).toBe("opponent");
      });

      it("should set owner to specific player ID", () => {
        const filter = builder.ownedBy("player123").build();
        expect(filter.owner).toBe("player123");
      });
    });

    describe("controlledBy()", () => {
      it("should set controller to self", () => {
        const filter = builder.controlledBy("self").build();
        expect(filter.controller).toBe("self");
      });

      it("should set controller to opponent", () => {
        const filter = builder.controlledBy("opponent").build();
        expect(filter.controller).toBe("opponent");
      });

      it("should set controller to specific player ID", () => {
        const filter = builder.controlledBy("player456").build();
        expect(filter.controller).toBe("player456");
      });
    });

    describe("inZone()", () => {
      it("should set single zone", () => {
        const filter = builder.inZone("play").build();
        expect(filter.zone).toBe("play");
      });

      it("should set multiple zones as array", () => {
        const filter = builder.inZone("play", "hand", "discard").build();
        expect(filter.zone).toEqual(["play", "hand", "discard"]);
      });
    });

    describe("source()", () => {
      it("should set source to self", () => {
        const filter = builder.source("self").build();
        expect(filter.source).toBe("self");
      });

      it("should set source to trigger", () => {
        const filter = builder.source("trigger").build();
        expect(filter.source).toBe("trigger");
      });

      it("should set source to target", () => {
        const filter = builder.source("target").build();
        expect(filter.source).toBe("target");
      });

      it("should set source to other", () => {
        const filter = builder.source("other").build();
        expect(filter.source).toBe("other");
      });
    });

    describe("location()", () => {
      it("should set location to source", () => {
        const filter = builder.location("source").build();
        expect(filter.location).toBe("source");
      });

      it("should set location to specific instance ID", () => {
        const filter = builder.location("location123").build();
        expect(filter.location).toBe("location123");
      });
    });
  });

  // =============================================================================
  // TURN-BASED FILTERS TESTS
  // =============================================================================

  describe("Turn-based Filters", () => {
    describe("playedThisTurn()", () => {
      it("should set playedThisTurn to true by default", () => {
        const filter = builder.playedThisTurn().build();
        expect(filter.playedThisTurn).toBe(true);
      });

      it("should set playedThisTurn to false when specified", () => {
        const filter = builder.playedThisTurn(false).build();
        expect(filter.playedThisTurn).toBe(false);
      });
    });

    describe("questedThisTurn()", () => {
      it("should set questedThisTurn to true by default", () => {
        const filter = builder.questedThisTurn().build();
        expect(filter.questedThisTurn).toBe(true);
      });

      it("should set questedThisTurn to false when specified", () => {
        const filter = builder.questedThisTurn(false).build();
        expect(filter.questedThisTurn).toBe(false);
      });
    });

    describe("challengedThisTurn()", () => {
      it("should set challengedThisTurn to true by default", () => {
        const filter = builder.challengedThisTurn().build();
        expect(filter.challengedThisTurn).toBe(true);
      });

      it("should set challengedThisTurn to false when specified", () => {
        const filter = builder.challengedThisTurn(false).build();
        expect(filter.challengedThisTurn).toBe(false);
      });
    });

    describe("usedInkwellThisTurn()", () => {
      it("should set usedInkwellThisTurn to true by default", () => {
        const filter = builder.usedInkwellThisTurn().build();
        expect(filter.usedInkwellThisTurn).toBe(true);
      });

      it("should set usedInkwellThisTurn to false when specified", () => {
        const filter = builder.usedInkwellThisTurn(false).build();
        expect(filter.usedInkwellThisTurn).toBe(false);
      });
    });

    describe("wasChallenged()", () => {
      it("should set wasChallenged to true by default", () => {
        const filter = builder.wasChallenged().build();
        expect(filter.wasChallenged).toBe(true);
      });

      it("should set wasChallenged to false when specified", () => {
        const filter = builder.wasChallenged(false).build();
        expect(filter.wasChallenged).toBe(false);
      });
    });
  });

  // =============================================================================
  // COMBAT-RELATED TESTS
  // =============================================================================

  describe("Combat-related Filters", () => {
    describe("challengeRole()", () => {
      it("should set challenge role to attacker", () => {
        const filter = builder.challengeRole("attacker").build();
        expect(filter.challengeRole).toBe("attacker");
      });

      it("should set challenge role to defender", () => {
        const filter = builder.challengeRole("defender").build();
        expect(filter.challengeRole).toBe("defender");
      });
    });

    describe("singRole()", () => {
      it("should set sing role to singer", () => {
        const filter = builder.singRole("singer").build();
        expect(filter.singRole).toBe("singer");
      });

      it("should set sing role to song", () => {
        const filter = builder.singRole("song").build();
        expect(filter.singRole).toBe("song");
      });
    });
  });

  // =============================================================================
  // DYNAMIC FILTERS TESTS
  // =============================================================================

  describe("Dynamic Filters", () => {
    describe("withInstanceId()", () => {
      it("should set single instance ID", () => {
        const filter = builder.withInstanceId("instance123").build();
        expect(filter.instanceId).toBe("instance123");
      });

      it("should set multiple instance IDs as array", () => {
        const filter = builder
          .withInstanceId("instance123", "instance456")
          .build();
        expect(filter.instanceId).toEqual(["instance123", "instance456"]);
      });
    });

    describe("withPublicId()", () => {
      it("should set single public ID", () => {
        const filter = builder.withPublicId("public123").build();
        expect(filter.publicId).toBe("public123");
      });

      it("should set multiple public IDs as array", () => {
        const filter = builder.withPublicId("public123", "public456").build();
        expect(filter.publicId).toEqual(["public123", "public456"]);
      });
    });
  });

  // =============================================================================
  // DECK/TOP-RELATED TESTS
  // =============================================================================

  describe("Deck/Top-related Filters", () => {
    describe("topDeck()", () => {
      it("should set top deck to self", () => {
        const filter = builder.topDeck("self").build();
        expect(filter.topDeck).toBe("self");
      });

      it("should set top deck to opponent", () => {
        const filter = builder.topDeck("opponent").build();
        expect(filter.topDeck).toBe("opponent");
      });
    });
  });

  // =============================================================================
  // SPECIAL FILTERS TESTS
  // =============================================================================

  describe("Special Filters", () => {
    describe("namedCard()", () => {
      it("should set named card", () => {
        const filter = builder
          .namedCard("Mickey Mouse - Brave Little Tailor")
          .build();
        expect(filter.namedCard).toBe("Mickey Mouse - Brave Little Tailor");
      });
    });
  });

  // =============================================================================
  // LOGICAL OPERATORS TESTS
  // =============================================================================

  describe("Logical Operators", () => {
    describe("and()", () => {
      it("should combine multiple builders with AND", () => {
        const subBuilder1 = new LorcanaCardFilterBuilder().cost(3);
        const subBuilder2 = new LorcanaCardFilterBuilder().canQuest();

        const filter = builder.and(subBuilder1, subBuilder2).build();

        expect(filter.and).toHaveLength(2);
        expect(filter.and![0]).toEqual({ cost: { exact: 3 } });
        expect(filter.and![1]).toEqual({ canQuest: true });
      });

      it("should combine multiple filter objects with AND", () => {
        const filter1: LorcanaCardFilterExtended = { cost: { exact: 3 } };
        const filter2: LorcanaCardFilterExtended = { canQuest: true };

        const filter = builder.and(filter1, filter2).build();

        expect(filter.and).toHaveLength(2);
        expect(filter.and![0]).toEqual(filter1);
        expect(filter.and![1]).toEqual(filter2);
      });

      it("should accumulate AND filters across multiple calls", () => {
        const filter = builder
          .and(new LorcanaCardFilterBuilder().cost(3))
          .and(new LorcanaCardFilterBuilder().canQuest())
          .build();

        expect(filter.and).toHaveLength(2);
      });
    });

    describe("or()", () => {
      it("should combine multiple builders with OR", () => {
        const subBuilder1 = new LorcanaCardFilterBuilder().cost(3);
        const subBuilder2 = new LorcanaCardFilterBuilder().cost(4);

        const filter = builder.or(subBuilder1, subBuilder2).build();

        expect(filter.or).toHaveLength(2);
        expect(filter.or![0]).toEqual({ cost: { exact: 3 } });
        expect(filter.or![1]).toEqual({ cost: { exact: 4 } });
      });

      it("should combine multiple filter objects with OR", () => {
        const filter1: LorcanaCardFilterExtended = { cost: { exact: 3 } };
        const filter2: LorcanaCardFilterExtended = { cost: { exact: 4 } };

        const filter = builder.or(filter1, filter2).build();

        expect(filter.or).toHaveLength(2);
        expect(filter.or![0]).toEqual(filter1);
        expect(filter.or![1]).toEqual(filter2);
      });

      it("should accumulate OR filters across multiple calls", () => {
        const filter = builder
          .or(new LorcanaCardFilterBuilder().cost(3))
          .or(new LorcanaCardFilterBuilder().cost(4))
          .build();

        expect(filter.or).toHaveLength(2);
      });
    });

    describe("not()", () => {
      it("should negate a builder", () => {
        const subBuilder = new LorcanaCardFilterBuilder().cost(3);

        const filter = builder.not(subBuilder).build();

        expect(filter.not).toEqual({ cost: { exact: 3 } });
      });

      it("should negate a filter object", () => {
        const subFilter: LorcanaCardFilterExtended = { cost: { exact: 3 } };

        const filter = builder.not(subFilter).build();

        expect(filter.not).toEqual(subFilter);
      });
    });
  });

  // =============================================================================
  // MISC OPTIONS TESTS
  // =============================================================================

  describe("Misc Options", () => {
    describe("negate()", () => {
      it("should set negate to true by default", () => {
        const filter = builder.negate().build();
        expect(filter.negate).toBe(true);
      });

      it("should set negate to false when specified", () => {
        const filter = builder.negate(false).build();
        expect(filter.negate).toBe(false);
      });
    });

    describe("ignoreBonuses()", () => {
      it("should set ignoreBonuses to true by default", () => {
        const filter = builder.ignoreBonuses().build();
        expect(filter.ignoreBonuses).toBe(true);
      });

      it("should set ignoreBonuses to false when specified", () => {
        const filter = builder.ignoreBonuses(false).build();
        expect(filter.ignoreBonuses).toBe(false);
      });
    });
  });

  // =============================================================================
  // BUILD METHOD TESTS
  // =============================================================================

  describe("build()", () => {
    it("should return a copy of the filter object", () => {
      const filter1 = builder.cost(3).build();
      const filter2 = builder.build();

      expect(filter1).toEqual(filter2);
      expect(filter1).not.toBe(filter2); // Different objects
    });

    it("should not affect the builder's internal state", () => {
      builder.cost(3);
      const filter1 = builder.build();

      builder.strength(4);
      const filter2 = builder.build();

      expect(filter1).toEqual({ cost: { exact: 3 } });
      expect(filter2).toEqual({ cost: { exact: 3 }, strength: { exact: 4 } });
    });
  });

  // =============================================================================
  // STATIC FACTORY METHODS TESTS
  // =============================================================================

  describe("Static Factory Methods", () => {
    describe("create()", () => {
      it("should create a new builder instance", () => {
        const newBuilder = LorcanaCardFilterBuilder.create();
        expect(newBuilder).toBeInstanceOf(LorcanaCardFilterBuilder);
        expect(newBuilder).not.toBe(builder);
      });
    });

    describe("and()", () => {
      it("should create a builder with AND filters", () => {
        const builder1 = new LorcanaCardFilterBuilder().cost(3);
        const builder2 = new LorcanaCardFilterBuilder().canQuest();

        const filter = LorcanaCardFilterBuilder.and(builder1, builder2).build();

        expect(filter.and).toHaveLength(2);
        expect(filter.and![0]).toEqual({ cost: { exact: 3 } });
        expect(filter.and![1]).toEqual({ canQuest: true });
      });
    });

    describe("or()", () => {
      it("should create a builder with OR filters", () => {
        const builder1 = new LorcanaCardFilterBuilder().cost(3);
        const builder2 = new LorcanaCardFilterBuilder().cost(4);

        const filter = LorcanaCardFilterBuilder.or(builder1, builder2).build();

        expect(filter.or).toHaveLength(2);
        expect(filter.or![0]).toEqual({ cost: { exact: 3 } });
        expect(filter.or![1]).toEqual({ cost: { exact: 4 } });
      });
    });
  });

  // =============================================================================
  // METHOD CHAINING TESTS
  // =============================================================================

  describe("Method Chaining", () => {
    it("should allow chaining all methods", () => {
      const filter = new LorcanaCardFilterBuilder()
        .cost(3)
        .strength({ min: 2, max: 5 })
        .name("Mickey Mouse")
        .type("character")
        .ink("red", "blue")
        .inkable(true)
        .hasKeyword("rush")
        .hasAbility("Singer 4")
        .exerted(false)
        .ready(true)
        .damaged(false)
        .canQuest(true)
        .canChallenge(true)
        .canSing(true)
        .ownedBy("self")
        .controlledBy("self")
        .inZone("play")
        .source("self")
        .playedThisTurn(false)
        .challengeRole("attacker")
        .withInstanceId("instance123")
        .topDeck("self")
        .namedCard("Test Card")
        .negate(false)
        .ignoreBonuses(true)
        .build();

      expect(filter).toEqual({
        cost: { exact: 3 },
        strength: { min: 2, max: 5 },
        name: { operator: "eq", value: "Mickey Mouse" },
        cardType: ["character"],
        ink: ["red", "blue"],
        inkable: true,
        hasKeyword: ["rush"],
        hasAbility: ["Singer 4"],
        exerted: false,
        ready: true,
        damaged: false,
        canQuest: true,
        canChallenge: true,
        canSing: true,
        owner: "self",
        controller: "self",
        zone: "play",
        source: "self",
        playedThisTurn: false,
        challengeRole: "attacker",
        instanceId: "instance123",
        topDeck: "self",
        namedCard: "Test Card",
        negate: false,
        ignoreBonuses: true,
      });
    });

    it("should return the same builder instance for all methods", () => {
      const result1 = builder.cost(3);
      const result2 = result1.strength(4);
      const result3 = result2.name("Test");

      expect(result1).toBe(builder);
      expect(result2).toBe(builder);
      expect(result3).toBe(builder);
    });
  });

  // =============================================================================
  // COMPLEX SCENARIOS TESTS
  // =============================================================================

  describe("Complex Scenarios", () => {
    it("should handle complex nested logical operations", () => {
      const lowCostBuilder = new LorcanaCardFilterBuilder()
        .cost({ max: 3 })
        .canQuest();

      const highStrengthBuilder = new LorcanaCardFilterBuilder()
        .strength({ min: 4 })
        .canChallenge();

      const filter = new LorcanaCardFilterBuilder()
        .ownedBy("self")
        .inZone("play")
        .or(lowCostBuilder, highStrengthBuilder)
        .not(new LorcanaCardFilterBuilder().exerted())
        .build();

      expect(filter).toEqual({
        owner: "self",
        zone: "play",
        or: [
          { cost: { max: 3 }, canQuest: true },
          { strength: { min: 4 }, canChallenge: true },
        ],
        not: { exerted: true },
      });
    });

    it("should handle multiple keywords and abilities", () => {
      const filter = new LorcanaCardFilterBuilder()
        .hasKeyword("rush", "evasive")
        .hasKeyword("bodyguard")
        .hasAbility("Singer 4")
        .hasAbility("Shift 3", "Ward")
        .build();

      expect(filter.hasKeyword).toEqual(["rush", "evasive", "bodyguard"]);
      expect(filter.hasAbility).toEqual(["Singer 4", "Shift 3", "Ward"]);
    });

    it("should handle all numeric comparison operators", () => {
      const builders = [
        { op: "eq" as const, expected: { exact: 3 } },
        { op: "gte" as const, expected: { min: 3 } },
        { op: "lte" as const, expected: { max: 3 } },
        { op: "gt" as const, expected: { min: 4 } },
        { op: "lt" as const, expected: { max: 2 } },
        { op: "ne" as const, expected: { exact: 3 } },
      ];

      for (const { op, expected } of builders) {
        const comparison: NumericComparison = { operator: op, value: 3 };
        const filter = new LorcanaCardFilterBuilder().cost(comparison).build();
        expect(filter.cost).toEqual(expected);
      }
    });

    it("should handle all string comparison operators", () => {
      const comparisons = [
        { operator: "eq" as const, value: "Mickey Mouse" },
        { operator: "contains" as const, value: "Mickey" },
        { operator: "startsWith" as const, value: "Mickey" },
        { operator: "endsWith" as const, value: "Mouse" },
        { operator: "ne" as const, value: "Donald Duck" },
      ];

      for (const comparison of comparisons) {
        const filter = new LorcanaCardFilterBuilder().name(comparison).build();
        expect(filter.name).toEqual(comparison);
      }
    });
  });

  // =============================================================================
  // EDGE CASES TESTS
  // =============================================================================

  describe("Edge Cases", () => {
    it("should handle empty build", () => {
      const filter = new LorcanaCardFilterBuilder().build();
      expect(filter).toEqual({});
    });

    it("should handle building the same filter multiple times", () => {
      builder.cost(3).strength(4);
      const filter1 = builder.build();
      const filter2 = builder.build();

      expect(filter1).toEqual(filter2);
      expect(filter1).not.toBe(filter2);
    });

    it("should handle empty arrays for multiple value methods", () => {
      const filter = new LorcanaCardFilterBuilder()
        .type()
        .ink()
        .hasKeyword()
        .hasAbility()
        .canTarget()
        .withInstanceId()
        .withPublicId()
        .inZone()
        .build();

      expect(filter.cardType).toEqual([]);
      expect(filter.ink).toEqual([]);
      expect(filter.hasKeyword).toEqual([]);
      expect(filter.hasAbility).toEqual([]);
      expect(filter.canTarget).toEqual([]);
      expect(filter.instanceId).toEqual([]);
      expect(filter.publicId).toEqual([]);
      expect(filter.zone).toEqual([]);
    });

    it("should handle string arrays in string comparisons", () => {
      const comparison: StringComparison = {
        operator: "eq",
        value: ["Mickey Mouse", "Donald Duck"],
      };

      const filter = new LorcanaCardFilterBuilder().name(comparison).build();
      expect(filter.name).toEqual(comparison);
    });

    it("should handle damage comparison with numeric values", () => {
      const damageComparison: NumericComparison = { operator: "gte", value: 2 };
      const filter = new LorcanaCardFilterBuilder()
        .damaged(damageComparison)
        .build();
      expect(filter.damaged).toEqual(damageComparison);
    });

    it("should handle mixed builder and filter objects in logical operators", () => {
      const subBuilder = new LorcanaCardFilterBuilder().cost(3);
      const subFilter: LorcanaCardFilterExtended = { strength: { exact: 4 } };

      const filter = new LorcanaCardFilterBuilder()
        .and(subBuilder, subFilter)
        .build();

      expect(filter.and).toHaveLength(2);
      expect(filter.and![0]).toEqual({ cost: { exact: 3 } });
      expect(filter.and![1]).toEqual(subFilter);
    });
  });
});
