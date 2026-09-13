import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveChampionNextPrevention({
  card,
  enlighten,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  enlighten: boolean;
}): void {
  for (const classBonus of [false, true])
    for (const expired of [false, true])
      for (const firstDamage of [1, 3])
        it(`class=${classBonus}, expired=${expired}, first damage=${firstDamage}`, () => {
          const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
            cost = enlighten && classBonus ? 2 : 3,
            opponent = grantTestChampionLevel(champion, 2),
            game = GrandArchiveTestEngine.startFixture({
              firstPlayer: expired ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  field: [giantTortoise],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  field: [giantTortoise, woodlandSquirrels, blitzMage, grayWolf],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            other = p.card(giantTortoise),
            pay = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (!expired) q.pass();
          const before = game.state;
          expect(() => p.activate(card, { reservePayment: pay.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { reservePayment: pay });
          expect(p.zone("memory")).toHaveLength(cost);
          passEffectsStack(game);
          if (expired) advanceToMain(game, q.id);
          else {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          }
          q.declareAttack(giantTortoise, other);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[other.objectId]!.damage).toBe(1);
          expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
          q.declareAttack(firstDamage === 1 ? woodlandSquirrels : blitzMage, hero);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            expired ? firstDamage : enlighten ? 0 : 1,
          );
          expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(
            !expired && enlighten ? firstDamage : 0,
          );
          q.declareAttack(grayWolf, hero);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            (expired ? firstDamage : enlighten ? 0 : 1) + 2,
          );
          expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(
            !expired && enlighten ? firstDamage : 0,
          );
          expect(game.state.objects[q.card(opponent).objectId]!.counters.enlighten ?? 0).toBe(0);
        });
}
