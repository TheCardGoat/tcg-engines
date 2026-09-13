import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { spiritBladeDispersion } from "./spirit-blade-dispersion.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { sealedBladeDoa } from "../weapons/sealed-blade-doa.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
/** @covers 7Rsid05Cf6-a1 */
describe("Dispersion spends all selected Sword durability before distributing exactly that much damage", () => {
  for (const spent of [false, true])
    for (const count of [0, 1, 2])
      it(`prior sword use=${spent}, selected swords=${count}`, () => {
        const champion = createClassBonusTestChampion(
            spiritBladeDispersion,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [spiritBladeDispersion],
                field: [trainingSword, sealedBladeDoa, curvedDagger, giantTortoise],
              },
            },
            playerTwo: { champion, zones: { field: [trainingSword, giantTortoise] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          first = p.card(trainingSword),
          second = p.card(sealedBladeDoa),
          foe = q.card(champion),
          ally = p.card(giantTortoise);
        if (spent) {
          p.declareAttack(p.card(champion), foe, { weaponIds: [first.objectId] });
          game.resolveCombatWithoutRetaliation();
        }
        p.activate(spiritBladeDispersion);
        passEffectsStack(game);
        const before = game.state;
        for (const bad of [p.card(curvedDagger), q.card(trainingSword), ally]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        const selected = [first, second].slice(0, count),
          amount = (count > 0 ? (spent ? 1 : 2) : 0) + (count > 1 ? 3 : 0);
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((c) => c.objectId),
        );
        passEffectsStack(game);
        for (const card of selected)
          expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
        if (amount) {
          const state = game.state;
          for (const allocations of [
            [],
            [{ objectId: foe.objectId, amount: amount - 1 }],
            [{ objectId: foe.objectId, amount: amount + 1 }],
            [{ objectId: q.card(trainingSword).objectId, amount }],
          ]) {
            expect(() => answerDecision(game, "resolve-distribution", { allocations })).toThrow();
            expect(game.state).toEqual(state);
          }
          const ownAmount = amount > 1 ? 1 : 0;
          answerDecision(game, "resolve-distribution", {
            allocations: [
              { objectId: foe.objectId, amount: amount - ownAmount },
              ...(ownAmount ? [{ objectId: ally.objectId, amount: ownAmount }] : []),
            ],
          });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            (spent ? 1 : 0) + amount - ownAmount,
          );
          expect(game.state.objects[ally.objectId]!.damage).toBe(ownAmount);
        } else {
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[foe.objectId]!.damage).toBe(spent ? 1 : 0);
        }
        expect(game.state.objects[p.card(curvedDagger).objectId]!.counters.durability).toBe(1);
        expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(2);
        if (count < 2) expect(game.state.objects[second.objectId]!.counters.durability).toBe(3);
        expect(p.card(spiritBladeDispersion, { zone: "graveyard" })).toBeDefined();
      });
});
