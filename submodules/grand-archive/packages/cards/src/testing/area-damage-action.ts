import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveAreaDamageAction({
  card,
  cost,
  damage,
  bonusDamage,
  hitsOpposingChampion = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  damage: number;
  bonusDamage: number;
  hitsOpposingChampion?: boolean;
}): void {
  for (const matching of [true, false])
    for (const empty of [true, false])
      it(`hits the printed set of units, Class Bonus=${matching}, empty allies=${empty}`, () => {
        const champion = createClassBonusTestChampion(card, matching, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: empty ? [trainingSword] : [giantTortoise, woodlandSquirrels, trainingSword],
            },
          },
          playerTwo: {
            champion,
            zones: { field: empty ? [] : [giantTortoise, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const expected = matching ? bonusDamage : damage;
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(card, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(card, { reservePayment: payment });
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          hitsOpposingChampion ? expected : 0,
        );
        if (!empty)
          for (const player of [p, q]) {
            expect(game.state.objects[player.card(giantTortoise).objectId]!.damage).toBe(expected);
            expect(player.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
          }
        expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(1);
      });
}
