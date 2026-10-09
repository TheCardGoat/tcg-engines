import { describe, expect, test } from "vite-plus/test";
import { createMctsStrategy } from "../../src/automation/search/mcts.ts";
import { createMonteCarloStrategy } from "../../src/automation/search/monte-carlo.ts";
import { greedyStrategy } from "../../src/automation/strategies/greedy.ts";
import { randomStrategy } from "../../src/automation/strategies/random.ts";
import type { AIStrategy, EngineHandle } from "../../src/automation/types.ts";
import type { PlayerId } from "../../src/types/branded.ts";
import type { CommandEnvelope } from "../../src/types/commands.ts";
import type { FilteredMatchView } from "../../src/view/filter.ts";
import type { AvailableMove, PlayerPrompt } from "../../src/view/player-prompt.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../src/testing/index.ts";

// Search graph fixture: two rival moves advance the same counter but leave
// different resources and legal actions. The real-game failure replays cover
// engine payment, attachment, and combat validation separately.
const base = CyberpunkTestEngine.createWithFixture({ deck: 10 }, { deck: 10 })
  .getLocalEngine()
  .getFilteredView(P1);
type Position =
  | "root"
  | "rival"
  | "funded"
  | "broke"
  | "rejected"
  | "soleRejected"
  | "allRejected"
  | "win"
  | "loss";
const edges: Partial<Record<Position, Partial<Record<CommandEnvelope["move"], Position>>>> = {
  root: { keepHand: "rival", passPhase: "loss" },
  rival: { sellCard: "funded", passPhase: "broke" },
  funded: { playCard: "win", passPhase: "loss" },
  broke: { sellCard: "win", passPhase: "loss" },
  rejected: { passPhase: "win" },
};
const moves: Partial<Record<Position, AvailableMove[]>> = {
  root: [
    { moveId: "passPhase", inputSpec: { type: "none" } },
    { moveId: "keepHand", inputSpec: { type: "none" } },
  ],
  rival: [
    { moveId: "passPhase", inputSpec: { type: "none" } },
    { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["funds"] } },
  ],
  funded: [
    { moveId: "passPhase", inputSpec: { type: "none" } },
    { moveId: "playCard", inputSpec: { type: "playCard", candidates: [{ cardId: "gear" }] } },
  ],
  broke: [
    { moveId: "passPhase", inputSpec: { type: "none" } },
    { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["funds"] } },
  ],
  rejected: [
    { moveId: "playCard", inputSpec: { type: "playCard", candidates: [{ cardId: "invalid" }] } },
    { moveId: "passPhase", inputSpec: { type: "none" } },
  ],
  soleRejected: [
    { moveId: "playCard", inputSpec: { type: "playCard", candidates: [{ cardId: "invalid" }] } },
  ],
  allRejected: [
    { moveId: "playCard", inputSpec: { type: "playCard", candidates: [{ cardId: "invalid" }] } },
    { moveId: "sellCard", inputSpec: { type: "selectCard", candidates: ["invalid"] } },
  ],
};

class Graph implements EngineHandle {
  constructor(
    private position: Position = "root",
    private counter = 0,
  ) {}

  getFilteredView(_player: PlayerId): FilteredMatchView {
    return {
      ...base,
      stateID: this.counter,
      activePlayerId: this.position === "rival" ? P2 : P1,
      gameEnded: this.position === "win" || this.position === "loss",
      winnerId: this.position === "win" ? P1 : this.position === "loss" ? P2 : null,
      players: {
        ...base.players,
        [P1]: { ...base.players[P1]!, eddies: this.position === "funded" ? 1 : 0 },
      },
    };
  }

  getPrompt(player: PlayerId): PlayerPrompt {
    if (player !== (this.position === "rival" ? P2 : P1))
      return { status: "waiting", availableMoves: [], choice: null };
    const availableMoves = moves[this.position] ?? [];
    return { status: availableMoves.length ? "action" : "idle", availableMoves, choice: null };
  }

  processCommand(command: CommandEnvelope, player: PlayerId): { success: boolean } {
    if (player !== (this.position === "rival" ? P2 : P1)) return { success: false };
    const next = edges[this.position]?.[command.move];
    if (!next) return { success: false };
    this.position = next;
    this.counter++;
    return { success: true };
  }

  fork(): EngineHandle {
    return new Graph(this.position, this.counter);
  }
}

function context(engine: EngineHandle) {
  return {
    engine,
    view: engine.getFilteredView(P1),
    playerId: P1,
    prompt: engine.getPrompt(P1),
    rng: () => 0.5,
  };
}

describe("search action legality", () => {
  test.each([randomStrategy, greedyStrategy])(
    "MCTS with $name rollouts does not reuse a different position with the same counter",
    (rolloutStrategy) => {
      const strategy = createMctsStrategy({ iterations: 50, maxRolloutSteps: 1, rolloutStrategy });
      const engine = new Graph();
      const first = strategy.decideAction(context(engine));
      expect(first).toMatchObject({ kind: "command", move: "keepHand" });
      expect(engine.processCommand({ commandID: "own", move: "keepHand" }, P1).success).toBe(true);
      expect(engine.processCommand({ commandID: "rival", move: "passPhase" }, P2).success).toBe(
        true,
      );

      const before = engine.getFilteredView(P1);
      expect(before.stateID).toBe(2);
      expect(before.players[P1]!.eddies).toBe(0);
      const second = strategy.decideAction(context(engine));
      expect(second).toMatchObject({
        kind: "command",
        move: "sellCard",
        args: { cardId: "funds" },
      });
      // Search and validation must leave the live game unchanged.
      expect(engine.getFilteredView(P1)).toEqual(before);
      if (second.kind !== "command") throw new Error("Expected executable command");
      expect(
        engine.processCommand(
          { commandID: "next", move: second.move, input: { args: second.args } },
          P1,
        ).success,
      ).toBe(true);
    },
  );

  const strategies: [string, () => AIStrategy][] = [
    ["MCTS", () => createMctsStrategy({ iterations: 0, maxRolloutSteps: 0 })],
    ["Monte Carlo", () => createMonteCarloStrategy({ rolloutsPerAction: 1, maxRolloutSteps: 0 })],
  ];

  test.each(strategies)("%s rejects an unexecutable sole candidate", (_name, makeStrategy) => {
    const engine = new Graph("soleRejected");
    const before = engine.getFilteredView(P1);
    expect(makeStrategy().decideAction(context(engine))).toMatchObject({ kind: "stuck" });
    expect(engine.getFilteredView(P1)).toEqual(before);
  });

  test.each(strategies)("%s selects an executable fallback", (_name, makeStrategy) => {
    const engine = new Graph("rejected");
    const before = engine.getFilteredView(P1);
    expect(makeStrategy().decideAction(context(engine))).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
    expect(engine.getFilteredView(P1)).toEqual(before);
  });

  test.each(strategies)(
    "%s does not return a rejected candidate when every probe fails",
    (_name, makeStrategy) => {
      const engine = new Graph("allRejected");
      expect(makeStrategy().decideAction(context(engine))).toMatchObject({ kind: "stuck" });
    },
  );

  test.each(strategies)(
    "%s uses the live prompt when the supplied context is stale",
    (_name, makeStrategy) => {
      const engine = new Graph("rejected");
      const ctx = { ...context(engine), prompt: new Graph("soleRejected").getPrompt(P1) };
      expect(makeStrategy().decideAction(ctx)).toMatchObject({
        kind: "command",
        move: "passPhase",
      });
    },
  );
});
