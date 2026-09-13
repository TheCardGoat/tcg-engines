import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { indiscriminateGyre } from "./indiscriminate-gyre.ts";

/** @covers byyw53xbld-a1 */
describe("Indiscriminate Gyre — Class Bonus On Attack", () => {
  for (const classBonus of [false, true]) {
    it(`deals 2 to all allies only with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(indiscriminateGyre, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            field: [woodlandSquirrels],
            hand: [indiscriminateGyre, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion: starter, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      const own = player.card(woodlandSquirrels, { zone: "field" });
      const enemy = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
      player.activate(indiscriminateGyre, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        attacker.objectId,
        game.player("player-two").card(starter, { zone: "field" }).objectId,
        "declare Indiscriminate Gyre",
      );
      advanceCombatToTrigger(game, "byyw53xbld-a1");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "byyw53xbld-a1",
        ),
      ).toBe(classBonus);
      passEffectsStack(game);
      expect(game.state.objects[own.objectId]!.zone).toBe(classBonus ? "graveyard" : "field");
      expect(game.state.objects[enemy.objectId]!.zone).toBe(classBonus ? "graveyard" : "field");
    });
  }
});
