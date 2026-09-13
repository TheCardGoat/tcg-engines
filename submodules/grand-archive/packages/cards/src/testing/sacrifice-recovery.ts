import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

/** Recover, rule 2: remove damage from your own champion, bounded at zero. */
export function proveSacrificeRecovery({
  card,
  abilityId,
  amount,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly abilityId: string;
  readonly amount: number;
}): void {
  for (const damage of [0, amount, amount + 1]) {
    it(`sacrifices as a cost and recovers ${amount} on resolution from ${damage} damage`, () => {
      const champion = createClassBonusTestChampion(card, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [card] } },
        playerTwo: {
          champion,
          zones: { field: Array.from({ length: damage }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = player.card(champion, { zone: "field" });
      for (const attacker of opponent.cards(woodlandSquirrels, { zone: "field" })) {
        opponent.declareAttack(attacker, target);
        game.resolveCombatWithoutRetaliation();
      }
      opponent.pass();
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
      const herb = player.card(card, { zone: "field" });
      player.activateAbility(herb, abilityId);
      expect(player.cards(card, { zone: "field" })).toHaveLength(0);
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      expect(game.state.objects[target.objectId]?.damage).toBe(Math.max(0, damage - amount));
      expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]?.damage).toBe(
        0,
      );
    });
  }
}
