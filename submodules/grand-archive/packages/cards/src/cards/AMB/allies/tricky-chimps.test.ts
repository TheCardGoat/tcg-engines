import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trickyChimps } from "./tricky-chimps.ts";

/** @covers bhhdb7x044-a1 */
describe("Tricky Chimps — Class Bonus crowded-board entry", () => {
  for (const classBonus of [false, true]) {
    for (const opposingAllies of [1, 2]) {
      it(`Class Bonus=${classBonus}, opposing allies=${opposingAllies}`, () => {
        const champion = createClassBonusTestChampion(
          trickyChimps,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [trickyChimps, woodlandSquirrels, woodlandSquirrels],
              field: [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: Array.from({ length: opposingAllies }, () => woodlandSquirrels) },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(trickyChimps, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        const chimps = player.card(trickyChimps, { zone: "field" });
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "bhhdb7x044-a1",
          ),
        ).toBe(classBonus);
        passEffectsStack(game);
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(chimps, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          classBonus && opposingAllies >= 2 ? 3 : 1,
        );
      });
    }
  }
});
