import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { hydroguardRetainer } from "./hydroguard-retainer.ts";

function reachMainWithShiftingCurrents() {
  const starter = lineageTestChampion("Kongming", 0);
  const opponent = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    definitions: [shiftingCurrents],
    playerOne: {
      champion: starter,
      zones: {
        field: [hydroguardRetainer],
        hand: [],
        "material-deck": [kongmingWaywardMaven],
        memory: [woodlandSquirrels],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion: opponent, zones: { "main-deck": [woodlandSquirrels] } },
  });
  const player = game.player("player-one");
  player.materialize(kongmingWaywardMaven);
  player.pass();
  game.player("player-two").pass();
  passEffectsStack(game);
  expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
  for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  return game;
}

function changeCurrents(game: GrandArchiveTestEngine, direction: "east" | "south" | "west"): void {
  for (let step = 0; game.state.turn.phase !== "end" && step < 48; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-optional-effect") {
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
  }
  answerDecision(game, "resolve-direction-choice", direction);
}

/** @covers 0qm7n87o4s-a2 */
describe("Hydroguard Retainer — North to West draw", () => {
  for (const to of ["west", "east"] as const) {
    it(`${to === "west" ? "draws" : "does not draw"} when currents change to ${to}`, () => {
      const game = reachMainWithShiftingCurrents();
      const player = game.player("player-one");
      changeCurrents(game, to);
      expect(game.state.players[player.id]!.states["shifting-currents"]).toBe(to);
      const drew = game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "0qm7n87o4s-a2",
      );
      if (to === "west") expect(drew).toBe(true);
    });
  }
});
