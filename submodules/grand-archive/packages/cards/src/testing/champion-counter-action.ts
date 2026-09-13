import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveChampionCounterAction({
  card,
  cost,
  counter,
  amount,
  level = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  counter: "enlighten" | "preparation";
  amount: number;
  level?: number;
}): void {
  it(`pays ${cost} and adds exactly ${amount} ${counter} counters on resolution at level ${level}`, () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(card, false, "activation-discount"),
      level,
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const self = player.card(champion);
    const foe = game.player("player-two").card(champion);
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    if (cost > 0) {
      const before = game.state;
      expect(() => player.activate(card, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(card, { reservePayment: payment });
    expect(game.state.objects[self.objectId]!.counters[counter] ?? 0).toBe(0);
    expect(player.zone("memory")).toHaveLength(cost);
    passEffectsStack(game);
    expect(game.state.objects[self.objectId]!.counters[counter]).toBe(amount);
    expect(game.state.objects[foe.objectId]!.counters[counter] ?? 0).toBe(0);
    expect(player.cards(card, { zone: "graveyard" })).toHaveLength(1);
  });
}
