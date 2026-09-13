import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { gemOfSearingFlame } from "./gem-of-searing-flame.ts";

function advanceToEnd(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "decision") {
      if (game.answerForcedDecision()) continue;
      if (game.state.decision?.kind === "choose-recollection") {
        answerDecision(game, "choose-recollection", []);
        continue;
      }
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", false);
        continue;
      }
      if (game.state.decision?.kind === "announce-triggered-ability") {
        const own = game.player(playerId).zone("field")[0];
        if (!own) throw new Error("No field object to target");
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-champion": [own.objectId] },
        });
        continue;
      }
      throw new Error(`Unexpected decision ${game.state.decision?.kind}`);
    } else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach end phase");
}

/** @covers v1jaidvvz2-a1 */
describe("Gem of Searing Flame — North to West", () => {
  it("deals 2 as a Spell when Shifting Currents change from North to West", () => {
    const starter = lineageTestChampion("Kongming", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          field: [gemOfSearingFlame],
          memory: [woodlandSquirrels],
          "material-deck": [kongmingWaywardMaven],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: { "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels) },
      },
      definitions: [shiftingCurrents],
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.materialize(kongmingWaywardMaven);
    player.pass();
    opponent.pass();
    passEffectsStack(game);
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-champion": [player.card(starter, { zone: "field" }).objectId] },
      });
      passEffectsStack(game);
    }
    expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("north");
    advanceToEnd(game, player.id);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    answerDecision(game, "resolve-direction-choice", "west");
    passEffectsStack(game);
    const target = opponent.card(lineageTestChampion("Opponent", 0), { zone: "field" });
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-champion": [target.objectId] },
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
