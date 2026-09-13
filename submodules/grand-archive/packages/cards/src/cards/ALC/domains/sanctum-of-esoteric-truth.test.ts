import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sanctumOfEsotericTruth } from "./sanctum-of-esoteric-truth.ts";

/** @covers k45swaf8ur-a1 */
describe("Sanctum of Esoteric Truth — champion level-up exchange", () => {
  it("optionally bottoms exactly two hand cards and draws the top two cards", () => {
    const champion = lineageTestChampion("Sanctum", 0);
    const successor = lineageTestChampion("Sanctum", 1);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [sanctumOfEsotericTruth],
          hand: [woodlandSquirrels, giantTortoise],
          memory: [woodlandSquirrels],
          "material-deck": [successor],
          "main-deck": [giantTortoise, woodlandSquirrels, giantTortoise],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const hand = player.zone("hand");
    const deck = player.zone("main-deck");
    player.materialize(successor);
    player.pass();
    opponent.pass();
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", true);

    const beforeInvalid = game.state;
    expect(() => answerDecision(game, "resolve-effect-choice", [hand[0]!.objectId])).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(
      game,
      "resolve-effect-choice",
      hand.map((card) => card.objectId),
    );
    passEffectsStack(game);

    expect(player.zone("hand")).toEqual(deck.slice(0, 2));
    expect(player.zone("main-deck")).toEqual([deck[2], ...hand]);
  });
});
