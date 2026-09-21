import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sleightOfHand } from "./sleight-of-hand.ts";
import { fiveOfSpades } from "../allies/five-of-spades.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainedHawk } from "../../DOA/allies/trained-hawk.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ddkocwcm38-a1 @covers ddkocwcm38-a2 */
describe("Sleight of Hand — Suited ally protection and class-restricted memory draw", () => {
  for (const matching of [false, true])
    for (const trueSight of [false, true])
      it(`responds to an attack, class=${matching}, True Sight=${trueSight}`, () => {
        const champion = createClassBonusTestChampion(
          sleightOfHand,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [fiveOfSpades, giantTortoise],
              hand: [sleightOfHand, fiveOfSpades, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise, trainedHawk, fiveOfSpades],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(fiveOfSpades, { zone: "field" });
        const top = p.zone("main-deck")[0]!;
        q.declareAttack(q.card(trueSight ? trainedHawk : giantTortoise), target);
        q.pass();
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [
          p.card(champion),
          p.card(giantTortoise),
          q.card(fiveOfSpades),
          p.card(fiveOfSpades, { zone: "hand" }),
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(sleightOfHand, {
              targets: { "target-1": [invalid.objectId] },
              reservePayment: payment,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const beforePayment = game.state;
        expect(() =>
          p.activate(sleightOfHand, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment.slice(1),
          }),
        ).toThrow();
        expect(game.state).toEqual(beforePayment);
        p.activate(sleightOfHand, {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment,
        });
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]!.zone).toBe(matching ? "memory" : "main-deck");
        expect(p.zone("memory")).toHaveLength(matching ? 3 : 2);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(trueSight ? 2 : 0);
        const beforeAttack = game.state;
        expect(() => q.declareAttack(q.card(fiveOfSpades), target)).toThrow();
        expect(game.state).toEqual(beforeAttack);
        advanceToMain(game, p.id);
        advanceToMain(game, q.id);
        q.declareAttack(q.card(giantTortoise), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
      });
});
