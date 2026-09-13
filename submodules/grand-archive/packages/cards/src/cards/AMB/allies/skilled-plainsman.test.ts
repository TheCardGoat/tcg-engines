import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { skilledPlainsman } from "./skilled-plainsman.ts";

/** @covers 55u41ilks4-a1 */
describe("Skilled Plainsman — Class Bonus Equestrian entry", () => {
  for (const classBonus of [false, true]) {
    for (const horse of [false, true]) {
      it(`Class Bonus=${classBonus}, Horse ally=${horse}`, () => {
        const champion = createClassBonusTestChampion(
          skilledPlainsman,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [skilledPlainsman, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: horse ? [galesMare] : [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [galesMare] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(skilledPlainsman, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        const plainsman = player.card(skilledPlainsman, { zone: "field" });
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "55u41ilks4-a1",
          ),
        ).toBe(classBonus);
        expect(game.state.objects[plainsman.objectId]!.counters.buff ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[plainsman.objectId]!.counters.buff ?? 0).toBe(
          classBonus && horse ? 1 : 0,
        );
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(plainsman, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus && horse ? 3 : 2);
      });
    }
  }
});
