import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { extractionIncision } from "./extraction-incision.ts";

/** @covers zthwm68lgo-a2 */
describe("Extraction Incision — Class Bonus On Kill", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "prepares" : "does not prepare"} after a kill with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(extractionIncision, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: [extractionIncision, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: starter, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      player.activate(extractionIncision, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        attacker.objectId,
        game.player("player-two").card(woodlandSquirrels, { zone: "field" }).objectId,
        "kill the opposing ally",
      );
      advanceCombatToTrigger(game, "zthwm68lgo-a2");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "zthwm68lgo-a2",
        ),
      ).toBe(classBonus);
      passEffectsStack(game);
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[attacker.objectId]!.counters.preparation ?? 0).toBe(
        classBonus ? 1 : 0,
      );
    });
  }
});
