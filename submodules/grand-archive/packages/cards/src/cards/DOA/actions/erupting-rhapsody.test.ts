import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { eruptingRhapsody } from "./erupting-rhapsody.ts";
import { songOfNurturing } from "./song-of-nurturing.ts";
import { markTheTarget } from "./mark-the-target.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision, advanceToMain } from "../../../testing/decisions.ts";
/** @covers dBAdWMoPEz-a1 @covers dBAdWMoPEz-a2 */
describe("Erupting Rhapsody's graveyard conversion and Harmonize distribution", () => {
  for (const count of [0, 1, 3])
    for (const melody of [false, true])
      it(`banishes ${count} Fire cards, Melody=${melody}`, () => {
        const champion = createClassBonusTestChampion(
          eruptingRhapsody,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                eruptingRhapsody,
                ...(melody ? [songOfNurturing] : []),
                ...Array.from({ length: melody ? 4 : 2 }, () => woodlandSquirrels),
              ],
              field: [trainingSword],
              graveyard: [markTheTarget, markTheTarget, markTheTarget, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { graveyard: [markTheTarget], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          id = p.card(champion).objectId,
          enemy = q.card(champion).objectId;
        const level = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const payment = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (melody) {
          p.activate(songOfNurturing, { reservePayment: payment() });
          passEffectsStack(game);
        }
        p.activate(eruptingRhapsody, { reservePayment: payment() });
        passEffectsStack(game);
        const before = game.state;
        for (const ref of [
          p.card(woodlandSquirrels, { zone: "graveyard" }),
          q.card(markTheTarget),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [ref.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(
          game,
          "resolve-effect-choice",
          p
            .cards(markTheTarget, { zone: "graveyard" })
            .slice(0, count)
            .map((c) => c.objectId),
        );
        passEffectsStack(game);
        expect(p.cards(markTheTarget, { zone: "banishment" })).toHaveLength(count);
        expect(level()).toBe(count);
        if (melody && count > 0) {
          const beforeDamage = game.state;
          expect(() =>
            answerDecision(game, "resolve-distribution", {
              allocations: [{ objectId: enemy, amount: count + 1 }],
            }),
          ).toThrow();
          expect(game.state).toEqual(beforeDamage);
          expect(() =>
            answerDecision(game, "resolve-distribution", {
              allocations: [{ objectId: p.card(trainingSword).objectId, amount: count }],
            }),
          ).toThrow();
          expect(game.state).toEqual(beforeDamage);
          answerDecision(game, "resolve-distribution", {
            allocations:
              count === 1
                ? [{ objectId: enemy, amount: 1 }]
                : [
                    { objectId: id, amount: 1 },
                    { objectId: enemy, amount: 2 },
                  ],
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[id]!.damage).toBe(melody && count === 3 ? 1 : 0);
        expect(game.state.objects[enemy]!.damage).toBe(melody ? Math.min(count, 2) : 0);
        advanceToMain(game, q.id);
        expect(level()).toBe(0);
        expect(p.cards(markTheTarget, { zone: "banishment" })).toHaveLength(count);
      });
});
