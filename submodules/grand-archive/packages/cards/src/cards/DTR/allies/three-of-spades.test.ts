import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { threeOfSpades } from "./three-of-spades.ts";
import { twoOfHearts } from "./two-of-hearts.ts";
import { fiveOfSpades } from "./five-of-spades.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers o09csnorqv-a1 */
describe("Three of Spades — Cardistry temporary life", () => {
  for (const distinct of [false, true])
    for (const self of [false, true])
      it(`protects only the chosen controlled Suited ally, self=${self}, distinct=${distinct}`, () => {
        const champion = createClassBonusTestChampion(threeOfSpades, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                threeOfSpades,
                threeOfSpades,
                twoOfHearts,
                woodlandSquirrels,
                ...(distinct ? [fiveOfSpades] : []),
              ],
              hand: [woodlandSquirrels, woodlandSquirrels],
              memory: [twoOfHearts],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [threeOfSpades, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.cards(threeOfSpades)[0]!;
        const target = self ? source : p.card(twoOfHearts, { zone: "field" });
        const baseLife = self ? 2 : 1;
        const payment = distinct
          ? []
          : [
              {
                kind: "card" as const,
                cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
              },
            ];
        q.pass();
        for (const invalid of [
          q.card(threeOfSpades),
          p.card(champion),
          p.card(woodlandSquirrels, { zone: "field" }),
          p.card(twoOfHearts, { zone: "memory" }),
        ]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "o09csnorqv-a1", {
              targets: { "target-1": [invalid.objectId] },
              reservePayment: payment,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (!distinct) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "o09csnorqv-a1", {
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "o09csnorqv-a1", {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment,
        });
        const life = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(life()).toBe(baseLife);
        passEffectsStack(game);
        expect(life()).toBe(baseLife + 2);
        expect(
          deriveGrandArchiveNumericProperty(
            game.state.objects[p.cards(threeOfSpades)[1]!.objectId]!,
            "life",
            { program: game.program, state: game.state, controllerId: p.id, bindings: {} },
          ),
        ).toBe(2);
        expect(
          deriveGrandArchiveNumericProperty(
            game.state.objects[q.card(threeOfSpades).objectId]!,
            "life",
            { program: game.program, state: game.state, controllerId: q.id, bindings: {} },
          ),
        ).toBe(2);
        for (const attacker of q.cards(woodlandSquirrels)) {
          q.declareAttack(attacker, target);
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        advanceToMain(game, p.id);
        expect(life()).toBe(baseLife);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "o09csnorqv-a1", {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment.length
              ? [
                  {
                    kind: "card",
                    cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                  },
                ]
              : [],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      });
});
