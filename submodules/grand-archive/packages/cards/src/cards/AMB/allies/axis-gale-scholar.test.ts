import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { axisGaleScholar } from "./axis-gale-scholar.ts";

function setupScholar() {
  const starter = lineageTestChampion("Kongming", 0);
  const opponent = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    definitions: [shiftingCurrents],
    playerOne: {
      champion: starter,
      zones: {
        field: [axisGaleScholar, woodlandSquirrels],
        hand: [],
        "material-deck": [kongmingWaywardMaven],
        memory: [woodlandSquirrels],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: opponent,
      zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
    },
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
  passEffectsStack(game);
}

/** @covers 384b3yjlhu-a1 */
describe("Axis Gale Scholar — North power", () => {
  it("gets +2 POWER only while currents face North", () => {
    const game = setupScholar();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(lineageTestChampion("Opponent", 0), { zone: "field" });
    player.declareAttack(axisGaleScholar, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
  });
});

/** @covers 384b3yjlhu-a2 */
describe("Axis Gale Scholar — South ally life", () => {
  it("gives controlled allies +1 LIFE only while currents face South", () => {
    const game = setupScholar();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const squirrel = player.card(woodlandSquirrels, { zone: "field" });
    changeCurrents(game, "south");
    expect(game.state.players[player.id]!.states["shifting-currents"]).toBe("south");
    passToPlayerMain(game, opponent.id);
    opponent.declareAttack(woodlandSquirrels, squirrel);
    game.resolveCombatWithoutRetaliation();
    expect(player.cards(woodlandSquirrels, { zone: "field" })).toEqual([squirrel]);
    expect(game.state.objects[squirrel.objectId]!.damage).toBe(1);
  });
});

function passToPlayerMain(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach main");
}
