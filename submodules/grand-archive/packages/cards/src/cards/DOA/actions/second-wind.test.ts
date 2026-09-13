import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { secondWind } from "./second-wind.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers Huh1DljE0j-a1 */
describe("Second Wind's wake and class power bonus", () => {
  for (const classBonus of [false, true])
    for (const own of [false, true])
      it(`class=${classBonus}, targeted own ally=${own}`, () => {
        const champion = createClassBonusTestChampion(
          secondWind,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [secondWind, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [giantTortoise],
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
          attacker = own ? p : q,
          defender = own ? q : p,
          ally = attacker.card(giantTortoise),
          victim = defender.card(champion);
        attacker.declareAttack(ally, victim);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        if (!own) q.pass();
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(secondWind, {
            reservePayment,
            targets: { "target-1": [p.card(champion).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(secondWind, { reservePayment, targets: { "target-1": [ally.objectId] } });
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(false);
        attacker.declareAttack(ally, victim);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[victim.objectId]!.damage).toBe(classBonus ? 3 : 2);
        advanceToMain(game, defender.id);
        advanceToMain(game, attacker.id);
        attacker.declareAttack(ally, victim);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[victim.objectId]!.damage).toBe(classBonus ? 4 : 3);
      });
});
