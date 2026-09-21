import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lacunasGrasp } from "./lacunas-grasp.ts";
import { raisedSlash } from "../attacks/raised-slash.ts";
import { backdash } from "../actions/backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers w7annwvl5q-a1 */
describe("Lacuna's Grasp — pay within owned omens for lasting weapon power", () => {
  for (const ciel of [false, true])
    for (const count of [0, 1, 3])
      for (const intent of [false, true])
        for (const accept of [false, true]) run(ciel, count, intent, accept, count);
  run(true, 3, false, true, 0);
  for (const count of [1, 3]) run(true, count, false, true, count, true);
  function run(
    ciel: boolean,
    count: number,
    intent: boolean,
    accept: boolean,
    x: number,
    repeatPay = false,
  ) {
    it(`Ciel=${ciel}, omens=${count}, intent=${intent}, accept=${accept}, X=${x}, repeat=${repeatPay}`, () => {
      const champion = createLineageTestChampion(lacunasGrasp, ciel ? "Ciel" : "Other");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [lacunasGrasp, ...Array.from({ length: count }, () => condemnedTrinket)],
            hand: [raisedSlash, ...Array.from({ length: 8 + 3 * count }, () => woodlandSquirrels)],
            graveyard: Array.from({ length: count + 1 }, () => backdash),
            banishment: [backdash],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [condemnedTrinket],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            graveyard: [backdash],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hero = p.card(champion),
        target = q.card(champion),
        blade = p.card(lacunasGrasp);
      const payment = (player: typeof p, n: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(q, 3) });
      passEffectsStack(game);
      advanceToMain(game, p.id);
      for (let i = 0; i < count; i++) {
        p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
          reservePayment: payment(p, 3),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          p.cards(backdash, { zone: "graveyard" })[0]!.objectId,
        ]);
        passEffectsStack(game);
      }
      if (intent) {
        p.activate(raisedSlash, { attackAttackerId: hero.objectId, reservePayment: payment(p, 3) });
        passEffectsStack(game);
        answerDecision(game, "declare-resolved-attack", {
          attackerId: hero.objectId,
          targetIds: [target.objectId],
          weaponIds: [blade.objectId],
        });
      } else p.declareAttack(hero, target, { weaponIds: [blade.objectId] });
      const memory = p.zone("memory").length;
      advanceCombatToTrigger(game, "w7annwvl5q-a1");
      if (ciel) {
        expect(game.state.decision?.kind).toBe("announce-triggered-ability");
        const before = game.state;
        for (const bad of [-1, count + 1]) {
          expect(() =>
            answerDecision(game, "announce-triggered-ability", { variables: { X: bad } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", { variables: { X: x } });
        passEffectsStack(game);
        if (!intent) {
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept && game.state.decision?.kind === "resolve-effect-payment") {
            if (x) {
              const snapshot = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-payment", {
                  reservePayment: payment(p, x - 1),
                }),
              ).toThrow();
              expect(game.state).toEqual(snapshot);
            }
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment(p, x) });
          }
          passEffectsStack(game);
        }
      }
      game.resolveCombatWithoutRetaliation();
      const bonus = ciel && !intent && accept ? x : 0;
      const firstDamage = 1 + (intent ? 3 : 0) + bonus;
      expect(game.state.objects[target.objectId]!.damage).toBe(firstDamage);
      expect(p.zone("memory")).toHaveLength(memory + bonus);
      expect(game.state.objects[blade.objectId]!.counters.durability).toBe(1);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      p.declareAttack(hero, target, { weaponIds: [blade.objectId] });
      advanceCombatToTrigger(game, "w7annwvl5q-a1");
      if (ciel) {
        answerDecision(game, "announce-triggered-ability", { variables: { X: repeatPay ? x : 0 } });
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", repeatPay);
        if (repeatPay)
          answerDecision(game, "resolve-effect-payment", { reservePayment: payment(p, x) });
        passEffectsStack(game);
      }
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(
        firstDamage + 1 + bonus + (repeatPay ? x : 0),
      );
      expect(game.state.objects[blade.objectId]!.zone).toBe("banishment");
    });
  }
});
