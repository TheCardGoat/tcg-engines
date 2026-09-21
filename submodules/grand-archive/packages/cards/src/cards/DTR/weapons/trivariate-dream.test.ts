import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { trivariateDream } from "./trivariate-dream.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 6g7x7tja9h-a2 */
describe("Trivariate Dream — exactly three Aethercharges", () => {
  for (const matching of [false, true])
    for (const count of [2, 3, 4])
      it(`grants its current attack bonus with class=${matching} and ${count} charges`, () => {
        const champion = createClassBonusTestChampion(
          trivariateDream,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [trivariateDream],
              hand: [
                ...Array.from({ length: count + 1 }, () => resonantAether),
                ...Array.from({ length: count + 1 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          weapon = p.card(trivariateDream);
        const charges = p.cards(resonantAether);
        const load = (charge: (typeof charges)[number]) => {
          p.activate(charge, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
        };
        for (const charge of charges.slice(0, count)) load(charge);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
        for (const charge of charges.slice(0, count))
          expect(game.state.objects[charge.objectId]!.zone).toBe("intent");
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        game.resolveCombatWithoutRetaliation();
        const firstDamage = 1 + count + (matching && count === 3 ? 3 : 0);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(firstDamage);
        expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(2);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        load(charges[count]!);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(firstDamage + 2);
        expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(1);
      });
});
