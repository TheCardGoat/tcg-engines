import { expect, test } from "vite-plus/test";
import { createExpertOracleStrategy } from "../../src/automation/search/expert-oracle.ts";
import type { EngineHandle } from "../../src/automation/types.ts";
import type { PlayerId } from "../../src/types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../../src/types/commands.ts";
import type { FilteredMatchView } from "../../src/view/filter.ts";
import type { PlayerPrompt } from "../../src/view/player-prompt.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../src/testing/index.ts";

// Search-structure fixture. Real-engine tests separately verify legal payment,
// information boundaries and complete games through the public driver.
test("plans four choices ahead and rejects a line defeated by a rival hand action", () => {
  const game = CyberpunkTestEngine.createWithFixture({ deck: 10 }, { deck: 10 });
  const base = game.getLocalEngine().getOracleView(P1);
  const success = game
    .getLocalEngine()
    .processCommand({ commandID: "template", move: "passPhase" }, P1);
  if (!success.success) throw new Error(success.error);
  const edges: Record<string, Record<string, string>> = {
    root: { sellCard: "setup1", playCard: "trap" },
    setup1: { playCard: "setup2", passPhase: "loss" },
    setup2: { playCard: "setup3", passPhase: "loss" },
    setup3: { playCard: "win", passPhase: "loss" },
    trap: { playCard: "loss", passPhase: "win" },
  };
  const stages = ["root", "setup1", "setup2", "setup3", "trap", "win", "loss"];
  class Graph implements EngineHandle {
    constructor(private node = "root") {}
    getFilteredView(): FilteredMatchView {
      return this.getOracleView();
    }
    getOracleView(): FilteredMatchView {
      return {
        ...base,
        gameEnded: this.node === "win" || this.node === "loss",
        winnerId: this.node === "win" ? P1 : this.node === "loss" ? P2 : null,
        players: {
          ...base.players,
          [P1]: { ...base.players[P1]!, streetCred: stages.indexOf(this.node) },
        },
      };
    }
    getPrompt(player: PlayerId): PlayerPrompt {
      if (player !== (this.node === "trap" ? P2 : P1))
        return { status: "waiting", availableMoves: [], choice: null };
      const moves = edges[this.node] ?? {};
      return {
        status: Object.keys(moves).length ? "action" : "idle",
        choice: null,
        availableMoves: [
          ...(moves.sellCard
            ? [
                {
                  moveId: "sellCard" as const,
                  inputSpec: { type: "selectCard" as const, candidates: ["funds"] },
                },
              ]
            : []),
          ...(moves.playCard
            ? [
                {
                  moveId: "playCard" as const,
                  inputSpec: { type: "playCard" as const, candidates: [{ cardId: "card" }] },
                },
              ]
            : []),
          ...(moves.passPhase
            ? [{ moveId: "passPhase" as const, inputSpec: { type: "none" as const } }]
            : []),
        ],
      };
    }
    processCommand(command: CommandEnvelope): CommandResult {
      const next = edges[this.node]?.[command.move];
      if (!next)
        return {
          success: false,
          error: "Missing graph edge",
          errorCode: "GRAPH",
          currentStateID: 0,
        };
      this.node = next;
      return success;
    }
    fork(): EngineHandle {
      return new Graph(this.node);
    }
  }
  const engine = new Graph();
  const decision = createExpertOracleStrategy({ maxNodes: 200, depthLimit: 12 }).decideAction({
    engine,
    view: engine.getFilteredView(),
    playerId: P1,
    prompt: engine.getPrompt(P1),
    rng: () => 0.5,
  });
  expect(decision).toMatchObject({ kind: "command", move: "sellCard" });
  expect(decision.kind === "command" && decision.diagnostics?.depthReached).toBeGreaterThanOrEqual(
    4,
  );
  expect(engine.getPrompt(P1).availableMoves).toHaveLength(2);
});
