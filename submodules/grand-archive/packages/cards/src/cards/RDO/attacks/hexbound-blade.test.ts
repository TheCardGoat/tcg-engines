import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { hexboundBlade } from "./hexbound-blade.ts";
import { speedPotion } from "../items/speed-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
/** @covers RfQhLQ539Z-a1 */
describe("Hexbound Blade — agility power", () => {
  for (const mode of ["none", "own", "opponent", "response", "expired", "stacked"])
    it(`checks current controller agility during attack: ${mode}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Other", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [speedPotion, speedPotion],
            hand: [hexboundBlade, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [speedPotion], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const gain = (player: typeof p) => {
        player.activateAbility(player.cards(speedPotion, { zone: "field" })[0]!, "0Z1r8GC8a8-a3");
        passEffectsStack(game);
      };
      if (["own", "expired", "stacked"].includes(mode)) gain(p);
      if (mode === "stacked") gain(p);
      if (mode === "opponent") {
        p.pass();
        gain(q);
      }
      if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
      const hero = p.card(champion),
        foe = q.card(champion);
      p.activate(hexboundBlade, {
        attackAttackerId: hero.objectId,
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(game, hero.objectId, foe.objectId, "Attack with Hexbound Blade");
      if (mode === "response") gain(p);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(
        ["own", "response", "stacked"].includes(mode) ? 6 : 2,
      );
      expect(p.cards(hexboundBlade, { zone: "graveyard" })).toHaveLength(1);
    });
});
