import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  passEffectsStack,
  advanceToMain,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { aesanProtector } from "../allies/aesan-protector.ts";
import { strikeFromTheMist } from "./strike-from-the-mist.ts";
import { acceptedContract } from "../actions/accepted-contract.ts";
/** @covers DHn9J7gX6g-a1 @covers DHn9J7gX6g-a2 */
describe("Strike from the Mist requires paid preparation and matching class", () => {
  for (const bonus of [false, true])
    for (const prepared of [false, true])
      it(`class=${bonus}, prepared=${prepared}`, () => {
        const champion = createClassBonusTestChampion(
          strikeFromTheMist,
          bonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                strikeFromTheMist,
                acceptedContract,
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [aesanProtector] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          guard = q.card(aesanProtector);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(strikeFromTheMist, {
            attackAttackerId: hero.objectId,
            reservePayment: pay(2),
            prepareAbilityIndexes: [0],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(3);
        p.activate(strikeFromTheMist, {
          attackAttackerId: hero.objectId,
          reservePayment: pay(2),
          ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 1 : 3);
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "Strike the opposing champion");
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(game.state.combat?.targetIds).toEqual([
          bonus && prepared ? foe.objectId : guard.objectId,
        ]);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(bonus && prepared ? 2 : 0);
        expect(game.state.objects[guard.objectId]!.damage).toBe(bonus && prepared ? 0 : 2);
        expect(p.card(strikeFromTheMist, { zone: "graveyard" })).toBeDefined();
      });
});
