import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { clandestineChart } from "./clandestine-chart.ts";

/** @covers js5qjwipkf-a1 */
describe("Clandestine Chart — Glimpse 2 and preparation", () => {
  it("pays two, banishes itself, Glimpses 2, then puts a preparation counter on the champion", () => {
    const champion = createClassBonusTestChampion(clandestineChart, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [clandestineChart],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, reposition, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const ownChampion = player.card(champion, { zone: "field" });
    const deck = player.zone("main-deck");
    player.activateAbility(clandestineChart, "js5qjwipkf-a1", {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(player.cards(clandestineChart, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[ownChampion.objectId]!.counters.preparation ?? 0).toBe(0);
    passEffectsStack(game);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 2");
    expect(glimpse.cardIds).toEqual(deck.slice(0, 2).map((card) => card.objectId));
    const answer = {
      kind: "reorder",
      top: glimpse.cardIds,
      bottom: [],
    } satisfies GrandArchiveGlimpseAnswer;
    answerDecision(game, "resolve-glimpse", answer);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.counters.preparation ?? 0).toBe(1);
  });
});
