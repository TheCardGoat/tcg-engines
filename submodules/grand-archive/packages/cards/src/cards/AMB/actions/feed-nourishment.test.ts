import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { meteoricSlime } from "../../RDO/allies/meteoric-slime.ts";
import { feedNourishment } from "./feed-nourishment.ts";

/** @covers 44pr0h0yqi-a1 */
describe("Feed Nourishment — Animal or Beast buff", () => {
  it("puts one buff on an Animal or Beast ally and rejects other units", () => {
    const champion = createClassBonusTestChampion(feedNourishment, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [feedNourishment, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [woodlandSquirrels, meteoricSlime, automatedGardener],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const animal = player.cards(woodlandSquirrels, { zone: "field" })[0]!;
    const beast = player.card(meteoricSlime, { zone: "field" });
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(champion, { zone: "field" }),
      player.card(automatedGardener, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(feedNourishment, {
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(feedNourishment, {
      reservePayment: payment,
      targets: { "target-1": [animal.objectId] },
    });
    expect(game.state.objects[animal.objectId]!.counters.buff ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[animal.objectId]!.counters.buff).toBe(1);
    expect(game.state.objects[beast.objectId]!.counters.buff ?? 0).toBe(0);
  });
});
