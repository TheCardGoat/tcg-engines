import { describe } from "vitest";
import { limitlessSlime } from "./limitless-slime.ts";
import { proveClassLevelAllyStats } from "../../../testing/class-level-ally-stats.ts";
/** @covers s4vxfy51ec-a2 */
describe("limitlessSlime — Class Bonus level stats", () => {
  proveClassLevelAllyStats(limitlessSlime, 1, 2);
});

import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers s4vxfy51ec-a1 */
describe("Limitless Slime — Class Bonus Level 1 Floating Memory", () => {
  proveLevelFloatingMemory(limitlessSlime, 1, false);
  proveLevelFloatingMemory(limitlessSlime, 1, true);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers s4vxfy51ec-a3 */
describe("Limitless Slime — Class Bonus Level 3 On Attack", () => {
  for (const matching of [false, true])
    for (const level of [1, 2, 3, 4])
      it(`adds a permanent buff on each own attack: class=${matching}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(limitlessSlime, matching, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [limitlessSlime, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [limitlessSlime], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          own = p.card(limitlessSlime),
          other = q.card(limitlessSlime),
          hero = q.card(champion);
        const buffs = () => game.state.objects[own.objectId]!.counters.buff ?? 0;
        p.declareAttack(woodlandSquirrels, hero);
        game.resolveCombatWithoutRetaliation();
        expect(buffs()).toBe(0);
        const active = matching && level >= 3,
          basePower = matching && level >= 2 ? 2 : 1;
        let damage = 1;
        for (let attack = 1; attack <= 2; attack++) {
          p.declareAttack(own, hero);
          if (active) {
            advanceCombatToTrigger(game, "s4vxfy51ec-a3");
            expect(buffs()).toBe(attack - 1);
            passEffectsStack(game);
            expect(buffs()).toBe(attack);
          }
          game.resolveCombatWithoutRetaliation();
          damage += basePower + (active ? attack : 0);
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          expect(buffs()).toBe(active ? attack : 0);
          expect(game.state.objects[other.objectId]!.counters.buff ?? 0).toBe(0);
          if (attack === 1) {
            advanceToMain(game, p.id, game.state.turn.number);
            expect(buffs()).toBe(active ? 1 : 0);
          }
        }
      });
});
