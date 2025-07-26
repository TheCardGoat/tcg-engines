import { describe, expect, it } from "bun:test";
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { challengeMove } from "./challenge";
import type { LorcanaEnumerableMove, LorcanaMoveFn } from "./types";

// Helper function to handle either MoveFn or EnumerableMove
function executeMove(
  move: LorcanaMoveFn | LorcanaEnumerableMove,
  context: any,
  ...args: any[]
) {
  if (typeof move === "function") {
    return move(context, ...args);
  }
  if (move.execute) {
    return move.execute(context, ...args);
  }
  throw new Error("Invalid move type");
}

describe("Move: Challenge", () => {
  describe("Basic validation", () => {
    it("should be defined", () => {
      expect(challengeMove).toBeDefined();
      expect(
        typeof challengeMove === "function" ||
          typeof (challengeMove as any).execute === "function",
      ).toBe(true);
    });

    it("should return invalid move for wrong phase", () => {
      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "wrongPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "wrongPhase" }),
          getCardInstance: () => null,
          getCardsInZone: () => [],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      expect(result).toEqual(
        createInvalidMove("WRONG_PHASE", "moves.challenge.errors.wrongPhase", {
          currentPhase: "wrongPhase",
          expectedPhase: "mainPhase",
        }),
      );
    });
  });

  describe("Challenger validation", () => {
    it("should reject exerted challenger", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: true, // Challenger is exerted
        meta: {},
      };

      const mockTarget = {
        instanceId: "target-id",
        card: {
          type: ["Character"],
          strength: 2,
          willpower: 3,
          abilities: [],
        },
        isExerted: true, // Target is exerted (required)
        meta: {},
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "target-id"
                ? mockTarget
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => false, // Cannot challenge because exerted
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {},
          gameStateCheck: () => {},
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      expect(result).toEqual(
        createInvalidMove(
          "CHALLENGER_CANNOT_CHALLENGE",
          "moves.challenge.errors.challengerCannotChallenge",
          {
            instanceId: "challenger-id",
            reason: "Character is exerted or unable to challenge",
          },
        ),
      );
    });

    it("should allow ready challenger to challenge", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: false, // Challenger is ready
        meta: {},
      };

      const mockTarget = {
        instanceId: "target-id",
        card: {
          type: ["Character"],
          strength: 2,
          willpower: 3,
          abilities: [],
        },
        isExerted: true, // Target is exerted (required)
        meta: {},
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "target-id"
                ? mockTarget
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true, // Can challenge because ready
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      // Should not return an invalid move
      expect(result).not.toHaveProperty("type", "INVALID_MOVE");
    });
  });

  describe("Target validation", () => {
    it("should reject ready character target (must be exerted)", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: false, // Ready challenger
        meta: {},
      };

      const mockTarget = {
        instanceId: "target-id",
        card: {
          type: ["Character"],
          strength: 2,
          willpower: 3,
          abilities: [],
        },
        isExerted: false, // Target is ready (NOT allowed for challenge)
        meta: {},
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "target-id"
                ? mockTarget
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      expect(result).toEqual(
        createInvalidMove(
          "TARGET_NOT_EXERTED",
          "moves.challenge.errors.targetNotExerted",
          {
            instanceId: "target-id",
          },
        ),
      );
    });

    it("should allow challenging exerted character", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: false, // Ready challenger
        meta: {},
      };

      const mockTarget = {
        instanceId: "target-id",
        card: {
          type: ["Character"],
          strength: 2,
          willpower: 3,
          abilities: [],
        },
        isExerted: true, // Target is exerted (allowed)
        meta: {},
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "target-id"
                ? mockTarget
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      // Should not return an invalid move
      expect(result).not.toHaveProperty("type", "INVALID_MOVE");
    });

    it("should allow challenging location (any ready state)", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: false, // Ready challenger
        meta: {},
      };

      const mockLocation = {
        instanceId: "location-id",
        card: {
          type: ["Location"],
          willpower: 5,
          abilities: [],
        }, // Locations don't have isExerted
        meta: {},
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "location-id"
                ? mockLocation
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "location-id",
      });

      // Should not return an invalid move
      expect(result).not.toHaveProperty("type", "INVALID_MOVE");
    });
  });

  describe("Challenge execution", () => {
    it("should exert the challenging character", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: {
          type: ["Character"],
          strength: 3,
          willpower: 2,
          abilities: [],
        },
        isExerted: false,
        meta: {},
      };

      const mockTarget = {
        instanceId: "target-id",
        card: {
          type: ["Character"],
          strength: 2,
          willpower: 3,
          abilities: [],
        },
        isExerted: true,
        meta: {},
      };

      let exertedCharacter = "";
      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: (id: string) =>
            id === "challenger-id"
              ? mockChallenger
              : id === "target-id"
                ? mockTarget
                : null,
          getCardsInZone: () => [mockChallenger],
          getCardOwner: (id: string) =>
            id === "challenger-id" ? "player_one" : "player_two",
          getCardZone: () => "play",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: (id: string) => {
            exertedCharacter = id;
          },
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
        },
        gameOps: null,
        playerID: "player_one",
      };

      executeMove(challengeMove, mockContext, "challenger-id", {
        targetInstanceId: "target-id",
      });

      expect(exertedCharacter).toBe("challenger-id");
    });
  });
});
