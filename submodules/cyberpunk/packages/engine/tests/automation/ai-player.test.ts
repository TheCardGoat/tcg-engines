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
  const engine = new LocalEngine(state);
  for (const player of players) {
    const choice = engine.getPrompt(player.id).choice;
    if (choice?.type !== "chooseFirstPlayer") continue;
    engine.processCommand(
      {
        commandID: `${seed}-choose-first`,
        move: "resolveFirstPlayer",
        input: { args: { goFirst: true } },
      },
      player.id,
    );
    break;
  }
  return { engine, players };
}

describe("AIPlayer.step", () => {
  test("acts when the prompt is actionable", () => {
    const { engine, players } = createEngine();
    const ai = new AIPlayer(engine, players[0]!.id, firstLegalStrategy);
    // After first-player selection, setup offers at least keep/mulligan.
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

describe("AIPlayer deferred decisions", () => {
  test("keeps seeded decisions and committed state identical across cloned worker snapshots", () => {
    const { engine: synchronous, players } = createEngine("worker-parity");
    const owner = new LocalEngine(structuredClone(synchronous.getState()));
    const syncPlayers = players.map(({ id }) => new AIPlayer(synchronous, id, randomStrategy));
    const committers = players.map(({ id }) => new AIPlayer(owner, id, randomStrategy));
    const thinkers = players.map(({ id }) => new AIPlayer(owner.fork(), id, randomStrategy));
    let committed = 0;
    for (let step = 0; step < 40; step++) {
      const seat = players.findIndex(({ id }) => id === synchronous.getEffectiveActivePlayerId());
      if (seat < 0 || synchronous.getState().G.gameEnded) break;
      const before = owner.getState();
      const selection = thinkers[seat]!.decide(new LocalEngine(structuredClone(before)));
      expect(owner.getState()).toBe(before);
      const immediate = syncPlayers[seat]!.step();
      const deferred = committers[seat]!.executeDecision(selection);
      expect(deferred.kind).toBe(immediate.kind);
      if (immediate.kind === "acted" && deferred.kind === "acted") {
        committed++;
        expect(deferred.decision).toEqual(immediate.decision);
        expect(deferred.result.success).toBe(true);
        expect(owner.getState()).toEqual(synchronous.getState());
      } else break;
    }
    expect(committed).toBeGreaterThan(10);
  });

  test("validates deferred commands against the owning engine", () => {
    const { engine, players } = createEngine();
    const ai = new AIPlayer(engine, players[0]!.id, firstLegalStrategy);
    const before = engine.getState();
    const result = ai.executeDecision({
      kind: "decision",
      decision: { kind: "command", move: "playCard", args: { cardId: "missing" } },
      decisionDurationMs: 1,
    });
    expect(result.kind).toBe("illegal");
    expect(engine.getState()).toBe(before);
  });
});
