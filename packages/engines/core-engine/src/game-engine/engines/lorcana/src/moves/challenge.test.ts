import { describe, expect, it } from "bun:test";
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { challengeMove } from "./challenge";

describe("Move: Challenge", () => {
  describe("Basic validation", () => {
    it("should be defined", () => {
      expect(challengeMove).toBeDefined();
      expect(typeof challengeMove).toBe("function");
    });

    it("should return invalid move for wrong phase", () => {
      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "wrongPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "wrongPhase" }),
          getCardInstance: () => null,
          getCardsInZone: () => [],
          getCardOwner: () => "player_one",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
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
        card: { type: ["Character"], strength: 3, willpower: 2 },
        isExerted: true, // Challenger is exerted
      };

      const mockTarget = {
        instanceId: "target-id",
        card: { type: ["Character"], strength: 2, willpower: 3 },
        isExerted: true, // Target is exerted (required)
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => false, // Cannot challenge because exerted
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
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
        card: { type: ["Character"], strength: 3, willpower: 2, keywords: [] },
        isExerted: false, // Challenger is ready
      };

      const mockTarget = {
        instanceId: "target-id",
        card: { type: ["Character"], strength: 2, willpower: 3, keywords: [] },
        isExerted: true, // Target is exerted (required)
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => true, // Can challenge because ready
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
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
        card: { type: ["Character"], strength: 3, willpower: 2, keywords: [] },
        isExerted: false, // Ready challenger
      };

      const mockTarget = {
        instanceId: "target-id",
        card: { type: ["Character"], strength: 2, willpower: 3 },
        isExerted: false, // Target is ready (NOT allowed for challenge)
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
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
        card: { type: ["Character"], strength: 3, willpower: 2, keywords: [] },
        isExerted: false, // Ready challenger
      };

      const mockTarget = {
        instanceId: "target-id",
        card: { type: ["Character"], strength: 2, willpower: 3 },
        isExerted: true, // Target is exerted (allowed)
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
        targetInstanceId: "target-id",
      });

      // Should not return an invalid move
      expect(result).not.toHaveProperty("type", "INVALID_MOVE");
    });

    it("should allow challenging location (any ready state)", () => {
      const mockChallenger = {
        instanceId: "challenger-id",
        card: { type: ["Character"], strength: 3, willpower: 2, keywords: [] },
        isExerted: false, // Ready challenger
      };

      const mockLocation = {
        instanceId: "location-id",
        card: { type: ["Location"], willpower: 5 }, // Locations don't have isExerted
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: () => {},
          applyDamage: () => {}, // Mock damage application
          gameStateCheck: () => {}, // Mock game state check
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = challengeMove(mockContext as any, "challenger-id", {
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
        card: { type: ["Character"], strength: 3, willpower: 2, keywords: [] },
        isExerted: false,
      };

      const mockTarget = {
        instanceId: "target-id",
        card: { type: ["Character"], strength: 2, willpower: 3 },
        isExerted: true,
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
          getCardOwner: () => "player_two",
          canCharacterChallenge: () => true,
          addTriggeredEffectsToTheBag: () => {},
          exertCard: (id: string) => {
            exertedCharacter = id;
          },
          state: { G: { metas: {} } }, // Mock state for keyword access
        },
        gameOps: null,
        playerID: "player_one",
      };

      challengeMove(mockContext as any, "challenger-id", {
        targetInstanceId: "target-id",
      });

      expect(exertedCharacter).toBe("challenger-id");
    });
  });
});
