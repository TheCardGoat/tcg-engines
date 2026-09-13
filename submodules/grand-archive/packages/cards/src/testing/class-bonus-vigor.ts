import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain } from "./decisions.ts";

export function proveClassBonusVigor(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  for (const matching of [true, false]) {
    it(`Vigor wakes the attacking ally only when class matches (${matching})`, () => {
      const champion = createClassBonusTestChampion(card, matching, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ally = p.card(card);
      p.declareAttack(ally, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!matching);
    });
  }
}
