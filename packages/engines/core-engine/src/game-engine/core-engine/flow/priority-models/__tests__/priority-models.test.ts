import { describe, expect, it, jest } from "bun:test";
import type { CoreEngineState } from "../../../game-configuration";
import { setPriorityPlayer } from "../../../state/context";
import type { FlowConfiguration } from "../../flow-manager";
import { FlowManager } from "../../flow-manager";
import { createAPNAPPriorityModel } from "../apnap-priority";
import { createFocusBasedPriorityModel } from "../focus-based-priority";
import { createPriorityModel } from "../priority-factory";
import { createTurnBasedPriorityModel } from "../turn-based-priority";

describe("Priority Models", () => {
  // Test state setup
  const createTestState = (playerCount = 3): CoreEngineState<any> => ({
    G: {},
    ctx: {
      // Use correct ctx structure based on game's Ctx interface
      playerOrder: Array.from({ length: playerCount }, (_, i) => `${i}`),
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      numTurns: 1,
      numTurnMoves: 0,
      currentPhase: "main",
      currentStep: null,
      cards: {} as any,
    },
    _stateID: 0,
    _undo: [],
    _redo: [],
  });

  // Test flow controller setup
  const createTestFlowController = (): FlowManager => {
    const config: FlowConfiguration = {
      turns: {
        phases: [
          {
            id: "main",
            name: "Main Phase",
            allowsPriorityPassing: true,
            advancesTo: "nextTurn",
          },
        ],
      },
      priority: {
        initialPriority: "turnPlayer",
        allowPriorityPassing: {
          main: true,
        },
        autoPriorityAdvance: {
          main: "nextTurn",
        },
      },
    };

    return new FlowManager(config, {} as any);
  };

  describe("Turn-Based Priority Model", () => {
    it("should initialize priority with turn player", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();

      expect(model.getInitialPriority(state.ctx)).toBe("0");
    });

    it("should get next player in turn order", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();

      expect(model.getNextPriority(state)).toBe("1");

      // With different priority player
      const modifiedState = {
        ...state,
        ctx: setPriorityPlayer(state.ctx, "1"),
      };

      expect(model.getNextPriority(modifiedState)).toBe("2");
    });

    it("should wrap around to first player", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();

      // Set last player as priority
      const modifiedState = {
        ...state,
        ctx: setPriorityPlayer(state.ctx, "2"),
      };

      expect(model.getNextPriority(modifiedState)).toBe("0");
    });

    it("should use flow controller to handle priority completion", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();
      const flowController = createTestFlowController();

      const result = model.handlePriorityCompletion(state, flowController);

      expect(result).toEqual({
        advancementType: "nextTurn",
      });
    });

    it("should handle different turn players correctly", () => {
      const model = createTurnBasedPriorityModel();
      let state = createTestState(4);

      // Set turn player to player 2
      state = {
        ...state,
        ctx: {
          ...state.ctx,
          turnPlayerPos: 2,
          priorityPlayerPos: 2,
        },
      };

      expect(model.getInitialPriority(state.ctx)).toBe("2");
      expect(model.getNextPriority(state)).toBe("3");
    });
  });

  describe("APNAP Priority Model", () => {
    it("should initialize priority with turn player", () => {
      const model = createAPNAPPriorityModel();
      const state = createTestState();

      expect(model.getInitialPriority(state.ctx)).toBe("0");
    });

    it("should go from turn player to first non-active player", () => {
      const model = createAPNAPPriorityModel();
      const state = createTestState();

      // Turn player is 0, so next should be 1
      expect(model.getNextPriority(state)).toBe("1");
    });

    it("should go back to turn player after cycling through non-active players", () => {
      const model = createAPNAPPriorityModel();
      const state = createTestState();

      // Set last non-active player as priority
      const modifiedState = {
        ...state,
        ctx: setPriorityPlayer(state.ctx, "2"),
      };

      // Should go back to turn player (0)
      expect(model.getNextPriority(modifiedState)).toBe("0");
    });

    it("should cycle through non-active players in order", () => {
      const model = createAPNAPPriorityModel();
      const fourPlayerState = createTestState(4);

      // Turn player is 0, first non-active should be 1
      expect(model.getNextPriority(fourPlayerState)).toBe("1");

      // From player 1, should go to player 2
      let state = {
        ...fourPlayerState,
        ctx: setPriorityPlayer(fourPlayerState.ctx, "1"),
      };
      expect(model.getNextPriority(state)).toBe("2");

      // From player 2, should go to player 3
      state = {
        ...fourPlayerState,
        ctx: setPriorityPlayer(fourPlayerState.ctx, "2"),
      };
      expect(model.getNextPriority(state)).toBe("3");

      // From player 3, should go back to turn player (0)
      state = {
        ...fourPlayerState,
        ctx: setPriorityPlayer(fourPlayerState.ctx, "3"),
      };
      expect(model.getNextPriority(state)).toBe("0");
    });

    it("should handle when turn player is not player 0", () => {
      const model = createAPNAPPriorityModel();
      let state = createTestState(4);

      // Set turn player to player 2
      state = {
        ...state,
        ctx: {
          ...state.ctx,
          turnPlayerPos: 2,
          priorityPlayerPos: 2, // Priority starts with turn player
        },
      };

      // From turn player (2), should go to first non-active (0)
      expect(model.getNextPriority(state)).toBe("0");
    });
  });

  describe("Focus-Based Priority Model", () => {
    it("should use custom determination function for focus", () => {
      // Create a custom determination function
      const determineNextFocus = (
        _state: CoreEngineState<any>,
      ): string | null => {
        // Example: always return player 2
        return "2";
      };

      const model = createFocusBasedPriorityModel(determineNextFocus);
      const state = createTestState();

      expect(model.getNextPriority(state)).toBe("2");
    });

    it("should return null when determination function returns null", () => {
      const determineNextFocus = () => null;
      const model = createFocusBasedPriorityModel(determineNextFocus);
      const state = createTestState();

      expect(model.getNextPriority(state)).toBe(null);
    });

    it("should pass state to determination function", () => {
      const mockDetermineNextFocus = jest.fn(() => "1");
      const model = createFocusBasedPriorityModel(mockDetermineNextFocus);
      const state = createTestState();

      model.getNextPriority(state);

      expect(mockDetermineNextFocus).toHaveBeenCalledWith(state);
    });
  });

  describe("Priority Factory", () => {
    it("should create turn-based model by default", () => {
      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: { initialPriority: "turnPlayer" },
      };

      const model = createPriorityModel(config);
      const state = createTestState();

      // Should behave like turn-based model
      expect(model.getNextPriority(state)).toBe("1");
    });

    it("should create APNAP model when specified", () => {
      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: {
          initialPriority: "turnPlayer",
          priorityModel: "apnap",
        },
      };

      const model = createPriorityModel(config);
      const state = createTestState();

      // Should behave like APNAP model
      expect(model.getNextPriority(state)).toBe("1");
    });

    it("should use custom priority model when provided", () => {
      const customModel = {
        getInitialPriority: () => "custom",
        getNextPriority: () => "custom-next",
        handlePriorityCompletion: () => ({
          advancementType: "nextTurn" as const,
        }),
      };

      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: {
          initialPriority: "turnPlayer",
          customPriorityModel: customModel,
        },
      };

      const model = createPriorityModel(config);
      const state = createTestState();

      expect(model.getNextPriority(state)).toBe("custom-next");
    });

    it("should fall back to turn-based for focus-based without custom model", () => {
      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: {
          initialPriority: "turnPlayer",
          priorityModel: "focus-based",
        },
      };

      // Should warn and fall back to turn-based
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const model = createPriorityModel(config);
      const state = createTestState();

      expect(model.getNextPriority(state)).toBe("1"); // Turn-based behavior
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Priority Model Edge Cases", () => {
    it("should handle single player games", () => {
      const model = createTurnBasedPriorityModel();
      const singlePlayerState = createTestState(1);

      // Next priority should wrap back to the same player
      expect(model.getNextPriority(singlePlayerState)).toBe("0");
    });

    it("should handle two player games", () => {
      const model = createTurnBasedPriorityModel();
      const twoPlayerState = createTestState(2);

      expect(model.getNextPriority(twoPlayerState)).toBe("1");

      // From player 1, should go back to player 0
      const modifiedState = {
        ...twoPlayerState,
        ctx: setPriorityPlayer(twoPlayerState.ctx, "1"),
      };
      expect(model.getNextPriority(modifiedState)).toBe("0");
    });

    it("should handle empty player order gracefully", () => {
      const model = createTurnBasedPriorityModel();
      const emptyState: CoreEngineState<any> = {
        G: {},
        ctx: {
          playerOrder: [],
          turnPlayerPos: 0,
          priorityPlayerPos: 0,
          numTurns: 1,
          numTurnMoves: 0,
          currentPhase: "main",
          currentStep: null,
          cards: {} as any,
        },
        _stateID: 0,
        _undo: [],
        _redo: [],
      };

      // Should return null for empty player order
      expect(model.getNextPriority(emptyState)).toBe(null);
    });

    it("should handle invalid priority player position", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();

      // Set invalid priority player position
      const invalidState = {
        ...state,
        ctx: {
          ...state.ctx,
          priorityPlayerPos: 99, // Invalid position
        },
      };

      // Should handle gracefully
      expect(() => model.getNextPriority(invalidState)).not.toThrow();
    });
  });

  describe("Priority Completion Handling", () => {
    it("should delegate to flow controller for automatic advancement", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();
      const flowController = createTestFlowController();

      // Mock the getAutomaticAdvancement method
      const mockAdvancement = jest.spyOn(
        flowController,
        "getAutomaticAdvancement",
      );
      mockAdvancement.mockReturnValue({
        advancementType: "nextPhase",
        nextId: "combat",
      });

      const result = model.handlePriorityCompletion(state, flowController);

      expect(mockAdvancement).toHaveBeenCalledWith(state);
      expect(result).toEqual({
        advancementType: "nextPhase",
        nextId: "combat",
      });

      mockAdvancement.mockRestore();
    });

    it("should handle null advancement type", () => {
      const model = createTurnBasedPriorityModel();
      const state = createTestState();
      const flowController = createTestFlowController();

      // Mock to return null advancement
      const mockAdvancement = jest.spyOn(
        flowController,
        "getAutomaticAdvancement",
      );
      mockAdvancement.mockReturnValue({
        advancementType: null,
      });

      const result = model.handlePriorityCompletion(state, flowController);

      expect(result.advancementType).toBe(null);

      mockAdvancement.mockRestore();
    });
  });

  describe("Integration Tests", () => {
    it("should work with FlowController integration", () => {
      const config: FlowConfiguration = {
        turns: {
          phases: [
            { id: "main", name: "Main Phase", allowsPriorityPassing: true },
          ],
        },
        priority: {
          initialPriority: "turnPlayer",
          priorityModel: "turn-based",
        },
      };

      const flowManager = new FlowManager(config, {} as any);
      const state = createTestState();

      // Test integration between FlowManager and priority model
      expect(flowManager.getInitialPriorityPlayer(state.ctx)).toBe("0");
      expect(flowManager.getNextPriorityPlayer(state)).toBe("1");
    });

    it("should handle priority model changes in different phases", () => {
      const customModel = {
        getInitialPriority: (ctx) => ctx.playerOrder[ctx.turnPlayerPos],
        getNextPriority: (state) => {
          // Different behavior based on phase
          if (state.ctx.currentPhase === "combat") {
            // Use APNAP in combat
            const apnap = createAPNAPPriorityModel();
            return apnap.getNextPriority(state);
          }
          // Use turn-based elsewhere
          const turnBased = createTurnBasedPriorityModel();
          return turnBased.getNextPriority(state);
        },
        handlePriorityCompletion: (state, flowController) => {
          return flowController.getAutomaticAdvancement(state);
        },
      };

      const config: FlowConfiguration = {
        turns: { phases: [] },
        priority: {
          initialPriority: "turnPlayer",
          customPriorityModel: customModel,
        },
      };

      const model = createPriorityModel(config);
      const mainState = createTestState();
      const combatState = {
        ...mainState,
        ctx: { ...mainState.ctx, currentPhase: "combat" },
      };

      // Should use turn-based in main phase
      expect(model.getNextPriority(mainState)).toBe("1");

      // Should use APNAP in combat phase
      expect(model.getNextPriority(combatState)).toBe("1"); // Same result but different logic
    });
  });
});
