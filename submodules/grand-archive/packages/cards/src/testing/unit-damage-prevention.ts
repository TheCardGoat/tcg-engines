import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveUnitDamagePrevention({
  card,
  cost,
  capacity,
  level = 0,
  combatOnly = false,
  everyInstance = false,
  ownChampion = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  capacity: number;
  level?: number;
  combatOnly?: boolean;
  everyInstance?: boolean;
  ownChampion?: boolean;
}): void {
  for (const expired of [false, true])
    for (const kind of ownChampion ? ["champion"] : ["champion", "ally"])
      for (const largeFirst of [false, true])
        it(`protects ${kind}, expired=${expired}, large first=${largeFirst}, level=${level}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(card, false, "activation-discount"),
              level,
            ),
          );
          const opponent = createClassBonusTestChampion(fireball, true, "activation-discount");
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: expired ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, trainingSword],
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: [giantTortoise, woodlandSquirrels, blitzMage],
                hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const target = p.card(kind === "ally" ? giantTortoise : champion);
          const other = p.card(kind === "ally" ? champion : giantTortoise);
          if (!expired) q.pass();
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const targets = ownChampion ? undefined : { "target-1": [target.objectId] };
          if (!ownChampion) {
            const before = game.state;
            expect(() =>
              p.activate(card, {
                reservePayment,
                targets: { "target-1": [p.card(trainingSword).objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(card, { reservePayment, targets });
          passEffectsStack(game);
          if (expired) advanceToMain(game, q.id);
          else {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          }
          q.activate(fireball, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          let remaining = expired ? 0 : capacity;
          let damage = combatOnly ? 1 : Math.max(0, 1 - remaining);
          if (!combatOnly) remaining = Math.max(0, remaining - 1);
          expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          q.declareAttack(giantTortoise, other);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[other.objectId]!.damage).toBe(1);
          for (const [attacker, power] of largeFirst
            ? ([
                [blitzMage, 3],
                [woodlandSquirrels, 1],
              ] as const)
            : ([
                [woodlandSquirrels, 1],
                [blitzMage, 3],
              ] as const)) {
            q.declareAttack(attacker, target);
            game.resolveCombatWithoutRetaliation();
            damage += Math.max(0, power - remaining);
            if (!everyInstance) remaining = Math.max(0, remaining - power);
            expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          }
        });
}
