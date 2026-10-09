import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { hemofluxDrain } from "./hemoflux-drain.ts";
import { proveLeveledDamageRecovery } from "../../../testing/leveled-damage-recovery.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
/** @covers zHhOcG9MfK-a2 */
describe("Hemoflux Drain — LV damage and recovery from actual damage", () => {
  proveLeveledDamageRecovery(hemofluxDrain, 5, "damage-dealt", false);
});
/** @covers zHhOcG9MfK-a1 */
describe("Hemoflux Drain — Damage 20 and Class Bonus cost threshold", () => {
  for (const matching of [false, true])
    for (const damage of [19, 20, 21])
      it(`class=${matching}, champion damage=${damage}`, () => {
        const level = damage - 1;
        const base = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(hemofluxDrain, matching, "activation-discount"),
            level,
          ),
        );
        const face = requireSingleFace(base);
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...face, stats: { ...face.stats, life: 50 } },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                hemofluxDrain,
                fireball,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          foe = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(fireball, {
          reservePayment: pay(matching ? 2 : 4),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]?.damage).toBe(damage);
        const cost = matching && damage >= 20 ? 2 : 5;
        const before = game.state;
        for (const wrong of [cost - 1, cost + 1]) {
          expect(() =>
            p.activate(hemofluxDrain, {
              reservePayment: pay(wrong),
              targets: { "target-1": [foe.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(hemofluxDrain, {
          reservePayment: pay(cost),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]?.damage).toBe(level);
        expect(game.state.objects[hero.objectId]?.damage).toBe(1);
        expect(p.zone("memory")).toHaveLength((matching ? 2 : 4) + cost);
        expect(p.card(hemofluxDrain, { zone: "graveyard" })).toBeDefined();
      });
});
