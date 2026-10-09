import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveBrewEntry } from "../../../testing/brew-entry.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { describe, expect, it } from "vitest";
import { moltenCinder } from "./molten-cinder.ts";

/** @covers df9q1vk8ao-a1 */
describe("Molten Cinder Brew", () => {
  proveBrewPotion({
    card: moltenCinder,
    reserveCost: 2,
    ingredients: [fraysia, manaroot],
    wrongIngredients: [manaroot, manaroot],
  });
});

/** @covers df9q1vk8ao-a2 */
describe("moltenCinder brewed entry", () => {
  proveBrewEntry({
    card: moltenCinder,
    ingredients: [fraysia, manaroot],
    reserveCost: 2,
    championDamage: 2,
  });
});

/** @covers df9q1vk8ao-a3 */
describe("Molten Cinder — champion level-up target", () => {
  for (const own of [false, true])
    for (const leveled of [false, true])
      for (const expired of [false, true]) {
        it(`requires this-turn level-up, own=${own}, leveled=${leveled}, expired=${expired}`, () => {
          const champion = lineageTestChampion("Cinder", 0),
            next = lineageTestChampion("Cinder", 1);
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                field: [moltenCinder, woodlandSquirrels],
                "material-deck": [next],
                memory: [woodlandSquirrels],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [moltenCinder],
                "material-deck": [next],
                memory: [woodlandSquirrels],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const target = owner.card(champion),
            source = p.card(moltenCinder);
          if (leveled) {
            owner.materialize(next);
            passEffectsStack(game);
          }
          advanceToMain(game, owner.id);
          if (expired) advanceToMain(game, owner.id, game.state.turn.number);
          if (!own) q.pass();
          const before = game.state;
          const activate = (ids: (typeof target.objectId)[]) =>
            p.activateAbility(source, "df9q1vk8ao-a3", { targets: { "target-1": ids } });
          for (const ids of [
            [],
            [source.objectId],
            [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            [target.objectId, target.objectId],
          ]) {
            expect(() => activate(ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          if (!leveled || expired) {
            expect(() => activate([target.objectId])).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          activate([target.objectId]);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          expect(() => activate([target.objectId])).toThrow();
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
          expect(q.cards(moltenCinder, { zone: "field" })).toHaveLength(1);
        });
      }
});
