import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { fireball } from "../actions/fireball.ts";
import { demonsBargain } from "../../PRD/actions/demons-bargain.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { snowFairy } from "./snow-fairy.ts";
import { secondWind } from "../actions/second-wind.ts";
/** @covers 4s0c9XgLg7-a2 */
describe("Snow Fairy locks only the selected ally's normal wake-up while controlled", () => {
  for (const ending of ["death", "control"] as const)
    it(`allows other wake effects and ends after ${ending}`, () => {
      const champion = createClassBonusTestChampion(snowFairy, false, "activation-discount"),
        base = grantTestChampionLevel(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
          1,
        ),
        opponent = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...requireSingleFace(base),
              elements: ["FIRE" as const, "WIND" as const, "ARCANE" as const],
            },
          },
        },
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [snowFairy, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [snowFairy, giantTortoise],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              hand: [
                secondWind,
                fireball,
                demonsBargain,
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              field: [giantTortoise, woodlandSquirrels, trainingSword],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(snowFairy, { zone: "hand" }),
        target = q.card(giantTortoise),
        hero = p.card(champion);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      const before = game.state;
      for (const bad of [hero, p.card(giantTortoise), q.card(opponent), q.card(trainingSword)]) {
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [bad.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      const pay = (n: number) =>
        q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      q.activate(secondWind, {
        reservePayment: pay(3),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
      q.declareAttack(target, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), p.card(giantTortoise));
      game.resolveCombatWithoutRetaliation();
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      expect(
        game.state.objects[q.card(woodlandSquirrels, { zone: "field" }).objectId]!.states.has(
          "rested",
        ),
      ).toBe(false);
      if (ending === "death") {
        q.activate(fireball, {
          reservePayment: pay(2),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      } else {
        q.activate(demonsBargain, {
          reservePayment: pay(2),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.controllerId).toBe(q.id);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
      }
      expect(
        p
          .cards(snowFairy, { zone: "field" })
          .filter((card) => game.state.objects[card.objectId]!.controllerId === p.id),
      ).toHaveLength(1);
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
      q.declareAttack(target, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(2);
    });
});
