import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { proveAllyBuffAction } from "../../../testing/ally-buff-action.ts";

import { mistResonance } from "./mist-resonance.ts";

/** @covers hw8dxKAnMX-a1 */
describe("Mist Resonance \u2014 resolution", () => {
  proveAllyBuffAction({ card: mistResonance, cost: 5, lifeBonus: 1, powerBonus: 0 });
});
import { songOfNurturing } from "./song-of-nurturing.ts";
/** @covers hw8dxKAnMX-a2 */
describe("Mist Resonance requires class and this-turn Melody to use full life for combat", () => {
  for (const bonus of [false, true])
    for (const melody of ["none", "own", "opponent", "expired"] as const)
      it(`class=${bonus}, Melody=${melody}`, () => {
        const champion = createClassBonusTestChampion(mistResonance, bonus, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise],
              hand: [
                mistResonance,
                songOfNurturing,
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise],
              hand: [songOfNurturing, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          ally = p.card(giantTortoise),
          foe = q.card(champion),
          qally = q.card(giantTortoise);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (melody === "own" || melody === "expired") {
          p.activate(songOfNurturing, { reservePayment: pay(2) });
          passEffectsStack(game);
          if (melody === "expired") advanceToMain(game, p.id, game.state.turn.number);
        }
        if (melody === "opponent") {
          p.pass();
          q.activate(songOfNurturing, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
        }
        p.activate(mistResonance, { reservePayment: pay(5) });
        passEffectsStack(game);
        p.declareAttack(ally, foe);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          bonus && melody === "own" ? 9 : 1 + (bonus && melody === "own" ? 1 : 0),
        );
        advanceToMain(game, q.id);
        q.declareAttack(qally, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        p.declareAttack(ally, foe);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          (bonus && melody === "own" ? 9 : 1) + 1,
        );
      });
});
