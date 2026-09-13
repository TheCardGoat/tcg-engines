import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { diffusiveBlock } from "../actions/diffusive-block.ts";
import { rustedWarshield } from "../items/rusted-warshield.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { nicoWhiplashAllure } from "./nico-whiplash-allure.ts";

/** @covers 5bbae3z4py-a1 @covers 5bbae3z4py-a2 */
describe("Nico, Whiplash Allure", () => {
  it("gains a lash from banished Floating Memory and mills that many cards on Champion Hit", () => {
    const starter = lineageTestChampion("Nico", 0);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Nico", 1)],
        zones: {
          "material-deck": [nicoWhiplashAllure, rustedWarshield],
          memory: [woodlandSquirrels, woodlandSquirrels],
          graveyard: [diffusiveBlock],
          field: [aurousteelGreatsword],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.materialize(nicoWhiplashAllure);
    player.pass();
    opponent.pass();
    passEffectsStack(game);
    for (let step = 0; step < 128; step++) {
      const wait = game.waitState();
      if (
        game.state.turn.playerId === player.id &&
        game.state.turn.phase === "materialize" &&
        wait.kind === "materialization-choice"
      )
        break;
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    player.materialize(rustedWarshield, {
      floatingMemoryCardIds: [player.card(diffusiveBlock, { zone: "graveyard" }).objectId],
    });
    player.pass();
    opponent.pass();
    passEffectsStack(game);
    const nico = player.card(starter, { zone: "field" });
    expect(game.state.objects[nico.objectId]!.counters["named:lash"]).toBe(1);

    for (let step = 0; step < 64 && game.state.turn.phase !== "main"; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    const beforeDeck = opponent.zone("main-deck");
    player.declareAttack(nico, opponent.card(opponentChampion), {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    advanceCombatToTrigger(game, "5bbae3z4py-a2");
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(opponent.zone("graveyard")).toContainEqual(beforeDeck[0]);
    expect(opponent.zone("main-deck")).toHaveLength(beforeDeck.length - 1);
  });
});
