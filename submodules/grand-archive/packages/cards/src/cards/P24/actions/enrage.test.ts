import { describe } from "vitest";
import { enrage } from "./enrage.ts";
import { proveDamageTwentyCost } from "../../../testing/damage-twenty-cost.ts";
/** @covers wcfvrfw35s-a1 */
describe("Enrage — Damage 20 activation discount", () => proveDamageTwentyCost(enrage, 4, false));

import { expect, it } from "vitest";
import { startDamageThresholdFixture } from "../../../testing/damage-twenty-cost.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { imperialCountermeasure } from "../../RDO/actions/imperial-countermeasure.ts";
/** @covers wcfvrfw35s-a2 */
describe("Enrage — unpreventable self-damage and next champion attack", () => {
  for (const matching of [false, true])
    for (const initial of [0, 3, 4, 19, 20, 21])
      for (const expired of [false, true])
        for (const shield of [false, true])
          it(`class=${matching}, damage=${initial}, expired=${expired}, shield=${shield}`, () => {
            const { game, p, q, hero, opponent } = startDamageThresholdFixture(
              enrage,
              matching,
              initial,
              [
                enrage,
                spiritsBlessing,
                ...(shield ? [imperialCountermeasure] : []),
                ...Array.from({ length: 8 }, () => woodlandSquirrels),
              ],
            );
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (shield) {
              p.activate(imperialCountermeasure, {
                reservePayment: pay(1),
                targets: { "target-1": [hero.objectId] },
              });
              passEffectsStack(game);
            }
            const start = game.state.eventHistory.length;
            p.activate(enrage, { reservePayment: pay(initial >= 20 ? 2 : 4) });
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial);
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial + 4);
            expect(
              game.state.eventHistory
                .slice(start)
                .filter((e) => e.type === "damage-marked" && e.objectId === hero.objectId)
                .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
            ).toEqual([4]);
            if (expired) advanceToMain(game, p.id, game.state.turn.number);
            const enemy = q.card(opponent);
            p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), enemy);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[enemy.objectId]!.damage).toBe(1);
            p.declareAttack(hero, enemy);
            game.resolveCombatWithoutRetaliation();
            const bonus = expired ? 0 : Math.floor((initial + 4) / 4);
            expect(game.state.objects[enemy.objectId]!.damage).toBe(2 + bonus);
            const sword = p.card(trainingSword, { zone: "field" });
            p.activate(spiritsBlessing, {
              reservePayment: pay(1),
              costSelections: [[sword.objectId]],
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
            p.declareAttack(hero, enemy);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[enemy.objectId]!.damage).toBe(3 + bonus);
            expect(game.state.objects[hero.objectId]!.damage).toBe(initial + 4);
            expect(game.state.combat).toBeNull();
          });
});
