import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../types";
import type {
  ActionDefinition,
  ActionInstance,
  ActionMetadata,
  ActionTiming,
} from "./action-definition";

describe("Action Definition Types", () => {
  describe("ActionTiming", () => {
    it("should define timing constraints with segments", () => {
      const timing: ActionTiming = {
        segments: ["gameplay"],
        phases: ["mainPhase"],
      };

      expect(timing.segments).toEqual(["gameplay"]);
      expect(timing.phases).toEqual(["mainPhase"]);
    });

    it("should support custom timing predicates", () => {
      type GameState = { turnCount: number };
      const timing: ActionTiming<GameState> = {
        custom: (state) => state.turnCount > 5,
      };

      expect(timing.custom?.({ turnCount: 6 })).toBe(true);
      expect(timing.custom?.({ turnCount: 3 })).toBe(false);
    });

    it("should support multiple phases and steps", () => {
      const timing: ActionTiming = {
        segments: ["gameplay"],
        phases: ["mainPhase", "combatPhase"],
        steps: ["attackStep", "blockStep"],
      };

      expect(timing.phases).toHaveLength(2);
      expect(timing.steps).toHaveLength(2);
    });
  });

  describe("ActionMetadata", () => {
    it("should define metadata for categorization", () => {
      const metadata: ActionMetadata = {
        category: "card-play",
        subcategory: "creature",
        tags: ["costs-resources", "requires-target"],
        priorityHint: 10,
      };

      expect(metadata.category).toBe("card-play");
      expect(metadata.tags).toContain("costs-resources");
      expect(metadata.priorityHint).toBe(10);
    });

    it("should support hidden actions", () => {
      const metadata: ActionMetadata = {
        hidden: true,
        category: "internal",
      };

      expect(metadata.hidden).toBe(true);
    });
  });

  describe("ActionDefinition", () => {
    it("should define minimal action with just id and name", () => {
      const action: ActionDefinition = {
        id: "pass",
        name: "Pass Priority",
      };

      expect(action.id).toBe("pass");
      expect(action.name).toBe("Pass Priority");
    });

    it("should define action with timing constraints", () => {
      const action: ActionDefinition = {
        id: "play-creature",
        name: "Play Creature",
        description: "Play a creature card from your hand",
        timing: {
          segments: ["gameplay"],
          phases: ["mainPhase"],
        },
      };

      expect(action.timing?.segments).toEqual(["gameplay"]);
      expect(action.timing?.phases).toEqual(["mainPhase"]);
    });

    it("should define action with target requirements", () => {
      const action: ActionDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        targets: [
          {
            filter: { type: "creature" },
            count: 1,
          },
        ],
      };

      expect(action.targets).toHaveLength(1);
      expect(action.targets?.[0].count).toBe(1);
    });

    it("should define action with metadata", () => {
      const action: ActionDefinition = {
        id: "attack",
        name: "Attack",
        metadata: {
          category: "combat",
          tags: ["combat-action"],
          priorityHint: 8,
        },
      };

      expect(action.metadata?.category).toBe("combat");
      expect(action.metadata?.priorityHint).toBe(8);
    });

    it("should support game-specific state types", () => {
      type LorcanaState = { turnPhase: string; inkPool: number };

      const action: ActionDefinition<LorcanaState> = {
        id: "quest",
        name: "Quest with Character",
        timing: {
          custom: (state) => state.turnPhase === "main" && state.inkPool >= 0,
        },
      };

      expect(action.timing?.custom?.({ turnPhase: "main", inkPool: 3 })).toBe(
        true,
      );
      expect(action.timing?.custom?.({ turnPhase: "draw", inkPool: 3 })).toBe(
        false,
      );
    });
  });

  describe("ActionInstance", () => {
    it("should create action instance without targets", () => {
      const player1 = createPlayerId("player1");
      const instance: ActionInstance = {
        actionId: "pass",
        playerId: player1,
      };

      expect(instance.actionId).toBe("pass");
      expect(instance.playerId).toBe(player1);
    });

    it("should create action instance with targets", () => {
      const player1 = createPlayerId("player1");
      const instance: ActionInstance = {
        actionId: "lightning-bolt",
        playerId: player1,
        targets: [["card1"]],
      };

      expect(instance.targets).toHaveLength(1);
      expect(instance.targets?.[0]).toEqual(["card1"]);
    });

    it("should create action instance with custom parameters", () => {
      const player1 = createPlayerId("player1");
      const instance: ActionInstance = {
        actionId: "choose-option",
        playerId: player1,
        params: {
          optionIndex: 2,
          cardId: "card1",
        },
        timestamp: Date.now(),
      };

      expect(instance.params?.optionIndex).toBe(2);
      expect(instance.timestamp).toBeDefined();
    });

    it("should support multi-target actions", () => {
      const player1 = createPlayerId("player1");
      const instance: ActionInstance = {
        actionId: "distribute-damage",
        playerId: player1,
        targets: [
          ["creature1", "creature2"], // First target group
          ["player1"], // Second target group
        ],
      };

      expect(instance.targets).toHaveLength(2);
      expect(instance.targets?.[0]).toHaveLength(2);
      expect(instance.targets?.[1]).toHaveLength(1);
    });
  });
});
