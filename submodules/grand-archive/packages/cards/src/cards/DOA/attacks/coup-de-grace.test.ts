import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { resolveCriticalCombat } from "../../../testing/critical-combat.ts";
import { coupDeGrace } from "./coup-de-grace.ts";
import { acceptedContract } from "../actions/accepted-contract.ts";
/** @covers 5qWWpkgQLl-a1 @covers 5qWWpkgQLl-a2 */
describe("Coup de Grace pays Prepare 4 before class-restricted critical 4", () => {
  for (const classBonus of [false, true])
    for (const prepared of [false, true])
      for (const handCount of [0, 3, 5])
        for (const pay of [false, true])
          it(`class=${classBonus}, prepared=${prepared}, opponent hand=${handCount}, pay=${pay}`, () => {
            const champion = createClassBonusTestChampion(
                coupDeGrace,
                classBonus,
                "activation-discount",
              ),
              game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      coupDeGrace,
                      acceptedContract,
                      acceptedContract,
                      ...Array.from({ length: 14 }, () => woodlandSquirrels),
                    ],
                  },
                },
                playerTwo: {
                  champion,
                  zones: { hand: Array.from({ length: handCount }, () => woodlandSquirrels) },
                },
              });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              foe = q.card(champion),
              payment = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            for (const contract of p.cards(acceptedContract)) {
              const before = game.state;
              expect(() =>
                p.activate(coupDeGrace, {
                  attackAttackerId: hero.objectId,
                  reservePayment: payment(4),
                  prepareAbilityIndexes: [0],
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              p.activate(contract, { reservePayment: payment(5) });
              passEffectsStack(game);
            }
            expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(6);
            const before = game.state;
            expect(() =>
              p.activate(coupDeGrace, {
                attackAttackerId: hero.objectId,
                reservePayment: payment(3),
                ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(coupDeGrace, {
              attackAttackerId: hero.objectId,
              reservePayment: payment(4),
              ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
            });
            expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 2 : 6);
            passEffectsStack(game);
            declareResolvedAttack(
              game,
              hero.objectId,
              foe.objectId,
              "Resolve prepared Coup de Grace",
            );
            passEffectsStack(game);
            const critical = classBonus && prepared;
            resolveCriticalCombat(game, { amount: 4, offered: critical && handCount >= 4, pay });
            expect(game.state.objects[foe.objectId]!.damage).toBe(
              critical && !(handCount >= 4 && pay) ? 8 : 4,
            );
            expect(q.zone("hand")).toHaveLength(
              handCount - (critical && handCount >= 4 && pay ? 4 : 0),
            );
            expect(p.card(coupDeGrace, { zone: "graveyard" })).toBeDefined();
          });
});
