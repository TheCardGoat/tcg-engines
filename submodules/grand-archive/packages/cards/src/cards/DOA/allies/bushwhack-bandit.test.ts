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
import { bushwhackBandit } from "./bushwhack-bandit.ts";
/** @covers kT8CeTFj82-a1 */
describe("Bushwhack Bandit's class-restricted critical 1", () => {
  for (const classBonus of [false, true])
    for (const hasHand of [false, true])
      for (const pay of [false, true])
        it(`class=${classBonus}, opponent hand=${hasHand}, pay=${pay}`, () => {
          const champion = createClassBonusTestChampion(
              bushwhackBandit,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: { champion, zones: { field: [bushwhackBandit, giantTortoise] } },
              playerTwo: {
                champion,
                zones: { hand: hasHand ? [woodlandSquirrels, giantTortoise] : [] },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = q.card(champion);
          p.declareAttack(giantTortoise, hero);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(1);
          p.declareAttack(bushwhackBandit, hero);
          resolveCriticalCombat(game, { amount: 1, offered: classBonus && hasHand, pay });
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            1 + (classBonus && !(hasHand && pay) ? 4 : 2),
          );
          expect(q.zone("hand")).toHaveLength(
            (hasHand ? 2 : 0) - (classBonus && hasHand && pay ? 1 : 0),
          );
        });
});
