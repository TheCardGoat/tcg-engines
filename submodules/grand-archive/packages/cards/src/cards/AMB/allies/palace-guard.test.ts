import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { palaceGuard } from "./palace-guard.ts";

/** @covers k940jhff6v-a2 */
describe("Palace Guard — Class Bonus Retort 2", () => {
  for (const classBonus of [false, true]) {
    it(`retaliates for ${classBonus ? 3 : 1} while Class Bonus is ${classBonus ? "enabled" : "disabled"}`, () => {
      const champion = createClassBonusTestChampion(palaceGuard, classBonus, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [palaceGuard] } },
        playerTwo: { champion, zones: { field: [automatedGardener] } },
      });
      const defender = game.player("player-one");
      const attacker = game.player("player-two");
      const guard = defender.card(palaceGuard, { zone: "field" });
      const gardener = attacker.card(automatedGardener, { zone: "field" });
      attacker.declareAttack(gardener, guard);
      for (
        let step = 0;
        game.state.decision?.kind !== "choose-retaliators" && game.state.combat && step < 16;
        step++
      ) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      answerDecision(game, "choose-retaliators", [guard.objectId]);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[guard.objectId]!.damage).toBe(2);
      expect(game.state.objects[gardener.objectId]!.zone).toBe(classBonus ? "graveyard" : "field");
      if (!classBonus) expect(game.state.objects[gardener.objectId]!.damage).toBe(1);
    });
  }
});
