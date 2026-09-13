import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { arthurYoungHeir } from "./arthur-young-heir.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { fireball } from "../actions/fireball.ts";
import { secondWind } from "../actions/second-wind.ts";
/** @covers GjM8b5fxqj-a1 @covers GjM8b5fxqj-a2 */
describe("Arthur's optional entry rest grants immortality and powers only other own allies", () => {
  for (const accept of [false, true])
    for (const wake of [false, true])
      it(`rest=${accept}, wake=${wake}`, () => {
        const base = grantTestChampionLevel(
            createClassBonusTestChampion(fireball, true, "activation-discount"),
            2,
          ),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), elements: ["FIRE" as const, "WIND" as const] },
            },
          },
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  arthurYoungHeir,
                  fireball,
                  secondWind,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                field: [woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                field: [woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(arthurYoungHeir, { zone: "hand" }),
          ally = p.card(woodlandSquirrels, { zone: "field" }),
          enemy = q.card(woodlandSquirrels, { zone: "field" }),
          power = (id: typeof ally.objectId) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(source, { reservePayment: pay(4) });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(accept);
        expect(power(source.objectId)).toBe(2);
        expect(power(ally.objectId)).toBe(accept ? 2 : 1);
        expect(power(enemy.objectId)).toBe(1);
        p.declareAttack(ally, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(accept ? 2 : 1);
        if (accept && wake) {
          p.activate(secondWind, {
            reservePayment: pay(3),
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          expect(power(ally.objectId)).toBe(1);
        }
        p.pass();
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "field" : "graveyard");
        if (!accept) {
          expect(power(ally.objectId)).toBe(1);
          return;
        }
        expect(game.state.objects[source.objectId]!.damage).toBe(3);
        expect(power(ally.objectId)).toBe(wake ? 1 : 2);
        advanceToMain(game, q.id);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        advanceToMain(game, p.id);
        p.activate(fireball, {
          reservePayment: pay(2),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(power(ally.objectId)).toBe(1);
      });
});
