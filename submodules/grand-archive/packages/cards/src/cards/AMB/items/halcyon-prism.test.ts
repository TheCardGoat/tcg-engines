import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { harvestHerbs } from "../../ALC/actions/harvest-herbs.ts";
import { halcyonPrism } from "./halcyon-prism.ts";

/** @covers 997vxajn2q-a1 */
describe("Halcyon Prism — Glimpse 3", () => {
  it("banishes itself and reorders three cards from the top of the deck", () => {
    const champion = createClassBonusTestChampion(halcyonPrism, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [halcyonPrism],
          "main-deck": [woodlandSquirrels, reposition, harvestHerbs, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    player.activateAbility(halcyonPrism, "997vxajn2q-a1");
    expect(player.cards(halcyonPrism, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    const glimpse = game.state.decision;
    expect(glimpse?.kind).toBe("resolve-glimpse");
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
    expect(glimpse.cardIds).toEqual(deck.slice(0, 3).map((card) => card.objectId));
    const answer = {
      kind: "reorder",
      top: [glimpse.cardIds[2]!],
      bottom: [glimpse.cardIds[0]!, glimpse.cardIds[1]!],
    } satisfies GrandArchiveGlimpseAnswer;
    answerDecision(game, "resolve-glimpse", answer);
    expect(player.zone("main-deck").map((card) => card.objectId)).toEqual([
      glimpse.cardIds[2],
      deck[3]!.objectId,
      glimpse.cardIds[0],
      glimpse.cardIds[1],
    ]);
  });
});
