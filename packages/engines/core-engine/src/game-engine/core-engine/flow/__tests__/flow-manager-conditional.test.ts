import { beforeEach, describe, expect, it } from "bun:test";
import { FlowManager } from "../flow-manager";
import {
  createMockFnContext,
  createMockHooks,
  createSpyEndIf,
  createSpyHook,
  MockConfigurations,
  MockGameStates,
  TestAssertions,
  type TestGameState,
} from "./flow-manager-test-mocks";

describe("FlowManager - Conditional Transitions", () => {
  let flowManager: FlowManager<TestGameState>;
  let mockHooks: any;

  beforeEach(() => {
    mockHooks = createMockHooks();
  });

  describe("Segment Next as Function", () => {
    it("should transition to different segments based on game state conditions", () => {
      const gameDefinition = {
        segments: {
          conditional: {
            start: true,
            // Next segment depends on game state
            next: (ctx: any) => {
              return ctx.G.combatInitiated ? "combat" : "peaceful";
            },
            endIf: createSpyEndIf("conditional", true),
            turn: {
              phases: {
                evaluationPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("evaluationPhase", false),
                },
              },
            },
          },
          combat: {
            next: undefined,
            onBegin: createSpyHook("combatOnBegin"),
            turn: {
              phases: {
                battlePhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("battlePhase", false),
                },
              },
            },
          },
          peaceful: {
            next: undefined,
            onBegin: createSpyHook("peacefulOnBegin"),
            turn: {
              phases: {
                diplomacyPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("diplomacyPhase", false),
                },
              },
            },
          },
        },
      };

      // Test combat path
      flowManager = new FlowManager(gameDefinition, {});
      const combatState = MockGameStates.initial();
      combatState.G.combatInitiated = true;
      combatState.ctx.currentSegment = "conditional";
      combatState.ctx.currentPhase = "evaluationPhase";

      const combatContext = createMockFnContext(combatState);
      const combatResult = flowManager.processFlowTransitions(
        combatState,
        combatContext,
      );

      expect(combatResult.ctx.currentSegment).toBe("combat");
      expect(combatResult.ctx.currentPhase).toBe("battlePhase");

      // Test peaceful path
      flowManager = new FlowManager(gameDefinition, {});
      const peacefulState = MockGameStates.initial();
      peacefulState.G.combatInitiated = false;
      peacefulState.ctx.currentSegment = "conditional";
      peacefulState.ctx.currentPhase = "evaluationPhase";

      const peacefulContext = createMockFnContext(peacefulState);
      const peacefulResult = flowManager.processFlowTransitions(
        peacefulState,
        peacefulContext,
      );

      expect(peacefulResult.ctx.currentSegment).toBe("peaceful");
      expect(peacefulResult.ctx.currentPhase).toBe("diplomacyPhase");
    });

    it("should handle segment next function returning undefined", () => {
      const gameDefinition = {
        segments: {
          terminal: {
            start: true,
            next: (ctx: any) => {
              // Return undefined to end the segment flow
              return ctx.G.gameOver ? undefined : "continuing";
            },
            endIf: createSpyEndIf("terminal", true),
            turn: {
              phases: {
                checkPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("checkPhase", false),
                },
              },
            },
          },
          continuing: {
            next: undefined,
            turn: {
              phases: {
                continuePhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("continuePhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const gameOverState = MockGameStates.initial();
      gameOverState.G.gameOver = true;
      gameOverState.ctx.currentSegment = "terminal";
      gameOverState.ctx.currentPhase = "checkPhase";

      const fnContext = createMockFnContext(gameOverState);
      const result = flowManager.processFlowTransitions(
        gameOverState,
        fnContext,
      );

      // Should stay in terminal segment since next returned undefined
      expect(result.ctx.currentSegment).toBe("terminal");
    });

    it("should handle complex conditional logic with multiple conditions", () => {
      const gameDefinition = {
        segments: {
          multiCondition: {
            start: true,
            next: (ctx: any) => {
              const { playerCount, turnEnded, gameOver } = ctx.G;

              if (gameOver) return "endGame";
              if (turnEnded && playerCount <= 2) return "quickEnd";
              if (turnEnded && playerCount > 2) return "multiplayerEnd";
              return "continuing";
            },
            endIf: createSpyEndIf("multiCondition", true),
            turn: {
              phases: {
                analysisPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("analysisPhase", false),
                },
              },
            },
          },
          endGame: {
            next: undefined,
            turn: {
              phases: {
                finalPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("finalPhase", false),
                },
              },
            },
          },
          quickEnd: {
            next: undefined,
            turn: {
              phases: {
                quickPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("quickPhase", false),
                },
              },
            },
          },
          multiplayerEnd: {
            next: undefined,
            turn: {
              phases: {
                multiPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("multiPhase", false),
                },
              },
            },
          },
          continuing: {
            next: undefined,
            turn: {
              phases: {
                continuePhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("continuePhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Test game over condition (highest priority)
      const gameOverState = MockGameStates.initial();
      gameOverState.G.gameOver = true;
      gameOverState.G.turnEnded = true;
      gameOverState.G.playerCount = 4;
      gameOverState.ctx.currentSegment = "multiCondition";
      gameOverState.ctx.currentPhase = "analysisPhase";

      const gameOverResult = flowManager.processFlowTransitions(
        gameOverState,
        createMockFnContext(gameOverState),
      );
      expect(gameOverResult.ctx.currentSegment).toBe("endGame");

      // Test quick end condition (2 players, turn ended)
      const quickEndState = MockGameStates.initial();
      quickEndState.G.gameOver = false;
      quickEndState.G.turnEnded = true;
      quickEndState.G.playerCount = 2;
      quickEndState.ctx.currentSegment = "multiCondition";
      quickEndState.ctx.currentPhase = "analysisPhase";

      const quickEndResult = flowManager.processFlowTransitions(
        quickEndState,
        createMockFnContext(quickEndState),
      );
      expect(quickEndResult.ctx.currentSegment).toBe("quickEnd");

      // Test multiplayer end condition (>2 players, turn ended)
      const multiEndState = MockGameStates.initial();
      multiEndState.G.gameOver = false;
      multiEndState.G.turnEnded = true;
      multiEndState.G.playerCount = 4;
      multiEndState.ctx.currentSegment = "multiCondition";
      multiEndState.ctx.currentPhase = "analysisPhase";

      const multiEndResult = flowManager.processFlowTransitions(
        multiEndState,
        createMockFnContext(multiEndState),
      );
      expect(multiEndResult.ctx.currentSegment).toBe("multiplayerEnd");

      // Test continuing condition (turn not ended)
      const continuingState = MockGameStates.initial();
      continuingState.G.gameOver = false;
      continuingState.G.turnEnded = false;
      continuingState.G.playerCount = 3;
      continuingState.ctx.currentSegment = "multiCondition";
      continuingState.ctx.currentPhase = "analysisPhase";

      const continuingResult = flowManager.processFlowTransitions(
        continuingState,
        createMockFnContext(continuingState),
      );
      expect(continuingResult.ctx.currentSegment).toBe("continuing");
    });
  });

  describe("Phase Next as Function", () => {
    it("should transition to different phases based on conditions", () => {
      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                decisionPhase: {
                  start: true,
                  next: (ctx: any) => {
                    return ctx.G.allPlayersPassed ? "endPhase" : "actionPhase";
                  },
                  endIf: createSpyEndIf("decisionPhase", true),
                },
                actionPhase: {
                  next: undefined,
                  endIf: createSpyEndIf("actionPhase", false),
                },
                endPhase: {
                  next: undefined,
                  endIf: createSpyEndIf("endPhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Test action phase path (not all players passed)
      const actionState = MockGameStates.initial();
      actionState.G.allPlayersPassed = false;
      actionState.ctx.currentSegment = "test";
      actionState.ctx.currentPhase = "decisionPhase";

      const actionResult = flowManager.processFlowTransitions(
        actionState,
        createMockFnContext(actionState),
      );
      expect(actionResult.ctx.currentPhase).toBe("actionPhase");

      // Test end phase path (all players passed)
      const endState = MockGameStates.initial();
      endState.G.allPlayersPassed = true;
      endState.ctx.currentSegment = "test";
      endState.ctx.currentPhase = "decisionPhase";

      const endResult = flowManager.processFlowTransitions(
        endState,
        createMockFnContext(endState),
      );
      expect(endResult.ctx.currentPhase).toBe("endPhase");
    });

    it("should handle phase next function returning undefined", () => {
      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                finalPhase: {
                  start: true,
                  next: (ctx: any) => {
                    // Return undefined to end phase progression
                    return ctx.G.timeoutReached ? undefined : "continuePhase";
                  },
                  endIf: createSpyEndIf("finalPhase", true),
                },
                continuePhase: {
                  next: undefined,
                  endIf: createSpyEndIf("continuePhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const timeoutState = MockGameStates.initial();
      timeoutState.G.timeoutReached = true;
      timeoutState.ctx.currentSegment = "test";
      timeoutState.ctx.currentPhase = "finalPhase";

      const result = flowManager.processFlowTransitions(
        timeoutState,
        createMockFnContext(timeoutState),
      );

      // Should stay in finalPhase since next returned undefined
      expect(result.ctx.currentPhase).toBe("finalPhase");
    });
  });

  describe("Step Next as Function", () => {
    it("should transition to different steps based on game logic", () => {
      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                complexPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("complexPhase", false),
                  steps: {
                    evaluateStep: {
                      start: true,
                      next: (ctx: any) => {
                        return ctx.G.playerPassedTurn
                          ? "endTurnStep"
                          : "actionStep";
                      },
                      endIf: createSpyEndIf("evaluateStep", true),
                    },
                    actionStep: {
                      next: undefined,
                      endIf: createSpyEndIf("actionStep", false),
                    },
                    endTurnStep: {
                      next: undefined,
                      endIf: createSpyEndIf("endTurnStep", false),
                    },
                  },
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});

      // Test action step path
      const actionState = MockGameStates.initial();
      actionState.G.playerPassedTurn = false;
      actionState.ctx.currentSegment = "test";
      actionState.ctx.currentPhase = "complexPhase";
      actionState.ctx.currentStep = "evaluateStep";

      const actionResult = flowManager.processFlowTransitions(
        actionState,
        createMockFnContext(actionState),
      );
      expect(actionResult.ctx.currentStep).toBe("actionStep");

      // Test end turn step path
      const endTurnState = MockGameStates.initial();
      endTurnState.G.playerPassedTurn = true;
      endTurnState.ctx.currentSegment = "test";
      endTurnState.ctx.currentPhase = "complexPhase";
      endTurnState.ctx.currentStep = "evaluateStep";

      const endTurnResult = flowManager.processFlowTransitions(
        endTurnState,
        createMockFnContext(endTurnState),
      );
      expect(endTurnResult.ctx.currentStep).toBe("endTurnStep");
    });

    it("should handle step next function returning undefined", () => {
      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("testPhase", false),
                  steps: {
                    terminalStep: {
                      start: true,
                      next: (ctx: any) => {
                        // Return undefined to end step progression
                        return undefined;
                      },
                      endIf: createSpyEndIf("terminalStep", true),
                    },
                  },
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "test";
      initialState.ctx.currentPhase = "testPhase";
      initialState.ctx.currentStep = "terminalStep";

      const result = flowManager.processFlowTransitions(
        initialState,
        createMockFnContext(initialState),
      );

      // Step should complete and phase should have null step after all steps are complete
      // Since the phase has no next and endIf returns false, phase stays complete with null step
      expect(result.ctx.currentStep).toBeNull();
    });
  });

  describe("Error Handling for Conditional Functions", () => {
    it("should handle next function throwing errors gracefully", () => {
      const gameDefinition = {
        segments: {
          errorSegment: {
            start: true,
            next: (ctx: any) => {
              throw new Error("Next function error");
            },
            endIf: createSpyEndIf("errorSegment", true),
            turn: {
              phases: {
                errorPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("errorPhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "errorSegment";
      initialState.ctx.currentPhase = "errorPhase";

      const fnContext = createMockFnContext(initialState);

      // Should not throw - should handle error gracefully
      expect(() => {
        flowManager.processFlowTransitions(initialState, fnContext);
      }).not.toThrow();
    });

    it("should handle next function returning invalid segment names", () => {
      const gameDefinition = {
        segments: {
          invalidNext: {
            start: true,
            next: (ctx: any) => {
              return "nonExistentSegment";
            },
            endIf: createSpyEndIf("invalidNext", true),
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("testPhase", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "invalidNext";
      initialState.ctx.currentPhase = "testPhase";

      const result = flowManager.processFlowTransitions(
        initialState,
        createMockFnContext(initialState),
      );

      // Should handle gracefully - likely staying in current segment
      expect(result.ctx).toBeDefined();
    });
  });

  describe("Priority Management", () => {
    it("should validate canPlayerAct correctly based on priority player", () => {
      const gameDefinition = {
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("testPhase", false),
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      // Set priority player to player1
      initialState.ctx.priorityPlayerPos = 0;
      initialState.ctx.playerOrder = ["player1", "player2"];

      // Test canPlayerAct
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(true);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(false);

      // Change priority to player2
      initialState.ctx.priorityPlayerPos = 1;
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(false);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(true);
    });

    it("should handle invalid priority player positions gracefully", () => {
      const gameDefinition = {
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("testPhase", false),
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      initialState.ctx.playerOrder = ["player1", "player2"];

      // Test with invalid priority positions
      initialState.ctx.priorityPlayerPos = -1;
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(false);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(false);

      initialState.ctx.priorityPlayerPos = 5; // Out of bounds
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(false);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(false);
    });

    it("should handle priority changes during flow transitions", () => {
      const gameDefinition = {
        segments: {
          testSegment: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: "phase2",
                  endIf: createSpyEndIf("phase1", true),
                },
                phase2: {
                  next: undefined,
                  onBegin: (ctx: any) => {
                    // Change priority when entering phase2
                    ctx.ctx.priorityPlayerPos = 1;
                    return ctx.G;
                  },
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
        },
        flow: { turns: { phases: [] } },
      };

      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "testSegment";
      initialState.ctx.currentPhase = "phase1";
      initialState.ctx.priorityPlayerPos = 0;
      initialState.ctx.playerOrder = ["player1", "player2"];

      // Initially player1 has priority
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(true);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(false);

      const fnContext = createMockFnContext(initialState);
      const result = flowManager.processFlowTransitions(
        initialState,
        fnContext,
      );

      // After transition, priority should have changed to player2
      expect(result.ctx.currentPhase).toBe("phase2");
      expect(flowManager.canPlayerAct(result, "player1")).toBe(false);
      expect(flowManager.canPlayerAct(result, "player2")).toBe(true);
    });

    it("should work with priority windows in combat scenarios", () => {
      const gameDefinition = MockConfigurations.combatPhaseFlow(mockHooks);
      flowManager = new FlowManager(gameDefinition, {});

      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "duringGame";
      initialState.ctx.currentPhase = "combatPhase";
      initialState.ctx.currentStep = "priorityWindow";
      initialState.ctx.priorityPlayerPos = 0;
      initialState.ctx.playerOrder = ["player1", "player2"];
      initialState.G.combatInitiated = true;
      initialState.G.allPlayersPassed = false;

      // In priority window, current priority player should be able to act
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(true);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(false);

      // Change priority
      initialState.ctx.priorityPlayerPos = 1;
      expect(flowManager.canPlayerAct(initialState, "player1")).toBe(false);
      expect(flowManager.canPlayerAct(initialState, "player2")).toBe(true);
    });
  });
});
