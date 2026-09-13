import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { bestialFrenzy } from "./bestial-frenzy.ts";
/** @covers HsaWNAsmAQ-a1 */
describe("Bestial Frenzy selects one mode or up to two with class, with independent Beast targets", () => {
  for (const bonus of [false, true])
    for (const modes of [
      [],
      ["champion-level"],
      ["beast-power"],
      ["beast-cleave"],
      ["champion-level", "beast-power"],
      ["champion-level", "beast-cleave"],
      ["beast-power", "beast-cleave"],
    ])
      it(`class=${bonus}, modes=${modes}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(bestialFrenzy, bonus, "activation-discount"),
          2,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [grayWolf, grayWolf, woodlandSquirrels],
              hand: [bestialFrenzy, woodlandSquirrels, woodlandSquirrels],
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
          wolf = p.cards(grayWolf)[0]!,
          second = p.cards(grayWolf)[1]!,
          hero = p.card(champion),
          foe = q.card(champion),
          tortoise = q.card(giantTortoise);
        const pay = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const both = modes.includes("beast-power") && modes.includes("beast-cleave"),
          cleaving = both ? second : wolf;
        const targets = {
          ...(modes.includes("beast-power") ? { "power-beast": [wolf.objectId] } : {}),
          ...(modes.includes("beast-cleave") ? { "cleave-beast": [cleaving.objectId] } : {}),
        };
        const before = game.state;
        expect(() =>
          p.activate(bestialFrenzy, {
            reservePayment: pay,
            modeIds: ["champion-level", "beast-power", "beast-cleave"],
            targets: { "power-beast": [wolf.objectId], "cleave-beast": [wolf.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (!bonus && modes.length !== 1) {
          expect(() =>
            p.activate(bestialFrenzy, { reservePayment: pay, modeIds: modes, targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        for (const key of Object.keys(targets))
          expect(() =>
            p.activate(bestialFrenzy, {
              reservePayment: pay,
              modeIds: modes,
              targets: { ...targets, [key]: [tortoise.objectId] },
            }),
          ).toThrow();
        if (both)
          expect(() =>
            p.activate(bestialFrenzy, {
              reservePayment: pay,
              modeIds: modes,
              targets: { "power-beast": [wolf.objectId], "cleave-beast": [wolf.objectId] },
            }),
          ).toThrow();
        p.activate(bestialFrenzy, { reservePayment: pay, modeIds: modes, targets });
        passEffectsStack(game);
        const level = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(level()).toBe(modes.includes("champion-level") ? 3 : 2);
        const cleave = {
          move: "declare-attack" as const,
          attackerId: cleaving.objectId,
          targetIds: [],
          cleavePlayerId: q.id,
        };
        if (modes.includes("beast-cleave")) p.execute(cleave);
        else {
          expect(() => p.execute(cleave)).toThrow();
          p.declareAttack(wolf, foe);
        }
        game.resolveCombatWithoutRetaliation();
        const damage = modes.includes("beast-power") && !both ? 3 : 2;
        expect(game.state.objects[foe.objectId]!.damage).toBe(damage);
        expect(game.state.objects[tortoise.objectId]!.damage).toBe(
          modes.includes("beast-cleave") ? damage : 0,
        );
        if (both) {
          p.declareAttack(wolf, foe);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(5);
        }
        advanceToMain(game, p.id, game.state.turn.number);
        expect(level()).toBe(2);
        expect(() => p.execute(cleave)).toThrow();
        p.declareAttack(wolf, foe);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe((both ? 5 : damage) + 2);
      });
});
