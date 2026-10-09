import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function provePreventionFollowUp({
  card,
  baseCost,
  recover,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  baseCost: number;
  recover: boolean;
}): void {
  for (const matching of [false, true])
    for (const expired of [false, true])
      for (const amount of [1, 4])
        for (const initial of recover ? [2, 5] : [0])
          it(`follow-up uses prevented damage once: class=${matching}, expired=${expired}, amount=${amount}, damage=${initial}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(card, matching, "activation-discount"),
            );
            const caster = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(fireball, true, "activation-discount"),
                amount - 1,
              ),
            );
            const cost = baseCost - (matching ? 2 : 0);
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                  field: [giantTortoise],
                  "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion: caster,
                zones: {
                  hand: [
                    fireball,
                    fireball,
                    fireball,
                    ...Array.from({ length: 6 }, () => woodlandSquirrels),
                  ],
                  field: Array.from({ length: initial }, () => woodlandSquirrels),
                  "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              other = p.card(giantTortoise);
            for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
              q.declareAttack(attacker, hero);
              game.resolveCombatWithoutRetaliation();
            }
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial);
            q.pass();
            p.activate(card, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial);
            if (expired) advanceToMain(game, q.id, game.state.turn.number);
            else {
              const wait = game.waitState();
              if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
            }
            const deck = [...p.zone("main-deck")];
            const spells = q.cards(fireball, { zone: "hand" });
            const damage = (index: number, target: typeof hero) => {
              q.activate(spells[index]!, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 2)
                  .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
                targets: { "target-1": [target.objectId] },
              });
              passEffectsStack(game);
            };
            damage(0, other);
            expect(game.state.objects[other.objectId]!.damage).toBe(amount);
            expect(p.zone("main-deck")).toEqual(deck);
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial);
            damage(1, hero);
            const afterFirst = expired
              ? initial + amount
              : recover
                ? Math.max(0, initial - amount)
                : initial;
            expect(game.state.objects[hero.objectId]!.damage).toBe(afterFirst);
            const milled = !recover && !expired ? amount : 0;
            expect(p.zone("main-deck")).toEqual(deck.slice(milled));
            for (const ref of deck.slice(0, milled))
              expect(game.state.objects[ref.objectId]!.zone).toBe("graveyard");
            damage(2, hero);
            expect(game.state.objects[hero.objectId]!.damage).toBe(afterFirst + amount);
            expect(p.zone("main-deck")).toEqual(deck.slice(milled));
          });
}
