import { morriganLostSpirit, woodlandSquirrels } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

describe("Turn-phase event ownership", () => {
  it("attributes every ordinary phase to its turn player, not the player who last passed", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
      playerTwo: {
        champion: morriganLostSpirit,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
    });
    const historyStart = game.state.eventHistory.length;
    let turnPlayer = game.state.turn.playerId;
    for (let step = 0; step < 128 && game.state.turn.number < 4; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice") {
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      } else if (wait.kind === "opportunity") {
        game.player(wait.playerId).pass();
      } else {
        throw new Error(`Unexpected ${wait.kind}`);
      }
    }
    expect(game.state.turn.number).toBe(4);
    const phases = new Set<string>();
    for (const event of game.state.eventHistory.slice(historyStart)) {
      if (event.type === "turn-started") turnPlayer = event.playerId;
      if (event.type === "phase-changed") {
        expect(event.actorId).toBe(turnPlayer);
        phases.add(`${turnPlayer}:${event.phase}`);
      }
    }
    for (const player of game.state.turnOrder) {
      for (const phase of ["wake-up", "materialize", "recollection", "draw", "main", "end"]) {
        expect(phases.has(`${player}:${phase}`)).toBe(true);
      }
    }
  });
});
