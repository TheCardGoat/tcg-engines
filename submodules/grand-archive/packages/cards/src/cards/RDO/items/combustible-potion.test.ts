import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { proveBrewEntry } from "../../../testing/brew-entry.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe, expect, it } from "vitest";
import { combustiblePotion } from "./combustible-potion.ts";

/** @covers GPsEkAfDjy-a1 */
describe("Combustible Potion Brew", () => {
  proveBrewPotion({
    card: combustiblePotion,
    reserveCost: 4,
    ingredients: [fraysia, springleaf],
    wrongIngredients: [fraysia, woodlandSquirrels],
  });
});

/** @covers GPsEkAfDjy-a2 */
describe("combustiblePotion brewed entry", () => {
  proveBrewEntry({
    card: combustiblePotion,
    ingredients: [fraysia, springleaf],
    reserveCost: 4,
    draw: 2,
    discard: 1,
  });
});

/** @covers GPsEkAfDjy-a3 */
describe("Combustible Potion — sacrifice damage", () => {
  for (const own of [false, true])
    for (const championTarget of [false, true])
      for (const bounce of championTarget ? [false] : [false, true]) {
        it(`resolves against own=${own}, champion=${championTarget}, bounce=${bounce}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(combustiblePotion, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [combustiblePotion, woodlandSquirrels],
                hand: [reclaim, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [combustiblePotion, woodlandSquirrels],
                hand: [reclaim, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const source = p.card(combustiblePotion),
            target = owner.card(championTarget ? champion : woodlandSquirrels, { zone: "field" });
          for (const ids of [
            [],
            [source.objectId],
            [owner.card(reclaim).objectId],
            [target.objectId, target.objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "GPsEkAfDjy-a3", { targets: { "target-1": ids } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activateAbility(source, "GPsEkAfDjy-a3", {
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          expect(() =>
            p.activateAbility(source, "GPsEkAfDjy-a3", {
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          if (bounce) {
            if (!own) p.pass();
            owner.activate(reclaim, {
              targets: { "target-1": [target.objectId] },
              reservePayment: owner
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
          }
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            bounce ? "hand" : championTarget ? "field" : "graveyard",
          );
          if (championTarget) expect(game.state.objects[target.objectId]!.damage).toBe(2);
          if (bounce) expect(game.state.objects[target.objectId]!.damage).toBe(0);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(q.cards(combustiblePotion, { zone: "field" })).toHaveLength(1);
        });
      }
});
