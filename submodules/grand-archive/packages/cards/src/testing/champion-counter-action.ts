import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
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

import { fireball } from "../cards/DOA/actions/fireball.ts";
import { lineageTestChampion } from "./champion-lineage.ts";

export function proveRepeatedChampionCounterAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: "preparation" | "level",
  amount: number,
  printedCost: number,
  unitDiscount = false,
) {
  for (const matching of [false, true])
    for (const units of unitDiscount ? [1, 2, 3, 4] : [1]) {
      it(`adds ${counter} on resolution and accumulates: class ${matching}, opposing units ${units}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const opponent = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, card, fireball, ...Array.from({ length: 16 }, () => woodlandSquirrels)],
              field: [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: { field: Array.from({ length: units - 1 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(opponent);
        const cost = printedCost - (unitDiscount && matching && units >= 3 ? 2 : 0);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (let cast = 1; cast <= 2; cast++) {
          const source = p.cards(card, { zone: "hand" })[0]!,
            before = game.state;
          expect(() => p.activate(source, { reservePayment: pay(cost - 1) })).toThrow();
          expect(game.state).toEqual(before);
          expect(() => p.activate(source, { reservePayment: pay(cost + 1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: pay(cost) });
          expect(game.state.objects[hero.objectId]!.counters[counter] ?? 0).toBe(
            (cast - 1) * amount,
          );
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.counters[counter]).toBe(cast * amount);
          expect(game.state.objects[foe.objectId]!.counters[counter] ?? 0).toBe(0);
        }
        if (counter === "level") {
          p.activate(fireball, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(3);
          expect(game.state.objects[hero.objectId]!.counters.level).toBe(2);
        }
      });
    }
}
