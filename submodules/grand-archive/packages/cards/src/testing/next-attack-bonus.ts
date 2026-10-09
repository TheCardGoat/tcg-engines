import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { cooktechApron } from "../cards/PRD/items/cooktech-apron.ts";
import { draughtOfStamina } from "../cards/PRD/items/draught-of-stamina.ts";

export function proveNextAttackBonus(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  cost: number,
  linked: boolean,
) {
  for (const matching of [false, true])
    for (const count of linked ? [0, 1, 2] : [0])
      for (const copies of [1, 2])
        for (const disposition of count === 0 && copies === 1
          ? ["current", "expired", "reentered"]
          : ["current", "expired"]) {
          const expired = disposition === "expired",
            reentered = disposition === "reentered";
          it(`class=${matching}, links=${count}, copies=${copies}, state=${disposition}`, () => {
            const base = enableAllTestElements(
              createClassBonusTestChampion(card, matching, "activation-discount"),
            );
            const face = requireSingleFace(base);
            const champion = {
              ...base,
              layout: {
                kind: "single-faced" as const,
                face: { ...face, stats: { ...face.stats, life: 40 } },
              },
            };
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [giantTortoise, woodlandSquirrels, draughtOfStamina],
                  hand: [
                    reclaim,
                    ...Array.from({ length: copies }, () => card),
                    ...Array.from({ length: count + 1 }, () => cooktechApron),
                    ...Array.from(
                      { length: 6 + cost * copies + 2 * (count + 1) },
                      () => woodlandSquirrels,
                    ),
                  ],
                  "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const ally = p.card(giantTortoise),
              other = p.card(woodlandSquirrels, { zone: "field" }),
              target = q.card(champion);
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const aprons = p.cards(cooktechApron, { zone: "hand" });
            for (let i = 0; i < aprons.length; i++) {
              p.activate(aprons[i]!, {
                reservePayment: pay(2),
                targets: { "intrinsic-link-target": [i < count ? ally.objectId : other.objectId] },
              });
              passEffectsStack(game);
            }
            for (const source of p.cards(card, { zone: "hand" })) {
              const before = game.state;
              expect(() =>
                p.activate(source, {
                  reservePayment: pay(cost),
                  targets: { "target-1": [target.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              p.activate(source, {
                reservePayment: pay(cost),
                targets: { "target-1": [ally.objectId] },
              });
              passEffectsStack(game);
            }
            const power = () =>
              deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "power", {
                program: game.program,
                state: game.state,
                controllerId: p.id,
                bindings: {},
              });
            expect(power()).toBe(1);
            if (reentered) {
              p.activate(reclaim, {
                reservePayment: pay(2),
                targets: { "target-1": [ally.objectId] },
              });
              passEffectsStack(game);
              expect(game.state.objects[ally.objectId]?.zone).toBe("hand");
              p.activate(ally, { reservePayment: pay(4) });
              passEffectsStack(game);
            }
            if (expired) advanceToMain(game, p.id, game.state.turn.number);
            const fight = (attacker: typeof ally) => {
              p.declareAttack(attacker, target);
              if (game.state.decision?.kind === "order-triggered-abilities")
                answerDecision(
                  game,
                  "order-triggered-abilities",
                  game.state.decision.pendingTriggerIds,
                );
              game.resolveCombatWithoutRetaliation();
            };
            // Another ally attacks first without consuming the target's delayed bonus.
            fight(other);
            expect(game.state.objects[target.objectId]?.damage).toBe(1);
            fight(ally);
            const bonus = expired || reentered ? 0 : copies * (linked ? count + 1 : 6);
            expect(game.state.objects[target.objectId]?.damage).toBe(2 + bonus);
            expect(power()).toBe(1);
            p.activateAbility(draughtOfStamina, "lpnvx7mnu1-a2", {
              targets: { "target-1": [ally.objectId] },
            });
            passEffectsStack(game);
            fight(ally);
            expect(game.state.objects[target.objectId]?.damage).toBe(3 + bonus);
            expect(power()).toBe(1);
          });
        }
}
