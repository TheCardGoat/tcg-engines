import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "@tcg/core";
import { isConditionMet } from "../condition-resolver";
import "../conditions/index"; // Register all
import type { CardInstance, CardRegistry } from "@tcg/core";
import type {
  Condition,
  HasNamedCharacterCondition,
  TurnCondition,
  UsedShiftCondition,
} from "../../cards/abilities/types/condition-types";
import type { LorcanaCardDefinition } from "../../types/card-types";
import {
  createDefaultCardMeta,
  createInitialLorcanaState,
  type LorcanaCardMeta,
  type LorcanaGameState,
} from "../../types/game-state";

describe("Condition Resolver", () => {
  let state: LorcanaGameState;
  let registry: CardRegistry<LorcanaCardDefinition>;
  let sourceCard: CardInstance<LorcanaCardMeta>;

  beforeEach(() => {
    state = createInitialLorcanaState(
      "player1" as PlayerId,
      "player2" as PlayerId,
      "player1" as PlayerId,
    );
    // Explicitly seed lore scores for comparison tests
    state.external.loreScores = {
      player1: 10,
      player2: 5,
    } as Record<PlayerId, number>;

    registry = {
      getCard: (id: string) => {
        if (id === "def-elsa")
          return {
            id: "def-elsa",
            name: "Elsa",
            fullName: "Elsa - Snow Queen",
            cardType: "character",
            inkType: ["amethyst"],
            cost: 3,
            inkable: true,
            set: "1",
          } as LorcanaCardDefinition;
        return undefined;
      },
      hasCard: () => true,
      getAllCards: () => [],
    } as any;

    sourceCard = {
      id: "card-1" as CardId,
      definitionId: "def-elsa",
      owner: "player1" as PlayerId,
      controller: "player1" as PlayerId,
      zone: "play" as ZoneId,
      tapped: false,
      flipped: false,
      revealed: false,
      phased: false,
      state: "ready",
      damage: 0,
      isDrying: true,
    } as any;

    state.internal.cards["card-1"] = sourceCard;
  });

  describe("Basic Conditions", () => {
    it("should check turn correctly", () => {
      state.external.activePlayerId = "player1" as PlayerId;
      const cond: TurnCondition = { type: "turn", whose: "your" };
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);

      state.external.activePlayerId = "player2" as PlayerId;
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);
    });

    it("should check exerted/ready", () => {
      sourceCard.state = "ready";
      expect(
        isConditionMet({ type: "is-ready" }, sourceCard, state, registry),
      ).toBe(true);
      expect(
        isConditionMet({ type: "is-exerted" }, sourceCard, state, registry),
      ).toBe(false);

      sourceCard.state = "exerted";
      expect(
        isConditionMet({ type: "is-ready" }, sourceCard, state, registry),
      ).toBe(false);
      expect(
        isConditionMet({ type: "is-exerted" }, sourceCard, state, registry),
      ).toBe(true);
    });
  });

  describe("Resolution Conditions", () => {
    it("should check bodyguard context", () => {
      const cond: Condition = { type: "resolution", value: "bodyguard" };

      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);

      const context = { resolutionContext: "bodyguard" } as any;
      expect(isConditionMet(cond, sourceCard, state, registry, context)).toBe(
        true,
      );
    });

    it("should check generic shift usage via stack", () => {
      const cond: UsedShiftCondition = { type: "used-shift" };
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);

      sourceCard.stackPosition = {
        isUnder: false,
        cardsUnderneath: ["card-under-1" as CardId],
        topCardId: "card-1" as CardId,
      };
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);
    });
  });

  describe("Existence Conditions", () => {
    it("should find named character", () => {
      const cond: HasNamedCharacterCondition = {
        type: "has-named-character",
        name: "Elsa",
        controller: "you",
      };
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);

      state.internal.cards = {}; // empty
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);
    });
  });

  describe("Logical Conditions", () => {
    it("should handle AND logic", () => {
      const cond: Condition = {
        type: "and",
        conditions: [{ type: "is-ready" }, { type: "no-damage" }],
      };

      sourceCard.state = "ready";
      sourceCard.damage = 0;
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);

      sourceCard.damage = 1;
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);
    });

    it("should handle nested NOT logic", () => {
      const cond: Condition = {
        type: "not",
        condition: { type: "is-exerted" },
      };
      sourceCard.state = "ready";
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);
    });

    it("should handle OR logic", () => {
      const cond: Condition = {
        type: "or",
        conditions: [
          { type: "is-exerted" }, // False
          { type: "no-damage" }, // True
        ],
      };

      sourceCard.state = "ready";
      sourceCard.damage = 0;
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);
    });
  });

  describe("Comparison Conditions", () => {
    it("should compare lore scores", () => {
      const condition: Condition = {
        type: "comparison",
        left: { type: "lore", controller: "you" },
        comparison: "gt" as any,
        right: { type: "lore", controller: "opponent" },
      };

      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(true);

      (state.external.loreScores as any).player2 = 15;
      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(
        false,
      );
    });
  });

  describe("History Conditions", () => {
    it("should check if event happened this turn", () => {
      state.external.turnHistory = [
        {
          type: "played-song",
          controllerId: "player1" as PlayerId,
          count: 1,
        },
      ];

      const condition: Condition = {
        type: "this-turn-happened",
        event: "played-song",
        who: "you",
      };

      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(true);
    });

    it("should count events this turn", () => {
      state.external.turnHistory = [
        {
          type: "played-action",
          controllerId: "player1" as PlayerId,
          count: 1,
        },
        {
          type: "played-action",
          controllerId: "player1" as PlayerId,
          count: 1,
        },
      ];

      const condition: Condition = {
        type: "this-turn-count",
        event: "played-action",
        who: "you",
        comparison: "gte" as any,
        count: 2,
      };

      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(true);
    });
  });

  describe("Zone Conditions", () => {
    it("should check if character is at location", () => {
      sourceCard.atLocationId = "loc-1" as CardId;

      const condition: Condition = {
        type: "at-location",
      };

      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(true);

      sourceCard.atLocationId = undefined;
      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(
        false,
      );
    });

    it("should check general zone content", () => {
      const discardCard: CardInstance<LorcanaCardMeta> = {
        id: "card-discard" as CardId,
        definitionId: "def-elsa",
        owner: "player1" as PlayerId,
        controller: "player1" as PlayerId,
        zone: "discard" as ZoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        ...createDefaultCardMeta(),
      };
      state.internal.cards["card-discard"] = discardCard;

      const condition: Condition = {
        type: "zone",
        zone: "discard",
        controller: "you",
        hasCards: true,
      };

      expect(isConditionMet(condition, sourceCard, state, registry)).toBe(true);
    });
  });

  describe("Card State Conditions", () => {
    it("should check for card under", () => {
      const cond: Condition = { type: "has-card-under" };

      sourceCard.stackPosition = undefined;
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(false);

      sourceCard.stackPosition = {
        isUnder: false,
        cardsUnderneath: ["card-under" as CardId],
        topCardId: "card-1" as CardId,
      };
      expect(isConditionMet(cond, sourceCard, state, registry)).toBe(true);
    });
  });
});
