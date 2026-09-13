import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

/** Class Bonus Stealth is restricted, so it stays card-specific. */
export function proveClassBonusStealth(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  for (const classBonus of [true, false] as const) {
    it(`${classBonus ? "blocks" : "allows"} an attack while Class Bonus is ${classBonus ? "enabled" : "disabled"}`, () => {
      const champion = createClassBonusTestChampion(card, classBonus, "activation-discount");
      const attackerChampion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [card] } },
        playerTwo: { champion: attackerChampion, zones: { field: [woodlandSquirrels] } },
      });
      const defender = game.player("player-one").card(card, { zone: "field" });
      const attacker = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
      if (classBonus) {
        const before = game.state;
        expect(() => game.player("player-two").declareAttack(attacker, defender)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        game.player("player-two").declareAttack(attacker, defender);
        expect(game.state.objects[defender.objectId]?.damage).toBe(0);
        game.resolveCombatWithoutRetaliation();
        const after = game.state.objects[defender.objectId]!;
        expect(after.damage > 0 || after.zone !== "field").toBe(true);
      }
    });
  }
}
