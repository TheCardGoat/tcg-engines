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
import { portSmuggler } from "./port-smuggler.ts";
/** @covers uCIEMgGjWe-a1 */
describe("Port Smuggler protects only its own attacks with matching class", () => {
  for (const bonus of [false, true])
    it(`class bonus=${bonus}`, () => {
      const champion = createClassBonusTestChampion(portSmuggler, bonus, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [portSmuggler, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [aesanProtector] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        foe = q.card(champion),
        guard = q.card(aesanProtector);
      for (const attacker of [p.card(woodlandSquirrels), p.card(portSmuggler)]) {
        const blocked = bonus && attacker.objectId === p.card(portSmuggler).objectId;
        p.declareAttack(attacker, foe);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(game.state.combat?.targetIds).toEqual([blocked ? foe.objectId : guard.objectId]);
        game.resolveCombatWithoutRetaliation();
      }
      expect(game.state.objects[foe.objectId]!.damage).toBe(bonus ? 1 : 0);
      expect(game.state.objects[guard.objectId]!.damage).toBe(bonus ? 1 : 2);
    });
});
