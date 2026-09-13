import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  advanceCombatToTrigger,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";

import { ralliedAdvance } from "./rallied-advance.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers SPESFtKHLw-a1 */
describe("Rallied Advance wakes an own ally only with class bonus", () => {
  for (const classBonus of [false, true])
    for (const rested of [false, true])
      it(`class=${classBonus}, rested=${rested}`, () => {
        const champion = createClassBonusTestChampion(
            ralliedAdvance,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [ralliedAdvance, woodlandSquirrels, woodlandSquirrels],
                field: [giantTortoise, trainingSword],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          ally = p.card(giantTortoise);
        if (rested) {
          p.declareAttack(ally, foe);
          game.resolveCombatWithoutRetaliation();
        }
        const initial = game.state.objects[foe.objectId]!.damage,
          pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(ralliedAdvance, {
            attackAttackerId: hero.objectId,
            reservePayment: pay.slice(0, 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(ralliedAdvance, { attackAttackerId: hero.objectId, reservePayment: pay });
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(rested);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "Attack with Rallied Advance");
        advanceCombatToTrigger(game, "SPESFtKHLw-a1");
        if (classBonus) {
          const before = game.state;
          for (const bad of [q.card(giantTortoise), hero, p.card(trainingSword)]) {
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [bad.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [ally.objectId] },
          });
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(rested && !classBonus);
        expect(game.state.objects[foe.objectId]!.damage).toBe(initial + 1);
        if (classBonus || !rested) {
          p.declareAttack(ally, foe);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(initial + 2);
        } else expect(() => p.declareAttack(ally, foe)).toThrow();
      });
});
