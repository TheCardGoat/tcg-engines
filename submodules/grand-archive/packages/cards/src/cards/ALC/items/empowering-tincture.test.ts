import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveSacrificeLevel } from "../../../testing/sacrifice-level.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { empoweringTincture } from "./empowering-tincture.ts";

/** @covers 9g44vm5kt3-a1 */
describe("empowering-tincture — Brew", () => {
  proveBrewPotion({
    card: empoweringTincture,
    reserveCost: 3,
    ingredients: [manaroot, fraysia],
    wrongIngredients: [blightroot, fraysia],
  });
});

/** @covers 9g44vm5kt3-a2 */
describe("Empowering Tincture — brewed On Enter", () => {
  for (const brewed of [true, false]) {
    it(`draws into memory only for a brewed entry (brewed=${brewed})`, () => {
      const champion = createClassBonusTestChampion(
        empoweringTincture,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              empoweringTincture,
              ...Array.from({ length: brewed ? 0 : 3 }, () => woodlandSquirrels),
            ],
            field: brewed ? [manaroot, fraysia] : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const top = player.zone("main-deck")[0]!;
      player.activate(
        empoweringTincture,
        brewed
          ? {
              activationMethod: "brew",
              brewIngredientIds: [player.card(manaroot).objectId, player.card(fraysia).objectId],
            }
          : {
              reservePayment: player
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            },
      );
      expect(player.zone("memory")).toHaveLength(brewed ? 0 : 3);
      player.pass();
      game.player("player-two").pass();
      expect(player.cards(empoweringTincture, { zone: "field" })).toHaveLength(1);
      expect(player.zone("memory")).toHaveLength(brewed ? 0 : 3);
      // The On Enter trigger is a separate stack item; choose to pass despite the sacrifice ability.
      for (let step = 0; game.state.stack.length > 0 && step < 8; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.stack).toHaveLength(0);
      expect(player.zone("memory")).toHaveLength(brewed ? 1 : 3);
      expect(game.state.objects[top.objectId]?.zone).toBe(brewed ? "memory" : "main-deck");
      expect(player.zone("hand")).toHaveLength(0);
    });
  }
});

/** @covers 9g44vm5kt3-a3 */
describe("Empowering Tincture — temporary level", () => {
  proveSacrificeLevel({ card: empoweringTincture, abilityId: "9g44vm5kt3-a3", amount: 2 });
});
