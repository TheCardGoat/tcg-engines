import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { accompanyingGuard } from "../../ALC/allies/accompanying-guard.ts";
import { royalBear } from "./royal-bear.ts";
import { wildgrowthFeline } from "./wildgrowth-feline.ts";

/** @covers 3krdvxapdp-a1 */
describe("Wildgrowth Feline — Class Bonus Animal or Beast entry", () => {
  for (const classBonus of [false, true]) {
    for (const entering of ["animal", "beast", "human", "self"] as const) {
      it(`Class Bonus=${classBonus}, entering=${entering}`, () => {
        const champion = createClassBonusTestChampion(
          wildgrowthFeline,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [wildgrowthFeline],
              hand: [
                woodlandSquirrels,
                royalBear,
                accompanyingGuard,
                wildgrowthFeline,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
            },
          },
          playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const feline = player.card(wildgrowthFeline, { zone: "field" });
        if (entering === "self") {
          player.activate(wildgrowthFeline, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
        } else if (entering === "animal") {
          player.activate(player.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        } else if (entering === "beast") {
          player.activate(royalBear, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 4)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
        } else {
          player.activate(accompanyingGuard, {
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
        }
        player.pass();
        opponent.pass();
        const triggers = game.state.stack.filter(
          (item) => item.kind === "triggered-ability" && item.ability.id === "3krdvxapdp-a1",
        );
        const shouldBuff =
          classBonus && (entering === "animal" || entering === "beast" || entering === "self");
        expect(triggers).toHaveLength(shouldBuff ? 1 : 0);
        expect(game.state.objects[feline.objectId]!.counters.buff ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[feline.objectId]!.counters.buff ?? 0).toBe(shouldBuff ? 1 : 0);

        expect(game.state.objects[feline.objectId]!.counters.buff ?? 0).toBe(shouldBuff ? 1 : 0);
      });
    }
  }
});
