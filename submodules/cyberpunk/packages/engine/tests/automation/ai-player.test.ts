import { describe, expect, test } from "vite-plus/test";
import { createMatchState } from "../../src/state/initial-state.ts";
import { LocalEngine } from "../../src/transport/local-engine.ts";
import {
  AIPlayer,
  firstLegalStrategy,
  randomStrategy,
  type AIStrategy,
  type DecisionContext,
  type MoveDecision,
} from "../../src/automation/index.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

function createEngine(seed = "ai-player-test") {
  const players = createTestPlayers();
  const decks = createTestDecks();
  const catalog = createTestCatalog();
  const state = createMatchState({ players, catalog, deckLists: decks, seed });
  return { engine: new LocalEngine(state), players };
}

describe("AIPlayer.step", () => {
  test("acts when the prompt is actionable", () => {
    const { engine, players } = createEngine();
    const ai = new AIPlayer(engine, players[0]!.id, firstLegalStrategy);
    // First step should succeed: setup phase has at least concede + mulligan.
    const result = ai.step();
    expect(["acted", "idle"]).toContain(result.kind);
  });

  test("surfaces stuck when the strategy returns a stuck decision", () => {
    const stuckStrategy: AIStrategy = {
      name: "stuck",
      decideAction(): MoveDecision {
        return { kind: "stuck", reason: "test-stuck" };
      },
    };
    const { engine, players } = createEngine();
    const active = engine.getFilteredView(players[0]!.id).activePlayerId;
    const activeId = active === (players[0]!.id as string) ? players[0]!.id : players[1]!.id;
    const ai = new AIPlayer(engine, activeId, stuckStrategy);
    const result = ai.step();
    expect(result.kind).toBe("stuck");
    if (result.kind === "stuck") {
      expect(result.reason).toBe("test-stuck");
    }
  });

  test("surfaces illegal when the strategy emits a non-legal command", () => {
    const illegalStrategy: AIStrategy = {
      name: "illegal",
      decideAction(_ctx: DecisionContext): MoveDecision {
        return { kind: "command", move: "playCard", args: { cardId: "no-such-card" } };
      },
    };
    const { engine, players } = createEngine();
    const active = engine.getFilteredView(players[0]!.id).activePlayerId;
    const activeId = active === (players[0]!.id as string) ? players[0]!.id : players[1]!.id;
    const ai = new AIPlayer(engine, activeId, illegalStrategy);
    const result = ai.step();
    expect(result.kind).toBe("illegal");
  });
});

describe("AIPlayer.takeTurn", () => {
  test("random strategy makes progress without throwing", () => {
    const { engine, players } = createEngine("random-takes-turn");
    const active = engine.getFilteredView(players[0]!.id).activePlayerId;
    const activeId = active === (players[0]!.id as string) ? players[0]!.id : players[1]!.id;
    const ai = new AIPlayer(engine, activeId, randomStrategy);
    const result = ai.takeTurn({ maxSteps: 50 });
    expect(result.steps.length).toBeGreaterThan(0);
    expect(["gameEnded", "waiting", "noMoves", "stuck", "illegal", "maxSteps"]).toContain(
      result.endedReason,
    );
  });
});
