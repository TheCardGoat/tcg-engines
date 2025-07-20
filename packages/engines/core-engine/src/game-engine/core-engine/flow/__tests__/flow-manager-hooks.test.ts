import { beforeEach, describe, expect, it } from "bun:test";
import type { FnContext } from "../../game-configuration";
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

describe("FlowManager - Hook Execution", () => {
  let flowManager: FlowManager<TestGameState>;
  let mockHooks: any;

  beforeEach(() => {
    mockHooks = createMockHooks();
  });

  describe("Hook Execution Order", () => {
    it("should call hooks in correct order: onBegin → endIf → onEnd", () => {
      const callOrder: string[] = [];

      // Create hooks that track call order
      const segmentOnBegin = (ctx: FnContext<TestGameState>) => {
        callOrder.push("segmentOnBegin");
        return ctx.G;
      };

      const segmentEndIf = () => {
        callOrder.push("segmentEndIf");
        return true;
      };

      const segmentOnEnd = (ctx: FnContext<TestGameState>) => {
        callOrder.push("segmentOnEnd");
        return ctx.G;
      };

      const nextSegmentOnBegin = (ctx: FnContext<TestGameState>) => {
        callOrder.push("nextSegmentOnBegin");
        return ctx.G;
      };

      const gameDefinition = {
        segments: {
          first: {
            start: true,
            next: "second",
            onBegin: segmentOnBegin,
            endIf: segmentEndIf,
            onEnd: segmentOnEnd,
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase1", false),
                },
              },
            },
          },
          second: {
            next: undefined,
            onBegin: nextSegmentOnBegin,
            turn: {
              phases: {
                phase2: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "first";
      initialState.ctx.currentPhase = "phase1";

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      // Verify correct execution order
      expect(callOrder).toEqual([
        "segmentEndIf", // Check if segment should end
        "segmentOnEnd", // End current segment
        "nextSegmentOnBegin", // Begin next segment
      ]);
    });

    it("should call phase hooks in correct order during phase transitions", () => {
      const callOrder: string[] = [];

      const phaseOnBegin = (ctx: FnContext<TestGameState>) => {
        callOrder.push("phaseOnBegin");
        return ctx.G;
      };

      const phaseEndIf = () => {
        callOrder.push("phaseEndIf");
        return true;
      };

      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: "phase2",
                  endIf: phaseEndIf,
                },
                phase2: {
                  next: undefined,
                  onBegin: phaseOnBegin,
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "test";
      initialState.ctx.currentPhase = "phase1";

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      expect(callOrder).toEqual([
        "phaseEndIf", // Check if phase should end
        "phaseOnBegin", // Begin next phase
      ]);
    });

    it("should call step hooks in correct order during step transitions", () => {
      const callOrder: string[] = [];

      const step1EndIf = () => {
        callOrder.push("step1EndIf");
        return true;
      };

      const step2OnBegin = (ctx: FnContext<TestGameState>) => {
        callOrder.push("step2OnBegin");
        return ctx.G;
      };

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
                    step1: {
                      start: true,
                      next: "step2",
                      endIf: step1EndIf,
                    },
                    step2: {
                      next: undefined,
                      onBegin: step2OnBegin,
                      endIf: createSpyEndIf("step2", false),
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
      initialState.ctx.currentStep = "step1";

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      expect(callOrder).toEqual([
        "step1EndIf", // Check if step should end
        "step2OnBegin", // Begin next step
      ]);
    });
  });

  describe("Hook Context Validation", () => {
    it("should pass correct context to hooks", () => {
      let receivedContext: any = null;

      const hookWithContextValidation = (ctx: FnContext<TestGameState>) => {
        receivedContext = ctx;
        return ctx.G;
      };

      const gameDefinition = {
        segments: {
          first: {
            start: true,
            next: "test",
            endIf: () => true, // Transition immediately
            turn: {
              phases: {
                firstPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("firstPhase", false),
                },
              },
            },
          },
          test: {
            next: undefined,
            onBegin: hookWithContextValidation,
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
      initialState.ctx.currentSegment = "first";
      initialState.ctx.currentPhase = "firstPhase";

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      // Verify hook received proper context
      expect(receivedContext).toBeTruthy();
      expect(receivedContext.G).toBeDefined();
      expect(receivedContext.ctx).toBeDefined();
      expect(receivedContext.coreOps).toBeDefined();
      expect(receivedContext._getUpdatedState).toBeDefined();
    });

    it("should update state when hooks return modified game state", () => {
      const gameModifyingHook = (ctx: FnContext<TestGameState>) => {
        return {
          ...ctx.G,
          testData: "modified by hook",
        };
      };

      const gameDefinition = {
        segments: {
          first: {
            start: true,
            next: "test",
            endIf: () => true, // Transition immediately
            turn: {
              phases: {
                firstPhase: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("firstPhase", false),
                },
              },
            },
          },
          test: {
            next: undefined,
            onBegin: gameModifyingHook,
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
      initialState.ctx.currentSegment = "first";
      initialState.ctx.currentPhase = "firstPhase";

      const fnContext = createMockFnContext(initialState);
      const result = flowManager.processFlowTransitions(
        initialState,
        fnContext,
      );

      expect(result.G.testData).toBe("modified by hook");
    });
  });

  describe("Hook Error Handling", () => {
    it("should handle hooks that throw errors gracefully", () => {
      const errorThrowingHook = (ctx: FnContext<TestGameState>) => {
        throw new Error("Hook error");
      };

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
                  onBegin: errorThrowingHook,
                  endIf: createSpyEndIf("testPhase", false),
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

      const fnContext = createMockFnContext(initialState);

      // Should not throw - should handle error gracefully
      expect(() => {
        flowManager.processFlowTransitions(initialState, fnContext);
      }).not.toThrow();
    });

    it("should skip hook execution when hook is undefined", () => {
      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            onBegin: undefined, // No hook defined
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
      initialState.ctx.currentSegment = "test";
      initialState.ctx.currentPhase = "testPhase";

      const fnContext = createMockFnContext(initialState);

      // Should not throw when hook is undefined
      expect(() => {
        flowManager.processFlowTransitions(initialState, fnContext);
      }).not.toThrow();
    });
  });

  describe("Hook Conditional Execution", () => {
    it("should NOT call onBegin when transitioning to same state", () => {
      const onBeginSpy = createSpyHook("onBeginSpy");

      const gameDefinition = {
        segments: {
          test: {
            start: true,
            next: undefined,
            endIf: createSpyEndIf("test", false), // Never end
            turn: {
              phases: {
                testPhase: {
                  start: true,
                  next: undefined,
                  onBegin: onBeginSpy,
                  endIf: createSpyEndIf("testPhase", false),
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

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      // onBegin should NOT be called since we're not transitioning
      expect(onBeginSpy).not.toHaveBeenCalled();
    });

    it("should call hooks for each transition in a chain", () => {
      const segment1OnEnd = createSpyHook("segment1OnEnd");
      const segment2OnBegin = createSpyHook("segment2OnBegin");
      const segment2OnEnd = createSpyHook("segment2OnEnd");
      const segment3OnBegin = createSpyHook("segment3OnBegin");

      const gameDefinition = {
        segments: {
          segment1: {
            start: true,
            next: "segment2",
            endIf: createSpyEndIf("segment1", true),
            onEnd: segment1OnEnd,
            turn: {
              phases: {
                phase1: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase1", false),
                },
              },
            },
          },
          segment2: {
            next: "segment3",
            onBegin: segment2OnBegin,
            endIf: createSpyEndIf("segment2", true),
            onEnd: segment2OnEnd,
            turn: {
              phases: {
                phase2: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase2", false),
                },
              },
            },
          },
          segment3: {
            next: undefined,
            onBegin: segment3OnBegin,
            turn: {
              phases: {
                phase3: {
                  start: true,
                  next: undefined,
                  endIf: createSpyEndIf("phase3", false),
                },
              },
            },
          },
        },
      };

      flowManager = new FlowManager(gameDefinition, {});
      const initialState = MockGameStates.initial();
      initialState.ctx.currentSegment = "segment1";
      initialState.ctx.currentPhase = "phase1";

      const fnContext = createMockFnContext(initialState);
      flowManager.processFlowTransitions(initialState, fnContext);

      // All hooks should be called in the chain
      expect(segment1OnEnd).toHaveBeenCalled();
      expect(segment2OnBegin).toHaveBeenCalled();
      expect(segment2OnEnd).toHaveBeenCalled();
      expect(segment3OnBegin).toHaveBeenCalled();
    });
  });
});
