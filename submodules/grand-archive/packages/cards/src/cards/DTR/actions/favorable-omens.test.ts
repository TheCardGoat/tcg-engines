import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { favorableOmens } from "./favorable-omens.ts";
import { backdash } from "./backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers tqy0rwvxgs-a1 */
describe("Favorable Omens — controlled wind omens and a fixed set of allies", () => {
  for (const count of [0, 1, 2])
    for (const added of ["none", "before-resolution", "after-resolution"] as const)
      it(`${count} initial wind omens, another added ${added}`, () => {
        const champion = createClassBonusTestChampion(favorableOmens, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                woodlandSquirrels,
                giantTortoise,
                ...Array.from({ length: count + 2 }, () => condemnedTrinket),
              ],
              hand: [
                favorableOmens,
                ...Array.from({ length: 3 * (count + 2) + 2 }, () => woodlandSquirrels),
              ],
              graveyard: [backdash, ...Array.from({ length: count + 2 }, () => favorableOmens)],
              banishment: [favorableOmens],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, condemnedTrinket, enfeebledDagger, enfeebledDagger],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [favorableOmens, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const ally = p.card(woodlandSquirrels, { zone: "field" }),
          tortoise = p.card(giantTortoise),
          enemy = q.card(woodlandSquirrels, { zone: "field" });
        const life = (id: typeof ally.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          q.card(favorableOmens, { zone: "graveyard" }).objectId,
        ]);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const omen = (id: typeof ally.objectId) => {
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(3),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [id]);
          expect(game.state.objects[id]!.zone).toBe("banishment");
          expect(game.state.objects[id]!.counters.omen).toBe(1);
        };
        omen(p.card(backdash, { zone: "graveyard" }).objectId);
        passEffectsStack(game);
        for (let i = 0; i < count; i++) {
          omen(p.cards(favorableOmens, { zone: "graveyard" })[0]!.objectId);
          passEffectsStack(game);
        }
        const source = p.card(favorableOmens, { zone: "hand" });
        const before = game.state;
        expect(() => p.activate(source)).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment: payment(1) });
        expect(life(ally.objectId)).toBe(1);
        expect(life(tortoise.objectId)).toBe(6);
        if (added === "before-resolution")
          omen(p.cards(favorableOmens, { zone: "graveyard" })[0]!.objectId);
        passEffectsStack(game);
        const bonus = count + Number(added === "before-resolution");
        expect(life(ally.objectId)).toBe(1 + bonus);
        expect(life(tortoise.objectId)).toBe(6 + bonus);
        expect(life(enemy.objectId)).toBe(1);
        expect(life(p.card(champion).objectId)).toBe(15);
        if (added === "after-resolution") {
          omen(p.cards(favorableOmens, { zone: "graveyard" })[0]!.objectId);
          passEffectsStack(game);
          expect(life(ally.objectId)).toBe(1 + bonus);
        }
        const late = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        p.activate(late);
        passEffectsStack(game);
        expect(life(late.objectId)).toBe(1);
        p.pass();
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [ally.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.zone).toBe(bonus ? "field" : "graveyard");
        if (bonus) expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        advanceToMain(game, q.id);
        expect(life(tortoise.objectId)).toBe(6);
        if (bonus) {
          expect(game.state.objects[ally.objectId]!.zone).toBe("field");
          expect(game.state.objects[ally.objectId]!.damage).toBe(0);
          expect(life(ally.objectId)).toBe(1);
          q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
            targets: { "target-unit": [ally.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
        }
      });
});
