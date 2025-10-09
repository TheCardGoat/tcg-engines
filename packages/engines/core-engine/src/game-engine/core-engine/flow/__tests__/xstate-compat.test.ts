import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../../types/branded-types";
import {
  applyFlowContext,
  createFlowMachine,
  type FlowDefinition,
  type FlowEvent,
  type FlowState,
  type FlowTransition,
  getFlowContext,
} from "../xstate-compat";

describe("XState Flow Manager Compatibility", () => {
  const player1 = createPlayerId("player-1");
  const player2 = createPlayerId("player-2");

  describe("FlowDefinition Type", () => {
    it("should define flow with states and transitions", () => {
      const flowDef: FlowDefinition<{ turn: number }> = {
        id: "game-flow",
        initial: "setup",
        states: {
          setup: {
            on: {
              START: "mainPhase",
            },
            onBegin: (ctx) => {
              ctx.G.turn = 1;
              return ctx.G;
            },
          },
          mainPhase: {
            on: {
              END_TURN: "endPhase",
            },
          },
          endPhase: {
            on: {
              NEXT_TURN: "mainPhase",
            },
            onEnd: (ctx) => {
              ctx.G.turn += 1;
              return ctx.G;
            },
          },
        },
      };

      expect(flowDef.id).toBe("game-flow");
      expect(flowDef.initial).toBe("setup");
      expect(flowDef.states.setup).toBeDefined();
      expect(flowDef.states.mainPhase).toBeDefined();
      expect(flowDef.states.endPhase).toBeDefined();
    });

    it("should support hierarchical states", () => {
      const flowDef: FlowDefinition<unknown> = {
        id: "turn-flow",
        initial: "draw",
        states: {
          draw: {
            on: { NEXT: "main" },
          },
          main: {
            initial: "play",
            states: {
              play: {
                on: { NEXT: "combat" },
              },
              combat: {
                on: { NEXT: "end" },
              },
            },
            on: {
              END: "end",
            },
          },
          end: {
            on: { NEXT_TURN: "draw" },
          },
        },
      };

      expect(flowDef.states.main.states).toBeDefined();
      expect(flowDef.states.main.states?.play).toBeDefined();
      expect(flowDef.states.main.states?.combat).toBeDefined();
    });

    it("should support guard conditions", () => {
      const flowDef: FlowDefinition<{ canAdvance: boolean }> = {
        id: "guarded-flow",
        initial: "waiting",
        states: {
          waiting: {
            on: {
              ADVANCE: {
                target: "ready",
                guard: (ctx) => ctx.G.canAdvance === true,
              },
            },
          },
          ready: {
            on: { RESET: "waiting" },
          },
        },
      };

      const transition = flowDef.states.waiting.on?.ADVANCE as FlowTransition<{
        canAdvance: boolean;
      }>;
      expect(typeof transition).toBe("object");
      if (typeof transition !== "string") {
        expect(transition.guard).toBeDefined();
      }
    });
  });

  describe("FlowEvent Type", () => {
    it("should support basic event types", () => {
      const event1: FlowEvent = { type: "NEXT_PHASE" };
      const event2: FlowEvent = { type: "PASS_PRIORITY" };
      const event3: FlowEvent = { type: "EXECUTE_MOVE", moveName: "playCard" };
      const event4: FlowEvent = { type: "END_TURN" };

      expect(event1.type).toBe("NEXT_PHASE");
      expect(event2.type).toBe("PASS_PRIORITY");
      expect(event3.type).toBe("EXECUTE_MOVE");
      expect(event3.moveName).toBe("playCard");
      expect(event4.type).toBe("END_TURN");
    });

    it("should support custom event types", () => {
      const customEvent: FlowEvent = {
        type: "CUSTOM_ACTION",
        payload: { data: "test" },
      };

      expect(customEvent.type).toBe("CUSTOM_ACTION");
      expect(customEvent.payload).toEqual({ data: "test" });
    });
  });

  describe("FlowState Type", () => {
    it("should represent current flow state", () => {
      const flowState: FlowState<{ hp: number }> = {
        value: "mainPhase",
        context: {
          G: { hp: 20 },
          ctx: {
            currentSegment: "gameplay",
            currentPhase: "mainPhase",
            currentStep: null,
            playerOrder: [player1, player2],
            turnPlayerPos: 0,
          },
        },
      };

      expect(flowState.value).toBe("mainPhase");
      expect(flowState.context.G.hp).toBe(20);
      expect(flowState.context.ctx.currentPhase).toBe("mainPhase");
    });

    it("should support nested state values", () => {
      const flowState: FlowState<unknown> = {
        value: { main: "combat" },
        context: {
          G: {},
          ctx: {
            currentSegment: "gameplay",
            currentPhase: "main",
            currentStep: "combat",
            playerOrder: [player1],
            turnPlayerPos: 0,
          },
        },
      };

      expect(flowState.value).toEqual({ main: "combat" });
    });
  });

  describe("createFlowMachine", () => {
    it("should create a flow machine from definition", () => {
      const flowDef: FlowDefinition<{ count: number }> = {
        id: "counter-flow",
        initial: "idle",
        states: {
          idle: {
            on: { START: "active" },
          },
          active: {
            on: { STOP: "idle" },
            onBegin: (ctx) => {
              ctx.G.count = 0;
              return ctx.G;
            },
          },
        },
      };

      const machine = createFlowMachine(flowDef);

      expect(machine).toBeDefined();
      expect(machine.id).toBe("counter-flow");
      expect(machine.initial).toBe("idle");
    });

    it("should preserve lifecycle hooks", () => {
      const onBeginCalled: string[] = [];
      const onEndCalled: string[] = [];

      const flowDef: FlowDefinition<unknown> = {
        id: "lifecycle-flow",
        initial: "first",
        states: {
          first: {
            on: { NEXT: "second" },
            onBegin: (ctx) => {
              onBeginCalled.push("first");
              return ctx.G;
            },
            onEnd: (ctx) => {
              onEndCalled.push("first");
              return ctx.G;
            },
          },
          second: {
            onBegin: (ctx) => {
              onBeginCalled.push("second");
              return ctx.G;
            },
          },
        },
      };

      const machine = createFlowMachine(flowDef);

      expect(machine.states.first.onBegin).toBeDefined();
      expect(machine.states.first.onEnd).toBeDefined();
      expect(machine.states.second.onBegin).toBeDefined();
    });
  });

  describe("getFlowContext", () => {
    it("should extract flow context from game state", () => {
      const state = {
        G: { score: 100 },
        ctx: {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
          currentStep: null,
          playerOrder: [player1, player2],
          turnPlayerPos: 0,
        },
      };

      const flowContext = getFlowContext(state);

      expect(flowContext.G).toEqual({ score: 100 });
      expect(flowContext.ctx.currentPhase).toBe("mainPhase");
      expect(flowContext.ctx.playerOrder).toEqual([player1, player2]);
    });

    it("should include currentPlayer if available", () => {
      const state = {
        G: {},
        ctx: {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
          currentStep: null,
          playerOrder: [player1, player2],
          turnPlayerPos: 1,
        },
      };

      const flowContext = getFlowContext(state);

      expect(flowContext.ctx.turnPlayerPos).toBe(1);
    });
  });

  describe("applyFlowContext", () => {
    it("should apply flow context changes to game state", () => {
      const state = {
        G: { score: 100 },
        ctx: {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
          currentStep: null,
          playerOrder: [player1, player2],
          turnPlayerPos: 0,
        },
      };

      const flowContext = {
        G: { score: 200 },
        ctx: {
          currentSegment: "gameplay",
          currentPhase: "endPhase",
          currentStep: null,
          playerOrder: [player1, player2],
          turnPlayerPos: 1,
        },
      };

      const newState = applyFlowContext(state, flowContext);

      expect(newState.G.score).toBe(200);
      expect(newState.ctx.currentPhase).toBe("endPhase");
      expect(newState.ctx.turnPlayerPos).toBe(1);
      // Original state unchanged
      expect(state.G.score).toBe(100);
      expect(state.ctx.currentPhase).toBe("mainPhase");
    });

    it("should handle partial context updates", () => {
      const state = {
        G: { score: 100, lives: 3 },
        ctx: {
          currentSegment: "gameplay",
          currentPhase: "mainPhase",
          currentStep: null,
          playerOrder: [player1],
          turnPlayerPos: 0,
        },
      };

      const flowContext = {
        G: { score: 150, lives: 3 },
        ctx: {
          ...state.ctx,
          currentPhase: "endPhase",
        },
      };

      const newState = applyFlowContext(state, flowContext);

      expect(newState.G.score).toBe(150);
      expect(newState.G.lives).toBe(3);
      expect(newState.ctx.currentPhase).toBe("endPhase");
    });
  });

  describe("Flow Event Handling", () => {
    it("should define standard flow events", () => {
      const events: FlowEvent[] = [
        { type: "NEXT_PHASE" },
        { type: "PASS_PRIORITY" },
        { type: "EXECUTE_MOVE", moveName: "attack" },
        { type: "END_TURN" },
      ];

      expect(events[0].type).toBe("NEXT_PHASE");
      expect(events[1].type).toBe("PASS_PRIORITY");
      expect(events[2].type).toBe("EXECUTE_MOVE");
      expect(events[3].type).toBe("END_TURN");
    });

    it("should support event transitions in flow definition", () => {
      const flowDef: FlowDefinition<unknown> = {
        id: "event-flow",
        initial: "waiting",
        states: {
          waiting: {
            on: {
              NEXT_PHASE: "active",
              END_TURN: "end",
            },
          },
          active: {
            on: {
              PASS_PRIORITY: "waiting",
            },
          },
          end: {
            type: "final",
          },
        },
      };

      expect(flowDef.states.waiting.on?.NEXT_PHASE).toBe("active");
      expect(flowDef.states.waiting.on?.END_TURN).toBe("end");
      expect(flowDef.states.active.on?.PASS_PRIORITY).toBe("waiting");
      expect(flowDef.states.end.type).toBe("final");
    });
  });
});
