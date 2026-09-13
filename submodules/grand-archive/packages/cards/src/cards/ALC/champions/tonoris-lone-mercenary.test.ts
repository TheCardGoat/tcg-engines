import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { tonorisLoneMercenary } from "./tonoris-lone-mercenary.ts";

function advanceToMain(
  game: GrandArchiveTestEngine,
  playerId: "player-one" | "player-two",
  afterTurn = 0,
): void {
  for (let step = 0; step < 256; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > afterTurn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error(`Did not reach ${playerId}'s main phase`);
}

/** @covers zb14m4c8lj-a1 */
describe("Tonoris, Lone Mercenary — temporary On Enter Taunt", () => {
  it("forces attacks toward awake Tonoris through the next opponent turn, then expires", () => {
    const starter = lineageTestChampion("Tonoris", 0);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [tonorisLoneMercenary],
          memory: [woodlandSquirrels],
          field: [giantTortoise],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: {
          field: [automatedGardener, automatedGardener],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const champion = player.card(starter, { zone: "field" });
    const otherTarget = player.card(giantTortoise, { zone: "field" });
    player.materialize(tonorisLoneMercenary);
    player.pass();
    opponent.pass();
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "zb14m4c8lj-a1",
      ),
    ).toBe(true);
    passEffectsStack(game);

    advanceToMain(game, "player-two");
    const attackers = opponent.cards(automatedGardener, { zone: "field" });
    const before = game.state;
    expect(() => opponent.declareAttack(attackers[0]!, otherTarget)).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(attackers[0]!, champion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[champion.objectId]!.damage).toBe(2);

    const firstOpponentTurn = game.state.turn.number;
    advanceToMain(game, "player-two", firstOpponentTurn);
    opponent.declareAttack(attackers[1]!, otherTarget);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[otherTarget.objectId]!.damage).toBe(2);
  });
});
