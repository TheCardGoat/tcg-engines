import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { revitalizingCleanse } from "./revitalizing-cleanse.ts";
import { chillingTouch } from "./chilling-touch.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 1BkfdFqCrG-a1 */
describe("Revitalizing Cleanse recovers only revealed water memory and draws", () => {
  for (const waterCount of [0, 2, 5])
    for (const damage of [0, 3])
      it(`${waterCount} water cards, starting damage ${damage}`, () => {
        const champion = createClassBonusTestChampion(
            revitalizingCleanse,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  revitalizingCleanse,
                  ...Array.from({ length: 5 }, (_, i) =>
                    i < waterCount ? chillingTouch : woodlandSquirrels,
                  ),
                ],
                memory: [woodlandSquirrels, woodlandSquirrels],
                graveyard: [chillingTouch],
                banishment: [chillingTouch],
                field: [giantTortoise],
                "main-deck": [blitzMage, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [blitzMage, woodlandSquirrels],
                memory: [chillingTouch, chillingTouch],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          other = p.card(giantTortoise),
          drawn = p.zone("main-deck")[0]!;
        if (damage) {
          q.declareAttack(blitzMage, hero);
          game.resolveCombatWithoutRetaliation();
        }
        q.declareAttack(woodlandSquirrels, other);
        game.resolveCombatWithoutRetaliation();
        q.pass();
        const pay = p
            .zone("hand")
            .filter((c) => c.definitionId !== revitalizingCleanse.canonicalId)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          before = game.state;
        expect(() => p.activate(revitalizingCleanse, { reservePayment: pay.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(revitalizingCleanse, { reservePayment: pay });
        const memory = p.zone("memory");
        expect(memory).toHaveLength(7);
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - waterCount));
        expect(game.state.objects[other.objectId]!.damage).toBe(1);
        expect(p.zone("hand")).toEqual([drawn]);
        expect(p.zone("memory")).toEqual(memory);
        expect(q.zone("memory")).toHaveLength(2);
        expect(
          game.state.eventHistory
            .filter((e) => e.type === "card-revealed")
            .map((e) => e.objectId)
            .sort(),
        ).toEqual(memory.map((c) => c.objectId).sort());
      });
});
