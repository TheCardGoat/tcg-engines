import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rivuletAdjutant } from "./rivulet-adjutant.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers y547d3iixm-a1 @covers y547d3iixm-a2 */
describe("Rivulet Adjutant — class-restricted Taunt and death omen", () => {
  for (const matching of [false, true])
    it(`restricts attack targets only with class bonus (${matching}) then becomes an omen on death`, () => {
      const champion = createClassBonusTestChampion(
        rivuletAdjutant,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { field: [rivuletAdjutant, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const attackers = p.cards(woodlandSquirrels),
        guard = q.card(rivuletAdjutant);
      if (matching) {
        for (const target of [q.card(champion), q.card(woodlandSquirrels)]) {
          const before = game.state;
          expect(() => p.declareAttack(attackers[0]!, target)).toThrow();
          expect(game.state).toEqual(before);
        }
      } else {
        p.declareAttack(attackers[0]!, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      }
      p.declareAttack(attackers[1]!, guard);
      advanceCombatToTrigger(game, "y547d3iixm-a2");
      expect(game.state.objects[guard.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[guard.objectId]!.counters.omen ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[guard.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[guard.objectId]!.counters.omen).toBe(1);
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      p.declareAttack(attackers[2]!, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(matching ? 1 : 2);
      expect(game.state.objects[p.card(champion).objectId]!.counters.omen ?? 0).toBe(0);
    });
});
