import { CoreOperation } from "../../engine/core-operation";
import type { CoreEngineState, FnContext } from "../../game-configuration";
import { createContext } from "../../utils/context-factory";

describe("Context Access Patterns", () => {
  // Mock state and engine for CoreOperation
  const mockState: CoreEngineState = {
    G: {},
    ctx: createContext({
      playerOrder: ["p1", "p2"],
      cards: {},
      players: {
        p1: { id: "p1", name: "Player 1" },
        p2: { id: "p2", name: "Player 2" },
      },
      initialPhase: "mainPhase",
    }),
    _undo: [],
    _redo: [],
    _stateID: 0,
  };

  const mockEngine = {} as any;

  test("getCtx method returns the current context", () => {
    // Create CoreOperation instance with mock state
    const coreOps = new CoreOperation({
      state: mockState,
      engine: mockEngine,
    });

    // Get the ctx using getCtx method
    const ctx = coreOps.getCtx();

    // Verify ctx has expected values
    expect(ctx).toBe(mockState.ctx);
    expect(ctx.currentPhase).toBe("mainPhase");
    expect(ctx.playerOrder).toEqual(["p1", "p2"]);
  });

  test("getCtx always returns updated context when state changes", () => {
    // Create CoreOperation instance with mock state
    const coreOps = new CoreOperation({
      state: mockState,
      engine: mockEngine,
    });

    // Initial context check
    expect(coreOps.getCtx().currentPhase).toBe("mainPhase");

    // Update the context phase
    mockState.ctx.currentPhase = "endPhase";

    // Verify getCtx returns updated context
    expect(coreOps.getCtx().currentPhase).toBe("endPhase");
  });

  test("Move pattern with coreOps.getCtx()", () => {
    // Create CoreOperation instance with mock state
    const coreOps = new CoreOperation({
      state: mockState,
      engine: mockEngine,
    });

    // Create a simulated move function using coreOps.getCtx
    const moveWithGetCtx = ({ G, coreOps }: Partial<FnContext>) => {
      const ctx = coreOps!.getCtx();
      return {
        phase: ctx.currentPhase,
        changed: true,
      };
    };

    // Execute the move with minimal context
    const partialContext: Partial<FnContext> = {
      G: mockState.G,
      coreOps: coreOps,
    };

    const result = moveWithGetCtx(partialContext);

    // Verify move was able to access context correctly
    expect(result).toEqual({
      phase: "endPhase",
      changed: true,
    });
  });
});
