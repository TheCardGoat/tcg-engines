import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { franCarmineSpark } from "./fran-carmine-spark.ts";
import { redHareUnrivaledStallion } from "./red-hare-unrivaled-stallion.ts";

/** @covers 5du8f077ua-a1 */
describe("Red Hare, Unrivaled Stallion — Pride 3", () => {
  provePrideAlly({ card: redHareUnrivaledStallion, pride: 3, power: 3 });
});

/** @covers 5du8f077ua-a2 */
describe("Red Hare, Unrivaled Stallion — Human rider bonus", () => {
  it("loses Pride and may discard then draw while a fire unique Human ally is controlled", () => {
    const champion = lineageTestChampion("Red Hare", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [redHareUnrivaledStallion, franCarmineSpark],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const discarded = player.cards(woodlandSquirrels, { zone: "hand" })[0]!;
    const drawn = player.zone("main-deck")[0]!;
    player.declareAttack(redHareUnrivaledStallion, opponent.card(champion));
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[discarded.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[drawn.objectId]!.zone).toBe("hand");
  });
});
