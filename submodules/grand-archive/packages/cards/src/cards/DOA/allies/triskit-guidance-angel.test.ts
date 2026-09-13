import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { triskitGuidanceAngel } from "./triskit-guidance-angel.ts";
import { blitzMage } from "./blitz-mage.ts";
import { windriderMage } from "./windrider-mage.ts";
import { fireball } from "../actions/fireball.ts";
import { secondWind } from "../actions/second-wind.ts";
/** @covers ilW4cRlI0C-a2 */
describe("Triskit enables Fire, Water and Wind only for its controller", () => {
  for (const controller of ["none", "player-one", "player-two"] as const)
    it(`Triskit controller=${controller}`, () => {
      const champion = createClassBonusTestChampion(
        woodlandSquirrels,
        false,
        "activation-discount",
      );
      const hand = [
        blitzMage,
        giantTortoise,
        windriderMage,
        ...Array.from({ length: 9 }, () => woodlandSquirrels),
      ];
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: controller === "player-one" ? [triskitGuidanceAngel] : [],
            hand,
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: controller === "player-two" ? [triskitGuidanceAngel] : [],
            hand,
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      for (const id of ["player-one", "player-two"] as const) {
        const p = game.player(id);
        advanceToMain(game, p.id);
        for (const [card, cost] of [
          [blitzMage, 3],
          [giantTortoise, 4],
          [windriderMage, 2],
        ] as const) {
          const options = {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, cost)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          };
          if (id === controller) {
            p.activate(card, options);
            passEffectsStack(game);
            expect(p.card(card, { zone: "field" })).toBeDefined();
          } else {
            const before = game.state;
            expect(() => p.activate(card, options)).toThrow();
            expect(game.state).toEqual(before);
          }
        }
      }
    });
});
/** @covers ilW4cRlI0C-a3 */
describe("Triskit optionally replaces the champion with a permanent base-level-three champion", () => {
  for (const accept of [false, true])
    for (const previousLevel of [0, 2])
      it(`replace=${accept}, previous level=${previousLevel}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(triskitGuidanceAngel, false, "activation-discount"),
          previousLevel,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                triskitGuidanceAngel,
                fireball,
                secondWind,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          old = p.card(champion),
          source = p.card(triskitGuidanceAngel),
          foe = q.card(champion),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(source, { reservePayment: pay(5) });
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        expect(game.state.objects[old.objectId]!.zone).toBe(accept ? "banishment" : "field");
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        const level = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        if (accept) expect(level()).toBe(3);
        p.declareAttack(source, foe);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(2);
        if (accept) {
          const before = game.state;
          expect(() =>
            p.activate(secondWind, {
              reservePayment: pay(3),
              targets: { "target-1": [source.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        } else {
          p.activate(secondWind, {
            reservePayment: pay(3),
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
        }
        p.activate(fireball, { reservePayment: pay(4), targets: { "target-1": [foe.objectId] } });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(2 + (accept ? 4 : previousLevel + 1));
        advanceToMain(game, p.id, game.state.turn.number);
        if (accept) expect(level()).toBe(3);
      });
});
