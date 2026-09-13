import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { igniteFate } from "./ignite-fate.ts";

/** @covers 267kgpwjmc-a1 */
describe("Ignite Fate — deal 2 to each champion", () => {
  it("damages both champions and leaves allies unhurt", () => {
    const champion = createClassBonusTestChampion(igniteFate, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [igniteFate, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [galesMare],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    const theirChampion = opponent.card(champion, { zone: "field" });
    const ally = player.card(galesMare, { zone: "field" });
    const enemyAlly = opponent.card(woodlandSquirrels, { zone: "field" });
    player.activate(igniteFate, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
    expect(game.state.objects[theirChampion.objectId]!.damage).toBe(2);
    expect(game.state.objects[ally.objectId]!.damage).toBe(0);
    expect(game.state.objects[enemyAlly.objectId]!.damage).toBe(0);
  });
});
