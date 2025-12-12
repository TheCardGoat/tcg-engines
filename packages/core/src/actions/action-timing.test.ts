import { describe, expect, it } from "bun:test";
import type { CardInstance } from "../cards/card-instance";
import type { Modifier } from "../cards/modifiers";
import { createCardRegistry } from "../operations/card-registry-impl";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { ActionDefinition, ActionInstance } from "./action-definition";
import {
  getAvailableActions,
  hasAvailableActions,
  type TimingContext,
  validateAction,
  validateActionTiming,
} from "./action-timing";

type TestGameState = TimingContext & {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
  turnCount?: number;
};

describe("Action Timing Validation", () => {
  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");
  const card1 = createCardId("card1");
  const card2 = createCardId("card2");
  const playZone = createZoneId("play");

  const registry = createCardRegistry([
    { id: "creature1", name: "Test Creature", type: "creature" },
  ]);

  const baseState: TestGameState = {
    currentSegment: "gameplay",
    currentPhase: "mainPhase",
    currentStep: null,
    cards: {
      [card1]: {
        id: card1,
        definitionId: "creature1",
        owner: player1,
        controller: player1,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      },
      [card2]: {
        id: card2,
        definitionId: "creature1",
        owner: player2,
        controller: player2,
        zone: playZone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      },
    },
  };

  describe("validateActionTiming", () => {
    it("should allow action with no timing restrictions", () => {
      const action: ActionDefinition = {
        id: "pass",
        name: "Pass",
      };

      const timingContext: TimingContext = {
        currentSegment: "gameplay",
        currentPhase: "mainPhase",
      };

      expect(validateActionTiming(action, timingContext)).toBe(true);
    });

    it("should validate segment restrictions", () => {
      const action: ActionDefinition = {
        id: "play-card",
        name: "Play Card",
        timing: {
          segments: ["gameplay"],
        },
      };

      expect(
        validateActionTiming(action, {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
        }),
      ).toBe(true);

      expect(
        validateActionTiming(action, {
          currentSegment: "setup",
          currentPhase: "draft",
        }),
      ).toBe(false);
    });

    it("should validate phase restrictions", () => {
      const action: ActionDefinition = {
        id: "play-creature",
        name: "Play Creature",
        timing: {
          phases: ["mainPhase"],
        },
      };

      expect(
        validateActionTiming(action, {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
        }),
      ).toBe(true);

      expect(
        validateActionTiming(action, {
          currentSegment: "gameplay",
          currentPhase: "combatPhase",
        }),
      ).toBe(false);
    });

    it("should validate step restrictions", () => {
      const action: ActionDefinition = {
        id: "attack",
        name: "Attack",
        timing: {
          steps: ["attackStep"],
        },
      };

      expect(
        validateActionTiming(action, {
          currentSegment: "gameplay",
          currentPhase: "combatPhase",
          currentStep: "attackStep",
        }),
      ).toBe(true);

      expect(
        validateActionTiming(action, {
          currentSegment: "gameplay",
          currentPhase: "combatPhase",
          currentStep: "blockStep",
        }),
      ).toBe(false);
    });

    it("should validate multiple phases", () => {
      const action: ActionDefinition = {
        id: "instant-spell",
        name: "Instant Spell",
        timing: {
          phases: ["mainPhase", "combatPhase", "endPhase"],
        },
      };

      expect(
        validateActionTiming(action, {
          currentPhase: "mainPhase",
        }),
      ).toBe(true);
      expect(
        validateActionTiming(action, {
          currentPhase: "combatPhase",
        }),
      ).toBe(true);
      expect(
        validateActionTiming(action, {
          currentPhase: "drawPhase",
        }),
      ).toBe(false);
    });

    it("should validate custom timing predicates", () => {
      type GameState = TimingContext & { turnCount: number };

      const action: ActionDefinition<GameState> = {
        id: "special-action",
        name: "Special Action",
        timing: {
          custom: (state) => state.turnCount >= 5,
        },
      };

      expect(
        validateActionTiming(
          action,
          { currentSegment: "gameplay" },
          { currentSegment: "gameplay", turnCount: 6 },
        ),
      ).toBe(true);

      expect(
        validateActionTiming(
          action,
          { currentSegment: "gameplay" },
          { currentSegment: "gameplay", turnCount: 3 },
        ),
      ).toBe(false);
    });

    it("should combine segment, phase, and custom restrictions", () => {
      type GameState = TimingContext & { hasSpecialToken: boolean };

      const action: ActionDefinition<GameState> = {
        id: "ultimate-ability",
        name: "Ultimate Ability",
        timing: {
          segments: ["gameplay"],
          phases: ["mainPhase"],
          custom: (state) => state.hasSpecialToken,
        },
      };

      expect(
        validateActionTiming(
          action,
          { currentSegment: "gameplay", currentPhase: "mainPhase" },
          {
            currentSegment: "gameplay",
            currentPhase: "mainPhase",
            hasSpecialToken: true,
          },
        ),
      ).toBe(true);

      expect(
        validateActionTiming(
          action,
          { currentSegment: "gameplay", currentPhase: "mainPhase" },
          {
            currentSegment: "gameplay",
            currentPhase: "mainPhase",
            hasSpecialToken: false,
          },
        ),
      ).toBe(false);
    });
  });

  describe("validateAction", () => {
    it("should validate action without targets", () => {
      const action: ActionDefinition = {
        id: "draw",
        name: "Draw Card",
        timing: {
          segments: ["gameplay"],
        },
      };

      const instance: ActionInstance = {
        actionId: "draw",
        playerId: player1,
      };

      const result = validateAction(
        instance,
        action,
        baseState,
        baseState,
        registry,
      );

      expect(result.valid).toBe(true);
    });

    it("should fail when timing is invalid", () => {
      const action: ActionDefinition = {
        id: "play-card",
        name: "Play Card",
        timing: {
          segments: ["setup"], // Wrong segment
        },
      };

      const instance: ActionInstance = {
        actionId: "play-card",
        playerId: player1,
      };

      const result = validateAction(
        instance,
        action,
        baseState,
        baseState,
        registry,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("timing");
    });

    it("should fail when targets required but not provided", () => {
      const action: ActionDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const instance: ActionInstance = {
        actionId: "lightning-bolt",
        playerId: player1,
      };

      const result = validateAction(
        instance,
        action,
        baseState,
        baseState,
        registry,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("targets");
      expect(result.error).toContain("requires targets");
    });

    it("should validate action with valid targets", () => {
      const action: ActionDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const instance: ActionInstance = {
        actionId: "lightning-bolt",
        playerId: player1,
        targets: [[card2]],
      };

      const result = validateAction(
        instance,
        action,
        baseState,
        baseState,
        registry,
      );

      expect(result.valid).toBe(true);
    });

    it("should fail when target card does not exist", () => {
      const action: ActionDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      const nonexistentCard = createCardId("nonexistent");
      const instance: ActionInstance = {
        actionId: "lightning-bolt",
        playerId: player1,
        targets: [[nonexistentCard]],
      };

      const result = validateAction(
        instance,
        action,
        baseState,
        baseState,
        registry,
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("targets");
      expect(result.error).toContain("do not exist");
    });
  });

  describe("getAvailableActions", () => {
    it("should return all actions when all are valid", () => {
      const actions: ActionDefinition[] = [
        { id: "pass", name: "Pass" },
        {
          id: "play",
          name: "Play Card",
          timing: { segments: ["gameplay"] },
        },
      ];

      const timingContext: TimingContext = {
        currentSegment: "gameplay",
      };

      const available = getAvailableActions(actions, timingContext);
      expect(available).toHaveLength(2);
    });

    it("should filter out actions with invalid timing", () => {
      const actions: ActionDefinition[] = [
        {
          id: "setup-action",
          name: "Setup Action",
          timing: { segments: ["setup"] },
        },
        {
          id: "gameplay-action",
          name: "Gameplay Action",
          timing: { segments: ["gameplay"] },
        },
      ];

      const timingContext: TimingContext = {
        currentSegment: "gameplay",
      };

      const available = getAvailableActions(actions, timingContext);
      expect(available).toHaveLength(1);
      expect(available[0].id).toBe("gameplay-action");
    });

    it("should filter based on custom timing predicates", () => {
      type GameState = TimingContext & { turnCount: number };

      const actions: ActionDefinition<GameState>[] = [
        {
          id: "early-action",
          name: "Early Action",
          timing: { custom: (state) => state.turnCount < 5 },
        },
        {
          id: "late-action",
          name: "Late Action",
          timing: { custom: (state) => state.turnCount >= 5 },
        },
      ];

      const available = getAvailableActions(
        actions,
        { currentSegment: "gameplay" },
        { currentSegment: "gameplay", turnCount: 6 },
      );

      expect(available).toHaveLength(1);
      expect(available[0].id).toBe("late-action");
    });
  });

  describe("hasAvailableActions", () => {
    it("should return true when at least one action is available", () => {
      const actions: ActionDefinition[] = [
        {
          id: "setup",
          name: "Setup",
          timing: { segments: ["setup"] },
        },
        {
          id: "play",
          name: "Play",
          timing: { segments: ["gameplay"] },
        },
      ];

      expect(hasAvailableActions(actions, { currentSegment: "gameplay" })).toBe(
        true,
      );
    });

    it("should return false when no actions are available", () => {
      const actions: ActionDefinition[] = [
        {
          id: "setup1",
          name: "Setup 1",
          timing: { segments: ["setup"] },
        },
        {
          id: "setup2",
          name: "Setup 2",
          timing: { segments: ["setup"] },
        },
      ];

      expect(hasAvailableActions(actions, { currentSegment: "gameplay" })).toBe(
        false,
      );
    });

    it("should return true when actions have no timing restrictions", () => {
      const actions: ActionDefinition[] = [{ id: "pass", name: "Pass" }];

      expect(hasAvailableActions(actions, { currentSegment: "any" })).toBe(
        true,
      );
    });
  });
});
