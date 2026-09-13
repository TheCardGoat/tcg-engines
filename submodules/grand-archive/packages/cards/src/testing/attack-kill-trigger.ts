import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack } from "./decisions.ts";
export function proveAttackKillTrigger({
  card,
  power,
  classRestricted,
  wake,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  power: number;
  classRestricted: boolean;
  wake: boolean;
}): void {
  for (const classBonus of classRestricted ? [false, true] : [false])
    for (const level of [1, 2])
      for (const kill of [false, true])
        it(`level=${level}, class=${classBonus}, kill=${kill}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(card, classBonus, "activation-discount"),
            level,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [card, woodlandSquirrels, woodlandSquirrels],
                field: [trainingSword, woodlandSquirrels],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [woodlandSquirrels, woodlandSquirrels, giantTortoise] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            attacker = p.card(champion),
            other = q.cards(woodlandSquirrels, { zone: "field" })[0]!;
          p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), other);
          game.resolveCombatWithoutRetaliation();
          expect(p.zone("main-deck")).toHaveLength(1);
          const target = kill
            ? q.cards(woodlandSquirrels, { zone: "field" })[0]!
            : q.card(giantTortoise);
          p.activate(card, {
            attackAttackerId: attacker.objectId,
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          declareResolvedAttack(
            game,
            attacker.objectId,
            target.objectId,
            "Attack for the conditional kill trigger",
          );
          game.resolveCombatWithoutRetaliation();
          const enabled = kill && level >= 2 && (!classRestricted || classBonus);
          expect(game.state.objects[target.objectId]!.zone).toBe(kill ? "graveyard" : "field");
          if (!kill) expect(game.state.objects[target.objectId]!.damage).toBe(power);
          expect(p.zone("hand")).toHaveLength(!wake && enabled ? 1 : 0);
          expect(q.zone("hand")).toHaveLength(0);
          expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(
            !(wake && enabled),
          );
          if (wake && enabled) {
            p.declareAttack(attacker, q.card(champion), {
              weaponIds: [p.card(trainingSword).objectId],
            });
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
          }
        });
}
