import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { primalWhip } from "./primal-whip.ts";

/** @covers az2b8nfh95-a1 */
describe("Primal Whip — Class Bonus [Level 2+] On Attack", () => {
  for (const [classBonus, level] of [
    [true, 2],
    [true, 1],
    [false, 2],
  ] as const) {
    it(`buffs non-Human allies only with class=${classBonus} level=${level}`, () => {
      const { starter, lineage } = classBonusLeveledChampion(primalWhip, classBonus, level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage,
          zones: { field: [primalWhip, woodlandSquirrels, zhangFeiSpiritedSteel] },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      const beast = player.card(woodlandSquirrels, { zone: "field" });
      const human = player.card(zhangFeiSpiritedSteel, { zone: "field" });
      const target = game.player("player-two").card(starter, { zone: "field" });
      const enabled = classBonus && level >= 2;
      player.declareAttack(attacker, target, {
        weaponIds: [player.card(primalWhip, { zone: "field" }).objectId],
      });
      advanceCombatToTrigger(game, "az2b8nfh95-a1");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "az2b8nfh95-a1",
        ) || game.state.decision?.kind === "announce-triggered-ability",
      ).toBe(enabled);
      if (enabled && game.state.decision?.kind === "announce-triggered-ability") {
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [beast.objectId] },
        });
      }
      passEffectsStack(game);
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(1);
      player.declareAttack(beast, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(enabled ? 3 : 2);
      player.declareAttack(human, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(enabled ? 5 : 4);
    });
  }
});
