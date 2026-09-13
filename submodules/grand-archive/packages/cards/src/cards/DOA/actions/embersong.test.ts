import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { embersong } from "./embersong.ts";

/** @covers XMb6pSHFJg-a1 @covers XMb6pSHFJg-a2 */
describe("Embersong's damage and class bonus have independent targets", () => {
  for (const bonus of [false, true])
    for (const hit of [false, true])
      it(`class=${bonus}, damage target=${hit}`, () => {
        const champion = createClassBonusTestChampion(embersong, bonus, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, trainingSword],
              hand: [embersong, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          own = p.card(giantTortoise),
          foe = q.card(giantTortoise);
        const pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const targets = {
          "target-1": hit ? [foe.objectId] : [],
          ...(bonus ? { "XMb6pSHFJg-a2:target-1": [own.objectId] } : {}),
        };
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[own.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const initialPower = power(),
          before = game.state;
        if (initialPower === undefined) throw new Error("Expected ally power");
        for (const invalid of [q.card(champion), p.card(trainingSword)]) {
          expect(() =>
            p.activate(embersong, {
              reservePayment: pay,
              targets: { ...targets, "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() => p.activate(embersong, { reservePayment: pay.slice(0, 1), targets })).toThrow();
        if (bonus) {
          for (const invalid of [foe.objectId, p.card(champion).objectId])
            expect(() =>
              p.activate(embersong, {
                reservePayment: pay,
                targets: { ...targets, "XMb6pSHFJg-a2:target-1": [invalid] },
              }),
            ).toThrow();
          expect(() =>
            p.activate(embersong, {
              reservePayment: pay,
              targets: { ...targets, "target-1": [own.objectId] },
            }),
          ).toThrow();
        }
        expect(game.state).toEqual(before);
        p.activate(embersong, { reservePayment: pay, targets });
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(2);
        expect(game.state.objects[foe.objectId]!.damage).toBe(hit ? 2 : 0);
        expect(game.state.objects[own.objectId]!.damage).toBe(0);
        expect(power()).toBe(initialPower + (bonus ? 2 : 0));
        advanceToMain(game, q.id);
        expect(power()).toBe(initialPower);
      });
});
