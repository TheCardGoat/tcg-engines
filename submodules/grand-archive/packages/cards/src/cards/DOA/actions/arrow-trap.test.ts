import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { acceptedContract } from "./accepted-contract.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { arrowTrap } from "./arrow-trap.ts";
/** @covers uoQGe5xGDQ-a1 @covers uoQGe5xGDQ-a2 */
describe("Arrow Trap's preparation and class determine bounce or destruction", () => {
  for (const classBonus of [false, true])
    for (const prepared of [false, true])
      it(`class=${classBonus}, prepared=${prepared}`, () => {
        const champion = createClassBonusTestChampion(arrowTrap, classBonus, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  arrowTrap,
                  acceptedContract,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise, woodlandSquirrels, trainingSword],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          attacker = q.card(giantTortoise),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        advanceToMain(game, q.id);
        q.declareAttack(attacker, hero);
        q.pass();
        const before = game.state;
        for (const bad of [
          q.card(woodlandSquirrels, { zone: "field" }),
          q.card(trainingSword),
          q.card(champion),
          p.card(giantTortoise),
        ]) {
          expect(() =>
            p.activate(arrowTrap, {
              reservePayment: pay(2),
              targets: { "target-attacking-ally": [bad.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(arrowTrap, {
            reservePayment: pay(1),
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
            targets: { "target-attacking-ally": [attacker.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(arrowTrap, {
          reservePayment: pay(2),
          ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          targets: { "target-attacking-ally": [attacker.objectId] },
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 2 : 3);
        passEffectsStack(game);
        expect(
          q.card(giantTortoise, { zone: prepared && classBonus ? "graveyard" : "hand" }).objectId,
        ).toBe(attacker.objectId);
        expect(p.cards(giantTortoise, { zone: "hand" })).toHaveLength(0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      });
});
